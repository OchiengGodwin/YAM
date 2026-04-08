from pydantic import BaseModel, Field


class ProPayload(BaseModel):
    full_name: str = Field(min_length=2, max_length=120)
    profession: str = Field(min_length=2, max_length=80)
    phone: str | None = Field(default=None, max_length=30)
    lat: float = Field(ge=-90, le=90)
    lng: float = Field(ge=-180, le=180)


class RegisterProRequest(BaseModel):
    user_id: str = Field(min_length=3, max_length=64)
    pro: ProPayload


class ToggleStatusRequest(BaseModel):
    pro_id: str = Field(min_length=3, max_length=64)
    is_available: bool


class ProfessionalOut(BaseModel):
    id: str
    full_name: str
    profession: str
    phone: str | None = None
    is_available: bool
    lat: float
    lng: float
    location: str
    distance_km: float | None = None


class ApiResponse(BaseModel):
    status: str = 'success'
    data: list[ProfessionalOut] | dict | None = None
    message: str | None = None
