/** Cloud build config: static export for Cloudflare Pages **/
/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
        unoptimized: true,
        domains: ['via.placeholder.com', 'images.unsplash.com'],
    },
}

module.exports = nextConfig


