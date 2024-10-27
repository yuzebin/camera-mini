Page({
  data: {
    cameras: []
  },

  onLoad() {
    this.fetchCameras();
  },

  onPullDownRefresh() {
    this.fetchCameras();
  },

  fetchCameras() {
    const token = wx.getStorageSync('token');
    
    wx.request({
      url: 'http://localhost:3000/cameras',
      method: 'GET',
      header: {
        'Authorization': `Bearer ${token}`
      },
      success: (res) => {
        if (res.data.success) {
          this.setData({
            cameras: res.data.cameras
          });
        } else {
          wx.showToast({
            title: res.data.message || '获取摄像头列表失败',
            icon: 'none'
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        });
      },
      complete: () => {
        wx.stopPullDownRefresh();
      }
    });
  },

  viewStream(e) {
    const cameraId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/stream/stream?id=${cameraId}`
    });
  }
});