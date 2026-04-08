from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.auth import get_current_user_id
from app.db.session import get_db
from app.schemas.job import CreateJobRequest, UpdateJobStatusRequest
from app.schemas.professional import ApiResponse
from app.services.jobs import (
    create_job,
    get_active_job_for_pro,
    get_job,
    get_pending_job_for_pro,
    update_job_status,
)

router = APIRouter(tags=['jobs'])


def _to_payload(job) -> dict:
    return {
        'id': job.id,
        'pro_id': job.pro_id,
        'customer_name': job.customer_name,
        'issue_description': job.issue_description,
        'customer_lat': job.customer_lat,
        'customer_lng': job.customer_lng,
        'status': job.status,
        'created_at': job.created_at,
        'updated_at': job.updated_at,
    }


@router.post('/jobs/request', response_model=ApiResponse)
def request_job(payload: CreateJobRequest, db: Session = Depends(get_db)):
    job = create_job(db, payload)
    return ApiResponse(status='success', data=_to_payload(job))


@router.get('/jobs/{job_id}', response_model=ApiResponse)
def get_job_status(job_id: int, db: Session = Depends(get_db)):
    job = get_job(db, job_id)
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Job not found')
    return ApiResponse(status='success', data=_to_payload(job))


@router.get('/jobs/pro/me/pending', response_model=ApiResponse)
def pending_job_for_me(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    job = get_pending_job_for_pro(db, user_id)
    return ApiResponse(status='success', data=_to_payload(job) if job else None)


@router.get('/jobs/pro/me/active', response_model=ApiResponse)
def active_job_for_me(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    job = get_active_job_for_pro(db, user_id)
    return ApiResponse(status='success', data=_to_payload(job) if job else None)


@router.patch('/jobs/{job_id}/status', response_model=ApiResponse)
def set_job_status(
    job_id: int,
    payload: UpdateJobStatusRequest,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    job = get_job(db, job_id)
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Job not found')

    if job.pro_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Cannot manage this job')

    allowed_statuses = {'accepted', 'declined', 'completed'}
    if payload.status not in allowed_statuses:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Invalid status transition')

    updated = update_job_status(db, job, payload.status)
    return ApiResponse(status='success', data=_to_payload(updated))
