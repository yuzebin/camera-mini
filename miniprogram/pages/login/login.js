Page({
  data: {
    username: '',
    password: ''
  },

  onUsernameInput(e) {
    this.setData({
      username: e.detail.value
    });
  },

  onPasswordInput(e) {
    this.setData({
      password: e.detail.value
    });
  },

  handleLogin() {
    const { username, password } = this.data;
    if (!username || !password) {
      wx.showToast({
        title: '请输入用户名和密码',
        icon: 'none'
      });
      return;
    }

    wx.request({
      url: 'http://localhost:3000/login',
      method: 'POST',
      data: {
        username,
        password
      },
      success: (res) => {
        if (res.data.success) {
          wx.setStorageSync('token', res.data.token);
          wx.setStorageSync('userInfo', res.data.userInfo);
          wx.reLaunch({
            url: '/pages/index/index'
          });
        } else {
          wx.showToast({
            title: res.data.message || '登录失败',
            icon: 'none'
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        });
      }
    });
  }
});