"""User model for the Slack bot."""

from app import db
from app.models.base import TimestampMixin

class User(db.Model, TimestampMixin):
    """User model for tracking onboarding progress."""
    __tablename__ = 'users'
    
    id = db.Column(db.String(20), primary_key=True)  # Slack user ID
    current_step = db.Column(db.Integer, default=1)
    completed = db.Column(db.Boolean, default=False)
    
    def __repr__(self):
        return f'<User {self.id}, Step: {self.current_step}, Completed: {self.completed}>'