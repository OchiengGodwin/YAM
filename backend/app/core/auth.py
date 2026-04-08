from fastapi import Depends, Header, HTTPException, status
import httpx

from app.core.config import get_settings

settings = get_settings()


def _extract_bearer_token(authorization: str | None) -> str:
    if not authorization:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Missing Authorization header')

    prefix = 'Bearer '
    if not authorization.startswith(prefix):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid Authorization header')

    token = authorization[len(prefix):].strip()
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Missing bearer token')

    return token


def verify_supabase_access_token(token: str) -> dict:
    if not settings.supabase_url or not settings.supabase_anon_key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail='Supabase auth is not configured on backend',
        )

    url = f"{settings.supabase_url.rstrip('/')}/auth/v1/user"
    headers = {
        'Authorization': f'Bearer {token}',
        'apikey': settings.supabase_anon_key,
    }

    try:
        response = httpx.get(url, headers=headers, timeout=10.0)
    except httpx.HTTPError:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail='Auth provider unavailable')

    if response.status_code != 200:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid or expired token')

    data = response.json()
    if not data.get('id'):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid auth payload')

    return data


def get_current_user(authorization: str | None = Header(default=None)) -> dict:
    token = _extract_bearer_token(authorization)
    return verify_supabase_access_token(token)


def get_current_user_id(user: dict = Depends(get_current_user)) -> str:
    return user['id']
