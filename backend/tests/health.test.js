const express = require('express');
const request = require('supertest');
const healthRoutes = require('../routes/Health.routes');

const app = express();
app.use('/health', healthRoutes);

describe('Health Routes', () => {
  it('GET /health should return some status and contain memory and system checks', async () => {
    const res = await request(app).get('/health');
    // Mongoose isn't connected so we might get 503 instead of 200, which is fine for this test.
    // What we care is the route doesn't crash and returns valid checks object.
    expect([200, 503]).toContain(res.status);
    expect(res.body.checks).toHaveProperty('memory');
    expect(res.body.checks).toHaveProperty('system');
  });
});
