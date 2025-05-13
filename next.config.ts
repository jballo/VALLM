import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
        {
          protocol: 'https',
          hostname: 'img.clerk.com',
        },
        {
          protocol: 'https',
          hostname: 'gw3qhbh6tl.ufs.sh',
          port: '',
          pathname: '/f/*'
        }
      ],
  }
};

export default nextConfig;
