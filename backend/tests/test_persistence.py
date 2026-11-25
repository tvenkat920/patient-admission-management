import os
import tempfile
from datetime import date
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base
from app.models import Patient
from app.schemas import PatientCreate
from app import crud

def test_sqlite_persistence_across_sessions():
    """Verify that records saved in SQLite persist after closing session and recreating engine."""
    with tempfile.NamedTemporaryFile(suffix=".db", delete=False) as tmp_db:
        db_path = tmp_db.name

    try:
        db_url = f"sqlite:///{db_path}"
        engine = create_engine(db_url, connect_args={"check_same_thread": False})
        Base.metadata.create_all(bind=engine)
        Session = sessionmaker(bind=engine)

        # Session 1: Create a patient
        db1 = Session()
        patient_in = PatientCreate(
            name="Persistent Patient",
            age=45,
            gender="Female",
            ward="ICU",
            department="Cardiology",
            doctor="Dr. Sarah Jenkins",
            admission_date=date.today(),
            status="Admitted"
        )
        created = crud.create_patient(db1, patient_in)
        saved_patient_id = created.patient_id
        db1.close()

        # Simulate complete server restart by disposing the engine and creating a brand new engine/session
        engine.dispose()
        new_engine = create_engine(db_url, connect_args={"check_same_thread": False})
        NewSession = sessionmaker(bind=new_engine)
        db2 = NewSession()

        # Session 2: Read the patient
        retrieved = crud.get_patient_by_id_or_code(db2, saved_patient_id)
        assert retrieved is not None
        assert retrieved.name == "Persistent Patient"
        assert retrieved.ward == "ICU"
        assert retrieved.status == "Admitted"

        db2.close()
        new_engine.dispose()
    finally:
        if os.path.exists(db_path):
            try:
                os.remove(db_path)
            except Exception:
                pass
