/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ["mongoose", "bcryptjs"],
    },
    eslint: {
        ignoreDuringBuilds: true,
    }
};

export default nextConfig;
