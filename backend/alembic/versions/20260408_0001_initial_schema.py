"""Initial schema for professionals and jobs tables."""
from __future__ import annotations

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '20260408_0001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'pro_services',
        sa.Column('id', sa.String(length=64), primary_key=True),
        sa.Column('full_name', sa.String(length=120), nullable=False),
        sa.Column('profession', sa.String(length=80), nullable=False),
        sa.Column('phone', sa.String(length=30), nullable=True),
        sa.Column('lat', sa.Float(), nullable=False),
        sa.Column('lng', sa.Float(), nullable=False),
        sa.Column('is_available', sa.Boolean(), nullable=False, server_default=sa.text('1')),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
    )
    op.create_index('ix_pro_services_profession', 'pro_services', ['profession'])

    op.create_table(
        'jobs',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('pro_id', sa.String(length=64), nullable=False),
        sa.Column('customer_name', sa.String(length=120), nullable=False),
        sa.Column('issue_description', sa.String(length=500), nullable=True),
        sa.Column('customer_lat', sa.Float(), nullable=False),
        sa.Column('customer_lng', sa.Float(), nullable=False),
        sa.Column('status', sa.String(length=30), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
    )
    op.create_index('ix_jobs_pro_id', 'jobs', ['pro_id'])
    op.create_index('ix_jobs_status', 'jobs', ['status'])


def downgrade() -> None:
    op.drop_index('ix_jobs_status', table_name='jobs')
    op.drop_index('ix_jobs_pro_id', table_name='jobs')
    op.drop_table('jobs')

    op.drop_index('ix_pro_services_profession', table_name='pro_services')
    op.drop_table('pro_services')
