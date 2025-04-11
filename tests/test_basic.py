"""Basic tests for the Flask application."""

import pytest
from app import create_app, db
from app.models.user import User

@pytest.fixture
def app():
    """Create and configure a Flask app for testing."""
    app = create_app('testing')
    
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    """A test client for the app."""
    return app.test_client()

def test_health_check(client):
    """Test that the health check endpoint works."""
    response = client.get('/health')
    assert response.status_code == 200
    assert response.json['status'] == 'ok'

def test_user_model():
    """Test the User model."""
    app = create_app('testing')
    
    with app.app_context():
        db.create_all()
        
        # Create a test user
        user = User(id='TEST123', current_step=1)
        db.session.add(user)
        db.session.commit()
        
        # Query the user
        saved_user = User.query.get('TEST123')
        assert saved_user is not None
        assert saved_user.current_step == 1
        assert saved_user.completed is False
        
        db.session.remove()
        db.drop_all()