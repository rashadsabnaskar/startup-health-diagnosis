"""
Startup Health Diagnosis System - Multi-Model Inference Engine
---------------------------------------------------------------
Loads trained Decision Tree, Random Forest, and Logistic Regression models
and computes independent predictions and ensemble majority voting.
"""

import os
import sys
import json
import joblib
import pandas as pd
import numpy as np

from pathlib import Path

FEATURE_COLUMNS = [
    'runway',
    'profit_margin',
    'burn_rate',
    'growth_rate',
    'customer_growth',
    'monthly_expenses',
    'monthly_revenue',
    'employees'
]

CLASSES = ['Healthy', 'Moderate Risk', 'Critical']

_MODELS = {
    'decision_tree': None,
    'random_forest': None,
    'logistic_regression': None,
    'scaler': None
}

SCRIPT_DIR = Path(__file__).resolve().parent

def find_models_dir():
    """
    Locates the models directory using robust relative paths.
    Works seamlessly in local dev, project root execution, and Vercel serverless containers.
    """
    candidate_paths = [
        SCRIPT_DIR / 'models',
        SCRIPT_DIR.parent / 'ml_model' / 'models',
        Path.cwd() / 'ml_model' / 'models',
        Path.cwd() / 'models',
        Path('/var/task/ml_model/models'),
        Path('/var/task/models')
    ]
    for candidate in candidate_paths:
        if candidate.is_dir() and (candidate / 'random_forest.pkl').exists():
            return candidate
    return SCRIPT_DIR / 'models'


def load_all_models():
    """Lazily load all models and scaler into cache using relative paths."""
    global _MODELS
    if _MODELS['random_forest'] is None:
        models_dir = find_models_dir()
        dt_path = models_dir / 'decision_tree.pkl'
        rf_path = models_dir / 'random_forest.pkl'
        lr_path = models_dir / 'logistic_regression.pkl'
        scaler_path = models_dir / 'scaler.pkl'

        # Fallback check for legacy single model
        if not rf_path.exists():
            legacy_path = SCRIPT_DIR / 'model.pkl'
            if legacy_path.exists():
                legacy_obj = joblib.load(str(legacy_path))
                _MODELS['decision_tree'] = legacy_obj
                _MODELS['random_forest'] = legacy_obj
                _MODELS['logistic_regression'] = legacy_obj
                return _MODELS

        if not rf_path.exists():
            raise FileNotFoundError(f"Trained models not found in {models_dir}. Run train.py first.")

        _MODELS['decision_tree'] = joblib.load(str(dt_path))
        _MODELS['random_forest'] = joblib.load(str(rf_path))
        _MODELS['logistic_regression'] = joblib.load(str(lr_path))
        _MODELS['scaler'] = joblib.load(str(scaler_path))

    return _MODELS


def extract_features(data):
    """
    Extracts the 8 required features with flexible support for snake_case,
    legacy names, and camelCase keys.
    """
    if not isinstance(data, dict):
        raise ValueError("Input data must be a JSON object / dictionary.")

    def get_num(keys, default=0.0):
        for k in keys:
            if k in data and data[k] is not None and str(data[k]).strip() != '':
                try:
                    return float(data[k])
                except (ValueError, TypeError):
                    pass
        return default

    revenue = get_num(['monthly_revenue', 'revenue', 'monthlyRevenue'], 0.0)
    expenses = get_num(['monthly_expenses', 'expenses', 'monthlyExpenses'], 0.0)
    burn = get_num(['burn_rate', 'burnRate', 'monthlyBurnRate'], max(0.0, expenses - revenue))
    
    # Margin
    if any(k in data for k in ['profit_margin', 'profitMargin', 'margin']):
        margin = get_num(['profit_margin', 'profitMargin', 'margin'], 0.0)
    else:
        margin = ((revenue - expenses) / revenue * 100.0) if revenue > 0 else (-100.0 if expenses > 0 else 0.0)

    # Runway
    if any(k in data for k in ['runway', 'cashRunway', 'cash_runway']):
        runway = get_num(['runway', 'cashRunway', 'cash_runway'], 12.0)
    else:
        cash = get_num(['availableCash', 'available_cash', 'cash'], 0.0)
        runway = (cash / burn) if burn > 0 else 36.0

    growth = get_num(['growth_rate', 'growthRate', 'customerGrowthRate'], 0.0)
    cust_growth = get_num(['customer_growth', 'customerGrowth', 'customerGrowthRate'], growth)
    employees = max(1.0, get_num(['employees', 'employee_count', 'employeeCount', 'numberOfEmployees'], 1.0))

    return {
        'runway': round(runway, 2),
        'profit_margin': round(margin, 2),
        'burn_rate': round(burn, 2),
        'growth_rate': round(growth, 2),
        'customer_growth': round(cust_growth, 2),
        'monthly_expenses': round(expenses, 2),
        'monthly_revenue': round(revenue, 2),
        'employees': round(employees, 0)
    }


def _model_inference(model, X_df, is_scaled=False, scaler=None):
    """Generates prediction class, confidence, and probabilities map for a single model."""
    X_input = scaler.transform(X_df) if (is_scaled and scaler is not None) else X_df
    pred_class = model.predict(X_input)[0]

    probabilities = {}
    confidence = 1.0

    if hasattr(model, 'predict_proba'):
        proba = model.predict_proba(X_input)[0]
        class_list = list(model.classes_)
        for cls in CLASSES:
            if cls in class_list:
                idx = class_list.index(cls)
                probabilities[cls] = round(float(proba[idx]), 3)
            else:
                probabilities[cls] = 0.0
        confidence = round(float(np.max(proba)), 2)
    else:
        for cls in CLASSES:
            probabilities[cls] = 1.0 if cls == pred_class else 0.0

    return pred_class, confidence, probabilities


def predict_startup_health(data):
    """
    Executes all three ML algorithms and calculates ensemble prediction.
    """
    models = load_all_models()
    features_dict = extract_features(data)

    df_features = pd.DataFrame([features_dict])[FEATURE_COLUMNS]

    # 1. Decision Tree
    dt_pred, dt_conf, dt_probs = _model_inference(models['decision_tree'], df_features)

    # 2. Random Forest
    rf_pred, rf_conf, rf_probs = _model_inference(models['random_forest'], df_features)

    # 3. Logistic Regression (scaled)
    lr_pred, lr_conf, lr_probs = _model_inference(
        models['logistic_regression'], df_features, is_scaled=True, scaler=models['scaler']
    )

    # 4. Ensemble Majority Voting
    votes = [dt_pred, rf_pred, lr_pred]
    vote_counts = {cls: votes.count(cls) for cls in CLASSES}

    # Combined average probabilities
    ensemble_probs = {}
    for cls in CLASSES:
        avg_p = (dt_probs.get(cls, 0.0) + rf_probs.get(cls, 0.0) + lr_probs.get(cls, 0.0)) / 3.0
        ensemble_probs[cls] = round(avg_p, 3)

    # Check for majority (2 or 3 votes)
    ensemble_pred = None
    for cls, cnt in vote_counts.items():
        if cnt >= 2:
            ensemble_pred = cls
            break

    # If 3-way tie, choose class with highest average probability
    if ensemble_pred is None:
        ensemble_pred = max(ensemble_probs, key=ensemble_probs.get)

    ensemble_conf = round(float(ensemble_probs.get(ensemble_pred, 0.85)), 2)
    agreement_text = f"{vote_counts[ensemble_pred]}/3 models agree"

    dt_result = {"prediction": dt_pred, "confidence": dt_conf, "probabilities": dt_probs}
    rf_result = {"prediction": rf_pred, "confidence": rf_conf, "probabilities": rf_probs}
    lr_result = {"prediction": lr_pred, "confidence": lr_conf, "probabilities": lr_probs}
    ensemble_result = {
        "prediction": ensemble_pred,
        "confidence": ensemble_conf,
        "probabilities": ensemble_probs,
        "agreement": agreement_text
    }

    return {
        "success": True,
        # Section 10 format
        "prediction": {
            "decision_tree": dt_result,
            "random_forest": rf_result,
            "logistic_regression": lr_result,
            "ensemble": ensemble_result
        },
        # Top-level models dictionary format
        "decision_tree": dt_result,
        "random_forest": rf_result,
        "logistic_regression": lr_result,
        "ensemble": ensemble_result,
        "ensemble_prediction": ensemble_pred,
        "ensemble_confidence": ensemble_conf,
        # Backward-compatible convenience keys for existing components
        "prediction_class": ensemble_pred,
        "confidence": ensemble_conf,
        "probabilities": ensemble_probs,
        "algorithm": "Ensemble (Random Forest + Decision Tree + Logistic Regression)",
        "inputs_analyzed": features_dict
    }


if __name__ == '__main__':
    sample = {
        "runway": 7.2,
        "profit_margin": 15.6,
        "burn_rate": 250000,
        "growth_rate": 6,
        "customer_growth": 5,
        "monthly_expenses": 380000,
        "monthly_revenue": 450000,
        "employees": 15
    }
    print("Testing multi-model inference:")
    out = predict_startup_health(sample)
    print(json.dumps(out, indent=2))
