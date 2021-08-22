const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/backend',
    createProxyMiddleware({
      target: 'https://iitp-tpc-portal-backend.herokuapp.com',
      changeOrigin: true,
    })
  );
};
