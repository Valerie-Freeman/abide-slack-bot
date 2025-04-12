"""Routes for the Slack bot."""

# Create a blueprint
from flask import Blueprint, request, jsonify

# Create blueprint
bot_bp = Blueprint('bot', __name__)

# These imports will be handled after blueprint creation
# to avoid circular imports
slack_app = None
handler = None

def init_slack_app(config):
    """Initialize the Slack app with the provided configuration."""
    global slack_app, handler
    
    try:
        from slack_bolt import App
        from slack_bolt.adapter.flask import SlackRequestHandler
        from app.bot.handlers import register_handlers
        
        # Initialize the Slack app
        slack_app = App(
            token=config.SLACK_BOT_TOKEN,
            signing_secret=config.SLACK_SIGNING_SECRET,
            # Enable Socket Mode if using SLACK_APP_TOKEN
            socket_mode=bool(config.SLACK_APP_TOKEN),
            app_token=config.SLACK_APP_TOKEN if config.SLACK_APP_TOKEN else None
        )
        
        # Register event handlers with the Slack app
        register_handlers(slack_app)
        
        # Create a request handler
        handler = SlackRequestHandler(slack_app)
        
        # Start the app if socket mode is enabled
        if slack_app.client.token and slack_app.client.app_token:
            from threading import Thread
            def start_socket_mode():
                slack_app.start()
            # Start Socket Mode in a separate thread
            socket_thread = Thread(target=start_socket_mode)
            socket_thread.daemon = True
            socket_thread.start()
            
    except ImportError as e:
        print(f"Error initializing Slack app: {e}")
        print("Make sure slack_bolt and slack_sdk are installed")

@bot_bp.route('/slack/events', methods=['POST'])
def slack_events():
    """Handle Slack events."""
    if handler:
        return handler.handle(request)
    return jsonify({"error": "Slack app not initialized"}), 500

@bot_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({"status": "ok"})