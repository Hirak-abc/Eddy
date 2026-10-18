import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app';

describe('GET /', () => {
  it('should return the API service status and health route', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: { status: 'ok', health: '/health', api: '/api' },
      error: null,
    });
  });
});

describe('GET /health', () => {
  it('should return 200 and status ok', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: { status: 'ok' },
      error: null,
    });
  });
});
