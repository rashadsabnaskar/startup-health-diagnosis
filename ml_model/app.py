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
from flask import Flask, request, jsonify
from flask_cors import CORS
from predict import predict_startup_health, load_all_models

app = Flask(__name__)
# Enable Cross-Origin Resource Sharing for React frontend integration
CORS(app, resources={r"/*": {"origins": "*"}})

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
METRICS_PATH = os.path.join(SCRIPT_DIR, 'model_metrics.json')


def get_stored_metrics():
    """Load cached model evaluation metrics."""
    if os.path.exists(METRICS_PATH):
        try:
            with open(METRICS_PATH, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            app.logger.error(f"Error loading metrics JSON: {e}")
    return None


@app.route('/', methods=['GET'])
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


@app.route('/predict', methods=['POST'])
@app.route('/api/predict', methods=['POST'])
def predict():
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
        return jsonify({
            "success": False,
            "error": str(fnf),
            "hint": "Please run 'python train.py' inside ml_model/ to train the models first."
        }), 503

    except Exception as err:
        app.logger.error(f"Prediction inference error: {err}")
        return jsonify({
            "success": False,
            "error": f"Inference error: {str(err)}"
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
