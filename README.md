# Abide Slack Bot

A custom onboarding bot for the Abide Slack workspace, built with Python, Flask, and PostgreSQL.

## Features

- Automatically onboards new users when they join the workspace
- Guides users through a multi-step setup process
- Uses interactive buttons for engagement
- Persists user state in a database
- Containerized for reliable deployment
- CI/CD pipeline for automated testing and deployment

## Tech Stack

- **Backend**: Python Flask
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Hosting**: DigitalOcean

## Local Development Setup

### Prerequisites

- Docker and Docker Compose
- Slack API credentials (Bot Token, Signing Secret, App Token)

### Environment Setup

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/abide-slack-bot.git
   cd abide-slack-bot
   ```

2. Create a `.env` file with your Slack credentials:
   ```
   SLACK_BOT_TOKEN=xoxb-your-bot-token-here
   SLACK_SIGNING_SECRET=your-signing-secret-here
   SLACK_APP_TOKEN=xapp-your-app-token-here
   SECRET_KEY=your-secret-key
   ```

3. Start the development environment:
   ```bash
   docker-compose up -d
   ```

4. Initialize the database:
   ```bash
   docker-compose exec web flask db upgrade
   ```

5. View logs:
   ```bash
   docker-compose logs -f
   ```

## Slack App Configuration

### App Permissions

The following Bot Token Scopes are required:
- `app_mentions:read`
- `chat:write`
- `im:history`
- `im:read`
- `im:write`
- `users:read`

### Event Subscriptions

Subscribe to the following bot events:
- `message.im`
- `app_mention`
- `team_join`

### Enable Socket Mode

Socket Mode allows the bot to receive events without exposing a public URL:

1. Go to your app settings on [api.slack.com](https://api.slack.com/apps)
2. Enable Socket Mode
3. Generate an App-Level Token with the `connections:write` scope
4. Add this token as `SLACK_APP_TOKEN` in your environment

## Deployment

### DigitalOcean Droplet Setup

1. Create a new Ubuntu droplet on DigitalOcean
2. SSH into your droplet
3. Clone this repository
4. Run the setup script:
   ```bash
   chmod +x scripts/setup_droplet.sh
   ./scripts/setup_droplet.sh
   ```

### GitHub Actions Setup

To enable automated deployments:

1. Go to your GitHub repository settings
2. Add the following secrets:
   - `DROPLET_IP`: Your DigitalOcean droplet IP
   - `DROPLET_USER`: SSH username (usually 'root')
   - `DROPLET_SSH_KEY`: Your private SSH key
   - `DROPLET_SSH_PASSPHRASE`: Your SSH key passphrase (if applicable)

## Project Structure

```
abide-slack-bot/
├── app/                    # Application package
│   ├── __init__.py         # Application factory
│   ├── config.py           # Configuration
│   ├── bot/                # Bot logic
│   │   ├── routes.py       # HTTP routes
│   │   └── handlers.py     # Event handlers
│   ├── models/             # Database models
│   └── onboarding/         # Onboarding process
│       └── steps.py        # Step definitions
├── migrations/             # Database migrations
├── .github/workflows/      # CI/CD configuration
├── docker-compose.yml      # Container orchestration
├── Dockerfile              # Container definition
├── requirements.txt        # Python dependencies
└── wsgi.py                 # Application entry point
```

## License

[MIT License](LICENSE)

## Purpose

This application serves two purposes: 

**Primary Goal:** For learning purposes including but not limited to
1. Containerization using Docker
2. CI/CD using Github actions
3. Deployment using Digital Ocean
4. Python/Flask development practice

**Secondary Goal:** To create an onboarding app for new members of the slack workspace


## Learning Notes

[Flask Application Factory Pattern](./notes/FLASK_APPLICATION_FACTORY_PATTERN.md)