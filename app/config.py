"""Application configuration."""

import os

# Try to import dotenv, but don't fail if it's not available
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    print("python-dotenv not installed. Environment variables must be set manually.")

class Config:
    """Base configuration."""
    # Flask
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-key-please-change-in-production')
    
    # Database
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'sqlite:///app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Slack
    SLACK_BOT_TOKEN = os.environ.get('SLACK_BOT_TOKEN')
    SLACK_SIGNING_SECRET = os.environ.get('SLACK_SIGNING_SECRET')
    SLACK_APP_TOKEN = os.environ.get('SLACK_APP_TOKEN')

class DevelopmentConfig(Config):
    """Development configuration."""
    DEBUG = True

class ProductionConfig(Config):
    """Production configuration."""
    DEBUG = False
    TESTING = False

class TestingConfig(Config):
    """Testing configuration."""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'

# Dictionary with different configurations
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}