## CELL 3 — SOIL MODEL (Train this first — it's fast, CPU-friendly, takes ~2 minutes)

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import pickle
import json
import matplotlib.pyplot as plt
import seaborn as sns

# Load dataset
df = pd.read_csv('model\Crop_recommendation.csv')
print(f"Dataset shape: {df.shape}")
print(f"Crops: {df['label'].unique()}")``
print(f"Class distribution:\n{df['label'].value_counts()}")

# Features and target
FEATURES = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
TARGET = 'label'

X = df[FEATURES]
y = df[TARGET]

# Encode labels
le = LabelEncoder()
y_encoded = le.fit_transform(y)
print(f"\nLabel mapping: {dict(zip(le.classes_, le.transform(le.classes_)))}")

# Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
)
print(f"\nTrain size: {len(X_train)}, Test size: {len(X_test)}")

# Train XGBoost (primary model)
print("\nTraining XGBoost...")
xgb_model = XGBClassifier(
    n_estimators=200,
    max_depth=6,
    learning_rate=0.1,
    subsample=0.8,
    colsample_bytree=0.8,
    use_label_encoder=False,
    eval_metric='mlogloss',
    random_state=42
)
xgb_model.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)

# Train Random Forest (backup model)
print("Training Random Forest...")
rf_model = RandomForestClassifier(n_estimators=200, random_state=42, n_jobs=-1)
rf_model.fit(X_train, y_train)

# Evaluate both
xgb_pred = xgb_model.predict(X_test)
rf_pred = rf_model.predict(X_test)

print(f"\nXGBoost Accuracy: {accuracy_score(y_test, xgb_pred):.4f}")
print(f"Random Forest Accuracy: {accuracy_score(y_test, rf_pred):.4f}")

# Detailed classification report
print("\nXGBoost Classification Report:")
print(classification_report(y_test, xgb_pred, target_names=le.classes_))

# Feature importance
importance_df = pd.DataFrame({
    'feature': FEATURES,
    'importance': xgb_model.feature_importances_
}).sort_values('importance', ascending=False)
print(f"\nFeature Importances:\n{importance_df}")

# Cross validation
cv_scores = cross_val_score(xgb_model, X, y_encoded, cv=5, scoring='accuracy')
print(f"\nCross-validation scores: {cv_scores}")
print(f"Mean CV accuracy: {cv_scores.mean():.4f} (+/- {cv_scores.std() * 2:.4f})")

# Save model artifacts
soil_artifacts = {
    'model': xgb_model,
    'label_encoder': le,
    'features': FEATURES,
    'accuracy': float(accuracy_score(y_test, xgb_pred)),
    'n_classes': len(le.classes_),
    'class_names': list(le.classes_),
}

with open('soil_model.pkl', 'wb') as f:
    pickle.dump(soil_artifacts, f)

# Save class names as JSON for the API
with open('soil_classes.json', 'w') as f:
    json.dump({
        'classes': list(le.classes_),
        'features': FEATURES,
        'accuracy': float(accuracy_score(y_test, xgb_pred))
    }, f, indent=2)

print("\n✅ Soil model saved as soil_model.pkl")
print(f"✅ soil_classes.json saved with {len(le.classes_)} crop classes")