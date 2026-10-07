"""
Startup Health Diagnosis System - Python Flask ML REST API
-----------------------------------------------------------
Serves predictions and model evaluation metrics for:
1. Decision Tree Classifier
2. Random Forest Classifier
3. Logistic Regression (with StandardScaler)
4. Ensemble Majority Voting with Probability Averaging

Endpoints:
- POST /predict      : Predict startup risk across all 3 models + Ensemble
- POST /api/predict  : Alias for /predict
- GET  /metrics      : Returns model evaluation metrics for all 3 models + Ensemble
- GET  /model-info   : Model architecture and feature metadata
- GET  /health       : Service health check
"""

import os
import json
from pathlib import Path
from flask import Flask, request, jsonify
from flask_cors import CORS

try:
    from predict import predict_startup_health, load_all_models
except ImportError:
    from ml_model.predict import predict_startup_health, load_all_models

app = Flask(__name__)

# Allowed origins: supports local dev, Vercel deployments (*.vercel.app), and FRONTEND_URL / CORS_ALLOWED_ORIGINS
cors_env = os.environ.get('FRONTEND_URL') or os.environ.get('CORS_ALLOWED_ORIGINS') or os.environ.get('VERCEL_URL')

allowed_origins = [
    r"https://.*\.vercel\.app",
    r"http://localhost:\d+",
    r"http://127\.0\.0\.1:\d+"
]

if cors_env:
    for origin in cors_env.split(','):
        o = origin.strip()
        if o:
            if not o.startswith('http://') and not o.startswith('https://'):
                allowed_origins.append(f"https://{o}")
            allowed_origins.append(o)

CORS(app, resources={r"/*": {"origins": allowed_origins}}, supports_credentials=True)

SCRIPT_DIR = Path(__file__).resolve().parent

def get_metrics_path():
    candidate_paths = [
        SCRIPT_DIR / 'model_metrics.json',
        SCRIPT_DIR.parent / 'ml_model' / 'model_metrics.json',
        Path.cwd() / 'ml_model' / 'model_metrics.json',
        Path.cwd() / 'model_metrics.json',
        Path('/var/task/ml_model/model_metrics.json'),
        Path('/var/task/model_metrics.json')
    ]
    for p in candidate_paths:
        if p.is_file():
            return p
    return SCRIPT_DIR / 'model_metrics.json'


def get_stored_metrics():
    """Load cached model evaluation metrics."""
    metrics_path = get_metrics_path()
    if metrics_path.exists():
        try:
            with open(metrics_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            app.logger.error(f"Error loading metrics JSON: {e}")
    return None


@app.route('/', methods=['GET'])
@app.route('/api', methods=['GET'])
def index():
    return jsonify({
        "service": "Startup Health Diagnosis ML API v2.0",
        "algorithms": [
            "Decision Tree Classifier (scikit-learn)",
            "Random Forest Classifier (scikit-learn)",
            "Logistic Regression (scikit-learn)",
            "Ensemble Majority Voting"
        ],
        "status": "Online",
        "endpoints": [
            "POST /predict",
            "POST /api/predict",
            "GET  /metrics",
            "GET  /model-info",
            "GET  /health"
        ]
    })


@app.route('/health', methods=['GET'])
@app.route('/api/health', methods=['GET'])
def health_check():
    models_loaded = False
    try:
        load_all_models()
        models_loaded = True
    except Exception:
        models_loaded = False

    return jsonify({
        "status": "healthy" if models_loaded else "models_not_loaded",
        "models_loaded": models_loaded,
        "algorithms": [
            "Decision Tree Classifier",
            "Random Forest Classifier",
            "Logistic Regression",
            "Ensemble Voting"
        ]
    })


@app.route('/predict', methods=['POST', 'OPTIONS'])
@app.route('/api/predict', methods=['POST', 'OPTIONS'])
def predict():
    if request.method == 'OPTIONS':
        return ('', 204)

    if not request.is_json:
        # Try parsing JSON if content-type header was omitted
        data = request.get_json(force=True, silent=True)
        if data is None:
            return jsonify({
                "success": False,
                "error": "Request body must be a valid JSON object"
            }), 400
    else:
        data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "success": False,
            "error": "Expected JSON payload with startup financial and traction features"
        }), 400

    try:
        result = predict_startup_health(data)
        return jsonify(result), 200

    except FileNotFoundError as fnf:
        app.logger.error(f"Model file error: {fnf}")
        return jsonify({
            "success": False,
            "error": "AI prediction service is temporarily unavailable.",
            "notice": "AI prediction service is temporarily unavailable. Showing deterministic startup health analysis."
        }), 503

    except Exception as err:
        app.logger.error(f"Prediction inference error: {err}")
        return jsonify({
            "success": False,
            "error": "AI prediction service is temporarily unavailable.",
            "notice": "AI prediction service is temporarily unavailable. Showing deterministic startup health analysis."
        }), 500


@app.route('/metrics', methods=['GET'])
@app.route('/api/metrics', methods=['GET'])
def metrics():
    data = get_stored_metrics()
    if not data:
        return jsonify({
            "success": False,
            "message": "Model metrics not found. Train the models using 'python train.py' first."
        }), 404

    return jsonify({
        "success": True,
        "metrics": data
    }), 200


@app.route('/model-info', methods=['GET'])
@app.route('/api/model-info', methods=['GET'])
def model_info():
    data = get_stored_metrics()
    return jsonify({
        "success": True,
        "models": [
            {
                "name": "Decision Tree Classifier",
                "library": "scikit-learn (DecisionTreeClassifier)",
                "hyperparameters": {"max_depth": 5, "criterion": "gini", "random_state": 42}
            },
            {
                "name": "Random Forest Classifier",
                "library": "scikit-learn (RandomForestClassifier)",
                "hyperparameters": {"n_estimators": 100, "max_depth": 8, "criterion": "gini", "random_state": 42}
            },
            {
                "name": "Logistic Regression",
                "library": "scikit-learn (LogisticRegression)",
                "hyperparameters": {"max_iter": 1000, "random_state": 42, "scaler": "StandardScaler"}
            },
            {
                "name": "Ensemble Majority Voting",
                "method": "Majority Vote with Probability Average Tie-Breaking"
            }
        ],
        "features": [
            "runway",
            "profit_margin",
            "burn_rate",
            "growth_rate",
            "customer_growth",
            "monthly_expenses",
            "monthly_revenue",
            "employees"
        ],
        "classes": ["Healthy", "Moderate Risk", "Critical"],
        "metrics": data
    }), 200


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    print(f"Starting Multi-Model Startup Health ML Flask API on http://127.0.0.1:{port}")
    app.run(host='0.0.0.0', port=port, debug=False)
