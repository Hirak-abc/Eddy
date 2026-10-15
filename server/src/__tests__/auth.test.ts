import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app';

describe('Authentication & Authorization Middleware', () => {
  it('should return 401 when authorization header is missing', async () => {
    const response = await request(app).get('/api/identity/me');
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('UNAUTHORIZED');
  });

  it('should return 401 when authorization header has invalid token', async () => {
    const response = await request(app)
      .get('/api/identity/me')
      .set('Authorization', 'Bearer invalid_token_xyz');
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('UNAUTHORIZED');
  });
});
