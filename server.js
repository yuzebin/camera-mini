const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'your-secret-key';

app.use(cors());
app.use(express.json());

// Mock data
const users = [
  { id: 1, username: 'admin', password: '123456' }
];

const cameras = [
  {
    id: 1,
    name: '前门摄像头',
    status: 'online',
    preview: 'https://picsum.photos/400/300',
    streamUrl: 'rtmp://live.example.com/stream1'
  },
  {
    id: 2,
    name: '后门摄像头',
    status: 'offline',
    preview: 'https://picsum.photos/400/301',
    streamUrl: 'rtmp://live.example.com/stream2'
  },
  {
    id: 3,
    name: '车库摄像头',
    status: 'online',
    preview: 'https://picsum.photos/400/302',
    streamUrl: 'rtmp://live.example.com/stream3'
  }
];

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.json({ success: false, message: '用户名或密码错误' });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
  res.json({
    success: true,
    token,
    userInfo: { id: user.id, username: user.username }
  });
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, message: '未授权' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'token无效' });
  }
};

// Get cameras list
app.get('/cameras', verifyToken, (req, res) => {
  res.json({ success: true, cameras });
});

// Get single camera
app.get('/cameras/:id', verifyToken, (req, res) => {
  const camera = cameras.find(c => c.id === parseInt(req.params.id));
  if (!camera) {
    return res.json({ success: false, message: '摄像头不存在' });
  }
  res.json({ success: true, camera });
});

// Get camera stream
app.get('/cameras/:id/stream', verifyToken, (req, res) => {
  const camera = cameras.find(c => c.id === parseInt(req.params.id));
  if (!camera) {
    return res.json({ success: false, message: '摄像头不存在' });
  }
  res.json({ success: true, streamUrl: camera.streamUrl });
});

app.listen(PORT, () => {
  console.log(`Mock server running on port ${PORT}`);
});