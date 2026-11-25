import httpx
from datetime import date, timedelta

def seed():
    base_url = "http://127.0.0.1:8000/api"
    today = date.today()

    patients = [
        {"name": "Arthur Pendelton", "age": 52, "gender": "Male", "ward": "ICU", "department": "Cardiology", "doctor": "Dr. Sarah Jenkins", "admission_date": str(today - timedelta(days=4)), "status": "Admitted"},
        {"name": "Sophia Chen", "age": 34, "gender": "Female", "ward": "General Ward", "department": "Neurology", "doctor": "Dr. Elena Rostova", "admission_date": str(today - timedelta(days=6)), "status": "Admitted"},
        {"name": "Lucas Montgomery", "age": 9, "gender": "Male", "ward": "Pediatric Ward", "department": "Pediatrics", "doctor": "Dr. Emily Taylor", "admission_date": str(today - timedelta(days=2)), "status": "Admitted"},
        {"name": "Eleanor Vance", "age": 68, "gender": "Female", "ward": "Private Ward", "department": "Orthopedics", "doctor": "Dr. James Wilson", "admission_date": str(today - timedelta(days=12)), "status": "Discharged"},
        {"name": "Marcus Aurelius", "age": 45, "gender": "Male", "ward": "Emergency", "department": "Emergency Medicine", "doctor": "Dr. Alexander Wright", "admission_date": str(today - timedelta(days=1)), "status": "Admitted"},
        {"name": "Hannah Abbott", "age": 28, "gender": "Female", "ward": "General Ward", "department": "General Medicine", "doctor": "Dr. Michael Chang", "admission_date": str(today - timedelta(days=5)), "status": "Admitted"},
        {"name": "Oliver Twist", "age": 11, "gender": "Male", "ward": "Pediatric Ward", "department": "Pediatrics", "doctor": "Dr. David Kim", "admission_date": str(today - timedelta(days=8)), "status": "Discharged"},
        {"name": "Charlotte Bronte", "age": 61, "gender": "Female", "ward": "ICU", "department": "Cardiology", "doctor": "Dr. Robert Chen", "admission_date": str(today - timedelta(days=3)), "status": "Admitted"}
    ]

    # Check if patients already exist
    existing = httpx.get(f"{base_url}/patients?limit=1").json()
    if existing.get("total", 0) > 0:
        print(f"Database already contains {existing['total']} patients. Skipping seed.")
        return

    created_count = 0
    for p in patients:
        res = httpx.post(f"{base_url}/patients", json=p)
        if res.status_code == 201:
            data = res.json()
            created_count += 1
            print(f"Created: {data['patient_id']} - {data['name']}")
        else:
            print("Error creating patient:", res.status_code, res.text)

    print(f"Successfully seeded {created_count} patients via REST API.")
    stats = httpx.get(f"{base_url}/dashboard/stats").json()
    print("Dashboard Stats:", stats["total_patients"], "total,", stats["currently_admitted"], "admitted,", stats["discharged_patients"], "discharged.")

if __name__ == "__main__":
    seed()
