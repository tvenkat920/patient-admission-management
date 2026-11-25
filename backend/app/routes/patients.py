import math
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import (
    PatientCreate,
    PatientUpdate,
    PatientResponse,
    PatientListResponse
)
from app import crud

router = APIRouter(prefix="/patients", tags=["Patients"])

@router.get("", response_model=PatientListResponse)
def list_patients(
    search: Optional[str] = Query(None, description="Search by patient name or ID"),
    ward: Optional[str] = Query(None, description="Filter by ward"),
    department: Optional[str] = Query(None, description="Filter by department"),
    doctor: Optional[str] = Query(None, description="Filter by doctor"),
    status: Optional[str] = Query(None, description="Filter by status (Admitted/Discharged)"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db)
):
    """Retrieve patients with search, filters, and pagination."""
    skip = (page - 1) * limit
    patients, total = crud.get_patients(
        db=db,
        search=search,
        ward=ward,
        department=department,
        doctor=doctor,
        status=status,
        skip=skip,
        limit=limit
    )
    pages = math.ceil(total / limit) if total > 0 else 1
    return PatientListResponse(
        items=patients,
        total=total,
        page=page,
        limit=limit,
        pages=pages
    )


@router.post("", response_model=PatientResponse, status_code=status.HTTP_201_CREATED)
def create_patient(
    patient_in: PatientCreate,
    db: Session = Depends(get_db)
):
    """Register a new patient with validation."""
    return crud.create_patient(db=db, patient_in=patient_in)


@router.get("/{patient_id}", response_model=PatientResponse)
def get_patient(
    patient_id: str,
    db: Session = Depends(get_db)
):
    """Retrieve a single patient by ID or code (e.g. PAT-1001)."""
    patient = crud.get_patient_by_id_or_code(db=db, identifier=patient_id)
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Patient with ID '{patient_id}' not found."
        )
    return patient


@router.put("/{patient_id}", response_model=PatientResponse)
def update_patient(
    patient_id: str,
    patient_in: PatientUpdate,
    db: Session = Depends(get_db)
):
    """Update patient details."""
    db_patient = crud.get_patient_by_id_or_code(db=db, identifier=patient_id)
    if not db_patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Patient with ID '{patient_id}' not found."
        )
    try:
        updated = crud.update_patient(db=db, db_patient=db_patient, update_data=patient_in)
        return updated
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))


@router.patch("/{patient_id}/discharge", response_model=PatientResponse)
def discharge_patient(
    patient_id: str,
    db: Session = Depends(get_db)
):
    """Mark an admitted patient as Discharged. Rejects if already discharged."""
    db_patient = crud.get_patient_by_id_or_code(db=db, identifier=patient_id)
    if not db_patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Patient with ID '{patient_id}' not found."
        )
    if db_patient.status == "Discharged":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Patient '{db_patient.name}' ({db_patient.patient_id}) is already discharged."
        )
    return crud.discharge_patient(db=db, db_patient=db_patient)


@router.delete("/{patient_id}", status_code=status.HTTP_200_OK)
def delete_patient(
    patient_id: str,
    db: Session = Depends(get_db)
):
    """Delete a patient record."""
    db_patient = crud.get_patient_by_id_or_code(db=db, identifier=patient_id)
    if not db_patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Patient with ID '{patient_id}' not found."
        )
    patient_name = db_patient.name
    code = db_patient.patient_id
    crud.delete_patient(db=db, db_patient=db_patient)
    return {
        "success": True,
        "message": f"Patient {patient_name} ({code}) successfully deleted."
    }
