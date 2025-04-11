#!/bin/bash
# This script sets up a DigitalOcean Droplet for running your Slack bot

# Exit on error
set -e

echo "===== Updating system packages ====="
apt-get update
apt-get upgrade -y

echo "===== Installing Docker ====="
apt-get install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io

echo "===== Installing Docker Compose ====="
curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

echo "===== Installing Git ====="
apt-get install -y git

echo "===== Creating Slack Bot Directory ====="
mkdir -p /opt/abide-slack-bot
cd /opt/abide-slack-bot

echo "===== Clone Git Repository ====="
# Replace with your actual repository URL
git clone https://github.com/your-username/abide-slack-bot.git .

echo "===== Creating Environment File ====="
cat <<EOF >.env
SLACK_BOT_TOKEN=xoxb-your-bot-token-here
SLACK_SIGNING_SECRET=your-signing-secret-here
SLACK_APP_TOKEN=xapp-your-app-token-here
SECRET_KEY=$(openssl rand -hex 32)
EOF

echo "===== Starting Docker Containers ====="
docker-compose up -d

echo "===== Running Database Migrations ====="
docker-compose exec -T web flask db upgrade

echo "===== Setting Up Firewall ====="
ufw allow OpenSSH
ufw allow 5000
ufw --force enable

echo "===== Setup Complete ====="
echo "Your Slack bot is now running on http://$(curl -s ifconfig.me):5000"
echo "Don't forget to update your Slack app configuration with this URL!"
