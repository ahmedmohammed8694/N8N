export default {
	async fetch(request, env) {
		const publicUrl = new URL(request.url);

		// robots.txt handler to protect n8n from web crawlers
		if (publicUrl.pathname === "/robots.txt") {
			return new Response("User-agent: *\nDisallow: /\n", {
				headers: { "Content-Type": "text/plain" },
			});
		}

		const origin = env.N8N_ORIGIN && !env.N8N_ORIGIN.includes("trycloudflare.com")
			? env.N8N_ORIGIN
			: "https://n8n-jpne.onrender.com";

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

	// 24/7 Keep-Alive Cron: Pings the backend every 10 minutes to prevent Render from going to sleep
	async scheduled(event, env, ctx) {
		const origin = env.N8N_ORIGIN && !env.N8N_ORIGIN.includes("trycloudflare.com")
			? env.N8N_ORIGIN
			: "https://n8n-jpne.onrender.com";
		ctx.waitUntil(
			fetch(`${origin}/healthz`).catch((err) => console.log("Keep-alive ping error:", err))
		);
	},
};
