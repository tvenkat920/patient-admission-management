import pytest

def test_dashboard_stats(client, sample_patient_data):
    # Initial empty stats
    res0 = client.get("/api/dashboard/stats")
    assert res0.status_code == 200
    stats0 = res0.json()
    assert stats0["total_patients"] == 0
    assert stats0["currently_admitted"] == 0
    assert stats0["discharged_patients"] == 0
    assert stats0["total_departments"] == 6

    # Create patient 1 (Admitted, Cardiology, General Ward)
    p1 = client.post("/api/patients", json=sample_patient_data).json()

    # Create patient 2 (Discharged, Neurology, ICU)
    p2_data = sample_patient_data.copy()
    p2_data["name"] = "Alice Wonderland"
    p2_data["department"] = "Neurology"
    p2_data["doctor"] = "Dr. Elena Rostova"
    p2_data["ward"] = "ICU"
    p2_data["status"] = "Discharged"
    p2 = client.post("/api/patients", json=p2_data).json()

    # Query dashboard stats
    res = client.get("/api/dashboard/stats")
    assert res.status_code == 200
    stats = res.json()
    assert stats["total_patients"] == 2
    assert stats["currently_admitted"] == 1
    assert stats["discharged_patients"] == 1
    assert stats["ward_breakdown"]["General Ward"] == 1
    assert stats["ward_breakdown"]["ICU"] == 1
    assert stats["department_breakdown"]["Cardiology"] == 1
    assert stats["department_breakdown"]["Neurology"] == 1
    assert len(stats["recent_patients"]) == 2
