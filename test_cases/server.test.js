const request = require('supertest');
const server = require('../server');

describe('GET /api', () => {
  it('should return 200', async () => {
    const res = await request(server).get('/');

    expect(res.status).toBe(200);
    expect(res.text).toBe('Vention Quest');
  });

  it('should handle /weapon', async () => {
    const res = await request(server).get('/api/weapon');

    expect(res.status).toBe(200);
  });

  it('should handle /material', async () => {
    const res = await request(server).get('/api/material');

    expect(res.status).toBe(200);
  });

});