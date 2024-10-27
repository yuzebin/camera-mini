const request = {
  async request(url, options = {}) {
    const token = wx.getStorageSync('token');
    const header = {
      'Content-Type': 'application/json',
      ...options.header
    };

    if (token) {
      header.Authorization = `Bearer ${token}`;
    }

    return new Promise((resolve, reject) => {
      wx.request({
        url,
        ...options,
        header,
        success: (res) => {
          if (res.statusCode === 401) {
            wx.removeStorageSync('token');
            wx.removeStorageSync('userInfo');
            wx.reLaunch({
              url: '/pages/login/login'
            });
            reject(new Error('未授权'));
            return;
          }
          resolve(res.data);
        },
        fail: (error) => {
          reject(error);
        }
      });
    });
  },

  get(url, options = {}) {
    return this.request(url, { ...options, method: 'GET' });
  },

  post(url, data, options = {}) {
    return this.request(url, { ...options, method: 'POST', data });
  }
};

module.exports = request;