const toast = {
  success(title) {
    wx.showToast({
      title,
      icon: 'success'
    });
  },

  error(title) {
    wx.showToast({
      title,
      icon: 'none'
    });
  }
};

module.exports = toast;