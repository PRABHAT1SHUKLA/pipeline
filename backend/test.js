const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

const server = app.listen(3000, () => {
  console.log('✅ Test server running on  xcknxc http://localhost:3000');
});

server.on('error', (err) => {
  console.error('❌ Server error:', err);
});
