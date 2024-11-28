const request = require('supertest');
const app = require('../server'); 

describe('Materials API', () => {
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

  it('should update a material by ID', async () => {
    const res = await request(app)
      .put('/api/material/1')
      .send({ power_level: 30, qty: 50 });
    expect(res.statusCode).toBe(200);
    expect(res.body.updatedMaterial).toHaveProperty('power_level', 30);
    expect(res.body.updatedMaterial).toHaveProperty('qty', 50);
  });

  it('should return 400 for negative qty', async () => {
    const res = await request(app)
      .put('/api/material/1')
      .send({ power_level: 30, qty: -50 });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Power level and quantity must be positive');
  });

  it('should return 400 for negative power level', async () => {
    const res = await request(app)
      .put('/api/material/1')
      .send({ power_level: -30, qty: 50 });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Power level and quantity must be positive');
  });

  it('should return 400 for negative power level and qty', async () => {
    const res = await request(app)
      .put('/api/material/1')
      .send({ power_level: -30, qty: -50 });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Power level and quantity must be positive');
  });

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
