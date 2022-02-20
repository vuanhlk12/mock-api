var express = require("express");
var app = (module.exports = express());
const cors = require("cors");

var proxy = require("http-proxy").createProxyServer({
  host: "https://gate.dev.tripi.vn/",
  // port: 80
});
app.use(cors());
app.use("*", function (req, res, next) {
  console.log("req", req);
  proxy.web(req, res, {
    target: "https://gate.dev.tripi.vn/",
    changeOrigin: true,
  });
});

app.listen(8000, function () {
  console.log("Listening!");
});
