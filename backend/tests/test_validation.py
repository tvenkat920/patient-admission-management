from datetime import date, timedelta
import pytest

def test_reject_missing_name(client, sample_patient_data):
    data = sample_patient_data.copy()
    data["name"] = ""
    res = client.post("/api/patients", json=data)
    assert res.status_code == 422
    assert "name" in res.json()["detail"].lower()

def test_reject_numbers_in_name(client, sample_patient_data):
    data = sample_patient_data.copy()
    data["name"] = "John Doe 123"
    res = client.post("/api/patients", json=data)
    assert res.status_code == 422
    assert "letters and spaces" in res.json()["detail"].lower()

def test_reject_special_characters_in_name(client, sample_patient_data):
    data = sample_patient_data.copy()
    data["name"] = "John@Doe!"
    res = client.post("/api/patients", json=data)
    assert res.status_code == 422
    assert "letters and spaces" in res.json()["detail"].lower()

def test_accept_and_trim_valid_name(client, sample_patient_data):
    data = sample_patient_data.copy()
    data["name"] = "   Alexander   Hamilton   "
    res = client.post("/api/patients", json=data)
    assert res.status_code == 201
    assert res.json()["name"] == "Alexander Hamilton"

def test_reject_negative_age(client, sample_patient_data):
    data = sample_patient_data.copy()
    data["age"] = -5
    res = client.post("/api/patients", json=data)
    assert res.status_code == 422
    assert "0 and 120" in res.json()["detail"]

def test_reject_age_over_120(client, sample_patient_data):
    data = sample_patient_data.copy()
    data["age"] = 125
    res = client.post("/api/patients", json=data)
    assert res.status_code == 422
    assert "0 and 120" in res.json()["detail"]

def test_reject_future_admission_date(client, sample_patient_data):
    data = sample_patient_data.copy()
    future_date = date.today() + timedelta(days=2)
    data["admission_date"] = str(future_date)
    res = client.post("/api/patients", json=data)
    assert res.status_code == 422
    assert "future" in res.json()["detail"].lower()

def test_reject_invalid_gender(client, sample_patient_data):
    data = sample_patient_data.copy()
    data["gender"] = "Alien"
    res = client.post("/api/patients", json=data)
    assert res.status_code == 422
    assert "valid gender" in res.json()["detail"].lower()

def test_reject_invalid_ward(client, sample_patient_data):
    data = sample_patient_data.copy()
    data["ward"] = "VIP Lounge"
    res = client.post("/api/patients", json=data)
    assert res.status_code == 422
    assert "valid ward" in res.json()["detail"].lower()

def test_reject_invalid_department(client, sample_patient_data):
    data = sample_patient_data.copy()
    data["department"] = "Astronomy"
    res = client.post("/api/patients", json=data)
    assert res.status_code == 422
    assert "valid department" in res.json()["detail"].lower()

def test_reject_invalid_doctor(client, sample_patient_data):
    data = sample_patient_data.copy()
    data["doctor"] = "Dr. Strange"
    res = client.post("/api/patients", json=data)
    assert res.status_code == 422
    assert "doctor" in res.json()["detail"].lower()

def test_reject_doctor_department_mismatch(client, sample_patient_data):
    data = sample_patient_data.copy()
    # Dr. Elena Rostova is in Neurology, but department is Cardiology
    data["department"] = "Cardiology"
    data["doctor"] = "Dr. Elena Rostova"
    res = client.post("/api/patients", json=data)
    assert res.status_code == 422
    assert "not associated with department" in res.json()["detail"].lower()
