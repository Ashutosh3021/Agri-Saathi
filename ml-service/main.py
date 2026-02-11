import os
import time
import logging
from contextlib import asynccontextmanager
from typing import Optional

from fastapi import FastAPI, HTTPException, Request, File, UploadFile, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from dotenv import load_dotenv

from models.pest_detection import PestDetectionModel
from models.soil_recommendation import SoilRecommendationModel

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Global state
pest_model: Optional[PestDetectionModel] = None
soil_model: Optional[SoilRecommendationModel] = None
service_start_time: Optional[float] = None

# Rate limiter
limiter = Limiter(key_func=get_remote_address)

# Pydantic Models
class SoilInput(BaseModel):
    nitrogen: float = Field(..., ge=0, le=200, description="Nitrogen content in soil (kg/ha)")
    phosphorus: float = Field(..., ge=0, le=200, description="Phosphorus content in soil (kg/ha)")
    potassium: float = Field(..., ge=0, le=200, description="Potassium content in soil (kg/ha)")
    temperature: float = Field(..., ge=-10, le=60, description="Temperature in Celsius")
    humidity: float = Field(..., ge=0, le=100, description="Humidity percentage")
    ph: float = Field(..., ge=0, le=14, description="Soil pH level")
    rainfall: float = Field(..., ge=0, le=1000, description="Annual rainfall in mm")
    selected_crop: Optional[str] = Field(None, description="Optional crop name to analyze")

class APIInfoResponse(BaseModel):
    message: str
    version: str
    endpoints: dict
    description: str

class PestPredictionResponse(BaseModel):
    disease: str
    confidence: float
    crop: str
    quick_fix: str
    permanent_fix: str
    organic_fix: Optional[str]
    severity: str
    treatment_id: str
    pesticide: Optional[str]
    raw_class: str
    inference_ms: float
    top_3: list

class SoilPredictionResponse(BaseModel):
    recommended_crops: list
    selected_crop_analysis: Optional[dict]
    current_soil_health: str
    weather_risk: str
    inference_ms: float

class HealthResponse(BaseModel):
    status: str
    pest_model: dict
    soil_model: dict
    uptime_seconds: float
    version: str

class ErrorResponse(BaseModel):
    error: str
    code: str

# Lifespan context manager for startup/shutdown events
@asynccontextmanager
async def lifespan(app: FastAPI):
    global pest_model, soil_model, service_start_time
    
    logger.info("Starting Agri Sathi ML Service...")
    service_start_time = time.time()
    
    try:
        # Load pest detection model
        pest_model = PestDetectionModel()
        pest_model.load()
        logger.info("Pest detection model loaded successfully")
        # logger.info("Pest detection model loading SKIPPED (compatibility issues)")
        
        # Load soil recommendation model
        soil_model = SoilRecommendationModel()
        soil_model.load()
        logger.info("Soil recommendation model loaded successfully")
        
        logger.info("All models loaded. Service ready.")
    except Exception as e:
        logger.error(f"Failed to load models: {e}")
        raise
    
    yield
    
    # Shutdown
    logger.info("Shutting down Agri Sathi ML Service...")

# Create FastAPI app
app = FastAPI(
    title="Agri Sathi ML Service",
    description="ML microservice for pest detection and crop recommendation",
    version="1.0.0",
    lifespan=lifespan
)

# Add rate limiter
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS middleware - allow only Next.js backend
allowed_origins = [os.getenv("NEXTJS_BACKEND_URL", "http://localhost:3000")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Authentication dependency
async def verify_internal_key(request: Request):
    """Verify X-Internal-Key header for internal API access."""
    internal_key = os.getenv("INTERNAL_API_KEY", "")
    if not internal_key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal API key not configured"
        )
    
    provided_key = request.headers.get("X-Internal-Key")
    if not provided_key or provided_key != internal_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing internal API key"
        )
    return True

# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    
    response = await call_next(request)
    
    process_time = (time.time() - start_time) * 1000
    logger.info(
        f"{request.method} {request.url.path} - {response.status_code} - {process_time:.2f}ms"
    )
    
    return response

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "An internal error occurred. Please try again later.",
            "code": "INTERNAL_ERROR"
        }
    )

# Root endpoint - API documentation/welcome message
@app.get("/", response_model=APIInfoResponse)
async def root():
    """Root endpoint providing API documentation and service information."""
    return APIInfoResponse(
        message="Agri Sathi ML Service - Agricultural Intelligence API",
        version="1.0.0",
        description="Machine learning microservice for pest detection and crop recommendations",
        endpoints={
            "health": {
                "method": "GET",
                "path": "/health",
                "description": "Health check endpoint returning service and model status",
                "authentication": "None"
            },
            "pest_detection": {
                "method": "POST",
                "path": "/predict/pest",
                "description": "Run pest/disease detection on uploaded image",
                "authentication": "X-Internal-Key header required",
                "request_body": "multipart/form-data with image file"
            },
            "soil_recommendation": {
                "method": "POST",
                "path": "/predict/soil",
                "description": "Get crop recommendations based on soil and weather data",
                "authentication": "X-Internal-Key header required",
                "request_body": "JSON with soil parameters (nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall, selected_crop)"
            }
        }
    )

# Health check endpoint - no auth required
@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint returning service and model status."""
    global pest_model, soil_model, service_start_time
    
    uptime = time.time() - service_start_time if service_start_time else 0
    
    return HealthResponse(
        status="healthy" if (pest_model and pest_model.is_loaded and soil_model and soil_model.is_loaded) else "degraded",
        pest_model=pest_model.stats if pest_model else {"is_loaded": False},
        soil_model=soil_model.stats if soil_model else {"is_loaded": False},
        uptime_seconds=round(uptime, 2),
        version="1.0.0"
    )

# Pest prediction endpoint
@app.post("/predict/pest", response_model=PestPredictionResponse)
@limiter.limit("100/minute")
async def predict_pest(
    request: Request,
    image: UploadFile = File(...),
    _: bool = Depends(verify_internal_key)
):
    """Run pest/disease detection on uploaded image."""
    global pest_model
    
    if not pest_model or not pest_model.is_loaded:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Pest detection model not available"
        )
    
    # Validate file type
    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Please upload an image file."
        )
    
    try:
        image_bytes = await image.read()
        result = pest_model.predict(image_bytes)
        return PestPredictionResponse(**result)
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process image"
        )

# Informative handler for GET requests to pest endpoint
@app.get("/predict/pest")
async def pest_endpoint_info():
    """Information about the pest detection endpoint."""
    return JSONResponse(
        status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
        content={
            "error": "Method Not Allowed",
            "message": "This endpoint only accepts POST requests.",
            "usage": "Send a POST request with multipart form data containing an image file.",
            "required_fields": {
                "image": "Image file (JPEG, PNG, etc.)"
            },
            "authentication": "X-Internal-Key header required",
            "example": "POST /predict/pest with form-data: image=@path/to/image.jpg"
        }
    )

# Soil recommendation endpoint
@app.post("/predict/soil", response_model=SoilPredictionResponse)
@limiter.limit("100/minute")
async def predict_soil(
    request: Request,
    data: SoilInput,
    _: bool = Depends(verify_internal_key)
):
    """Get crop recommendations based on soil and weather data."""
    global soil_model
    
    if not soil_model or not soil_model.is_loaded:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Soil recommendation model not available"
        )
    
    try:
        result = soil_model.predict(data.dict())
        return SoilPredictionResponse(**result)
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process soil data"
        )

# Informative handler for GET requests to soil endpoint
@app.get("/predict/soil")
async def soil_endpoint_info():
    """Information about the soil recommendation endpoint."""
    return JSONResponse(
        status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
        content={
            "error": "Method Not Allowed",
            "message": "This endpoint only accepts POST requests.",
            "usage": "Send a POST request with JSON data containing soil parameters.",
            "required_fields": {
                "nitrogen": "Nitrogen content (kg/ha)",
                "phosphorus": "Phosphorus content (kg/ha)", 
                "potassium": "Potassium content (kg/ha)",
                "temperature": "Temperature (°C)",
                "humidity": "Humidity (%)",
                "ph": "Soil pH level",
                "rainfall": "Annual rainfall (mm)"
            },
            "optional_fields": {
                "selected_crop": "Specific crop name to analyze"
            },
            "authentication": "X-Internal-Key header required",
            "example": "POST /predict/soil with JSON body containing soil parameters"
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
