"""
Vercel Serverless Function Entry Point
--------------------------------------
Exposes the Flask WSGI application instance 'app' for Vercel's Python runtime.
Allows the Startup Health Diagnosis ML REST API to run serverlessly on Vercel.
"""

import os
import sys
from pathlib import Path

# Configure search paths for Vercel container environment
CURRENT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = CURRENT_DIR.parent
ML_MODEL_DIR = PROJECT_ROOT / "ml_model"

for p in [str(PROJECT_ROOT), str(ML_MODEL_DIR)]:
    if p not in sys.path:
        sys.path.insert(0, p)

# Import the configured Flask app
from ml_model.app import app

# Vercel WSGI entry point
# When deployed, requests to /api/* or /predict are handled by this application instance
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=False)
