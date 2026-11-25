from typing import Optional, Tuple, List, Dict
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from app.models import Patient
from app.schemas import PatientCreate, PatientUpdate
from app.validators import VALID_DEPARTMENTS, VALID_WARDS, validate_doctor

def generate_next_patient_id(db: Session) -> str:
    """Generate the next unique Patient ID format: PAT-1001, PAT-1002, etc."""
    last_patient = db.query(Patient).order_by(Patient.id.desc()).first()
    next_num = (last_patient.id + 1) if last_patient else 1
    candidate_id = f"PAT-{1000 + next_num}"
    
    # Ensure uniqueness in case of manual deletions
    while db.query(Patient).filter(Patient.patient_id == candidate_id).first():
        next_num += 1
        candidate_id = f"PAT-{1000 + next_num}"
        
    return candidate_id


def get_patient_by_id_or_code(db: Session, identifier: str) -> Optional[Patient]:
    """Retrieve patient by either internal integer ID or string patient_id (e.g. PAT-1001)."""
    # Try by patient_id first (e.g., "PAT-1001")
    patient = db.query(Patient).filter(func.lower(Patient.patient_id) == identifier.strip().lower()).first()
    if patient:
        return patient
        
    # Try as numeric ID if identifier is all digits
    if identifier.strip().isdigit():
        return db.query(Patient).filter(Patient.id == int(identifier.strip())).first()
        
    return None


def get_patients(
    db: Session,
    search: Optional[str] = None,
    ward: Optional[str] = None,
    department: Optional[str] = None,
    doctor: Optional[str] = None,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 10
) -> Tuple[List[Patient], int]:
    """Retrieve patients with filtering, dynamic search, and pagination."""
    query = db.query(Patient)

    # Search filter (case-insensitive on name or patient_id)
    if search and search.strip():
        search_term = f"%{search.strip().lower()}%"
        query = query.filter(
            or_(
                func.lower(Patient.name).like(search_term),
                func.lower(Patient.patient_id).like(search_term)
            )
        )

    # Ward filter
    if ward and ward.strip() and ward.strip() != "All":
        query = query.filter(Patient.ward == ward.strip())

    # Department filter
    if department and department.strip() and department.strip() != "All":
        query = query.filter(Patient.department == department.strip())

    # Doctor filter
    if doctor and doctor.strip() and doctor.strip() != "All":
        query = query.filter(Patient.doctor == doctor.strip())

    # Status filter
    if status and status.strip() and status.strip() != "All":
        status_cap = status.strip().capitalize()
        query = query.filter(Patient.status == status_cap)

    total_count = query.count()

    # Sort by admission date descending, then ID descending
    patients = (
        query.order_by(Patient.admission_date.desc(), Patient.id.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    return patients, total_count


def create_patient(db: Session, patient_in: PatientCreate) -> Patient:
    """Create a new patient record in SQLite."""
    new_patient_id = generate_next_patient_id(db)
    
    db_patient = Patient(
        patient_id=new_patient_id,
        name=patient_in.name,
        age=patient_in.age,
        gender=patient_in.gender,
        ward=patient_in.ward,
        department=patient_in.department,
        doctor=patient_in.doctor,
        admission_date=patient_in.admission_date,
        status=patient_in.status or "Admitted"
    )
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient


def update_patient(db: Session, db_patient: Patient, update_data: PatientUpdate) -> Patient:
    """Update patient information."""
    update_dict = update_data.model_dump(exclude_unset=True)

    # If department or doctor is being updated, cross validate
    target_dept = update_dict.get("department", db_patient.department)
    target_doc = update_dict.get("doctor", db_patient.doctor)
    validate_doctor(target_doc, target_dept)

    for field, value in update_dict.items():
        setattr(db_patient, field, value)

    db.commit()
    db.refresh(db_patient)
    return db_patient


def discharge_patient(db: Session, db_patient: Patient) -> Patient:
    """Mark an admitted patient as Discharged."""
    db_patient.status = "Discharged"
    db.commit()
    db.refresh(db_patient)
    return db_patient


def delete_patient(db: Session, db_patient: Patient) -> None:
    """Delete a patient record."""
    db.delete(db_patient)
    db.commit()


def get_dashboard_stats(db: Session) -> Dict:
    """Calculate dynamic dashboard statistics."""
    total_patients = db.query(func.count(Patient.id)).scalar() or 0
    currently_admitted = db.query(func.count(Patient.id)).filter(Patient.status == "Admitted").scalar() or 0
    discharged_patients = db.query(func.count(Patient.id)).filter(Patient.status == "Discharged").scalar() or 0
    
    # Ward breakdown
    ward_counts = (
        db.query(Patient.ward, func.count(Patient.id))
        .group_by(Patient.ward)
        .all()
    )
    ward_dict = {w: 0 for w in VALID_WARDS}
    for ward, count in ward_counts:
        ward_dict[ward] = count

    # Department breakdown
    dept_counts = (
        db.query(Patient.department, func.count(Patient.id))
        .group_by(Patient.department)
        .all()
    )
    dept_dict = {d: 0 for d in VALID_DEPARTMENTS}
    for dept, count in dept_counts:
        dept_dict[dept] = count

    # Total departments available in system
    total_departments = len(VALID_DEPARTMENTS)

    # 5 most recent patients
    recent_patients = (
        db.query(Patient)
        .order_by(Patient.admission_date.desc(), Patient.id.desc())
        .limit(5)
        .all()
    )

    return {
        "total_patients": total_patients,
        "currently_admitted": currently_admitted,
        "discharged_patients": discharged_patients,
        "total_departments": total_departments,
        "ward_breakdown": ward_dict,
        "department_breakdown": dept_dict,
        "recent_patients": recent_patients
    }
