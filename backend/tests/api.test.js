const request = require('supertest');
const app = require('../server');

describe('Task Manager API', () => {
  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const res = await request(app)
        .get('/api/health')
        .expect(200);
      
      expect(res.body.status).toBe('OK');
      expect(res.body.version).toBe('1.0.0');
    });
  });

  describe('GET /api/tasks', () => {
    it('should return all tasks', async () => {
      const res = await request(app)
        .get('/api/tasks')
        .expect(200);
      
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const newTask = {
        title: 'Test Task',
        description: 'Test Description'
      };

      const res = await request(app)
        .post('/api/tasks')
        .send(newTask)
        .expect(201);
      
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe(newTask.title);
      expect(res.body.data.status).toBe('pending');
    });

    it('should fail without title', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ description: 'No title' })
        .expect(400);
      
      expect(res.body.success).toBe(false);
    });
  });
});
