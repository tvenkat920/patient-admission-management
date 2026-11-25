from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from app.config import settings
from app.database import engine, Base, SessionLocal
from app.routes import patients, dashboard, options
from app.seed import seed_db_if_empty

# Create tables in SQLite/PostgreSQL on application startup
Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Optionally bootstrap initial sample data when database starts empty in cloud demos."""
    if settings.SEED_IF_EMPTY:
        db = SessionLocal()
        try:
            seed_db_if_empty(db)
        finally:
            db.close()
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Production-ready REST API for Patient Admission Management System",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)

# CORS Middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local and deployed access
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom validation error handler for user-friendly error messages
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    # Extract the first human-readable error message or combine them
    error_messages = []
    for err in errors:
        loc = " -> ".join(str(l) for l in err.get("loc", []) if l != "body")
        msg = err.get("msg", "Validation error")
        # Clean up pydantic prefix if any
        if msg.startswith("Value error, "):
            msg = msg.replace("Value error, ", "")
        error_messages.append(f"{loc}: {msg}" if loc else msg)
        
    readable_error = error_messages[0] if error_messages else "Invalid input data."
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "detail": readable_error,
            "errors": error_messages
        }
    )

# Include API routers
app.include_router(patients.router, prefix=settings.API_V1_STR)
app.include_router(dashboard.router, prefix=settings.API_V1_STR)
app.include_router(options.router, prefix=settings.API_V1_STR)

@app.get("/api/health", tags=["Health"])
def health_check():
    """Health check endpoint to verify backend status."""
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT
    }

@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Welcome to the Patient Admission Management API",
        "docs": "/api/docs",
        "health": "/api/health"
    }
