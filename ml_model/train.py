"""
Startup Health Diagnosis System - Multi-Model ML Training Pipeline
-------------------------------------------------------------------
Supervised Machine Learning Algorithms:
1. Decision Tree Classifier (max_depth=5, random_state=42)
2. Random Forest Classifier (n_estimators=100, max_depth=8, random_state=42)
3. Logistic Regression (max_iter=1000, random_state=42, with StandardScaler)
4. Ensemble Majority Voting with Probability Tie-Breaking

Features:
- runway
- profit_margin
- burn_rate
- growth_rate
- customer_growth
- monthly_expenses
- monthly_revenue
- employees

Target:
- risk_level ('Healthy', 'Moderate Risk', 'Critical')
"""

import json
import os
import joblib
import numpy as np
import pandas as pd
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
)
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression

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


def ensemble_predict_sample(dt_pred, rf_pred, lr_pred, dt_proba, rf_proba, lr_proba, classes):
    """
    Combines predictions from Decision Tree, Random Forest, and Logistic Regression.
    Uses majority voting (2+ votes).
    If there is a 3-way tie, chooses the class with the highest average predicted probability.
    """
    votes = [dt_pred, rf_pred, lr_pred]
    vote_counts = {cls: votes.count(cls) for cls in classes}

    # Check for majority
    for cls, count in vote_counts.items():
        if count >= 2:
            return cls

    # Tie breaking by average probability
    avg_proba = {}
    for i, cls in enumerate(classes):
        avg_proba[cls] = (dt_proba[i] + rf_proba[i] + lr_proba[i]) / 3.0

    return max(avg_proba, key=avg_proba.get)


def train_and_evaluate():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_path = os.path.join(script_dir, 'dataset.csv')
    if not os.path.exists(dataset_path):
        dataset_path = os.path.join(script_dir, 'startup_health_dataset.csv')

    models_dir = os.path.join(script_dir, 'models')
    os.makedirs(models_dir, exist_ok=True)

    metrics_path = os.path.join(script_dir, 'model_metrics.json')

    print("=" * 68)
    print("  STARTUP HEALTH DIAGNOSIS SYSTEM - MULTI-MODEL ML PIPELINE")
    print("  Algorithms: Decision Tree, Random Forest, Logistic Regression, Ensemble")
    print("=" * 68)

    df = pd.read_csv(dataset_path)

    # Normalize column names if legacy dataset is loaded
    col_mapping = {
        'revenue': 'monthly_revenue',
        'expenses': 'monthly_expenses',
        'employee_count': 'employees',
        'startup_health': 'risk_level'
    }
    df.rename(columns=col_mapping, inplace=True)

    X = df[FEATURE_COLUMNS].copy()
    y = df['risk_level'].copy()

    total_samples = len(df)
    class_distribution = y.value_counts().to_dict()

    print(f"\n[1] Dataset Loaded: {total_samples} samples across 8 features.")
    print(f"    Class Distribution: {class_distribution}")

    # Train / Test split: 80% train, 20% test, stratified by class
    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=0.20,
        random_state=42,
        stratify=y
    )

    print(f"    Train Samples: {len(X_train)} (80%)")
    print(f"    Test Samples:  {len(X_test)} (20%)")

    # Preprocessing: StandardScaler for Logistic Regression (fit ONLY on training data)
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # -------------------------------------------------------------
    # 1. DECISION TREE CLASSIFIER
    # -------------------------------------------------------------
    print("\n[2] Training Decision Tree Classifier (max_depth=5, random_state=42)...")
    dt_model = DecisionTreeClassifier(
        max_depth=5,
        random_state=42,
        criterion='gini'
    )
    dt_model.fit(X_train, y_train)

    dt_pred = dt_model.predict(X_test)
    dt_proba = dt_model.predict_proba(X_test)

    dt_acc = round(accuracy_score(y_test, dt_pred) * 100, 2)
    dt_prec = round(precision_score(y_test, dt_pred, average='macro', zero_division=0) * 100, 2)
    dt_rec = round(recall_score(y_test, dt_pred, average='macro', zero_division=0) * 100, 2)
    dt_f1 = round(f1_score(y_test, dt_pred, average='macro', zero_division=0) * 100, 2)
    dt_cm = confusion_matrix(y_test, dt_pred, labels=CLASSES).tolist()

    dt_importances = {
        feat: round(float(imp), 4)
        for feat, imp in sorted(zip(FEATURE_COLUMNS, dt_model.feature_importances_), key=lambda x: x[1], reverse=True)
    }

    # -------------------------------------------------------------
    # 2. RANDOM FOREST CLASSIFIER
    # -------------------------------------------------------------
    print("[3] Training Random Forest Classifier (n_estimators=100, max_depth=8, random_state=42)...")
    rf_model = RandomForestClassifier(
        n_estimators=100,
        max_depth=8,
        random_state=42,
        criterion='gini'
    )
    rf_model.fit(X_train, y_train)

    rf_pred = rf_model.predict(X_test)
    rf_proba = rf_model.predict_proba(X_test)

    rf_acc = round(accuracy_score(y_test, rf_pred) * 100, 2)
    rf_prec = round(precision_score(y_test, rf_pred, average='macro', zero_division=0) * 100, 2)
    rf_rec = round(recall_score(y_test, rf_pred, average='macro', zero_division=0) * 100, 2)
    rf_f1 = round(f1_score(y_test, rf_pred, average='macro', zero_division=0) * 100, 2)
    rf_cm = confusion_matrix(y_test, rf_pred, labels=CLASSES).tolist()

    rf_importances = {
        feat: round(float(imp), 4)
        for feat, imp in sorted(zip(FEATURE_COLUMNS, rf_model.feature_importances_), key=lambda x: x[1], reverse=True)
    }

    # -------------------------------------------------------------
    # 3. LOGISTIC REGRESSION (with StandardScaler)
    # -------------------------------------------------------------
    print("[4] Training Logistic Regression (max_iter=1000, random_state=42, StandardScaler)...")
    lr_model = LogisticRegression(
        max_iter=1000,
        random_state=42
    )
    lr_model.fit(X_train_scaled, y_train)

    lr_pred = lr_model.predict(X_test_scaled)
    lr_proba = lr_model.predict_proba(X_test_scaled)

    lr_acc = round(accuracy_score(y_test, lr_pred) * 100, 2)
    lr_prec = round(precision_score(y_test, lr_pred, average='macro', zero_division=0) * 100, 2)
    lr_rec = round(recall_score(y_test, lr_pred, average='macro', zero_division=0) * 100, 2)
    lr_f1 = round(f1_score(y_test, lr_pred, average='macro', zero_division=0) * 100, 2)
    lr_cm = confusion_matrix(y_test, lr_pred, labels=CLASSES).tolist()

    # -------------------------------------------------------------
    # 4. ENSEMBLE PREDICTIONS ON TEST SET
    # -------------------------------------------------------------
    print("[5] Evaluating Ensemble Majority Voting...")
    ensemble_preds = []
    classes_list = list(dt_model.classes_)

    for i in range(len(X_test)):
        ens_p = ensemble_predict_sample(
            dt_pred[i], rf_pred[i], lr_pred[i],
            dt_proba[i], rf_proba[i], lr_proba[i],
            classes_list
        )
        ensemble_preds.append(ens_p)

    ens_acc = round(accuracy_score(y_test, ensemble_preds) * 100, 2)
    ens_prec = round(precision_score(y_test, ensemble_preds, average='macro', zero_division=0) * 100, 2)
    ens_rec = round(recall_score(y_test, ensemble_preds, average='macro', zero_division=0) * 100, 2)
    ens_f1 = round(f1_score(y_test, ensemble_preds, average='macro', zero_division=0) * 100, 2)
    ens_cm = confusion_matrix(y_test, ensemble_preds, labels=CLASSES).tolist()

    # -------------------------------------------------------------
    # PRINT RESULTS TABLE
    # -------------------------------------------------------------
    print("\n" + "=" * 45)
    print("===== MODEL PERFORMANCE =====")
    print("=" * 45)

    print("\nDecision Tree")
    print(f"Accuracy:  {dt_acc:.2f}%")
    print(f"Precision: {dt_prec:.2f}%")
    print(f"Recall:    {dt_rec:.2f}%")
    print(f"F1 Score:  {dt_f1:.2f}%")

    print("\nRandom Forest")
    print(f"Accuracy:  {rf_acc:.2f}%")
    print(f"Precision: {rf_prec:.2f}%")
    print(f"Recall:    {rf_rec:.2f}%")
    print(f"F1 Score:  {rf_f1:.2f}%")

    print("\nLogistic Regression")
    print(f"Accuracy:  {lr_acc:.2f}%")
    print(f"Precision: {lr_prec:.2f}%")
    print(f"Recall:    {lr_rec:.2f}%")
    print(f"F1 Score:  {lr_f1:.2f}%")

    print("\nEnsemble (Majority Voting)")
    print(f"Accuracy:  {ens_acc:.2f}%")
    print(f"Precision: {ens_prec:.2f}%")
    print(f"Recall:    {ens_rec:.2f}%")
    print(f"F1 Score:  {ens_f1:.2f}%")

    print("\n" + "-" * 45)
    print("Top Feature Importances (Random Forest):")
    for feat, val in list(rf_importances.items())[:5]:
        print(f"  {feat:<20}: {val * 100:.2f}%")

    # -------------------------------------------------------------
    # SAVE MODELS
    # -------------------------------------------------------------
    print(f"\n[6] Saving trained models to: {models_dir}")
    joblib.dump(dt_model, os.path.join(models_dir, 'decision_tree.pkl'))
    joblib.dump(rf_model, os.path.join(models_dir, 'random_forest.pkl'))
    joblib.dump(lr_model, os.path.join(models_dir, 'logistic_regression.pkl'))
    joblib.dump(scaler, os.path.join(models_dir, 'scaler.pkl'))

    # Save legacy root model.pkl as random_forest
    joblib.dump(rf_model, os.path.join(script_dir, 'model.pkl'))

    # -------------------------------------------------------------
    # PREPARE METRICS JSON
    # -------------------------------------------------------------
    metrics_payload = {
        "models": {
            "decision_tree": {
                "name": "Decision Tree Classifier",
                "algorithm": "DecisionTreeClassifier",
                "max_depth": 5,
                "accuracy": dt_acc,
                "precision": dt_prec,
                "recall": dt_rec,
                "f1_score": dt_f1,
                "confusion_matrix": dt_cm,
                "feature_importances": dt_importances
            },
            "random_forest": {
                "name": "Random Forest Classifier",
                "algorithm": "RandomForestClassifier",
                "n_estimators": 100,
                "max_depth": 8,
                "accuracy": rf_acc,
                "precision": rf_prec,
                "recall": rf_rec,
                "f1_score": rf_f1,
                "confusion_matrix": rf_cm,
                "feature_importances": rf_importances
            },
            "logistic_regression": {
                "name": "Logistic Regression",
                "algorithm": "LogisticRegression",
                "max_iter": 1000,
                "scaler": "StandardScaler",
                "accuracy": lr_acc,
                "precision": lr_prec,
                "recall": lr_rec,
                "f1_score": lr_f1,
                "confusion_matrix": lr_cm
            },
            "ensemble": {
                "name": "Ensemble (Majority Voting)",
                "method": "Hard Voting with Probability Tie-Breaking",
                "models_combined": ["decision_tree", "random_forest", "logistic_regression"],
                "accuracy": ens_acc,
                "precision": ens_prec,
                "recall": ens_rec,
                "f1_score": ens_f1,
                "confusion_matrix": ens_cm
            }
        },
        # Legacy flat structure for backward compatibility
        "accuracy": ens_acc,
        "precision": ens_prec,
        "recall": ens_rec,
        "f1_score": ens_f1,
        "confusion_matrix": ens_cm,
        "confusion_matrix_labels": CLASSES,
        "feature_importances": rf_importances,
        "classes": CLASSES,
        "features": FEATURE_COLUMNS,
        "total_samples": total_samples,
        "train_samples": len(X_train),
        "test_samples": len(X_test),
        "random_state": 42
    }

    with open(metrics_path, 'w', encoding='utf-8') as f:
        json.dump(metrics_payload, f, indent=2)

    print(f"[7] Model metrics saved to: {metrics_path}")
    print("\n[SUCCESS] Pipeline completed successfully!")

    return metrics_payload


if __name__ == '__main__':
    train_and_evaluate()
