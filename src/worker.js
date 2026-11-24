export default {
	async fetch(request, env) {
		const publicUrl = new URL(request.url);

		// 1. robots.txt handler to disallow web crawlers and indexers
		if (publicUrl.pathname === "/robots.txt") {
			return new Response("User-agent: *\nDisallow: /\n", {
				headers: { "Content-Type": "text/plain" },
			});
		}

		// 2. Automatically redirect users to the primary custom domain hostingn8n.dpdns.org
		const targetDomain = "hostingn8n.dpdns.org";
		if (publicUrl.hostname.includes("workers.dev") && publicUrl.pathname !== "/healthz") {
			const redirectUrl = new URL(request.url);
			redirectUrl.hostname = targetDomain;
			redirectUrl.protocol = "https:";
			return Response.redirect(redirectUrl.toString(), 301);
		}

		// 3. Fallback reverse proxy to Render backend
		const origin = env.N8N_ORIGIN || "https://n8n-jpne.onrender.com";
		const upstreamUrl = new URL(origin);
		upstreamUrl.pathname = publicUrl.pathname;
		upstreamUrl.search = publicUrl.search;

		const headers = new Headers(request.headers);
		headers.set("Host", upstreamUrl.host);
		headers.set("X-Forwarded-Host", publicUrl.host);
		headers.set("X-Forwarded-Proto", "https");
		headers.set("X-Forwarded-Port", "443");

		try {
			return await fetch(upstreamUrl, {
				method: request.method,
				headers,
				body: request.body,
				redirect: "manual",
			});
		} catch (error) {
			return new Response(
				`n8n is unavailable. The backend may be booting up.\n\n${error.message}`,
				{
					status: 502,
					headers: { "Content-Type": "text/plain; charset=utf-8" },
				},
			);
		}
	},

	// 24/7 Keep-Alive Cron: Pings the backend every 5 minutes to prevent Render from going to sleep
	async scheduled(event, env, ctx) {
		const origin = env.N8N_ORIGIN || "https://n8n-jpne.onrender.com";
		const targets = ["https://hostingn8n.dpdns.org/healthz", `${origin}/healthz`];
		ctx.waitUntil(
			Promise.all(
				targets.map((url) =>
					fetch(url, { headers: { "User-Agent": "n8n-keepalive-worker" } })
						.then((res) => console.log(`Keep-alive ${url}: ${res.status}`))
						.catch((err) => console.log(`Keep-alive ${url} error:`, err))
				)
			)
		);
	},
};
