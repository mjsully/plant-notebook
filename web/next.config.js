const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'http://api:8000/:path*',
        },
      ]
    },
    async redirects() {
      return [
        {
          source: '/',
          destination: '/summary',
          permanent: true,
        },
      ]
    }
  };

module.exports = nextConfig