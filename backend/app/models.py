from datetime import datetime
from sqlalchemy import Column, Integer, String, Date, DateTime, func
from app.database import Base

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    patient_id = Column(String(30), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False, index=True)
    age = Column(Integer, nullable=False)
    gender = Column(String(20), nullable=False)
    ward = Column(String(50), nullable=False)
    department = Column(String(50), nullable=False)
    doctor = Column(String(100), nullable=False)
    admission_date = Column(Date, nullable=False)
    status = Column(String(20), nullable=False, default="Admitted")  # 'Admitted' or 'Discharged'
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    def __repr__(self):
        return f"<Patient(id={self.id}, patient_id='{self.patient_id}', name='{self.name}', status='{self.status}')>"
