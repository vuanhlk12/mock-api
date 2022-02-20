const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(
  "*",
  createProxyMiddleware({
    target: "https://gate.dev.tripi.vn/",
    changeOrigin: true,
  })
);
app.listen(3000, () => console.log("Example app is listening on port 3000."));
