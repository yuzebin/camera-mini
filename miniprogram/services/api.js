const config = require('../config');
const request = require('../utils/request');

const api = {
  login(username, password) {
    return request.post(`${config.apiBaseUrl}/login`, {
      username,
      password
    });
  },

  getCameras() {
    return request.get(`${config.apiBaseUrl}/cameras`);
  },

  getCameraById(id) {
    return request.get(`${config.apiBaseUrl}/cameras/${id}`);
  },

  getCameraStream(id) {
    return request.get(`${config.apiBaseUrl}/cameras/${id}/stream`);
  }
};

module.exports = api;