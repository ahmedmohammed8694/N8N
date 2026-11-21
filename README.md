# n8n 24/7 Cloud Architecture

Production deployment for personal n8n automation running 24/7 with zero local machine dependencies.

## Architecture

- **Public Frontend**: [Cloudflare Worker](https://hosting.mdahmed08061994.workers.dev/) (`hosting.mdahmed08061994.workers.dev`)
- **Cloud Backend**: Render Web Service (`n8n-jpne.onrender.com`) running official n8n Docker image
- **Persistent Database**: Cloud PostgreSQL (`n8n-db`) storing all workflows, credentials, and execution logs

## 24/7 Cloud Deployment (Render + Cloudflare)

The repository includes `render.yaml` pre-configured with memory optimizations for low-resource environments:
- Node.js max heap: 384MB (`NODE_OPTIONS=--max-old-space-size=384`)
- Filesystem binary data storage
- Automated execution history pruning

## Local Development (Optional)
If running locally with Docker:
```bash
docker compose up -d
```

Then set the public hostname in `.env`:

```dotenv
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
