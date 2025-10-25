/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['via.placeholder.com', 'images.unsplash.com'],
    },
    // For Cloudflare Pages, use standard Next.js deployment
    // API routes will be handled by Pages Functions
}

module.exports = nextConfig
