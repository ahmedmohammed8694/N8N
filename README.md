# n8n Self-Hosted Configuration

My personal n8n Docker deployment configuration.

## Requirements
- Docker Desktop
- Docker Compose

## Start
docker compose up -d

## Stop
docker compose stop

## Logs
docker compose logs -f n8n

## Dashboard
http://localhost:5678

## Security
Never commit .env files, credentials, encryption keys, or database backups.
