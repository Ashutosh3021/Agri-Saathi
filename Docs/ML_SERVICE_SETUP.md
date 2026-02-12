# ML Service Setup Guide

This guide explains how to set up the ML service for Agri Sathi after training your models.

## Prerequisites

1. Complete the model training in `model/training_notebook.ipynb`
2. Download all model files from Google Colab
3. Have Python 3.8+ installed locally

## Step 1: Create ML Service Directory

```bash
mkdir ml-service
cd ml-service
```

## Step 2: Create Weights Directory

```bash
mkdir weights
```

Place these files in the `weights/` directory:
- `soil_model.pkl`
- `soil_classes.json`
- `pest_model.h5`
- `pest_class_labels.json`
- `pest_model_metadata.json`

## Step 3: Create ML Service Application

Create `ml-service/app.py`:

```python
from flask import Flask, request, jsonify
import pickle
import json
import numpy as np
from tensorflow.keras.models import load_model
import os

app = Flask(__name__)

# Load models
SOIL_MODEL_PATH = 'weights/soil_model.pkl'
PEST_MODEL_PATH = 'weights/pest_model.h5'
SOIL_CLASSES_PATH = 'weights/soil_classes.json'
PEST_CLASSES_PATH = 'weights/pest_class_labels.json'

# Load soil model
with open(SOIL_MODEL_PATH, 'rb') as f:
    soil_artifacts = pickle.load(f)
    soil_model = soil_artifacts['model']
    soil_label_encoder = soil_artifacts['label_encoder']

# Load pest model
pest_model = load_model(PEST_MODEL_PATH)

# Load class mappings
with open(SOIL_CLASSES_PATH, 'r') as f:
    soil_classes = json.load(f)

with open(PEST_CLASSES_PATH, 'r') as f:
    pest_classes = json.load(f)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'models_loaded': True,
        'soil_classes': len(soil_classes['classes']),
        'pest_classes': pest_classes['num_classes']
    })

@app.route('/predict/soil', methods=['POST'])
def predict_soil():
    try:
        data = request.get_json()
        
        # Extract features
        features = [
            data['nitrogen'],
            data['phosphorus'], 
            data['potassium'],
            data['temperature'],
            data['humidity'],
            data['ph'],
            data['rainfall']
        ]
        
        # Predict
        prediction = soil_model.predict([features])[0]
        probabilities = soil_model.predict_proba([features])[0]
        
        # Get crop recommendation
        crop = soil_label_encoder.inverse_transform([prediction])[0]
        confidence = float(probabilities[prediction])
        
        return jsonify({
            'recommended_crop': crop,
            'confidence': confidence,
            'all_probabilities': [
                {
                    'crop': soil_label_encoder.inverse_transform([i])[0],
                    'probability': float(prob)
                }
                for i, prob in enumerate(probabilities)
            ]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/predict/pest', methods=['POST'])
def predict_pest():
    try:
        # Handle image upload
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
            
        image_file = request.files['image']
        # Process image and predict (implement based on your needs)
        # This is a simplified example
        
        return jsonify({
            'disease': 'healthy',
            'confidence': 0.95,
            'crop': 'tomato'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
```

## Step 4: Create Requirements File

Create `ml-service/requirements.txt`:

```
flask==2.3.3
tensorflow==2.13.0
scikit-learn==1.3.0
xgboost==1.7.6
numpy==1.24.3
pillow==10.0.1
```

## Step 5: Install Dependencies

```bash
cd ml-service
pip install -r requirements.txt
```

## Step 6: Run the ML Service

```bash
python app.py
```

The service will start on `http://localhost:8000`

## Step 7: Configure Environment Variables

Copy `.env.example` to `.env` and update:

```bash
cp .env.example .env
```

Set these variables:
```
ML_SERVICE_URL="http://localhost:8000"
ML_INTERNAL_KEY="your-secret-key-here"
```

## Step 8: Test the Setup

Test the health endpoint:
```bash
curl http://localhost:8000/health
```

Test from your Next.js app:
```bash
curl http://localhost:3000/api/ml/health
```

## Deployment Options

### Option 1: Local Development
Run the ML service locally as shown above.

### Option 2: Docker Deployment
Create a `Dockerfile` in the ml-service directory:

```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["python", "app.py"]
```

Build and run:
```bash
docker build -t agri-sathi-ml .
docker run -p 8000:8000 agri-sathi-ml
```

### Option 3: Cloud Deployment
Deploy to platforms like:
- Render
- Railway
- Heroku
- AWS EC2
- Google Cloud Run

Remember to update `ML_SERVICE_URL` in your `.env` file with the deployed URL.

## Troubleshooting

### Common Issues:

1. **Model files not found**: Ensure all files are in `ml-service/weights/`
2. **Port conflicts**: Change port in `app.py` if 8000 is busy
3. **Memory issues**: For pest model, ensure adequate RAM (4GB+ recommended)
4. **CUDA errors**: Use CPU version of TensorFlow if no GPU available

### Logs:
Check the ML service console for detailed error messages.

## Security Notes

- Never expose the ML service publicly without authentication
- Use the `ML_INTERNAL_KEY` for service-to-service communication
- Consider adding rate limiting for production use