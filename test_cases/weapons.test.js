const request = require('supertest');
const app = require('../server');

describe(' GET /api/weapon', () => {

  it('should get all weapons', async () => {
    const res = await request(app).get('/api/weapon');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('weapons');
    expect(Array.isArray(res.body.weapons)).toBe(true);
  });

  it('should calculate max build quantity for a weapon', async () => {
    const res = await request(app).get('/api/weapon/1/maxBuildQuantity');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('maxBuildQty');
  });

  it('should return 404 for non-existent weapon id', async () => {
    const res = await request(app).get('/api/weapon/1342/maxBuildQuantity');

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Weapon with ID 1342 does not exist');
  });
  
});
