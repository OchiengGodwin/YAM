from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


JobStatus = Literal['pending', 'accepted', 'declined', 'completed', 'cancelled']


class CreateJobRequest(BaseModel):
    pro_id: str = Field(min_length=3, max_length=64)
    customer_name: str = Field(min_length=2, max_length=120)
    issue_description: str | None = Field(default=None, max_length=500)
    customer_lat: float = Field(ge=-90, le=90)
    customer_lng: float = Field(ge=-180, le=180)


class UpdateJobStatusRequest(BaseModel):
    status: JobStatus


class JobOut(BaseModel):
    id: int
    pro_id: str
    customer_name: str
    issue_description: str | None
    customer_lat: float
    customer_lng: float
    status: JobStatus
    created_at: datetime
    updated_at: datetime
