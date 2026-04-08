from sqlalchemy import Select, select
from sqlalchemy.orm import Session

from app.db.models import Job
from app.schemas.job import CreateJobRequest


def create_job(db: Session, payload: CreateJobRequest) -> Job:
    job = Job(
        pro_id=payload.pro_id,
        customer_name=payload.customer_name,
        issue_description=payload.issue_description,
        customer_lat=payload.customer_lat,
        customer_lng=payload.customer_lng,
        status='pending',
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    return job


def get_job(db: Session, job_id: int) -> Job | None:
    return db.get(Job, job_id)


def get_pending_job_for_pro(db: Session, pro_id: str) -> Job | None:
    stmt: Select[tuple[Job]] = (
        select(Job)
        .where(Job.pro_id == pro_id)
        .where(Job.status == 'pending')
        .order_by(Job.created_at.asc())
        .limit(1)
    )
    return db.execute(stmt).scalars().first()


def get_active_job_for_pro(db: Session, pro_id: str) -> Job | None:
    stmt: Select[tuple[Job]] = (
        select(Job)
        .where(Job.pro_id == pro_id)
        .where(Job.status == 'accepted')
        .order_by(Job.created_at.desc())
        .limit(1)
    )
    return db.execute(stmt).scalars().first()


def update_job_status(db: Session, job: Job, status: str) -> Job:
    job.status = status
    db.commit()
    db.refresh(job)
    return job
