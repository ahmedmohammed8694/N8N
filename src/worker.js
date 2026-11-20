export default {
	async fetch(request, env) {
		const origin = env.N8N_ORIGIN || "https://boots-oliver-strings-coaches.trycloudflare.com";
		const publicUrl = new URL(request.url);
		const upstreamUrl = new URL(origin);
		upstreamUrl.pathname = publicUrl.pathname;
		upstreamUrl.search = publicUrl.search;

		const headers = new Headers(request.headers);
		headers.set("Host", publicUrl.host);
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
				`n8n is unavailable. The Cloudflare Tunnel may be offline.\n\n${error.message}`,
				{
					status: 502,
					headers: { "Content-Type": "text/plain; charset=utf-8" },
				},
			);
		}
	},
};
