/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["zustand"],
    experimental: {
        serverComponentsExternalPackages: ["mongoose", "bcryptjs"],
    },
    eslint: {
        ignoreDuringBuilds: true,
    }
};

export default nextConfig;
