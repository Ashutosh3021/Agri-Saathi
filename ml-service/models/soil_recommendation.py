import pickle
import numpy as np
import json
import os
import time
import logging
from typing import Optional

logger = logging.getLogger(__name__)

class SoilRecommendationModel:
    def __init__(self):
        self.model = None
        self.label_encoder = None
        self.class_names = None
        self.features = None
        self.is_loaded = False
        self.prediction_count = 0
        self.total_inference_ms = 0
    
    def load(self):
        try:
            model_path = os.path.join(os.path.dirname(__file__), '..', 'weights', 'soil_model.pkl')
            
            logger.info("Loading soil recommendation model...")
            with open(os.path.abspath(model_path), 'rb') as f:
                artifacts = pickle.load(f)
            
            self.model = artifacts['model']
            self.label_encoder = artifacts['label_encoder']
            self.class_names = artifacts['class_names']
            self.features = artifacts['features']
            self.is_loaded = True
            logger.info(f"Soil model loaded. Crops: {len(self.class_names)}")
            
        except Exception as e:
            logger.error(f"Failed to load soil model: {e}")
            raise
    
    def predict(self, nitrogen: float, phosphorus: float, potassium: float,
                temperature: float, humidity: float, ph: float, rainfall: float,
                selected_crop: Optional[str] = None) -> dict:
        
        if not self.is_loaded:
            raise RuntimeError("Model not loaded. Call load() first.")
        
        start_time = time.time()
        
        input_data = np.array([[nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall]])
        
        # Get probability for all classes
        probabilities = self.model.predict_proba(input_data)[0]
        
        # Get top 3 crops by probability
        top_3_indices = np.argsort(probabilities)[-3:][::-1]
        
        recommended_crops = [
            {
                'crop': self.class_names[idx],
                'suitability': round(float(probabilities[idx]), 4),
                'rank': i + 1
            }
            for i, idx in enumerate(top_3_indices)
        ]
        
        inference_ms = (time.time() - start_time) * 1000
        self.prediction_count += 1
        self.total_inference_ms += inference_ms
        
        # Analyze selected crop if provided
        selected_crop_analysis = None
        if selected_crop:
            selected_crop_lower = selected_crop.lower()
            matching_class = next(
                (name for name in self.class_names if name.lower() == selected_crop_lower),
                None
            )
            
            if matching_class:
                class_idx = list(self.class_names).index(matching_class)
                suitability = float(probabilities[class_idx])
                selected_crop_analysis = self._analyze_selected_crop(
                    matching_class, suitability, nitrogen, phosphorus, potassium, ph
                )
            else:
                selected_crop_analysis = {
                    'crop': selected_crop,
                    'is_suitable': False,
                    'potential_issues': [f'{selected_crop} is not in our trained crop database.'],
                    'soil_improvements': ['Consult a local agronomist for specific guidance.']
                }
        
        # Overall soil health assessment
        soil_health = self._assess_soil_health(nitrogen, phosphorus, potassium, ph, moisture=humidity)
        weather_risk = self._assess_weather_risk(temperature, rainfall, humidity)
        
        return {
            'recommended_crops': recommended_crops,
            'selected_crop_analysis': selected_crop_analysis,
            'current_soil_health': soil_health,
            'weather_risk': weather_risk,
            'inference_ms': round(inference_ms, 2),
        }
    
    def _analyze_selected_crop(self, crop: str, suitability: float, n, p, k, ph) -> dict:
        is_suitable = suitability > 0.6
        issues = []
        improvements = []
        
        # Generic issue detection based on NPK and pH
        if n < 20:
            issues.append('Low nitrogen may reduce yield by 15-25%')
            improvements.append('Apply urea (46-0-0) at 50kg/acre before sowing')
        if p < 15:
            issues.append('Phosphorus deficiency may affect root development')
            improvements.append('Add single superphosphate (SSP) at 40kg/acre')
        if k < 15:
            issues.append('Low potassium may reduce disease resistance')
            improvements.append('Apply muriate of potash (MOP) at 30kg/acre')
        if ph < 5.5:
            issues.append('Soil is too acidic — most crops prefer pH 6.0-7.0')
            improvements.append('Apply agricultural lime at 2-4 tonnes/acre to raise pH')
        elif ph > 7.5:
            issues.append('Soil is too alkaline — may lock nutrients')
            improvements.append('Apply gypsum or sulfur to lower pH gradually')
        
        if not issues:
            issues.append('Soil conditions look favorable for this crop')
        if not improvements:
            improvements.append('Maintain current soil management practices')
        
        return {
            'crop': crop,
            'is_suitable': is_suitable,
            'suitability_score': round(suitability, 4),
            'potential_issues': issues,
            'soil_improvements': improvements,
        }
    
    def _assess_soil_health(self, n, p, k, ph, moisture) -> str:
        score = 0
        if 30 <= n <= 80: score += 2
        elif n > 0: score += 1
        if 20 <= p <= 60: score += 2
        elif p > 0: score += 1
        if 20 <= k <= 60: score += 2
        elif k > 0: score += 1
        if 6.0 <= ph <= 7.0: score += 2
        elif 5.5 <= ph <= 7.5: score += 1
        
        if score >= 7: return 'good'
        elif score >= 4: return 'moderate'
        else: return 'poor'
    
    def _assess_weather_risk(self, temp, rainfall, humidity) -> str:
        if temp > 40 or temp < 5: return 'high'
        if rainfall > 200 or rainfall < 20: return 'medium'
        if humidity > 85: return 'medium'
        return 'low'
    
    @property
    def stats(self) -> dict:
        return {
            'is_loaded': self.is_loaded,
            'prediction_count': self.prediction_count,
            'avg_inference_ms': round(self.total_inference_ms / max(self.prediction_count, 1), 2),
        }
