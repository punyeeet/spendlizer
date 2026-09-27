/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["zustand"],
    experimental: {
        serverComponentsExternalPackages: ["mongoose"],
    },
    eslint: {
        ignoreDuringBuilds: true,
    }
};

export default nextConfig;
