from fastapi import APIRouter
from app.schemas import OptionsResponse
from app.validators import (
    VALID_GENDERS,
    VALID_WARDS,
    VALID_DEPARTMENTS,
    VALID_DOCTORS,
    DOCTORS_BY_DEPARTMENT,
)

router = APIRouter(prefix="/options", tags=["Options"])

@router.get("", response_model=OptionsResponse)
def get_options():
    """Return all valid system options for genders, wards, departments, and doctors."""
    return OptionsResponse(
        genders=VALID_GENDERS,
        wards=VALID_WARDS,
        departments=VALID_DEPARTMENTS,
        doctors=VALID_DOCTORS,
        doctors_by_department=DOCTORS_BY_DEPARTMENT,
    )
