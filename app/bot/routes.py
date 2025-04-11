"""Routes for the Slack bot."""

from flask import Blueprint, request, jsonify
from slack_bolt import App
from slack_bolt.adapter.flask import SlackRequestHandler

from app.config import Config
from app.bot.handlers import register_handlers

# Create a blueprint
bot_bp = Blueprint('bot', __name__)

# Initialize the Slack app
slack_app = App(
    token=Config.SLACK_BOT_TOKEN,
    signing_secret=Config.SLACK_SIGNING_SECRET,
    # Enable Socket Mode if using SLACK_APP_TOKEN
    socket_mode=bool(Config.SLACK_APP_TOKEN),
    app_token=Config.SLACK_APP_TOKEN if Config.SLACK_APP_TOKEN else None
)

# Register event handlers with the Slack app
register_handlers(slack_app)

# Create a request handler
handler = SlackRequestHandler(slack_app)

@bot_bp.route('/slack/events', methods=['POST'])
def slack_events():
    """Handle Slack events."""
    return handler.handle(request)

@bot_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({"status": "ok"})

# Start the app if socket mode is enabled
# This is important because we don't need to expose HTTP endpoints in socket mode
if slack_app.client.token and slack_app.client.app_token:
    from threading import Thread
    def start_socket_mode():
        slack_app.start()
    # Start Socket Mode in a separate thread
    socket_thread = Thread(target=start_socket_mode)
    socket_thread.daemon = True
    socket_thread.start()