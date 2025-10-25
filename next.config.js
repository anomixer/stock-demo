/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['via.placeholder.com', 'images.unsplash.com'],
    },
    output: 'export',  // Enable static export for GitHub Pages
    trailingSlash: true,  // Ensure trailing slash for GitHub Pages
    // For Cloudflare Pages, use standard Next.js deployment
    // API routes will be handled by Pages Functions
}

module.exports = nextConfig
