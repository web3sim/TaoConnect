const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
app.use(cors()); // Enable CORS for all requests

// Proxy route: /proxy?target=host:port&path=/api/endpoint
app.use('/proxy', (req, res, next) => {
  const target = req.query.target;
  const path = req.query.path;

  if (!target || !path) {
    return res.status(400).send('Missing target or path parameter');
  }

  return createProxyMiddleware({
    target: `http://${target}`,
    changeOrigin: true,
    pathRewrite: () => path,
  })(req, res, next);
});

// Use dynamic port for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Proxy server running at http://localhost:${PORT}`);
});
