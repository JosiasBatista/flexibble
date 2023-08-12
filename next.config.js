/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com', 'res.cloudinary.com']
  },
  experimental: {
    serverComponentsExternalPackages: ['cloudinary', 'graphql-request']
  }
}

module.exports = {...nextConfig,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/application',
        permanent: true,
      },
    ]
  },
}
