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

## Public hosting with Cloudflare Tunnel

This repository runs n8n in Docker. Cloudflare Workers cannot execute this
Docker Compose deployment.

1. In Cloudflare Zero Trust, create a tunnel and copy its token.
2. Add the token and public hostname to `.env`:

```dotenv
CLOUDFLARE_TUNNEL_TOKEN=your-tunnel-token
N8N_HOST=n8n.example.com
N8N_PROTOCOL=https
N8N_EDITOR_BASE_URL=https://n8n.example.com/
WEBHOOK_URL=https://n8n.example.com/
N8N_SECURE_COOKIE=true
```

3. In the tunnel's Public Hostname settings, route `n8n.example.com` to
   `http://n8n:5678`.
4. Start the services:

```bash
docker compose up -d
```

Do not configure `n8n.example.com` to point at the tunnel container itself or
to a Cloudflare Worker. DNS for a custom domain should point through the
Cloudflare Tunnel, not through this Workers URL:
`https://hosting.mdahmed08061994.workers.dev/`.

Official n8n references:

- [n8n Docker installation](https://github.com/n8n-io/n8n)
- [n8n Cloudflare Tunnel test setup](https://github.com/n8n-io/n8n/blob/master/packages/quality/environments/containers/services/cloudflared.ts)
- [n8n URL and proxy configuration](https://github.com/n8n-io/n8n/blob/master/packages/@n8n/config/src/index.ts)

## Security
- Never upload .env files.
- Never upload encryption keys.
- Never upload credentials or database backups.
- Keep this repository private.
