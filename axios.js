const Qs = require("qs");
const axios = require("axios");

const request = axios.create();

const api = (options = {}) => {
  console.log("optiones", options);
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
module.exports = api;
