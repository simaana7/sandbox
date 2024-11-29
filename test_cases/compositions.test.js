const request = require('supertest');
const app = require('../server');
const dbConfig = require('../config/dbConfig');

describe('POST /api/material/:parentId/composition', () => {

    it('should create a new composition', async () => {
      const payload = { material_id: 3, qty: 5 };

      const res = await request(app).post('/api/material/1/composition').send(payload);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('newComposition');
      expect(res.body.newComposition).toHaveProperty('parent_id', 1);
      expect(res.body.newComposition).toHaveProperty('material_id', 3);
      expect(res.body.newComposition).toHaveProperty('qty', 5);
    });
    
    it('should return 400 if parentId is equal to material_id', async () => {
      const payload = { material_id: 1, qty: 5 };

      const res = await request(app).post('/api/material/1/composition').send(payload);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message', 'Cannot set the composition of a material to itself');
    });
  
    it('should return 400 if qty is negative', async () => {
      const payload = { material_id: 2, qty: -5 };

      const res = await request(app).post('/api/material/1/composition').send(payload);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message', 'the quantity must be a positive value');
    });

    it('should return 400 if material_id and qty are negative', async () => {
      const payload = { material_id: -2, qty: -5 };

      const res = await request(app).post('/api/material/1/composition').send(payload);
      
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message', 'the quantity must be a positive value');
    });

    it('should return 400 if composition already exists', async () => {
      const payload = { material_id: 2, qty: 5 };
      // create first composition
      await request(app).post('/api/material/1/composition').send(payload);
      // try to create the same composition again
      const res = await request(app).post('/api/material/1/composition').send(payload);
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message', 'The composition with the parent_id 1 and the material_id 2 already exists');
    });

    it('should return 400 if there is a circular reference', async () => {

      const payload = { material_id: 2, qty: 5 };

      const res = await request(app).post('/api/material/3/composition').send(payload);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message', 'The composition with the parent_id 3 and the material_id 2 would cause a circular reference');
    });

  });

  describe('PUT /api/material/:parentId/composition/:materialId', () => {

    it('should update a composition', async () => {
      const payload = { material_id: 4, qty: 12 };

      const res = await request(app).put('/api/material/1/composition/3').send(payload);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('updatedComposition');
      expect(res.body.updatedComposition).toHaveProperty('qty', 12);
    });


    it('should return 400 for pre-existent composition', async () => {
      const payload = { material_id: 4, qty: 5 };

      const res = await request(app).put('/api/material/2/composition/3').send(payload);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message','The composition with the parent_id 2 and the material_id 4 already exists');
    });

    it('should return 400 if qty is negative', async () => {
      const payload = { material_id: 2, qty: -5 };

      const res = await request(app).put('/api/material/1/composition/12').send(payload);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message', 'the quantity must be a positive value');
    });

    it('should return 400 if parentId is equal to material_id', async () => {
      const payload = { material_id: 1, qty: 10 };

      const res = await request(app).put('/api/material/1/composition/1').send(payload);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message', 'Cannot set the composition of a material to itself');
    });

    it('should return 404 if composition does not exist', async () => {
      const payload = { material_id: 99, qty: 10 };

      const res = await request(app).put('/api/material/1/composition/999').send(payload);

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message', 'Composition with the parent_id 1 and the material_id 999 does not exist');
    });
  });

  describe('DELETE /api/material/:parentId/composition/:materialId', () => {
    
      it('should delete a composition', async () => {
        const res = await request(app).delete('/api/material/1/composition/4');

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('deletedComposition');
        expect(res.body.deletedComposition).toHaveProperty('material_id', 4);
      });
    
      it('should return 404 if composition does not exist', async () => {
        const res = await request(app).delete('/api/material/1/composition/999');

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('message', 'Composition with the parent_id 1 and the material_id 999 does not exist');
      });
  
  });
