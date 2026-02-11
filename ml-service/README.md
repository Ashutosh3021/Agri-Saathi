# Agri Sathi ML Service

A production-ready FastAPI microservice serving two ML models:
- **Pest/Disease Detection**: MobileNetV2-based TensorFlow model for detecting 38 plant diseases from images
- **Crop Recommendation**: XGBoost model for recommending crops based on soil and weather data

## Architecture

This service is designed to be called ONLY from the Next.js backend, never directly from the frontend. It includes:
- Internal API key authentication
- Rate limiting (100 requests/minute per IP)
- Request logging
- CORS protection (configured for Next.js backend only)
- Health monitoring

## Project Structure

```
ml-service/
├── main.py                      # FastAPI application entry point
├── models/
│   ├── __init__.py
│   ├── pest_detection.py        # MobileNetV2 model wrapper
│   └── soil_recommendation.py   # XGBoost model wrapper
├── weights/
│   ├── pest_model.h5            # TensorFlow model (download from Colab)
│   ├── soil_model.pkl           # XGBoost model (download from Colab)
│   ├── pest_class_labels.json   # Class index mapping
│   └── soil_classes.json        # Crop class names
├── data/
│   └── treatment_lookup.json    # Treatment recommendations for 38 diseases
├── requirements.txt
├── Dockerfile
├── .env.example
└── README.md
```

## Setup Instructions

### Prerequisites

- Python 3.11+
- pip
- Docker (optional, for containerized deployment)

### Local Development

1. **Clone the repository and navigate to the ml-service directory:**
```bash
cd ml-service
```

2. **Create a virtual environment:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Download model weights from Colab:**

Place the following files in the `weights/` directory:
- `pest_model.h5` - Trained MobileNetV2 model
- `soil_model.pkl` - Trained XGBoost model with artifacts
- `pest_class_labels.json` - Class label mappings
- `soil_classes.json` - Soil crop class names

5. **Set up environment variables:**
```bash
cp .env.example .env
```

Edit `.env` and set:
```env
INTERNAL_API_KEY=your_secure_random_key_here
NEXTJS_BACKEND_URL=http://localhost:3000
```

6. **Run the service:**
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

### Docker Deployment

1. **Build the Docker image:**
```bash
docker build -t agri-sathi-ml .
```

2. **Run the container:**
```bash
docker run -d \
  -p 8000:8000 \
  -e INTERNAL_API_KEY=your_secure_random_key_here \
  -e NEXTJS_BACKEND_URL=http://localhost:3000 \
  --name agri-sathi-ml \
  agri-sathi-ml
```

## API Documentation

### Authentication

All endpoints except `/health` require the `X-Internal-Key` header:
```
X-Internal-Key: your_internal_api_key_here
```

### Endpoints

#### 1. Health Check

Check service status and model statistics.

```bash
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "pest_model": {
    "is_loaded": true,
    "prediction_count": 0,
    "avg_inference_ms": 0.0,
    "load_time": 1705000000.0
  },
  "soil_model": {
    "is_loaded": true,
    "prediction_count": 0,
    "avg_inference_ms": 0.0
  },
  "uptime_seconds": 120.5,
  "version": "1.0.0"
}
```

#### 2. Pest/Disease Detection

Upload an image to detect plant diseases.

```bash
POST /predict/pest
```

**Request:**
- Content-Type: `multipart/form-data`
- Body: `image` (file upload)

**Example using curl:**
```bash
curl -X POST http://localhost:8000/predict/pest \
  -H "X-Internal-Key: your_internal_api_key_here" \
  -F "image=@path/to/plant_image.jpg"
```

**Response:**
```json
{
  "disease": "Tomato Late Blight",
  "confidence": 0.9856,
  "crop": "Tomato",
  "quick_fix": "Remove and destroy ALL infected plants immediately...",
  "permanent_fix": "Plant resistant varieties like Mountain Magic...",
  "organic_fix": "Apply copper spray weekly...",
  "severity": "high",
  "treatment_id": "TOMATO_LATEBLIGHT_31",
  "pesticide": "Metalaxyl 8% + Mancozeb 64% WP...",
  "raw_class": "Tomato___Late_blight",
  "inference_ms": 125.43,
  "top_3": [
    {
      "class": "Tomato___Late_blight",
      "confidence": 0.9856
    },
    {
      "class": "Tomato___Early_blight",
      "confidence": 0.0123
    },
    {
      "class": "Tomato___healthy",
      "confidence": 0.0012
    }
  ]
}
```

#### 3. Soil/Crop Recommendation

Get crop recommendations based on soil and weather data.

```bash
POST /predict/soil
```

**Request:**
- Content-Type: `application/json`

**Parameters:**
| Field | Type | Range | Description |
|-------|------|-------|-------------|
| nitrogen | float | 0-200 | Nitrogen content in soil (kg/ha) |
| phosphorus | float | 0-200 | Phosphorus content in soil (kg/ha) |
| potassium | float | 0-200 | Potassium content in soil (kg/ha) |
| temperature | float | -10-60 | Temperature in Celsius |
| humidity | float | 0-100 | Humidity percentage |
| ph | float | 0-14 | Soil pH level |
| rainfall | float | 0-1000 | Annual rainfall in mm |
| selected_crop | string | optional | Crop to analyze for suitability |

**Example using curl:**
```bash
curl -X POST http://localhost:8000/predict/soil \
  -H "Content-Type: application/json" \
  -H "X-Internal-Key: your_internal_api_key_here" \
  -d '{
    "nitrogen": 90,
    "phosphorus": 42,
    "potassium": 43,
    "temperature": 20.8,
    "humidity": 82,
    "ph": 6.5,
    "rainfall": 202.9,
    "selected_crop": "rice"
  }'
```

**Response:**
```json
{
  "recommended_crops": [
    {
      "crop": "rice",
      "suitability": 0.9234,
      "rank": 1
    },
    {
      "crop": "maize",
      "suitability": 0.6543,
      "rank": 2
    },
    {
      "crop": "wheat",
      "suitability": 0.4321,
      "rank": 3
    }
  ],
  "selected_crop_analysis": {
    "crop": "rice",
    "is_suitable": true,
    "suitability_score": 0.9234,
    "potential_issues": [
      "Soil conditions look favorable for this crop"
    ],
    "soil_improvements": [
      "Maintain current soil management practices"
    ]
  },
  "current_soil_health": "good",
  "weather_risk": "low",
  "inference_ms": 15.23
}
```

## Error Responses

All errors follow this format:

```json
{
  "error": "Description of what went wrong",
  "code": "ERROR_CODE"
}
```

Common error codes:
- `401` - Invalid or missing internal API key
- `400` - Bad request (invalid file type, missing parameters)
- `413` - Payload too large
- `429` - Rate limit exceeded (100 requests/minute)
- `500` - Internal server error
- `503` - Model not available

## Deployment to Railway

### Prerequisites

- Railway CLI installed
- Railway account
- Model weights uploaded to a storage service or included in repo

### Steps

1. **Login to Railway:**
```bash
railway login
```

2. **Initialize project:**
```bash
railway init
```

3. **Set environment variables in Railway dashboard:**
- `INTERNAL_API_KEY` - Secure random string
- `NEXTJS_BACKEND_URL` - Your Next.js app URL

4. **Deploy:**
```bash
railway up
```

5. **Enable health checks:**
In Railway dashboard, ensure the health check endpoint is set to `/health`

### Alternative: Using Railway GitHub Integration

1. Push code to GitHub (exclude large weight files using .gitignore)
2. Connect Railway to your GitHub repo
3. Set environment variables in Railway dashboard
4. Deploy automatically on push

**Note:** For large model files (>100MB), use:
- Railway volumes for persistent storage
- Or external storage (S3, Google Cloud Storage) with download script

## Updating Model Weights

### Method 1: Direct Replacement

1. Train new model in Colab
2. Download new weights
3. Replace files in `weights/` directory
4. Update `pest_class_labels.json` or `soil_classes.json` if class mappings changed
5. Redeploy

### Method 2: Versioned Models

For zero-downtime updates:

1. Store models in versioned directories:
```
weights/
  v1.0/
    pest_model.h5
  v1.1/
    pest_model.h5
```

2. Add version parameter to API
3. Deploy new version alongside old
4. Gradually migrate traffic

## Monitoring & Logging

The service logs:
- All HTTP requests (method, path, status code, duration)
- Model loading status
- Prediction counts and average inference times
- Errors with stack traces (internal only)

View logs:
```bash
# Local
tail -f logs/app.log

# Docker
docker logs agri-sathi-ml

# Railway
railway logs
```

## Performance Considerations

- **Model Loading**: Models are loaded once at startup (in lifespan context)
- **Inference**: 
  - Pest detection: ~100-300ms (depends on image size and hardware)
  - Soil recommendation: ~10-50ms
- **Memory**: 
  - TensorFlow model: ~50-100MB RAM
  - XGBoost model: ~10-20MB RAM
- **CPU**: Single worker recommended for CPU-bound inference

## Security Considerations

1. **Never expose INTERNAL_API_KEY in frontend code**
2. **Use HTTPS in production**
3. **Keep model weights secure** - they are your intellectual property
4. **Rate limiting** is enabled by default
5. **Input validation** on all endpoints
6. **CORS** configured to allow only your Next.js backend

## Troubleshooting

### Models fail to load

Check:
1. Model files exist in `weights/` directory
2. File paths in code match actual file locations
3. Model format matches code expectations (h5 vs SavedModel, pickle format)

### Out of memory errors

Solutions:
1. Use smaller batch sizes
2. Reduce image resolution before sending
3. Enable TensorFlow memory growth:
   ```python
   gpus = tf.config.experimental.list_physical_devices('GPU')
   if gpus:
       tf.config.experimental.set_memory_growth(gpus[0], True)
   ```

### Slow inference

Optimizations:
1. Use TensorFlow Lite for edge deployment
2. Enable model quantization
3. Use GPU if available
4. Cache common predictions

## Development

### Running Tests

```bash
# Add pytest to requirements.txt for testing
pip install pytest pytest-asyncio httpx

# Run tests
pytest tests/
```

### Code Style

```bash
# Format code
black main.py models/

# Lint
flake8 main.py models/
```

## Support

For issues or questions:
- Check the health endpoint: `/health`
- Review logs for error details
- Ensure environment variables are set correctly
- Verify model files are present and valid

## License

[Your License Here]

## Changelog

### v1.0.0
- Initial release
- Pest detection with 38 PlantVillage classes
- Soil recommendation with NPK and weather data
- RESTful API with authentication
- Docker support
- Railway deployment ready
