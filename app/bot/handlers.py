"""Event handlers for Slack interactions."""

# Standard library imports
import logging

# Database imports
from app import db
from app.models.user import User
from app.onboarding.steps import get_onboarding_steps

# Set up logger
logger = logging.getLogger(__name__)

def register_handlers(app):
    """Register event handlers with the Slack app."""
    
    @app.message("hi")
    def handle_hi_message(message, say, client):
        """Handle the 'hi' message to start onboarding.
        
        Always starts the onboarding process from step 1, even if the user
        has completed it before.
        """
        # Only respond to direct messages
        if message.get('channel_type') == 'im':
            user_id = message['user']
            # Always restart onboarding from step 1
            restart_onboarding(client, user_id)
    
    @app.event("team_join")
    def handle_team_join(event, client):
        """Handle new member joining the workspace."""
        user_id = event['user']['id']
        
        # Start onboarding for the new user
        start_onboarding(client, user_id)
    
    @app.action("onboarding_next_step")
    def handle_next_step(ack, body, client):
        """Handle button clicks to advance to the next step."""
        # Acknowledge the button click
        ack()
        
        # Get the user ID
        user_id = body['user']['id']
        
        # Advance to next step
        go_to_next_step(client, user_id)
    
    @app.action("onboarding_calendar_added")
    def handle_calendar_added(ack, body, client):
        """Handle when user adds the calendar."""
        # Acknowledge the button click
        ack()
        
        # Get the user ID
        user_id = body['user']['id']
        
        # Advance to next step
        go_to_next_step(client, user_id)
    
    @app.action("onboarding_calendar_skip")
    def handle_calendar_skip(ack, body, client):
        """Handle when user skips adding the calendar."""
        # Acknowledge the button click
        ack()
        
        # Get the user ID
        user_id = body['user']['id']
        
        # Advance to next step
        go_to_next_step(client, user_id)
    
    @app.action("calendar_link_clicked")
    def handle_calendar_link_click(ack):
        """Handle when user clicks the calendar link."""
        # Just acknowledge the action
        ack()

def restart_onboarding(client, user_id):
    """Reset and restart the onboarding process for a user."""
    try:
        # Get user from database
        user = User.query.get(user_id)
        
        if user:
            # Reset to step 1
            user.current_step = 1
            user.completed = False
            db.session.commit()
        else:
            # Create new user
            user = User(id=user_id, current_step=1)
            db.session.add(user)
            db.session.commit()
        
        # Send first step
        steps = get_onboarding_steps()
        step_data = steps[0]  # Always get the first step
        
        client.chat_postMessage(
            channel=user_id,
            text="Welcome to Abide Slack! Let's get you set up.",
            blocks=step_data['message']['blocks']
        )
        
    except Exception as e:
        logger.error(f"Error restarting onboarding: {e}")

def start_onboarding(client, user_id):
    """Start the onboarding process for a new user."""
    try:
        # Check if user already exists
        user = User.query.get(user_id)
        
        if not user:
            # Create new user
            user = User(id=user_id, current_step=1)
            db.session.add(user)
            db.session.commit()
        else:
            # Reset user to step 1 (even if they've completed before)
            user.current_step = 1
            user.completed = False
            db.session.commit()
        
        # Send first step
        steps = get_onboarding_steps()
        step_data = steps[0]  # Start with first step
        client.chat_postMessage(
            channel=user_id,
            text="Welcome to Abide Slack! Let's get you set up.",
            blocks=step_data['message']['blocks']
        )
        
    except Exception as e:
        logger.error(f"Error starting onboarding: {e}")

def go_to_next_step(client, user_id):
    """Advance the user to the next onboarding step."""
    try:
        # Get user from database
        user = User.query.get(user_id)
        
        if not user:
            # User doesn't exist, create and start at step 1
            start_onboarding(client, user_id)
            return
        
        # Advance to next step
        next_step = user.current_step + 1
        user.current_step = next_step
        db.session.commit()
        
        # Get onboarding steps
        steps = get_onboarding_steps()
        
        # Check if there are more steps
        if next_step <= len(steps):
            # Send next step
            step_data = steps[next_step - 1]
            client.chat_postMessage(
                channel=user_id,
                text=f"Step {next_step}",
                blocks=step_data['message']['blocks']
            )
        else:
            # Mark onboarding as completed
            user.completed = True
            db.session.commit()
            logger.info(f"User {user_id} completed all steps")
    except Exception as e:
        logger.error(f"Error advancing to next step: {e}")