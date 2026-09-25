import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app';

describe('GET /health', () => {
  it('should return 200 and status ok', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
  });
});
