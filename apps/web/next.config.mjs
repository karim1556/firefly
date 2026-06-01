/** @type {import('next').NextConfig} */
const nextConfig = {
	async rewrites() {
		const apiTarget = process.env.API_PROXY_TARGET ?? "http://localhost:4000";

		return [
			{
				source: "/api/v1/:path*",
				destination: `${apiTarget}/api/v1/:path*`
			},
			{
				source: "/health",
				destination: `${apiTarget}/health`
			}
		];
	}
};

export default nextConfig;
