/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['via.placeholder.com', 'images.unsplash.com'],
    },
    output: 'export',  // Enable static export for GitHub Pages
    trailingSlash: true,  // Ensure trailing slash for GitHub Pages
    // For Cloudflare Pages, use standard Next.js deployment
    // API routes will be handled by Pages Functions
    exportPathMap: async function (defaultPathMap, { dev, dir, outDir, distDir, buildId }) {
        // Exclude API routes from static export as they are handled by Cloudflare Pages Functions
        const filteredPathMap = {};
        for (const [path, config] of Object.entries(defaultPathMap)) {
            if (!path.startsWith('/api/')) {
                filteredPathMap[path] = config;
            }
        }
        return filteredPathMap;
    },
}

module.exports = nextConfig
