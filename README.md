# 🏥 MediCare - Patient Admission Management System
### DScribe Software Engineer Intern – Round 1 Assignment

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB.svg?style=flat&logo=react&logoColor=black)](https://reactjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC.svg?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![SQLite](https://img.shields.io/badge/Database-SQLite_Persistent-003B57.svg?style=flat&logo=sqlite&logoColor=white)](https://www.sqlite.org)
[![Python Tests](https://img.shields.io/badge/Pytest-25_Passed-success.svg?style=flat&logo=pytest&logoColor=white)](https://pytest.org)

---

## 1. Project Title
**MediCare – Modern Hospital Patient Admission Management Web Application**  
*DScribe | Unriddle Technologies Pvt Ltd – Software Engineer Intern Round 1 Task*

---

## 2. Project Overview
**MediCare** is a production-grade hospital administration dashboard tailored for healthcare personnel and clinical staff. It delivers end-to-end management of patient hospitalizations, real-time bed occupancy metrics, multi-parameter clinical search and filtering, and patient lifecycle transitions from initial intake to discharge.

The application adheres to modern clinical UI/UX design standards, clean architecture principles, and bidirectional data validation across both the client-side React application and server-side FastAPI infrastructure.

---

## 3. Problem Statement
Hospital administrative staff frequently encounter delays and errors when managing inpatient admissions, tracking ward bed occupancy, filtering by medical departments and attending physicians, and updating patient discharge states. Basic systems often lack dual-layer validation, allowing corrupt or invalid data (such as future admission dates, invalid alphanumeric names, or unverified physician associations) into clinical records.

**MediCare solves this by providing:**
- A unified single-pane-of-glass dashboard displaying dynamic admission statistics and ward occupancy distributions.
- Zero-latency multi-filter queries (Ward, Department, Physician, and Admission Status).
- Strict dual-layer validation on both React and Pydantic/SQLAlchemy layers.
- Persistent transactional SQLite storage guaranteeing data safety across restarts.
- Confirmatory audit workflows for discharging and deleting patient records.

---

## 4. Key Features

| Feature | Description | Implementation Details |
| :--- | :--- | :--- |
| **Dynamic Dashboard** | Live operational metrics for hospital staff | Dynamically computes Total Patients, Admitted Count, Discharged Count, Total Departments, Ward & Specialty load distributions. |
| **Patient Registration** | Rapid patient intake with instant validation | Real-time validation for Name, Age, Gender, Ward, Department, Doctor, and Admission Date. |
| **All Patients Registry** | Centralized patient registry table | Lists all patients with status badges, pagination, and quick action buttons. |
| **Dynamic Search** | Instant case-insensitive name & ID search | Searches patient names and unique identifiers (e.g., `PAT-1001`) with backend database queries. |
| **Multi-Parameter Filtering** | Coordinated multi-attribute filtering | Independent and combined filtering by Ward, Department, Attending Doctor, and Admission Status. Includes **Clear Filters**. |
| **Patient Details View** | Full medical dossier modal | Displays complete patient profile, care team, admission timeline, and system audit timestamps. |
| **Patient Record Editing** | Pre-populated editing modal | Full modification support for patient attributes with department-physician validation. |
| **Discharge Workflow** | Patient discharge confirmation | Safeguard dialog preventing re-discharge of already discharged patients while preserving historical records. |
| **Safe Record Deletion** | Permanent record removal | Dual-confirmation modal identifying exact patient ID and name prior to deletion. |
| **Dual-Layer Validation** | Strict front-to-back schema enforcement | Regex name constraints, age boundaries (0–120), date constraints ($\le$ today), and department-physician integrity. |

---

## 5. Technology Stack

### **Frontend**
- **Framework:** React.js (v18.2)
- **Tooling & Bundler:** Vite (v5.4)
- **Language:** JavaScript (ESNext, React JSX)
- **Styling:** Tailwind CSS (Custom Medical Design System: Primary `#173B65`, Secondary `#2878C8`, Surface `#F5F7FB`)
- **API Client:** Axios (Centralized instance with custom error interceptors)
- **Iconography:** Lucide React

### **Backend**
- **Framework:** Python FastAPI (v0.110+)
- **Validation & Schemas:** Pydantic v2 (Strict type validators & custom error handlers)
- **ORM & Data Mapping:** SQLAlchemy 2.0
- **Server:** Uvicorn ASGI Server

### **Database**
- **Database Engine:** SQLite (ACID compliant, persistent disk storage)
- **Persistence:** Local file `patients.db` / Render persistent mounted volume (`/var/data/patients.db`)

### **Testing**
- **Testing Framework:** Pytest (v9.2)
- **Test Client:** HTTPX & Starlette TestClient (25 automated test cases executed)

---

## 6. Screenshots & Interface Overview

### Dashboard & Metrics Overview
![Dashboard Overview Placeholder](https://raw.githubusercontent.com/placeholder-images/dashboard-preview.png)
*Modern hospital dashboard displaying live statistic cards, ward occupancy breakdown, department distributions, and recent admissions table.*

### Patient Management Registry
![Patient Registry Placeholder](https://raw.githubusercontent.com/placeholder-images/registry-preview.png)
*Registry table featuring search input, ward/department/doctor/status filters, status badges, and action toolbars.*

### Patient Registration & Validation Modal
![Patient Modal Placeholder](https://raw.githubusercontent.com/placeholder-images/modal-preview.png)
*Patient registration modal with real-time feedback, doctor-department cascading select, and field-level validation.*

---

## 7. Project Folder Structure

```
patient-admission-management/
│
├── frontend/                          # React Frontend Application
│   ├── public/                        # Static assets & icons
│   ├── src/
│   │   ├── components/                # Reusable UI Components
│   │   │   ├── ConfirmDialog.jsx      # Confirmation modal for delete & discharge
│   │   │   ├── Navbar.jsx             # Top navigation bar with live date
│   │   │   ├── PatientDetailsModal.jsx# Patient file dossier modal
│   │   │   ├── PatientModal.jsx       # Add/Edit patient modal with validation
│   │   │   ├── PatientTable.jsx       # Patient tabular display & action buttons
│   │   │   ├── Sidebar.jsx            # Collapsible navigation sidebar
│   │   │   ├── StatCard.jsx           # Dashboard metric cards
│   │   │   └── Toast.jsx              # Notification toast system
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx      # Hospital stats & distribution charts
│   │   │   └── PatientsPage.jsx       # Search, filter & patient table view
│   │   ├── services/
│   │   │   ├── api.js                 # Axios instance with interceptors
│   │   │   └── patientService.js      # REST API service functions
│   │   ├── utils/
│   │   │   └── validators.js          # Client-side validation logic & formatters
│   │   ├── App.jsx                    # Root state management & routing
│   │   ├── index.css                  # Tailwind styles & theme variables
│   │   └── main.jsx                   # React DOM entrypoint
│   ├── .env.example                   # Frontend environment template
│   ├── index.html                     # HTML root document
│   ├── package.json                   # Node dependencies & build scripts
│   ├── postcss.config.js              # PostCSS configuration
│   ├── tailwind.config.js             # Custom Tailwind color palette & typography
│   ├── vercel.json                    # Vercel deployment rewrites
│   └── vite.config.js                 # Vite build & dev configuration
│
├── backend/                           # Python FastAPI Backend
│   ├── app/
│   │   ├── routes/
│   │   │   ├── dashboard.py           # Dashboard statistics endpoint
│   │   │   ├── options.py             # Predefined wards, depts & doctors
│   │   │   └── patients.py            # CRUD operations & discharge endpoints
│   │   ├── config.py                  # Pydantic Settings & environment config
│   │   ├── crud.py                    # Database queries & business logic
│   │   ├── database.py                # SQLAlchemy engine & session dependency
│   │   ├── main.py                    # FastAPI application initialization & CORS
│   │   ├── models.py                  # SQLAlchemy Patient ORM model
│   │   ├── schemas.py                 # Pydantic request & response schemas
│   │   ├── seed.py                    # Database initial seeding utility
│   │   └── validators.py              # Strict validation functions & rules
│   ├── tests/                         # Pytest Automated Test Suite
│   │   ├── conftest.py                # Test fixtures & in-memory test database
│   │   ├── test_dashboard.py          # Dashboard metric calculation tests
│   │   ├── test_patients.py           # CRUD and discharge endpoint tests
│   │   ├── test_persistence.py        # Database persistence verification tests
│   │   └── test_validation.py         # Comprehensive validation rule tests
│   ├── .env.example                   # Backend environment template
│   └── requirements.txt               # Python package dependencies
│
├── .gitignore                         # Git exclusion rules
├── render.yaml                        # Render Blueprint deployment config
├── vercel.json                        # Root Vercel SPA configuration
└── README.md                          # Comprehensive project documentation
```

---

## 8. Backend Installation Steps

### Prerequisites
- Python 3.10+ (Tested on Python 3.12)
- `pip` package manager

### Steps
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   # Windows (PowerShell)
   python -m venv venv
   .\venv\Scripts\Activate.ps1

   # Linux / macOS
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

---

## 9. Frontend Installation Steps

### Prerequisites
- Node.js (v18+ or v20+)
- `npm` (v9+)

### Steps
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

---

## 10. Environment Variable Configuration

### Backend `.env`
```ini
# Server Configuration
PORT=8000
HOST=0.0.0.0
ENVIRONMENT=development

# Database Configuration (SQLite)
# Local: sqlite:///./patients.db
# Render with persistent disk: sqlite:////var/data/patients.db
DATABASE_URL=sqlite:///./patients.db

# CORS Configuration (comma-separated origins)
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,https://your-frontend.vercel.app
```

### Frontend `.env`
```ini
# Base URL pointing to the FastAPI backend API
VITE_API_BASE_URL=http://localhost:8000/api
```

---

## 11. How to Run Locally

### Terminal 1: Run Backend Server
```bash
# From repository root
cd backend
# Windows
.\venv\Scripts\activate
# Set PYTHONPATH and start server
$env:PYTHONPATH="."
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
The FastAPI interactive documentation will be accessible at:  
👉 `http://127.0.0.1:8000/api/docs`

### Terminal 2: Run Frontend Development Server
```bash
# From repository root
cd frontend
npm run dev
```
The React application will be accessible at:  
👉 `http://localhost:5173`

*(Optional) Seed sample patient records via REST API:*
```bash
python backend/app/seed.py
```

---

## 12. API Endpoint Documentation

| Method | Endpoint | Description | Status Codes |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status check | `200 OK` |
| `GET` | `/api/options` | Retrieve valid genders, wards, departments, doctors | `200 OK` |
| `GET` | `/api/dashboard/stats` | Dynamic hospital statistics & ward breakdown | `200 OK` |
| `GET` | `/api/patients` | Search, filter & paginate patients | `200 OK` |
| `POST` | `/api/patients` | Register a new patient | `201 Created`, `422 Unprocessable` |
| `GET` | `/api/patients/{patient_id}` | Retrieve single patient record | `200 OK`, `404 Not Found` |
| `PUT` | `/api/patients/{patient_id}` | Update patient details | `200 OK`, `422 Unprocessable`, `404 Not Found` |
| `PATCH` | `/api/patients/{patient_id}/discharge` | Mark patient as discharged | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `DELETE` | `/api/patients/{patient_id}` | Permanently delete patient record | `200 OK`, `404 Not Found` |

### Sample Patient Creation Request (`POST /api/patients`)
```json
{
  "name": "Sarah Connor",
  "age": 29,
  "gender": "Female",
  "ward": "ICU",
  "department": "Cardiology",
  "doctor": "Dr. Sarah Jenkins",
  "admission_date": "2026-11-20",
  "status": "Admitted"
}
```

### Sample Response (`201 Created`)
```json
{
  "id": 1,
  "patient_id": "PAT-1001",
  "name": "Sarah Connor",
  "age": 29,
  "gender": "Female",
  "ward": "ICU",
  "department": "Cardiology",
  "doctor": "Dr. Sarah Jenkins",
  "admission_date": "2026-11-20",
  "status": "Admitted",
  "created_at": "2026-11-25T11:00:00",
  "updated_at": "2026-11-25T11:00:00"
}
```

---

## 13. Database Information & Persistence

- **Database Engine:** SQLite 3.
- **Persistence Guarantee:** Data is committed via SQLAlchemy ORM transactions to a durable disk file (`patients.db`). It persists across full application restarts, server reboots, and multi-session instances.
- **Render Production Disk:** On Render, persistent storage is enabled via a mounted disk at `/var/data` configured in `render.yaml`, safeguarding the SQLite database from ephemeral container restarts.
- **Automated Verification:** Verified through automated test `test_sqlite_persistence_across_sessions` which writes data, disposes the SQLAlchemy engine, instantiates a clean engine connection, and confirms data fidelity.

---

## 14. Deployment Instructions

### Deploying the Backend on Render
1. Create a free account on [Render](https://render.com).
2. Click **New +** -> **Blueprint** (or **Web Service**).
3. Connect your GitHub repository.
4. Render will automatically detect `render.yaml`:
   - Environment: `Python`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Persistent Disk: `/var/data` (1 GB)
   - Database URL: `sqlite:////var/data/patients.db`
5. Deploy the service. Note down the backend URL (e.g., `https://patient-admission-backend.onrender.com`).

### Deploying the Frontend on Vercel
1. Create an account on [Vercel](https://vercel.com).
2. Click **Add New** -> **Project** and import your repository.
3. Configure the project settings:
   - Framework Preset: `Vite`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Set Environment Variables:
   - `VITE_API_BASE_URL`: `https://your-backend.onrender.com/api`
5. Click **Deploy**. Vercel will output your live URL (e.g., `https://patient-admission-management.vercel.app`).
6. Update the backend `CORS_ORIGINS` environment variable on Render to include your Vercel URL.

---

## 15. Live Application & Repository Links

- **Frontend Live URL:** `https://patient-admission-management.vercel.app` *(or custom domain)*
- **Backend API Live URL:** `https://patient-admission-backend.onrender.com/api`
- **Interactive Swagger Documentation:** `https://patient-admission-backend.onrender.com/api/docs`
- **Public GitHub Repository:** `https://github.com/your-username/patient-admission-management`

---

## 16. Test Suite & Verification Results

All 25 automated backend tests pass with 100% success rate:

```
============================= test session starts =============================
platform win32 -- Python 3.12.10, pytest-9.2.0
collected 25 items

backend/tests/test_dashboard.py::test_dashboard_stats PASSED             [  4%]
backend/tests/test_patients.py::test_health_check PASSED                 [  8%]
backend/tests/test_patients.py::test_get_options PASSED                  [ 12%]
backend/tests/test_patients.py::test_create_patient PASSED               [ 16%]
backend/tests/test_patients.py::test_get_patient_by_id_and_code PASSED   [ 20%]
backend/tests/test_patients.py::test_get_patient_not_found PASSED        [ 24%]
backend/tests/test_patients.py::test_list_patients_pagination PASSED     [ 28%]
backend/tests/test_patients.py::test_search_patients_by_name_and_code PASSED [ 32%]
backend/tests/test_patients.py::test_filter_patients PASSED              [ 36%]
backend/tests/test_patients.py::test_update_patient PASSED               [ 40%]
backend/tests/test_patients.py::test_discharge_patient PASSED            [ 44%]
backend/tests/test_patients.py::test_delete_patient PASSED               [ 48%]
backend/tests/test_persistence.py::test_sqlite_persistence_across_sessions PASSED [ 52%]
backend/tests/test_validation.py::test_reject_missing_name PASSED        [ 56%]
backend/tests/test_validation.py::test_reject_numbers_in_name PASSED     [ 60%]
backend/tests/test_validation.py::test_reject_special_characters_in_name PASSED [ 64%]
backend/tests/test_validation.py::test_accept_and_trim_valid_name PASSED [ 68%]
backend/tests/test_validation.py::test_reject_negative_age PASSED        [ 72%]
backend/tests/test_validation.py::test_reject_age_over_120 PASSED        [ 76%]
backend/tests/test_validation.py::test_reject_future_admission_date PASSED [ 80%]
backend/tests/test_validation.py::test_reject_invalid_gender PASSED      [ 84%]
backend/tests/test_validation.py::test_reject_invalid_ward PASSED        [ 88%]
backend/tests/test_validation.py::test_reject_invalid_department PASSED  [ 92%]
backend/tests/test_validation.py::test_reject_invalid_doctor PASSED      [ 96%]
backend/tests/test_validation.py::test_reject_doctor_department_mismatch PASSED [100%]

======================= 25 passed in 0.95s =======================
```

To re-run the tests locally:
```bash
python -m pytest backend/tests -v
```

---

## 17. Submission Guidelines Compliance

- ✅ **Tech Stack Strict Compliance:** React.js frontend + Python FastAPI backend + SQLite persistent database.
- ✅ **No Node.js Backend:** Python FastAPI exclusively handles all REST operations.
- ✅ **No Fake / Hardcoded Data:** All data dynamically served from SQLite database via REST endpoints.
- ✅ **Dual Validation:** Strict validation rules implemented identically across client and server.
- ✅ **Mandatory Features:** Add, View, Search, Filter (Ward, Dept, Doctor, Status), Edit, Delete with Confirmation, Discharge with Confirmation, Dynamic Dashboard.
- ✅ **Ready for Round 2:** Clean, modular, well-documented architecture, structured for easy live code explanation and feature extensions.
