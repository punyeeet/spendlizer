/** @type {import('next').NextConfig} */
const nextConfig = {
    serverExternalPackages: ["mongoose", "bcryptjs"],
    eslint: {
        ignoreDuringBuilds: true,
    }
};

export default nextConfig;
