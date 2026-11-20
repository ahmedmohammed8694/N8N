# n8n Self-Hosted Configuration

Personal n8n Docker deployment.

## Requirements
- Docker Desktop
- Docker Compose

## Start n8n
docker compose up -d

## Stop n8n
docker compose stop

## Restart n8n
docker compose restart

## View logs
docker compose logs -f n8n

## Dashboard
http://localhost:5678
https://legendary-zebra-ww4q75j5jg7fg6p5-5678.app.github.dev/

## Security
- Never upload .env files.
- Never upload encryption keys.
- Never upload credentials or database backups.
- Keep this repository private.
