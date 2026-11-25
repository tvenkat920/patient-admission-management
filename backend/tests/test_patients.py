from datetime import date, timedelta
import pytest

def test_health_check(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "version" in data

def test_get_options(client):
    response = client.get("/api/options")
    assert response.status_code == 200
    data = response.json()
    assert "genders" in data
    assert "wards" in data
    assert "departments" in data
    assert "doctors" in data
    assert "doctors_by_department" in data
    assert "Male" in data["genders"]
    assert "Cardiology" in data["departments"]
    assert "Dr. Sarah Jenkins" in data["doctors"]

def test_create_patient(client, sample_patient_data):
    response = client.post("/api/patients", json=sample_patient_data)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "John Doe"
    assert data["age"] == 35
    assert data["patient_id"].startswith("PAT-")
    assert data["status"] == "Admitted"
    assert "created_at" in data

def test_get_patient_by_id_and_code(client, sample_patient_data):
    # Create patient
    create_res = client.post("/api/patients", json=sample_patient_data)
    created = create_res.json()
    internal_id = created["id"]
    code = created["patient_id"]

    # Query by internal integer ID
    res1 = client.get(f"/api/patients/{internal_id}")
    assert res1.status_code == 200
    assert res1.json()["name"] == "John Doe"

    # Query by patient_id code (e.g. PAT-1001)
    res2 = client.get(f"/api/patients/{code}")
    assert res2.status_code == 200
    assert res2.json()["name"] == "John Doe"

def test_get_patient_not_found(client):
    res = client.get("/api/patients/NON_EXISTENT_ID")
    assert res.status_code == 404
    assert "not found" in res.json()["detail"].lower()

def test_list_patients_pagination(client, sample_patient_data):
    # Insert 3 patients
    client.post("/api/patients", json=sample_patient_data)
    
    p2 = sample_patient_data.copy()
    p2["name"] = "Alice Smith"
    p2["doctor"] = "Dr. Robert Chen"
    client.post("/api/patients", json=p2)

    p3 = sample_patient_data.copy()
    p3["name"] = "Bob Jones"
    p3["doctor"] = "Dr. Robert Chen"
    client.post("/api/patients", json=p3)

    res = client.get("/api/patients?page=1&limit=2")
    assert res.status_code == 200
    data = res.json()
    assert data["total"] == 3
    assert len(data["items"]) == 2
    assert data["page"] == 1
    assert data["pages"] == 2

def test_search_patients_by_name_and_code(client, sample_patient_data):
    client.post("/api/patients", json=sample_patient_data)  # John Doe
    
    p2 = sample_patient_data.copy()
    p2["name"] = "Mary Johnson"
    p2["doctor"] = "Dr. Robert Chen"
    p2_res = client.post("/api/patients", json=p2).json()

    # Search lowercase partial
    res = client.get("/api/patients?search=john")
    assert res.status_code == 200
    names = [p["name"] for p in res.json()["items"]]
    assert "John Doe" in names
    assert "Mary Johnson" in names

    # Search by code
    res_code = client.get(f"/api/patients?search={p2_res['patient_id']}")
    assert res_code.status_code == 200
    assert res_code.json()["total"] == 1
    assert res_code.json()["items"][0]["name"] == "Mary Johnson"

def test_filter_patients(client, sample_patient_data):
    # Patient 1: Cardiology / ICU / Dr. Sarah Jenkins
    p1 = sample_patient_data.copy()
    p1["ward"] = "ICU"
    p1["department"] = "Cardiology"
    p1["doctor"] = "Dr. Sarah Jenkins"
    client.post("/api/patients", json=p1)

    # Patient 2: Neurology / General Ward / Dr. Elena Rostova
    p2 = sample_patient_data.copy()
    p2["name"] = "Elena Gilbert"
    p2["ward"] = "General Ward"
    p2["department"] = "Neurology"
    p2["doctor"] = "Dr. Elena Rostova"
    client.post("/api/patients", json=p2)

    # Filter by Ward
    res_ward = client.get("/api/patients?ward=ICU")
    assert res_ward.json()["total"] == 1
    assert res_ward.json()["items"][0]["ward"] == "ICU"

    # Filter by Department
    res_dept = client.get("/api/patients?department=Neurology")
    assert res_dept.json()["total"] == 1
    assert res_dept.json()["items"][0]["name"] == "Elena Gilbert"

    # Filter by Doctor
    res_doc = client.get("/api/patients?doctor=Dr.%20Sarah%20Jenkins")
    assert res_doc.json()["total"] == 1
    assert res_doc.json()["items"][0]["doctor"] == "Dr. Sarah Jenkins"

def test_update_patient(client, sample_patient_data):
    create_res = client.post("/api/patients", json=sample_patient_data)
    code = create_res.json()["patient_id"]

    # Update name, age, ward
    update_payload = {
        "name": "Jonathan Doe",
        "age": 36,
        "ward": "Private Ward"
    }
    update_res = client.put(f"/api/patients/{code}", json=update_payload)
    assert update_res.status_code == 200
    updated = update_res.json()
    assert updated["name"] == "Jonathan Doe"
    assert updated["age"] == 36
    assert updated["ward"] == "Private Ward"

def test_discharge_patient(client, sample_patient_data):
    create_res = client.post("/api/patients", json=sample_patient_data)
    code = create_res.json()["patient_id"]
    assert create_res.json()["status"] == "Admitted"

    # Discharge
    discharge_res = client.patch(f"/api/patients/{code}/discharge")
    assert discharge_res.status_code == 200
    assert discharge_res.json()["status"] == "Discharged"

    # Discharging again must fail with 400
    second_res = client.patch(f"/api/patients/{code}/discharge")
    assert second_res.status_code == 400
    assert "already discharged" in second_res.json()["detail"].lower()

def test_delete_patient(client, sample_patient_data):
    create_res = client.post("/api/patients", json=sample_patient_data)
    code = create_res.json()["patient_id"]

    # Delete
    del_res = client.delete(f"/api/patients/{code}")
    assert del_res.status_code == 200
    assert del_res.json()["success"] is True

    # Verify not found
    get_res = client.get(f"/api/patients/{code}")
    assert get_res.status_code == 404
