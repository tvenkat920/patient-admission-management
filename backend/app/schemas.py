from datetime import date, datetime
from typing import List, Optional, Dict
from pydantic import BaseModel, Field, field_validator, model_validator
from app.validators import (
    validate_patient_name,
    validate_patient_age,
    validate_gender,
    validate_ward,
    validate_department,
    validate_doctor,
    validate_admission_date,
    validate_status,
    VALID_GENDERS,
    VALID_WARDS,
    VALID_DEPARTMENTS,
    DOCTORS_BY_DEPARTMENT
)

# Base patient schema
class PatientBase(BaseModel):
    name: str = Field(..., description="Full name of the patient (letters and spaces only)")
    age: int = Field(..., description="Age in years (0-120)")
    gender: str = Field(..., description="Gender (Male, Female, Other)")
    ward: str = Field(..., description="Assigned ward")
    department: str = Field(..., description="Hospital department")
    doctor: str = Field(..., description="Attending physician")
    admission_date: date = Field(..., description="Date of admission (cannot be in future)")

    @field_validator("name")
    @classmethod
    def validate_name_field(cls, v: str) -> str:
        return validate_patient_name(v)

    @field_validator("age")
    @classmethod
    def validate_age_field(cls, v: int) -> int:
        return validate_patient_age(v)

    @field_validator("gender")
    @classmethod
    def validate_gender_field(cls, v: str) -> str:
        return validate_gender(v)

    @field_validator("ward")
    @classmethod
    def validate_ward_field(cls, v: str) -> str:
        return validate_ward(v)

    @field_validator("department")
    @classmethod
    def validate_dept_field(cls, v: str) -> str:
        return validate_department(v)

    @field_validator("admission_date")
    @classmethod
    def validate_admission_date_field(cls, v: date) -> date:
        return validate_admission_date(v)

    @model_validator(mode="after")
    def validate_doctor_and_department(self) -> "PatientBase":
        # Validate that doctor is valid and belongs to the department
        validate_doctor(self.doctor, self.department)
        return self


class PatientCreate(PatientBase):
    status: Optional[str] = Field("Admitted", description="Admission status (defaults to Admitted)")

    @field_validator("status")
    @classmethod
    def validate_status_field(cls, v: Optional[str]) -> str:
        return validate_status(v or "Admitted")


class PatientUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    ward: Optional[str] = None
    department: Optional[str] = None
    doctor: Optional[str] = None
    admission_date: Optional[date] = None
    status: Optional[str] = None

    @field_validator("name")
    @classmethod
    def validate_name_field(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            return validate_patient_name(v)
        return v

    @field_validator("age")
    @classmethod
    def validate_age_field(cls, v: Optional[int]) -> Optional[int]:
        if v is not None:
            return validate_patient_age(v)
        return v

    @field_validator("gender")
    @classmethod
    def validate_gender_field(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            return validate_gender(v)
        return v

    @field_validator("ward")
    @classmethod
    def validate_ward_field(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            return validate_ward(v)
        return v

    @field_validator("department")
    @classmethod
    def validate_dept_field(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            return validate_department(v)
        return v

    @field_validator("admission_date")
    @classmethod
    def validate_admission_date_field(cls, v: Optional[date]) -> Optional[date]:
        if v is not None:
            return validate_admission_date(v)
        return v

    @field_validator("status")
    @classmethod
    def validate_status_field(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            return validate_status(v)
        return v

    @model_validator(mode="after")
    def validate_doctor_update(self) -> "PatientUpdate":
        if self.doctor is not None:
            # If both doctor and department are provided, cross-validate
            validate_doctor(self.doctor, self.department)
        return self


class PatientResponse(PatientBase):
    id: int
    patient_id: str
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class PatientListResponse(BaseModel):
    items: List[PatientResponse]
    total: int
    page: int
    limit: int
    pages: int


class DashboardStats(BaseModel):
    total_patients: int
    currently_admitted: int
    discharged_patients: int
    total_departments: int
    ward_breakdown: Dict[str, int]
    department_breakdown: Dict[str, int]
    recent_patients: List[PatientResponse]


class OptionsResponse(BaseModel):
    genders: List[str]
    wards: List[str]
    departments: List[str]
    doctors: List[str]
    doctors_by_department: Dict[str, List[str]]
