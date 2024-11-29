const request = require('supertest');
const app = require('../server'); 
const dbConfig = require('../config/dbConfig');

describe('GET /api/material/', () => {

  it('should get all materials', async () => {
    const res = await request(app).get('/api/material');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('materials');
    expect(Array.isArray(res.body.materials)).toBe(true);
  });

  it('should return a material by ID', async () => {
    const res = await request(app).get('/api/material/1');

    expect(res.statusCode).toBe(200);
    expect(res.body.material).toHaveProperty('id', 1);
  });

  it('should return 404 for a non-existent material ID', async () => {
    const res = await request(app).get('/api/material/9999');

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message');
  });
});

describe('PUT /api/material/', () => {
  
  it('should update a material by ID', async () => {
    const payload = { power_level: 30, qty: 50 }

    const res = await request(app).put('/api/material/1').send(payload);

    expect(res.statusCode).toBe(200);
    expect(res.body.updatedMaterial).toHaveProperty('power_level', 30);
    expect(res.body.updatedMaterial).toHaveProperty('qty', 50);
  });

  it('should return 404 for non-existent id ', async () => {
    const payload = { power_level: 30, qty: 50 }

    const res = await request(app).put('/api/material/193').send(payload);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Material with ID 193 does not exist');
  });

  it('should return 400 for negative qty', async () => {
    const payload = { power_level: 30, qty: -50 };

    const res = await request(app).put('/api/material/1').send(payload);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Power level and quantity must be positive');
  });

  it('should return 400 for negative power level', async () => {
    const payload = { power_level: -30, qty: 50 };

    const res = await request(app).put('/api/material/1').send(payload);
  
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Power level and quantity must be positive');
  });

  it('should return 400 for negative power level and qty', async () => {
    const payload = { power_level: -30, qty: -50 };

    const res = await request(app).put('/api/material/1').send(payload);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Power level and quantity must be positive');
  });

});

describe('DELETE /api/material/', () => {

  it('should delete a material by ID', async () => {
    const res = await request(app).delete('/api/material/1');

    expect(res.statusCode).toBe(200);
    expect(res.body.deletedMaterials[0]).toHaveProperty('id', 1);
  });

  it('should return 404 for non-existent id', async () => {
    const res = await request(app).delete('/api/material/13434');

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Material with ID 13434 does not exist');
  });

});