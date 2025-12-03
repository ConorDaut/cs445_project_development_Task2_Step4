import request from 'supertest';
import app from '../app';

describe('Auth', () => {
  it('rejects invalid register', async () => {
    const res = await request(app).post('/api/auth/register').send({});
    expect(res.status).toBe(400);
  });
});
