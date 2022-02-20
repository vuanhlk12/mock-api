//const api = require("./axios");
//--inpect
const express = require("express");
const bodyParser = require("body-parser");
const Qs = require("qs");
const CryptoJS = require("crypto-js");
const axios = require("axios");
const cors = require("cors");

const proxy = require("http-proxy").createProxyServer({
  host: "https://gate.dev.tripi.vn/",
  // port: 80
});

let CONFIG_SERVER = {
  NEXT_PUBLIC_DOMAIN_GATE: "https://gate.dev.tripi.vn",
  NEXT_PUBLIC_DOMAIN_BACKEND_CORE_ASSES_UPLOAD: "https://assets.dev.tripi.vn",
  NEXT_PUBLIC_HASH_KEY: "kasdhasdhakdjkad",
  NEXT_PUBLIC_APP_ID: "food-merchant-web",
  gg_plus_id:
    "701699179758-9tb2gjluvjnu2m218tka373fv62cq8rq.apps.googleusercontent.com",
};

const getAppHash = () => {
  let timeStamp = new Date().getTime();
  timeStamp = timeStamp / 1000 - ((timeStamp / 1000) % 300);
  let str = `${timeStamp}:${CONFIG_SERVER.NEXT_PUBLIC_HASH_KEY}`;
  const hash = CryptoJS.SHA256(str);
  const hashStr = CryptoJS.enc.Base64.stringify(hash);
  return hashStr;
};

const request = axios.create();

let temp = 0;

const api = (options = {}) => {
  const { headers, path, body, method, query } = options;
  const rq = {
    baseURL: "https://gate.dev.tripi.vn/",
    method,
    url: path,
    data: body,
    params: query,
    serVice: "FOOD_SERVICE",
    headers: {
      "login-token": headers?.["login-token"] || null,
      caId: headers?.caid || 30,
      "device-id":
        headers?.["device-id"] || "1640833059904-0.26689283839493694",
      deviceInfo: "PC-Web",
      lang: "vi",
      "Accept-Language": "vi",
      platform: "website",
      appId: headers?.appid ?? "food-merchant-web",
      appHash: headers?.apphash ?? getAppHash(),
      version: "1.0",
    },
    paramsSerializer: (params) =>
      Qs.stringify(params, { arrayFormat: "repeat" }),
  };
  console.log("connect " + temp++, options, rq);
  return request(rq);
};

const app = express();
app.options("*", cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get("*", cors(), async (req, res) => {
  const { headers, path, body, query } = req;
  try {
    const response = await api({ headers, path, body, query, method: "get" });
    res.send(response.data);
  } catch (e) {
    res.send("error response." + req);
  }
});

app.post("*", cors(), async (req, res) => {
  const { headers, path, body, query } = req;
  try {
    // res.json({ abc: headers });
    const response = await api({ headers, path, body, query, method: "post" });
    res.json(response.data);
  } catch (e) {
    res.json("error response." + req);
  }
});

app.put("*", async (req, res) => {
  const { headers, path, body, query } = req;
  try {
    const response = await api({ headers, path, body, query, method: "put" });
    res.send(response.data);
  } catch (e) {
    res.send("error response." + req);
  }
});

app.delete("*", async (req, res) => {
  const { headers, path, body, query } = req;
  try {
    const response = await api({
      headers,
      path,
      body,
      query,
      method: "delete",
    });
    res.send(response.data);
  } catch (e) {
    res.send("error response." + req);
  }
});

app.listen(3001, () => console.log("Example app is listening on port 3001."));
