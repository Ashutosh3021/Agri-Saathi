import tensorflow as tf
import numpy as np
from PIL import Image
import io
import json
import os
import time
import logging
from keras.utils import custom_object_scope

logger = logging.getLogger(__name__)

# Universal compatibility function
def fix_layer_config(kwargs):
    """Fix layer configuration for compatibility with older models."""
    # Handle batch_shape -> shape conversion for InputLayer
    batch_shape = kwargs.pop('batch_shape', None)
    if batch_shape is not None:
        # Convert batch_shape to shape (remove the batch dimension)
        if isinstance(batch_shape, (list, tuple)) and len(batch_shape) > 1:
            kwargs['shape'] = batch_shape[1:]  # Remove first dimension (batch)
        else:
            kwargs['shape'] = batch_shape
    
    # Remove other incompatible arguments
    kwargs.pop('optional', None)
    kwargs.pop('synchronized', None)
    kwargs.pop('quantization_config', None)  # Newer TF versions
    
    # Fix dtype policy
    dtype_config = kwargs.get('dtype', None)
    if isinstance(dtype_config, dict) and dtype_config.get('class_name') == 'DTypePolicy':
        kwargs['dtype'] = dtype_config.get('config', {}).get('name', 'float32')
    
    return kwargs

# Create a universal compatible layer factory
def create_compatible_layer(base_class):
    class CompatibleLayer(base_class):
        def __init__(self, **kwargs):
            kwargs = fix_layer_config(kwargs)
            super().__init__(**kwargs)
    return CompatibleLayer

# Create compatible versions of ALL common Keras layers
compatible_layers = {}
layer_classes = [
    'InputLayer', 'Conv2D', 'Dense', 'BatchNormalization', 'ReLU', 
    'DepthwiseConv2D', 'GlobalAveragePooling2D', 'Add', 'Multiply',
    'ZeroPadding2D', 'Activation', 'Dropout', 'MaxPooling2D', 'AveragePooling2D',
    'Flatten', 'Reshape', 'Concatenate', 'LeakyReLU', 'ELU', 'PReLU'
]

for layer_name in layer_classes:
    if hasattr(tf.keras.layers, layer_name):
        base_class = getattr(tf.keras.layers, layer_name)
        compatible_layers[layer_name] = create_compatible_layer(base_class)

class PestDetectionModel:
    def __init__(self):
        self.model = None
        self.class_labels = None
        self.treatment_lookup = None
        self.is_loaded = False
        self.load_time = None
        self.prediction_count = 0
        self.total_inference_ms = 0
    
    def load(self):
        """Load model weights and metadata. Call once at startup."""
        try:
            weights_path = os.path.join(os.path.dirname(__file__), '..', 'weights', 'pest_model_best.h5')
            labels_path = os.path.join(os.path.dirname(__file__), '..', 'weights', 'pest_class_labels.json')
            treatment_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'treatment_lookup.json')
            
            logger.info("Loading pest detection model...")
            # Try loading with different approaches
            try:
                # First try: with custom objects
                with custom_object_scope(compatible_layers):
                    self.model = tf.keras.models.load_model(
                        os.path.abspath(weights_path),
                        compile=False
                    )
            except Exception as e:
                logger.warning(f"Failed with custom objects: {e}")
                try:
                    # Second try: load architecture and weights separately
                    self.model = tf.keras.models.load_model(
                        os.path.abspath(weights_path),
                        custom_objects=compatible_layers,
                        compile=False
                    )
                except Exception as e2:
                    logger.error(f"Failed to load model: {e2}")
                    raise
            # Recompile with appropriate settings
            self.model.compile(
                optimizer='adam',
                loss='sparse_categorical_crossentropy',
                metrics=['accuracy']
            )
            
            with open(os.path.abspath(labels_path)) as f:
                labels_data = json.load(f)
                self.class_labels = labels_data['idx_to_class']
            
            with open(os.path.abspath(treatment_path)) as f:
                self.treatment_lookup = json.load(f)
            
            self.is_loaded = True
            self.load_time = time.time()
            logger.info(f"Pest model loaded. Classes: {len(self.class_labels)}")
            
        except Exception as e:
            logger.error(f"Failed to load pest model: {e}")
            raise
    
    def preprocess_image(self, image_bytes: bytes) -> np.ndarray:
        """Preprocess image bytes to model input tensor."""
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        image = image.resize((224, 224), Image.LANCZOS)
        img_array = np.array(image, dtype=np.float32) / 255.0
        return np.expand_dims(img_array, axis=0)
    
    def predict(self, image_bytes: bytes) -> dict:
        """Run inference on image bytes. Returns structured prediction result."""
        if not self.is_loaded:
            raise RuntimeError("Model not loaded. Call load() first.")
        
        start_time = time.time()
        
        # Preprocess
        input_tensor = self.preprocess_image(image_bytes)
        
        # Inference
        predictions = self.model.predict(input_tensor, verbose=0)
        
        inference_ms = (time.time() - start_time) * 1000
        self.prediction_count += 1
        self.total_inference_ms += inference_ms
        
        # Get top 3 predictions
        top_3_indices = np.argsort(predictions[0])[-3:][::-1]
        top_prediction_idx = str(top_3_indices[0])
        confidence = float(predictions[0][top_3_indices[0]])
        
        # Get class name
        class_name = self.class_labels.get(top_prediction_idx, 'Unknown')
        
        # Get treatment info
        treatment = self.treatment_lookup.get(class_name, {
            'id': 'UNKNOWN',
            'display_name': class_name.replace('___', ' - ').replace('_', ' '),
            'quick_fix': 'Please consult a local agronomist for this issue.',
            'permanent_fix': 'Monitor crop closely and improve general soil health.',
            'organic_fix': None,
            'severity': 'medium',
            'pesticide_name': None,
            'affected_crop': class_name.split('___')[0] if '___' in class_name else 'Unknown'
        })
        
        # Extract crop name from class name (format: Crop___Disease)
        parts = class_name.split('___')
        crop_name = parts[0].replace('_', ' ') if parts else 'Unknown'
        
        return {
            'disease': treatment.get('display_name', class_name),
            'confidence': round(confidence, 4),
            'crop': crop_name,
            'quick_fix': treatment.get('quick_fix', ''),
            'permanent_fix': treatment.get('permanent_fix', ''),
            'organic_fix': treatment.get('organic_fix'),
            'severity': treatment.get('severity', 'medium'),
            'treatment_id': treatment.get('id', 'UNKNOWN'),
            'pesticide': treatment.get('pesticide_name'),
            'raw_class': class_name,
            'inference_ms': round(inference_ms, 2),
            'top_3': [
                {
                    'class': self.class_labels.get(str(idx), 'Unknown'),
                    'confidence': round(float(predictions[0][idx]), 4)
                }
                for idx in top_3_indices
            ]
        }
    
    @property
    def avg_inference_ms(self) -> float:
        if self.prediction_count == 0:
            return 0.0
        return round(self.total_inference_ms / self.prediction_count, 2)
    
    @property
    def stats(self) -> dict:
        return {
            'is_loaded': self.is_loaded,
            'prediction_count': self.prediction_count,
            'avg_inference_ms': self.avg_inference_ms,
            'load_time': self.load_time,
        }
