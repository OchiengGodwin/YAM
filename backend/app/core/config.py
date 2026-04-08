from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8', extra='ignore')

    app_name: str = 'YAM Backend'
    app_env: str = 'development'
    app_debug: bool = True
    app_host: str = '0.0.0.0'
    app_port: int = 8000

    cors_origins: str = 'http://localhost:3000,http://127.0.0.1:3000'

    database_url: str = 'sqlite:///./yam.db'
    supabase_url: str = ''
    supabase_anon_key: str = ''

    search_radius_km: float = 20.0
    search_limit: int = 20

    @property
    def parsed_cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(',') if origin.strip()]


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
