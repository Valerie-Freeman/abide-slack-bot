# Abide Slack Bot

A Slack onboarding bot for the Abide Slack workspace that guides new members through setting up their account.

## Project Overview

The Abide bot helps new members with:
- Understanding what Abide is about
- Setting up their Slack profile
- Adding the Google Calendar
- Understanding channels and notifications
- Sending direct messages
- Inviting others to the workspace

## Features

- Interactive onboarding with button-based progression
- Seven-step onboarding process
- State management to track user progress

## Setup Requirements

### Environment Variables
Create a `.env` file with:
```
SLACK_BOT_TOKEN=xoxb-your-bot-token-here
SLACK_SIGNING_SECRET=your-signing-secret-here
SLACK_APP_TOKEN=xapp-your-app-token-here
```

### Slack App Configuration
- Enable Socket Mode in app settings
- Generate App-Level Token with connections:write scope
- Add necessary Bot Token Scopes:
  * app_mentions:read
  * chat:write
  * im:history
  * im:read
  * im:write
  * users:read
- Enable App Home with both Home Tab and Messages Tab
- Subscribe to bot events:
  * message.im
  * app_mention
  * message.channels (if needed)

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/abide-slack-bot.git
cd abide-slack-bot
```

2. Install dependencies
```bash
npm install
```

3. Start the bot
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

## Deployment

This bot can be deployed to DigitalOcean or any other hosting provider.

## License

This project is private and intended for the Abide community.

## Purpose

This application serves two purposes: 

**Primary Goal:** For learning purposes including but not limited to
1. Containerization using Docker
2. CI/CD using Github actions
3. Deployment using Digital Ocean
4. Python/Flask development practice

**Secondary Goal:** To create an onboarding app for new members of the slack workspace


## Learning Notes

[Flask Application Factory Patter](./notes/FLASK_APPLICATION_FACTORY_PATTERN.md)