"""Initial migration.

Revision ID: 0001
Revises: 
Create Date: 2024-04-11

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic
revision = '0001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Create users table
    op.create_table('users',
        sa.Column('id', sa.String(20), primary_key=True),
        sa.Column('current_step', sa.Integer(), nullable=False, default=1),
        sa.Column('completed', sa.Boolean(), nullable=False, default=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
    )


def downgrade():
    op.drop_table('users')