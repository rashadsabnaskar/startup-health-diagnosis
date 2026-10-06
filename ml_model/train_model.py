"""
Startup Health Diagnosis System - Multi-Model ML Training Pipeline
Alias for train.py
"""
import os
import sys

# Add parent directory if needed and execute train.py
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from train import train_and_evaluate

if __name__ == '__main__':
    train_and_evaluate()
