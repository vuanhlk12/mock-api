//const api  from "./axios");
//--inpect
import express from "express";
import bodyParser from "body-parser";
import Qs from "qs";
import CryptoJS from "crypto-js";
import axios from "axios";
import cors from "cors";
import fetch from "node-fetch";
import https from "https";

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
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

const api2 = async (options = {}) => {
  try {
    const { headers, path, body, method, query } = options;
    const controller = new AbortController();
    const { signal } = controller;
    console.log("query", query);
    const params = !!Object.keys(query).length
      ? "?" + Qs.stringify(query, { arrayFormat: "repeat" })
      : "";
    console.log("options", options);
    const tempHeader = {
      ...{
        version: "1.0",
        deviceInfo: "HMS",
        timeStamp: "1645344095772",
        caId: "17",
      },
      "Content-Type": "application/json",
      caId: headers?.caid || 30,
      "device-id":
        headers?.["device-id"] || "1640833059904-0.26689283839493694",
      lang: "vi",
      "Accept-Language": "vi",
      platform: "website",
      appId: headers?.appid ?? "food-merchant-web",
      appHash: headers?.apphash ?? getAppHash(),
      version: "1.0",
    };
    if (headers?.["login-token"])
      tempHeader["login-token"] = headers?.["login-token"] || null;
    const rq = {
      method,
      headers: tempHeader,
      // signal,
      cache: "no-store",
      agent: httpsAgent,
      signal,
    };
    if (method !== "get") rq.body = JSON.stringify(body);
    let res = await fetch("https://gate.dev.tripi.vn" + path + params, rq);
    const result = await res.json();
    console.log("result", JSON.stringify(result));
    return { ...result, header: rq.headers };
  } catch (e) {
    console.log("errer", e);
    return e;
  }
};

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
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get("*", async (req, res) => {
  const { headers, path, body, query } = req;
  try {
    const response = await api2({ headers, path, body, query, method: "get" });
    res.send(response);
  } catch (e) {
    res.send("error response." + req);
  }
});

app.post("*", async (req, res) => {
  const { headers, path, body, query } = req;
  try {
    const response = await api2({ headers, path, body, query, method: "post" });
    console.log("response", response);
    res.send(response);
  } catch (e) {
    res.send("error response." + req);
  }
});

app.put("*", async (req, res) => {
  const { headers, path, body, query } = req;
  try {
    const response = await api2({ headers, path, body, query, method: "put" });
    res.send(response);
  } catch (e) {
    res.send("error response." + req);
  }
});

app.delete("*", async (req, res) => {
  const { headers, path, body, query } = req;
  try {
    const response = await api2({
      headers,
      path,
      body,
      query,
      method: "delete",
    });
    res.send(response);
  } catch (e) {
    res.send("error response." + req);
  }
});

app.listen(3000, () => console.log("Example app is listening on port 3001."));
