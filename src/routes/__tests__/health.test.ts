import request from 'supertest';
import { createApp } from '../../app';

// Test di ESEMPIO già funzionante: dimostra il setup Jest + supertest.
// Nel Lab 2 creerai src/routes/__tests__/products.test.ts sullo stesso modello.
describe('GET /api/health', () => {
  it('risponde 200 con status ok', async () => {
    const res = await request(createApp()).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
