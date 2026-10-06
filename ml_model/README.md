# Startup Health Diagnosis System — Machine Learning Pipeline

This module implements a supervised machine learning classification pipeline to predict startup risk:
- **Healthy**
- **Moderate Risk**
- **Critical**

---

## 1. Machine Learning Algorithms Implemented

### 1. Decision Tree Classifier
- **Algorithm:** `scikit-learn` `DecisionTreeClassifier`
- **Hyperparameters:** `criterion='gini'`, `max_depth=5`, `random_state=42`
- **Role:** Non-linear decision rules splitting on threshold cutoffs. Highly explainable for venture capital and solvency evaluation.

### 2. Random Forest Classifier (Primary Model)
- **Algorithm:** `scikit-learn` `RandomForestClassifier`
- **Hyperparameters:** `n_estimators=100`, `max_depth=8`, `criterion='gini'`, `random_state=42`
- **Role:** An ensemble of 100 decorrelated decision trees using bootstrap aggregation (bagging). Offers the highest stability, generalization, and feature importance rankings.

### 3. Logistic Regression
- **Algorithm:** `scikit-learn` `LogisticRegression`
- **Hyperparameters:** `max_iter=1000`, `random_state=42`
- **Preprocessing:** `StandardScaler` (fitted strictly on training split to eliminate data leakage)
- **Role:** Computes smooth posterior class probabilities via softmax multinomial classification.

### 4. Ensemble Majority Voting
- **Method:** Hard Majority Voting with Soft Probability Average Tie-Breaking
- **Role:** Combines the predictions of all three models. When 2 or 3 models agree, their consensus defines the output. If a 3-way tie occurs, the class with the highest average probability across all 3 models is chosen.

---

## 2. Directory Structure

```text
ml_model/
├── app.py                     # Flask REST API service (Port 5001)
├── train.py                   # Multi-model training and evaluation pipeline
├── generate_dataset.py        # Realistic synthetic dataset generator
├── dataset.csv                # 750 startup records across 8 quantitative features
├── startup_health_dataset.csv # Legacy compatible dataset format
├── requirements.txt           # Python dependencies
├── model_metrics.json         # Real measured test set metrics
├── models/
│   ├── decision_tree.pkl      # Serialized Decision Tree model
│   ├── random_forest.pkl      # Serialized Random Forest model
│   ├── logistic_regression.pkl# Serialized Logistic Regression model
│   └── scaler.pkl             # Serialized StandardScaler
└── README.md
```

---

## 3. Features & Target

The models train on 8 quantitative features:
1. `runway`: Estimated operational survival cushion in months
2. `profit_margin`: Net operating profit margin percentage
3. `burn_rate`: Net monthly capital outflow
4. `growth_rate`: Month-over-month revenue growth percentage
5. `customer_growth`: Month-over-month user acquisition velocity percentage
6. `monthly_expenses`: Monthly operating overhead
7. `monthly_revenue`: Monthly recurring revenue
8. `employees`: Full-time equivalent headcount

**Target:** `risk_level` (`Healthy`, `Moderate Risk`, `Critical`)

---

## 4. Model Performance (Measured on Unseen 20% Test Split)

| Algorithm | Test Accuracy | Macro Precision | Macro Recall | Macro F1-Score |
| :--- | :--- | :--- | :--- | :--- |
| **Decision Tree** | 100.00% | 100.00% | 100.00% | 100.00% |
| **Random Forest (Primary)** | 100.00% | 100.00% | 100.00% | 100.00% |
| **Logistic Regression** | 99.33% | 99.35% | 99.33% | 99.33% |
| **Ensemble (Majority Vote)**| 100.00% | 100.00% | 100.00% | 100.00% |

### Top Feature Importances (Random Forest)
1. `profit_margin`: 23.93%
2. `customer_growth`: 22.87%
3. `runway`: 20.10%
4. `growth_rate`: 16.67%
5. `monthly_revenue`: 10.03%

---

## 5. How to Run

### 1. Train the Models:
```bash
python train.py
```

### 2. Start the Flask ML API:
```bash
python app.py
```
API runs on `http://localhost:5001`.

### 3. API Endpoints:
- `POST /predict`: Submit startup metrics, returns all 3 model predictions + Ensemble
- `GET /metrics`: Returns actual test evaluation metrics
- `GET /health`: Health and model loading status
