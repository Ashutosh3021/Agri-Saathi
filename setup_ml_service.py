#!/usr/bin/env python3
"""
Model Deployment Helper Script
Helps automate the process of setting up the ML service after training
"""

import os
import shutil
import json
from pathlib import Path

def check_model_files():
    """Check if all required model files are present"""
    required_files = [
        'soil_model.pkl',
        'soil_classes.json', 
        'pest_model.h5',
        'pest_class_labels.json',
        'pest_model_metadata.json'
    ]
    
    missing_files = []
    for file in required_files:
        if not os.path.exists(file):
            missing_files.append(file)
    
    return missing_files

def create_ml_service_structure():
    """Create the ML service directory structure"""
    # Create directories
    dirs = ['ml-service', 'ml-service/weights', 'ml-service/logs']
    
    for directory in dirs:
        Path(directory).mkdir(exist_ok=True)
        print(f"✓ Created directory: {directory}")

def copy_model_files():
    """Copy model files to the ML service weights directory"""
    model_files = [
        'soil_model.pkl',
        'soil_classes.json',
        'pest_model.h5', 
        'pest_class_labels.json',
        'pest_model_metadata.json'
    ]
    
    copied_files = []
    failed_files = []
    
    for file in model_files:
        if os.path.exists(file):
            try:
                shutil.copy2(file, f'ml-service/weights/{file}')
                copied_files.append(file)
                print(f"✓ Copied {file}")
            except Exception as e:
                failed_files.append((file, str(e)))
                print(f"✗ Failed to copy {file}: {e}")
        else:
            failed_files.append((file, "File not found"))
    
    return copied_files, failed_files

def generate_requirements():
    """Generate requirements.txt for the ML service"""
    requirements = """flask==2.3.3
tensorflow==2.13.0
scikit-learn==1.3.0
xgboost==1.7.6
numpy==1.24.3
pillow==10.0.1
gunicorn==21.2.0
"""
    
    with open('ml-service/requirements.txt', 'w') as f:
        f.write(requirements)
    
    print("✓ Generated requirements.txt")

def generate_app_py():
    """Generate the Flask application"""
    app_code = '''from flask import Flask, request, jsonify
import pickle
import json
import numpy as np
from tensorflow.keras.models import load_model
import os
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/ml_service.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Configuration
INTERNAL_KEY = os.environ.get('ML_INTERNAL_KEY', 'default-key-change-in-production')
PORT = int(os.environ.get('PORT', 8000))

# Load models with error handling
def load_models():
    try:
        # Load soil model
        with open('weights/soil_model.pkl', 'rb') as f:
            soil_artifacts = pickle.load(f)
            global soil_model, soil_label_encoder
            soil_model = soil_artifacts['model']
            soil_label_encoder = soil_artifacts['label_encoder']
        logger.info("✓ Soil model loaded successfully")
        
        # Load pest model  
        global pest_model
        pest_model = load_model('weights/pest_model.h5')
        logger.info("✓ Pest model loaded successfully")
        
        # Load class mappings
        with open('weights/soil_classes.json', 'r') as f:
            global soil_classes
            soil_classes = json.load(f)
            
        with open('weights/pest_class_labels.json', 'r') as f:
            global pest_classes  
            pest_classes = json.load(f)
            
        logger.info("✓ All models and mappings loaded successfully")
        return True
    except Exception as e:
        logger.error(f"✗ Failed to load models: {e}")
        return False

# Authentication decorator
def require_internal_key(f):
    def decorated_function(*args, **kwargs):
        key = request.headers.get('X-Internal-Key')
        if key != INTERNAL_KEY:
            logger.warning(f"Unauthorized access attempt with key: {key}")
            return jsonify({'error': 'Unauthorized'}), 401
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function

@app.route('/health', methods=['GET'])
@require_internal_key
def health():
    return jsonify({
        'status': 'healthy',
        'models_loaded': True,
        'soil_classes': len(soil_classes['classes']),
        'pest_classes': pest_classes['num_classes'],
        'service_version': '1.0.0'
    })

@app.route('/predict/soil', methods=['POST'])
@require_internal_key
def predict_soil():
    try:
        data = request.get_json()
        
        # Validate input
        required_fields = ['nitrogen', 'phosphorus', 'potassium', 'temperature', 
                          'humidity', 'ph', 'rainfall']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Extract features
        features = [
            float(data['nitrogen']),
            float(data['phosphorus']), 
            float(data['potassium']),
            float(data['temperature']),
            float(data['humidity']),
            float(data['ph']),
            float(data['rainfall'])
        ]
        
        # Predict
        prediction = soil_model.predict([features])[0]
        probabilities = soil_model.predict_proba([features])[0]
        
        # Get crop recommendation
        crop = soil_label_encoder.inverse_transform([prediction])[0]
        confidence = float(probabilities[prediction])
        
        # Get top 3 recommendations
        top_indices = np.argsort(probabilities)[::-1][:3]
        recommendations = []
        for i in top_indices:
            recommendations.append({
                'crop': soil_label_encoder.inverse_transform([i])[0],
                'suitability': float(probabilities[i]),
                'rank': len(recommendations) + 1
            })
        
        logger.info(f"Soil prediction made for crop: {crop} (confidence: {confidence:.2f})")
        
        return jsonify({
            'recommended_crops': recommendations,
            'selected_crop_analysis': {
                'crop': crop,
                'is_suitable': confidence > 0.3,
                'potential_issues': [],
                'soil_improvements': []
            },
            'current_soil_health': 'good' if confidence > 0.7 else 'moderate' if confidence > 0.4 else 'poor',
            'weather_risk': 'low'
        })
    except Exception as e:
        logger.error(f"Soil prediction error: {e}")
        return jsonify({'error': str(e)}), 400

@app.route('/predict/pest', methods=['POST'])
@require_internal_key  
def predict_pest():
    try:
        # Handle image upload
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
            
        image_file = request.files['image']
        # In a real implementation, you would:
        # 1. Save the image temporarily
        # 2. Preprocess it (resize, normalize)
        # 3. Make prediction with the pest model
        # 4. Return results
        
        # Placeholder response
        response = {
            'disease': 'healthy',
            'confidence': 0.95,
            'crop': 'tomato',
            'quick_fix': 'No immediate action needed',
            'permanent_fix': 'Continue regular monitoring',
            'severity': 'low',
            'treatment_id': 'HEALTHY_001'
        }
        
        logger.info("Pest prediction made")
        return jsonify(response)
    except Exception as e:
        logger.error(f"Pest prediction error: {e}")
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    # Load models before starting
    if not load_models():
        logger.error("Failed to load models, exiting...")
        exit(1)
    
    logger.info(f"Starting ML service on port {PORT}")
    app.run(host='0.0.0.0', port=PORT, debug=False)
'''
    
    with open('ml-service/app.py', 'w') as f:
        f.write(app_code)
    
    print("✓ Generated app.py")

def generate_dockerfile():
    """Generate Dockerfile for containerization"""
    dockerfile = '''FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \\
    gcc \\
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create logs directory
RUN mkdir -p logs

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \\
    CMD curl -f http://localhost:8000/health || exit 1

# Run the application
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "2", "app:app"]
'''
    
    with open('ml-service/Dockerfile', 'w') as f:
        f.write(dockerfile)
    
    print("✓ Generated Dockerfile")

def main():
    print("🚀 Agri Sathi ML Service Deployment Helper")
    print("=" * 50)
    
    # Check current directory
    current_dir = os.getcwd()
    print(f"Working directory: {current_dir}")
    
    # Check for model files
    print("\n🔍 Checking for trained model files...")
    missing_files = check_model_files()
    
    if missing_files:
        print("❌ Missing model files:")
        for file in missing_files:
            print(f"   - {file}")
        print("\nPlease run the training notebook first and ensure all files are downloaded.")
        return
    
    print("✓ All model files found!")
    
    # Create directory structure
    print("\n📂 Creating ML service directory structure...")
    create_ml_service_structure()
    
    # Copy model files
    print("\n📋 Copying model files...")
    copied, failed = copy_model_files()
    
    if failed:
        print("⚠️  Some files failed to copy:")
        for file, error in failed:
            print(f"   - {file}: {error}")
    
    # Generate files
    print("\n⚙️  Generating service files...")
    generate_requirements()
    generate_app_py() 
    generate_dockerfile()
    
    # Final instructions
    print("\n✅ Setup Complete!")
    print("\nNext steps:")
    print("1. Navigate to ml-service directory: cd ml-service")
    print("2. Install dependencies: pip install -r requirements.txt")
    print("3. Set environment variable: export ML_INTERNAL_KEY='your-secret-key'")
    print("4. Run the service: python app.py")
    print("5. Test: curl -H 'X-Internal-Key: your-secret-key' http://localhost:8000/health")
    print("\nFor production deployment, use Docker:")
    print("docker build -t agri-sathi-ml .")
    print("docker run -p 8000:8000 -e ML_INTERNAL_KEY='your-secret-key' agri-sathi-ml")

if __name__ == "__main__":
    main()