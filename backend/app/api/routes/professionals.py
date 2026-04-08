from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.auth import get_current_user_id
from app.db.session import get_db
from app.schemas.professional import (
    ApiResponse,
    ProfessionalOut,
    RegisterProRequest,
    ToggleStatusRequest,
)
from app.services.professionals import (
    find_nearby_professionals,
    format_point_wkt,
    get_all_professionals,
    set_professional_status,
    upsert_professional,
)

router = APIRouter(tags=['professionals'])


@router.post('/register-pro', response_model=ApiResponse)
def register_pro(
    payload: RegisterProRequest,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    if payload.user_id != user_id:
        raise HTTPException(status_code=403, detail='Cannot register profile for another user')

    pro = upsert_professional(db, payload.user_id, payload.pro)
    return ApiResponse(
        status='success',
        data={
            'id': pro.id,
            'full_name': pro.full_name,
            'profession': pro.profession,
            'is_available': pro.is_available,
            'location': format_point_wkt(pro.lat, pro.lng),
        },
    )


@router.post('/toggle-status', response_model=ApiResponse)
def toggle_status(
    payload: ToggleStatusRequest,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    if payload.pro_id != user_id:
        raise HTTPException(status_code=403, detail='Cannot update status for another user')

    pro = set_professional_status(db, payload.pro_id, payload.is_available)
    if pro is None:
        raise HTTPException(status_code=404, detail='Professional not found')

    return ApiResponse(
        status='success',
        data={
            'id': pro.id,
            'is_available': pro.is_available,
        },
    )


@router.get('/all-pros', response_model=ApiResponse)
def all_pros(db: Session = Depends(get_db)):
    rows = get_all_professionals(db)
    data = [
        ProfessionalOut(
            id=pro.id,
            full_name=pro.full_name,
            profession=pro.profession,
            phone=pro.phone,
            is_available=pro.is_available,
            lat=pro.lat,
            lng=pro.lng,
            location=format_point_wkt(pro.lat, pro.lng),
            distance_km=None,
        )
        for pro in rows
    ]
    return ApiResponse(status='success', data=data)


@router.get('/find-pro', response_model=ApiResponse)
def find_pro(
    lat: float = Query(..., ge=-90, le=90),
    lng: float = Query(..., ge=-180, le=180),
    profession: str = Query(..., min_length=2, max_length=80),
    db: Session = Depends(get_db),
):
    ranked = find_nearby_professionals(db, lat=lat, lng=lng, profession=profession)
    data = [
        ProfessionalOut(
            id=pro.id,
            full_name=pro.full_name,
            profession=pro.profession,
            phone=pro.phone,
            is_available=pro.is_available,
            lat=pro.lat,
            lng=pro.lng,
            location=format_point_wkt(pro.lat, pro.lng),
            distance_km=round(distance, 3),
        )
        for pro, distance in ranked
    ]
    return ApiResponse(status='success', data=data)
