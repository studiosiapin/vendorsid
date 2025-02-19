/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: [
            'utfs.io',
            'api.slingacademy.com',
            'bnumduzaszvwhatwtvoe.supabase.co',
            'images.unsplash.com'
        ]
    }
};

module.exports = nextConfig;
