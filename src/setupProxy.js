const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://150.200.3.16:29173',
      changeOrigin: true,
    })
  );
};