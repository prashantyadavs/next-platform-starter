/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true, // Enable styled-components SWC support
  },
  output: 'export', // This tells Next.js to export your application
  images: {
    domains: [
      'tradifybyith.in', // Your existing domain
      'images.unsplash.com', // Domain for Unsplash images
      'static.wixstatic.com', // Additional domain for Wix static files
    ],
  },
};

export default nextConfig;
