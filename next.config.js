/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: [
            'utfs.io',
            'api.slingacademy.com',
            'bnumduzaszvwhatwtvoe.supabase.co'
        ]
    }
};

module.exports = nextConfig;
