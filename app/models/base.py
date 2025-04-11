from datetime import datetime
from app import db

class TimestampMixin:
    """Add timestamp fields to models that inherit this."""
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)