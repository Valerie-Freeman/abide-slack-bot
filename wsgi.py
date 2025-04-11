import os
from app import create_app

# Get environment from environment variable with a default fallback
env = os.environ.get('FLASK_APP_ENV', 'development')

# Create the app with the specified environment
app = create_app(env)

if __name__ == '__main__':
    app.run()