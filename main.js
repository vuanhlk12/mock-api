//const api = require("./axios");

const express = require("express");
const bodyParser = require("body-parser");
const Qs = require("qs");
const axios = require("axios");

const request = axios.create();
const api = (options = {}) => {
  console.log("optiones", {
    baseURL: "http://gate.dev.tripi.vn/food-merchant",
    ...options,
    paramsSerializer: (params) =>
      Qs.stringify(params, { arrayFormat: "repeat" }),
    headers: {
      ...options.headers,
    },
  });
  return request({
    baseURL: "http://gate.dev.tripi.vn/food-merchant",
    ...options,
    paramsSerializer: (params) =>
      Qs.stringify(params, { arrayFormat: "repeat" }),
    headers: {
      ...options.headers,
    },
  });
};
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get("*", async (req, res) => {
  const options = {
    method: "get",
    headers: {
      ...req.headers,
      "Accept-Language": "vi",
      caId: 30,
      lang:'vi',
      "device-id": "1638954697250-0.5875880284947199",
    },
    url: req.path,
    data: req.body,
    serVice: "FOOD_SERVICE",
  };
  try {
    const response = await api(options);
    res.send("Successful response." + JSON.stringify(response));
  } catch (e) {
    res.send("fail response." + JSON.stringify(e));
  }
});

app.post("*", async (req, res) => {
  console.log("header", req.headers);
  console.log("path", req.path);
  console.log("req", req.body);
  const options = {
    method: "post",
    headers: req.headers,
    url: req.path,
    data: req.body,
  };
  try {
    const response = await api(options);
    console.log("response", response);
  } catch (e) {
    console.log("error", e);
  }
  res.send("Successful response." + req);
});

app.listen(3000, () => console.log("Example app is listening on port 3000."));
