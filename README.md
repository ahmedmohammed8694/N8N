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

## Security
- Never upload .env files.
- Never upload encryption keys.
- Never upload credentials or database backups.
- Keep this repository private.
