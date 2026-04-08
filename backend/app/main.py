from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.health import router as health_router
from app.api.routes.jobs import router as jobs_router
from app.api.routes.professionals import router as professionals_router
from app.core.config import get_settings
from app.core.logging import configure_logging
from app.db import models  # noqa: F401

settings = get_settings()


app = FastAPI(
    title=settings.app_name,
    debug=settings.app_debug,
    version='1.0.0',
)

configure_logging(settings.app_debug)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.parsed_cors_origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

# Compatibility routes for current frontend
app.include_router(health_router)
app.include_router(professionals_router)
app.include_router(jobs_router)

# Versioned routes for long-term API evolution
app.include_router(health_router, prefix='/api/v1')
app.include_router(professionals_router, prefix='/api/v1')
app.include_router(jobs_router, prefix='/api/v1')


@app.get('/')
def root() -> dict:
    return {'status': 'ok', 'service': settings.app_name, 'version': '1.0.0'}
