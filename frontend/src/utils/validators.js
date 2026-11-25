/**
 * Frontend Validation Rules matching the Backend Pydantic specification
 */

const NAME_REGEX = /^[A-Za-z\s]+$/;

export function validatePatientForm(formData, options = {}) {
  const errors = {};

  // 1. Name validation
  if (!formData.name || !formData.name.trim()) {
    errors.name = 'Patient name is required.';
  } else {
    const trimmed = formData.name.trim();
    if (trimmed.length < 2) {
      errors.name = 'Patient name must be at least 2 characters.';
    } else if (trimmed.length > 100) {
      errors.name = 'Patient name cannot exceed 100 characters.';
    } else if (!NAME_REGEX.test(trimmed)) {
      errors.name = 'Patient name can contain only letters and spaces.';
    }
  }

  // 2. Age validation
  if (formData.age === '' || formData.age === null || formData.age === undefined) {
    errors.age = 'Age is required.';
  } else {
    const ageNum = Number(formData.age);
    if (isNaN(ageNum) || !Number.isInteger(ageNum)) {
      errors.age = 'Age must be a valid whole number.';
    } else if (ageNum < 0 || ageNum > 120) {
      errors.age = 'Age must be between 0 and 120.';
    }
  }

  // 3. Gender validation
  if (!formData.gender) {
    errors.gender = 'Please select a valid gender.';
  } else if (options.genders && !options.genders.includes(formData.gender)) {
    errors.gender = 'Please select a valid gender.';
  }

  // 4. Ward validation
  if (!formData.ward) {
    errors.ward = 'Please select a valid ward.';
  } else if (options.wards && !options.wards.includes(formData.ward)) {
    errors.ward = 'Please select a valid ward.';
  }

  // 5. Department validation
  if (!formData.department) {
    errors.department = 'Please select a valid department.';
  } else if (options.departments && !options.departments.includes(formData.department)) {
    errors.department = 'Please select a valid department.';
  }

  // 6. Doctor validation
  if (!formData.doctor) {
    errors.doctor = 'Please select a valid doctor.';
  } else {
    if (options.doctors && !options.doctors.includes(formData.doctor)) {
      errors.doctor = 'Invalid doctor selection.';
    } else if (
      formData.department &&
      options.doctors_by_department &&
      options.doctors_by_department[formData.department] &&
      !options.doctors_by_department[formData.department].includes(formData.doctor)
    ) {
      errors.doctor = `Selected doctor does not belong to ${formData.department}.`;
    }
  }

  // 7. Admission Date validation
  if (!formData.admission_date) {
    errors.admission_date = 'Admission date is required.';
  } else {
    const selectedDate = new Date(formData.admission_date);
    const today = new Date();
    // Normalize to date comparison without time
    today.setHours(23, 59, 59, 999);
    if (selectedDate > today) {
      errors.admission_date = 'Admission date cannot be in the future.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function formatDate(dateString) {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateTimeString) {
  if (!dateTimeString) return '-';
  try {
    const d = new Date(dateTimeString);
    if (isNaN(d.getTime())) return dateTimeString;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateTimeString;
  }
}
