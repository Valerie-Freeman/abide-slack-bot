"""WSGI entry point for the application."""

import os
import sys

# Add the project directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from app import create_app
except ImportError as e:
    print(f"Failed to import application: {e}")
    print("Make sure all dependencies are installed.")
    # Still provide an app for gunicorn, but it will return 500 errors
    from flask import Flask
    app = Flask(__name__)
    
    @app.route('/')
    def error():
        return "Application import failed. Check logs for details.", 500
else:
    # Get environment from environment variable with a default fallback
    env = os.environ.get('FLASK_APP_ENV', 'development')
    
    try:
        # Create the app with the specified environment
        app = create_app(env)
        print(f"Application created with environment: {env}")
    except Exception as e:
        print(f"Failed to create application: {e}")
        # Provide a basic app that will return 500 errors
        from flask import Flask
        app = Flask(__name__)
        
        @app.route('/')
        def error():
            return "Application creation failed. Check logs for details.", 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))