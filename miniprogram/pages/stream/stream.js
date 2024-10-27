Page({
  data: {
    cameraId: '',
    streamUrl: '',
    cameraInfo: {}
  },

  onLoad(options) {
    this.setData({
      cameraId: options.id
    });
    this.fetchCameraInfo();
    this.initStream();
  },

  fetchCameraInfo() {
    const token = wx.getStorageSync('token');
    
    wx.request({
      url: `http://localhost:3000/cameras/${this.data.cameraId}`,
      method: 'GET',
      header: {
        'Authorization': `Bearer ${token}`
      },
      success: (res) => {
        if (res.data.success) {
          this.setData({
            cameraInfo: res.data.camera
          });
        } else {
          wx.showToast({
            title: res.data.message || '获取摄像头信息失败',
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
  },

  initStream() {
    const token = wx.getStorageSync('token');
    
    wx.request({
      url: `http://localhost:3000/cameras/${this.data.cameraId}/stream`,
      method: 'GET',
      header: {
        'Authorization': `Bearer ${token}`
      },
      success: (res) => {
        if (res.data.success) {
          this.setData({
            streamUrl: res.data.streamUrl
          });
        } else {
          wx.showToast({
            title: res.data.message || '获取视频流失败',
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
  },

  statechange(e) {
    console.log('播放状态变化:', e.detail.code);
  },

  error(e) {
    console.error('播放错误:', e.detail.errMsg);
    wx.showToast({
      title: '视频播放出错',
      icon: 'none'
    });
  },

  handleFullScreen() {
    const player = wx.createLivePlayerContext('player');
    player.requestFullScreen({
      direction: 90
    });
  },

  handleSnapshot() {
    const player = wx.createLivePlayerContext('player');
    player.snapshot({
      success: (res) => {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempImagePath,
          success: () => {
            wx.showToast({
              title: '截图已保存到相册',
              icon: 'success'
            });
          },
          fail: () => {
            wx.showToast({
              title: '保存失败',
              icon: 'none'
            });
          }
        });
      }
    });
  },

  onUnload() {
    const player = wx.createLivePlayerContext('player');
    player.stop();
  }
});