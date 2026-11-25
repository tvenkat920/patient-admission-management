import os
from datetime import date, timedelta
import httpx
import pytest

BASE_URL = "http://127.0.0.1:8000/api"

def test_e2e_health_and_options():
    # 1. Health Check
    res = httpx.get(f"{BASE_URL}/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"

    # 2. Options
    res_opts = httpx.get(f"{BASE_URL}/options")
    assert res_opts.status_code == 200
    opts = res_opts.json()
    assert len(opts["genders"]) == 3
    assert len(opts["wards"]) == 5
    assert len(opts["departments"]) == 6
    assert "Dr. Sarah Jenkins" in opts["doctors"]


def test_e2e_crud_lifecycle_and_validation():
    today = date.today()

    # 1. Validation Rejection Tests
    # Invalid Name (contains numbers)
    bad_name = {
        "name": "Jane Doe 123",
        "age": 30,
        "gender": "Female",
        "ward": "ICU",
        "department": "Cardiology",
        "doctor": "Dr. Sarah Jenkins",
        "admission_date": str(today),
    }
    res_bad_name = httpx.post(f"{BASE_URL}/patients", json=bad_name)
    assert res_bad_name.status_code == 422
    assert "letters and spaces" in res_bad_name.json()["detail"].lower()

    # Invalid Age (negative)
    bad_age = bad_name.copy()
    bad_age["name"] = "Jane Doe"
    bad_age["age"] = -10
    res_bad_age = httpx.post(f"{BASE_URL}/patients", json=bad_age)
    assert res_bad_age.status_code == 422
    assert "0 and 120" in res_bad_age.json()["detail"]

    # Future Admission Date
    bad_date = bad_name.copy()
    bad_date["name"] = "Jane Doe"
    bad_date["admission_date"] = str(today + timedelta(days=5))
    res_bad_date = httpx.post(f"{BASE_URL}/patients", json=bad_date)
    assert res_bad_date.status_code == 422
    assert "future" in res_bad_date.json()["detail"].lower()

    # Doctor / Department mismatch
    bad_doc = bad_name.copy()
    bad_doc["name"] = "Jane Doe"
    bad_doc["department"] = "Cardiology"
    bad_doc["doctor"] = "Dr. Elena Rostova"  # Elena is in Neurology
    res_bad_doc = httpx.post(f"{BASE_URL}/patients", json=bad_doc)
    assert res_bad_doc.status_code == 422
    assert "not associated" in res_bad_doc.json()["detail"].lower()

    # 2. Create Valid Patient
    valid_patient = {
        "name": "Zachary Taylor",
        "age": 42,
        "gender": "Male",
        "ward": "ICU",
        "department": "Cardiology",
        "doctor": "Dr. Sarah Jenkins",
        "admission_date": str(today - timedelta(days=1)),
        "status": "Admitted"
    }
    create_res = httpx.post(f"{BASE_URL}/patients", json=valid_patient)
    assert create_res.status_code == 201
    created_patient = create_res.json()
    patient_id = created_patient["patient_id"]
    assert patient_id.startswith("PAT-")
    assert created_patient["status"] == "Admitted"

    # 3. Dynamic Search by Name
    search_res = httpx.get(f"{BASE_URL}/patients?search=zachary")
    assert search_res.status_code == 200
    found_names = [p["name"] for p in search_res.json()["items"]]
    assert "Zachary Taylor" in found_names

    # 4. Search by Patient ID
    code_res = httpx.get(f"{BASE_URL}/patients?search={patient_id}")
    assert code_res.status_code == 200
    assert code_res.json()["total"] >= 1
    assert code_res.json()["items"][0]["patient_id"] == patient_id

    # 5. Filter by Ward
    ward_res = httpx.get(f"{BASE_URL}/patients?ward=ICU")
    assert ward_res.status_code == 200
    assert all(p["ward"] == "ICU" for p in ward_res.json()["items"])

    # 6. Filter by Department
    dept_res = httpx.get(f"{BASE_URL}/patients?department=Cardiology")
    assert dept_res.status_code == 200
    assert all(p["department"] == "Cardiology" for p in dept_res.json()["items"])

    # 7. Filter by Doctor
    doc_res = httpx.get(f"{BASE_URL}/patients?doctor=Dr.%20Sarah%20Jenkins")
    assert doc_res.status_code == 200
    assert all(p["doctor"] == "Dr. Sarah Jenkins" for p in doc_res.json()["items"])

    # 8. Update Patient
    update_payload = {
        "name": "Zachary Taylor",
        "age": 43,
        "ward": "Private Ward"
    }
    update_res = httpx.put(f"{BASE_URL}/patients/{patient_id}", json=update_payload)
    assert update_res.status_code == 200
    updated = update_res.json()
    assert updated["age"] == 43
    assert updated["ward"] == "Private Ward"

    # 9. Discharge Patient
    discharge_res = httpx.patch(f"{BASE_URL}/patients/{patient_id}/discharge")
    assert discharge_res.status_code == 200
    assert discharge_res.json()["status"] == "Discharged"

    # Second discharge must fail with 400
    double_discharge = httpx.patch(f"{BASE_URL}/patients/{patient_id}/discharge")
    assert double_discharge.status_code == 400
    assert "already discharged" in double_discharge.json()["detail"].lower()

    # 10. Delete Patient
    del_res = httpx.delete(f"{BASE_URL}/patients/{patient_id}")
    assert del_res.status_code == 200
    assert del_res.json()["success"] is True

    # Subsequent GET returns 404
    get_del = httpx.get(f"{BASE_URL}/patients/{patient_id}")
    assert get_del.status_code == 404


def test_e2e_dashboard_stats():
    res = httpx.get(f"{BASE_URL}/dashboard/stats")
    assert res.status_code == 200
    stats = res.json()
    assert "total_patients" in stats
    assert "currently_admitted" in stats
    assert "discharged_patients" in stats
    assert stats["total_patients"] == stats["currently_admitted"] + stats["discharged_patients"]
    assert len(stats["recent_patients"]) <= 5
    assert len(stats["ward_breakdown"]) == 5
    assert len(stats["department_breakdown"]) == 6


def test_frontend_dist_bundle():
    dist_html = "frontend/dist/index.html"
    assert os.path.exists(dist_html), "Frontend production build missing!"
    with open(dist_html, "r", encoding="utf-8") as f:
        html = f.read()
    assert "MediCare" in html or "root" in html
    assert "script" in html
