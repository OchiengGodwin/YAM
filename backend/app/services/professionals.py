import math

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.db.models import Professional
from app.schemas.professional import ProPayload

settings = get_settings()


def haversine_km(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    radius = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(dlng / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return radius * c


def format_point_wkt(lat: float, lng: float) -> str:
    return f'POINT({lng} {lat})'


def upsert_professional(db: Session, user_id: str, pro: ProPayload) -> Professional:
    existing = db.get(Professional, user_id)
    if existing:
        existing.full_name = pro.full_name
        existing.profession = pro.profession
        existing.phone = pro.phone
        existing.lat = pro.lat
        existing.lng = pro.lng
        existing.is_available = True
        db.commit()
        db.refresh(existing)
        return existing

    row = Professional(
        id=user_id,
        full_name=pro.full_name,
        profession=pro.profession,
        phone=pro.phone,
        lat=pro.lat,
        lng=pro.lng,
        is_available=True,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


def set_professional_status(db: Session, pro_id: str, is_available: bool) -> Professional | None:
    pro = db.get(Professional, pro_id)
    if pro is None:
        return None

    pro.is_available = is_available
    db.commit()
    db.refresh(pro)
    return pro


def get_all_professionals(db: Session) -> list[Professional]:
    stmt = select(Professional).order_by(Professional.created_at.desc())
    return list(db.execute(stmt).scalars().all())


def find_nearby_professionals(
    db: Session,
    lat: float,
    lng: float,
    profession: str,
    radius_km: float | None = None,
    limit: int | None = None,
) -> list[tuple[Professional, float]]:
    radius = radius_km if radius_km is not None else settings.search_radius_km
    max_results = limit if limit is not None else settings.search_limit

    # Quick prefilter to reduce rows before precise Haversine ranking.
    lat_delta = radius / 111.0
    lng_delta = radius / (111.0 * max(math.cos(math.radians(lat)), 0.01))

    stmt = (
        select(Professional)
        .where(Professional.is_available.is_(True))
        .where(func.lower(Professional.profession) == profession.lower())
        .where(Professional.lat.between(lat - lat_delta, lat + lat_delta))
        .where(Professional.lng.between(lng - lng_delta, lng + lng_delta))
    )

    candidates = list(db.execute(stmt).scalars().all())

    ranked: list[tuple[Professional, float]] = []
    for pro in candidates:
        distance = haversine_km(lat, lng, pro.lat, pro.lng)
        if distance <= radius:
            ranked.append((pro, distance))

    ranked.sort(key=lambda item: item[1])
    return ranked[:max_results]
