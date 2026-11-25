import re
from datetime import date, datetime, timedelta, timezone
from typing import Dict, List, Optional

# Predefined valid options as required by assignment specification
VALID_GENDERS: List[str] = ["Male", "Female", "Other"]

VALID_WARDS: List[str] = [
    "General Ward",
    "ICU",
    "Emergency",
    "Private Ward",
    "Pediatric Ward",
]

VALID_DEPARTMENTS: List[str] = [
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "General Medicine",
    "Emergency Medicine",
]

# Configurable list of doctors associated with departments
DOCTORS_BY_DEPARTMENT: Dict[str, List[str]] = {
    "Cardiology": [
        "Dr. Sarah Jenkins",
        "Dr. Robert Chen",
    ],
    "Neurology": [
        "Dr. Elena Rostova",
        "Dr. Marcus Brody",
    ],
    "Orthopedics": [
        "Dr. James Wilson",
        "Dr. Priya Patel",
    ],
    "Pediatrics": [
        "Dr. Emily Taylor",
        "Dr. David Kim",
    ],
    "General Medicine": [
        "Dr. Michael Chang",
        "Dr. Rachel Green",
    ],
    "Emergency Medicine": [
        "Dr. Alexander Wright",
        "Dr. Lisa Cuddy",
    ],
}

# Flat list of all valid doctors
VALID_DOCTORS: List[str] = [
    doc for docs in DOCTORS_BY_DEPARTMENT.values() for doc in docs
]

VALID_STATUSES: List[str] = ["Admitted", "Discharged"]

NAME_REGEX = re.compile(r"^[A-Za-z\s]+$")


def validate_patient_name(name: str) -> str:
    """Validate that name is non-empty, contains only letters and spaces, and trims excess whitespace."""
    if not name or not name.strip():
        raise ValueError("Patient name is required.")
    
    cleaned = " ".join(name.strip().split())
    
    if len(cleaned) < 2:
        raise ValueError("Patient name must be at least 2 characters long.")
    if len(cleaned) > 100:
        raise ValueError("Patient name cannot exceed 100 characters.")
        
    if not NAME_REGEX.match(cleaned):
        raise ValueError("Patient name can contain only letters and spaces.")
        
    return cleaned


def validate_patient_age(age: int) -> int:
    """Validate age between 0 and 120."""
    if age is None:
        raise ValueError("Age is required.")
    if not isinstance(age, int):
        raise ValueError("Age must be a valid integer.")
    if age < 0 or age > 120:
        raise ValueError("Age must be between 0 and 120.")
    return age


def validate_gender(gender: str) -> str:
    """Validate gender against allowed options."""
    if not gender:
        raise ValueError("Please select a valid gender.")
    gender_trimmed = gender.strip()
    if gender_trimmed not in VALID_GENDERS:
        raise ValueError(f"Please select a valid gender. Allowed: {', '.join(VALID_GENDERS)}")
    return gender_trimmed


def validate_ward(ward: str) -> str:
    """Validate ward against allowed options."""
    if not ward:
        raise ValueError("Please select a valid ward.")
    ward_trimmed = ward.strip()
    if ward_trimmed not in VALID_WARDS:
        raise ValueError(f"Please select a valid ward. Allowed: {', '.join(VALID_WARDS)}")
    return ward_trimmed


def validate_department(department: str) -> str:
    """Validate department against allowed options."""
    if not department:
        raise ValueError("Please select a valid department.")
    dept_trimmed = department.strip()
    if dept_trimmed not in VALID_DEPARTMENTS:
        raise ValueError(f"Please select a valid department. Allowed: {', '.join(VALID_DEPARTMENTS)}")
    return dept_trimmed


def validate_doctor(doctor: str, department: Optional[str] = None) -> str:
    """Validate doctor against allowed doctor list and department mapping if provided."""
    if not doctor:
        raise ValueError("Please select a valid doctor.")
    doctor_trimmed = doctor.strip()
    if doctor_trimmed not in VALID_DOCTORS:
        raise ValueError(f"Invalid doctor selection. Please choose from the recognized medical staff.")
    
    if department and department in DOCTORS_BY_DEPARTMENT:
        dept_docs = DOCTORS_BY_DEPARTMENT[department]
        if doctor_trimmed not in dept_docs:
            raise ValueError(
                f"Selected doctor '{doctor_trimmed}' is not associated with department '{department}'."
            )
            
    return doctor_trimmed


def validate_admission_date(adm_date: date) -> date:
    """Validate admission date is not in the future (aligned to IST / local date)."""
    if not adm_date:
        raise ValueError("Admission date is required.")
    ist_today = datetime.now(timezone(timedelta(hours=5, minutes=30))).date()
    today = max(date.today(), ist_today)
    if adm_date > today:
        raise ValueError("Admission date cannot be in the future.")
    return adm_date


def validate_status(status: str) -> str:
    """Validate status is Admitted or Discharged."""
    if not status:
        return "Admitted"
    status_trimmed = status.strip().capitalize()
    if status_trimmed not in VALID_STATUSES:
        raise ValueError(f"Status must be either 'Admitted' or 'Discharged'.")
    return status_trimmed
