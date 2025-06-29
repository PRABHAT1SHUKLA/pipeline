const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

const server = app.listen(5000, () => {
  console.log('✅ Test server running on http://localhost:5000');
});

server.on('error', (err) => {
  console.error('❌ Server error:', err);
});
