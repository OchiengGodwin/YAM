from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base


class Professional(Base):
    __tablename__ = 'pro_services'

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    full_name: Mapped[str] = mapped_column(String(120), nullable=False)
    profession: Mapped[str] = mapped_column(String(80), index=True, nullable=False)
    phone: Mapped[str | None] = mapped_column(String(30), nullable=True)
    lat: Mapped[float] = mapped_column(Float, nullable=False)
    lng: Mapped[float] = mapped_column(Float, nullable=False)
    is_available: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )


class Job(Base):
    __tablename__ = 'jobs'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    pro_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    customer_name: Mapped[str] = mapped_column(String(120), nullable=False)
    issue_description: Mapped[str | None] = mapped_column(String(500), nullable=True)
    customer_lat: Mapped[float] = mapped_column(Float, nullable=False)
    customer_lng: Mapped[float] = mapped_column(Float, nullable=False)
    status: Mapped[str] = mapped_column(String(30), index=True, nullable=False, default='pending')
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )
