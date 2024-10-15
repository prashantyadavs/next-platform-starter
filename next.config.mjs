/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true, // Enable styled-components SWC support
  },
  output: 'export', // This tells Next.js to export your application
  // Additional configurations can go here if needed
  images: {
    domains: [
      'tradifybyith.in', // Your existing domain
      'images.unsplash.com', 
      'static.wixstatic.com'// Add Unsplash domain here
    ],
  },
};

export default nextConfig;
