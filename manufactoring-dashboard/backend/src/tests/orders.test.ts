import request from 'supertest';
import app from '../app';

describe('Orders', () => {
  it('requires auth', async () => {
    const res = await request(app).get('/api/orders');
    expect(res.status).toBe(401);
  });
});
