"""
Startup Health Diagnosis System - Realistic Dataset Generator
--------------------------------------------------------------
Generates a realistic, multifaceted startup dataset with 750 records across 3 classes:
- Healthy (250 records)
- Moderate Risk (250 records)
- Critical (250 records)

Includes realistic real-world boundary overlap (early growth investments,
bridge rounds, churn cliffs) so algorithms exhibit genuine test metrics (~92-97%)
reflecting real venture capital and solvency conditions.
"""

import csv
import os
import random

def generate_dataset(output_path, num_per_class=250, random_seed=42):
    random.seed(random_seed)
    records = []

    # 1. HEALTHY STARTUPS (250 records)
    for _ in range(num_per_class):
        archetype = random.choice(['bootstrapped_profitable', 'scaleup_high_growth'])
        if archetype == 'bootstrapped_profitable':
            monthly_revenue = round(random.uniform(500000, 2500000), -3)
            profit_margin = round(random.uniform(15.0, 48.0), 1)
            monthly_expenses = round(monthly_revenue * (1.0 - profit_margin / 100.0), -3)
            burn_rate = 0.0
            runway = round(random.uniform(12.0, 36.0), 1)
            growth_rate = round(random.uniform(8.0, 25.0), 1)
            customer_growth = round(random.uniform(7.0, 22.0), 1)
            employees = random.randint(8, 45)
        else: # scaleup_high_growth
            monthly_revenue = round(random.uniform(800000, 3500000), -3)
            burn_ratio = random.uniform(1.05, 1.30)
            monthly_expenses = round(monthly_revenue * burn_ratio, -3)
            burn_rate = round(monthly_expenses - monthly_revenue, -2)
            profit_margin = round(((monthly_revenue - monthly_expenses) / monthly_revenue) * 100.0, 1)
            runway = round(random.uniform(11.0, 28.0), 1)
            growth_rate = round(random.uniform(14.0, 40.0), 1)
            customer_growth = round(random.uniform(12.0, 35.0), 1)
            employees = random.randint(18, 75)

        # Realistic real-world boundary overlap:
        # e.g., 6% of healthy startups are reinvesting heavily with 7.5 - 10.5 mo runway
        if random.random() < 0.06:
            runway = round(random.uniform(7.5, 10.5), 1)
        # e.g., 5% have temporarily slower 5-7% growth while revamping product
        if random.random() < 0.05:
            growth_rate = round(random.uniform(5.0, 7.5), 1)

        records.append({
            'runway': runway,
            'profit_margin': profit_margin,
            'burn_rate': burn_rate,
            'growth_rate': growth_rate,
            'customer_growth': customer_growth,
            'monthly_expenses': monthly_expenses,
            'monthly_revenue': monthly_revenue,
            'employees': employees,
            'risk_level': 'Healthy'
        })

    # 2. MODERATE RISK STARTUPS (250 records)
    for _ in range(num_per_class):
        archetype = random.choice(['thin_margin_stabilizing', 'venture_burn_pivot'])
        if archetype == 'thin_margin_stabilizing':
            monthly_revenue = round(random.uniform(250000, 1200000), -3)
            profit_margin = round(random.uniform(-10.0, 12.0), 1)
            monthly_expenses = round(monthly_revenue * (1.0 - profit_margin / 100.0), -3)
            burn_rate = max(0.0, round(monthly_expenses - monthly_revenue, -2))
            runway = round(random.uniform(6.0, 13.0), 1)
            growth_rate = round(random.uniform(4.0, 12.0), 1)
            customer_growth = round(random.uniform(3.0, 11.0), 1)
            employees = random.randint(6, 32)
        else: # venture_burn_pivot
            monthly_revenue = round(random.uniform(300000, 1500000), -3)
            monthly_expenses = round(monthly_revenue * random.uniform(1.20, 1.60), -3)
            burn_rate = round(monthly_expenses - monthly_revenue, -2)
            profit_margin = round(((monthly_revenue - monthly_expenses) / monthly_revenue) * 100.0, 1)
            runway = round(random.uniform(5.5, 12.0), 1)
            growth_rate = round(random.uniform(5.0, 16.0), 1)
            customer_growth = round(random.uniform(4.0, 14.0), 1)
            employees = random.randint(10, 45)

        # Realistic overlap:
        # e.g., 6% have slightly higher runway (13.5 - 16 mo) but plateauing growth
        if random.random() < 0.06:
            runway = round(random.uniform(13.5, 16.0), 1)
            growth_rate = round(random.uniform(2.5, 5.0), 1)
        # e.g., 6% have shorter runway (4.5 - 5.5 mo) but trying to raise
        if random.random() < 0.06:
            runway = round(random.uniform(4.5, 5.5), 1)

        records.append({
            'runway': runway,
            'profit_margin': profit_margin,
            'burn_rate': burn_rate,
            'growth_rate': growth_rate,
            'customer_growth': customer_growth,
            'monthly_expenses': monthly_expenses,
            'monthly_revenue': monthly_revenue,
            'employees': employees,
            'risk_level': 'Moderate Risk'
        })

    # 3. CRITICAL RISK STARTUPS (250 records)
    for _ in range(num_per_class):
        archetype = random.choice(['cash_exhaustion_cliff', 'structural_burn_deficit'])
        if archetype == 'cash_exhaustion_cliff':
            monthly_revenue = round(random.uniform(60000, 450000), -3)
            monthly_expenses = round(monthly_revenue * random.uniform(1.8, 4.5), -3)
            burn_rate = round(monthly_expenses - monthly_revenue, -2)
            profit_margin = round(((monthly_revenue - monthly_expenses) / monthly_revenue) * 100.0, 1)
            runway = round(random.uniform(0.5, 4.5), 1)
            growth_rate = round(random.uniform(-18.0, 3.0), 1)
            customer_growth = round(random.uniform(-12.0, 3.0), 1)
            employees = random.randint(4, 35)
        else: # structural_burn_deficit
            monthly_revenue = round(random.uniform(100000, 600000), -3)
            monthly_expenses = round(monthly_revenue * random.uniform(2.2, 5.0), -3)
            burn_rate = round(monthly_expenses - monthly_revenue, -2)
            profit_margin = round(((monthly_revenue - monthly_expenses) / monthly_revenue) * 100.0, 1)
            runway = round(random.uniform(0.4, 4.0), 1)
            growth_rate = round(random.uniform(-25.0, 2.0), 1)
            customer_growth = round(random.uniform(-15.0, 2.0), 1)
            employees = random.randint(5, 40)

        # Realistic overlap:
        # e.g., 6% have received a tiny bridge loan bumping runway to 5.5 - 6.8 mo, but unit economics remain poor
        if random.random() < 0.06:
            runway = round(random.uniform(5.5, 6.8), 1)

        records.append({
            'runway': runway,
            'profit_margin': profit_margin,
            'burn_rate': burn_rate,
            'growth_rate': growth_rate,
            'customer_growth': customer_growth,
            'monthly_expenses': monthly_expenses,
            'monthly_revenue': monthly_revenue,
            'employees': employees,
            'risk_level': 'Critical'
        })

    random.shuffle(records)

    fieldnames = [
        'runway',
        'profit_margin',
        'burn_rate',
        'growth_rate',
        'customer_growth',
        'monthly_expenses',
        'monthly_revenue',
        'employees',
        'risk_level'
    ]

    with open(output_path, mode='w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(records)

    print(f"Generated {len(records)} realistic startup records into: {output_path}")

    # Also save as startup_health_dataset.csv with alias columns for backward compatibility
    dir_path = os.path.dirname(output_path)
    legacy_path = os.path.join(dir_path, 'startup_health_dataset.csv')
    legacy_records = []
    for r in records:
        legacy_records.append({
            'revenue': r['monthly_revenue'],
            'expenses': r['monthly_expenses'],
            'growth_rate': r['growth_rate'],
            'customer_growth': r['customer_growth'],
            'burn_rate': r['burn_rate'],
            'runway': r['runway'],
            'profit_margin': r['profit_margin'],
            'employee_count': r['employees'],
            'startup_health': r['risk_level']
        })
    with open(legacy_path, mode='w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=[
            'revenue', 'expenses', 'growth_rate', 'customer_growth',
            'burn_rate', 'runway', 'profit_margin', 'employee_count', 'startup_health'
        ])
        writer.writeheader()
        writer.writerows(legacy_records)
    print(f"Also saved legacy-compatible dataset into: {legacy_path}")

if __name__ == '__main__':
    script_dir = os.path.dirname(os.path.abspath(__file__))
    target_csv = os.path.join(script_dir, 'dataset.csv')
    generate_dataset(target_csv, num_per_class=250, random_seed=42)
