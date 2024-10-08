/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    crossOrigin: 'anonymous',
    images: {
        remotePatterns: [
            {
              protocol: 'https',
              hostname: 'lh3.googleusercontent.com',
              port: '',
              pathname: '/**',
            },
        ],
    }
};

export default nextConfig;
