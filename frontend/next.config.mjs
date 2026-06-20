import path from "path";

const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    NEXT_PUBLIC_ESEWA_MERCHANT: process.env.NEXT_PUBLIC_ESEWA_MERCHANT,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
