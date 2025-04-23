const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
app.use(cors()); // Enable all CORS requests

// Matches: /proxy/<any-path>?target=host:port
app.use('/proxy', (req, res, next) => {
  const target = req.query.target;
  if (!target) return res.status(400).send('Missing target parameter');

  const proxy = createProxyMiddleware({
    target: `http://${target}`,
    changeOrigin: true,
    pathRewrite: (path, req) => {
      // Remove `/proxy` from path
      return path.replace(/^\/proxy/, '');
    },
  });

  return proxy(req, res, next);
});

// Use dynamic port for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Proxy server running at http://localhost:${PORT}`);
});
