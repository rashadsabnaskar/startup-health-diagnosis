"""
Startup Health Diagnosis System - Multi-Model Inference Engine
---------------------------------------------------------------
Loads trained Decision Tree, Random Forest, and Logistic Regression models
and computes independent predictions and ensemble majority voting.
"""

import os
import sys
import json
import warnings
import joblib
import numpy as np

from pathlib import Path

# Suppress feature-name mismatch warnings when passing pure NumPy arrays to scikit-learn models
warnings.filterwarnings('ignore', category=UserWarning)

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


def _ensure_lightweight_sklearn():
    """
    Ensures lightweight model classes are available in sys.modules for unpickling
    trained .pkl models without requiring heavy scipy or scikit-learn libraries.
    If scikit-learn and scipy are installed and working, uses them directly.
    """
    try:
        import sklearn
        import sklearn.tree._classes
        import sklearn.ensemble._forest
        import sklearn.linear_model._logistic
        import sklearn.preprocessing._data
        return
    except (ImportError, Exception):
        pass

    import types

    sklearn = types.ModuleType('sklearn')
    sklearn_tree = types.ModuleType('sklearn.tree')
    sklearn_tree_classes = types.ModuleType('sklearn.tree._classes')
    sklearn_tree_tree = types.ModuleType('sklearn.tree._tree')
    sklearn_ensemble = types.ModuleType('sklearn.ensemble')
    sklearn_ensemble_forest = types.ModuleType('sklearn.ensemble._forest')
    sklearn_linear_model = types.ModuleType('sklearn.linear_model')
    sklearn_linear_model_logistic = types.ModuleType('sklearn.linear_model._logistic')
    sklearn_preprocessing = types.ModuleType('sklearn.preprocessing')
    sklearn_preprocessing_data = types.ModuleType('sklearn.preprocessing._data')

    class Tree:
        def __init__(self, *args, **kwargs):
            pass
        def __setstate__(self, state):
            if isinstance(state, dict):
                self.max_depth = state.get('max_depth', 5)
                self.node_count = state.get('node_count', 0)
                nodes = state['nodes']
                self.children_left = nodes['left_child']
                self.children_right = nodes['right_child']
                self.feature = nodes['feature']
                self.threshold = nodes['threshold']
                self.value = state['values']
            elif isinstance(state, tuple):
                self.max_depth = state[0]
                self.node_count = state[1]
                nodes = state[2]
                self.children_left = nodes['left_child']
                self.children_right = nodes['right_child']
                self.feature = nodes['feature']
                self.threshold = nodes['threshold']
                self.value = state[3]

    class DecisionTreeClassifier:
        def __init__(self, *args, **kwargs):
            pass
        def __setstate__(self, state):
            self.__dict__.update(state)

        def predict_proba(self, X):
            X = np.asarray(X, dtype=float)
            tree = self.tree_
            probas = []
            for x in X:
                node = 0
                while tree.children_left[node] != -1:
                    if x[tree.feature[node]] <= tree.threshold[node]:
                        node = tree.children_left[node]
                    else:
                        node = tree.children_right[node]
                v = tree.value[node][0]
                total = np.sum(v)
                probas.append(v / total if total > 0 else v)
            return np.array(probas)

        def predict(self, X):
            probas = self.predict_proba(X)
            return self.classes_[np.argmax(probas, axis=1)]

    class RandomForestClassifier:
        def __init__(self, *args, **kwargs):
            pass
        def __setstate__(self, state):
            self.__dict__.update(state)

        def predict_proba(self, X):
            X = np.asarray(X, dtype=float)
            all_probas = [tree.predict_proba(X) for tree in self.estimators_]
            return np.mean(all_probas, axis=0)

        def predict(self, X):
            probas = self.predict_proba(X)
            return self.classes_[np.argmax(probas, axis=1)]

    class LogisticRegression:
        def __init__(self, *args, **kwargs):
            pass
        def __setstate__(self, state):
            self.__dict__.update(state)

        def predict_proba(self, X):
            X = np.asarray(X, dtype=float)
            scores = X @ self.coef_.T + self.intercept_
            exp_scores = np.exp(scores - np.max(scores, axis=1, keepdims=True))
            return exp_scores / np.sum(exp_scores, axis=1, keepdims=True)

        def predict(self, X):
            probas = self.predict_proba(X)
            return self.classes_[np.argmax(probas, axis=1)]

    class StandardScaler:
        def __init__(self, *args, **kwargs):
            pass
        def __setstate__(self, state):
            self.__dict__.update(state)

        def transform(self, X):
            X = np.asarray(X, dtype=float)
            return (X - self.mean_) / self.scale_

    sklearn_tree.DecisionTreeClassifier = DecisionTreeClassifier
    sklearn_tree_classes.DecisionTreeClassifier = DecisionTreeClassifier
    sklearn_tree_tree.Tree = Tree

    sklearn_ensemble.RandomForestClassifier = RandomForestClassifier
    sklearn_ensemble_forest.RandomForestClassifier = RandomForestClassifier

    sklearn_linear_model.LogisticRegression = LogisticRegression
    sklearn_linear_model_logistic.LogisticRegression = LogisticRegression

    sklearn_preprocessing.StandardScaler = StandardScaler
    sklearn_preprocessing_data.StandardScaler = StandardScaler

    modules = {
        'sklearn': sklearn,
        'sklearn.tree': sklearn_tree,
        'sklearn.tree._classes': sklearn_tree_classes,
        'sklearn.tree._tree': sklearn_tree_tree,
        'sklearn.ensemble': sklearn_ensemble,
        'sklearn.ensemble._forest': sklearn_ensemble_forest,
        'sklearn.linear_model': sklearn_linear_model,
        'sklearn.linear_model._logistic': sklearn_linear_model_logistic,
        'sklearn.preprocessing': sklearn_preprocessing,
        'sklearn.preprocessing._data': sklearn_preprocessing_data,
    }
    for name, mod in modules.items():
        sys.modules[name] = mod


def load_all_models():
    """Lazily load all models and scaler into cache using relative paths."""
    global _MODELS
    if _MODELS['random_forest'] is None:
        _ensure_lightweight_sklearn()
        models_dir = find_models_dir()
        dt_path = models_dir / 'decision_tree.pkl'
        rf_path = models_dir / 'random_forest.pkl'
        lr_path = models_dir / 'logistic_regression.pkl'
        scaler_path = models_dir / 'scaler.pkl'

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


def _model_inference(model, X_input, is_scaled=False, scaler=None):
    """Generates prediction class, confidence, and probabilities map for a single model."""
    X_eval = scaler.transform(X_input) if (is_scaled and scaler is not None) else X_input
    pred_class = model.predict(X_eval)[0]

    probabilities = {}
    confidence = 1.0

    if hasattr(model, 'predict_proba'):
        proba = model.predict_proba(X_eval)[0]
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

    # Lightweight 2D NumPy feature vector (eliminates bulky pandas runtime dependency)
    feature_vector = np.array([[features_dict[col] for col in FEATURE_COLUMNS]], dtype=float)

    # 1. Decision Tree
    dt_pred, dt_conf, dt_probs = _model_inference(models['decision_tree'], feature_vector)

    # 2. Random Forest
    rf_pred, rf_conf, rf_probs = _model_inference(models['random_forest'], feature_vector)

    # 3. Logistic Regression (scaled)
    lr_pred, lr_conf, lr_probs = _model_inference(
        models['logistic_regression'], feature_vector, is_scaled=True, scaler=models['scaler']
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
