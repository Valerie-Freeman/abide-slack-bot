"""Flask application factory."""

# Import Flask
try:
    from flask import Flask
    from flask_sqlalchemy import SQLAlchemy
    from flask_migrate import Migrate
except ImportError:
    Flask = None
    SQLAlchemy = None
    Migrate = None
    print("Flask and extensions not installed. Install with:")
    print("pip install Flask Flask-SQLAlchemy Flask-Migrate")

# Initialize extensions
db = SQLAlchemy() if SQLAlchemy else None
migrate = Migrate() if Migrate else None

def create_app(config_name='default'):
    """Application factory function."""
    if not Flask:
        raise ImportError("Flask is not installed")
        
    # Import the config after checking for Flask
    from app.config import config
    
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Initialize extensions with app
    db.init_app(app)
    migrate.init_app(app, db)
    
    # Register blueprints
    from app.bot.routes import bot_bp
    app.register_blueprint(bot_bp)
    
    # Initialize the Slack app
    with app.app_context():
        from app.bot.routes import init_slack_app
        init_slack_app(app.config)
    
    return app