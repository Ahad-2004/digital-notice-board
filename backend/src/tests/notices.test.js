const request = require('supertest');
const app = require('../testApp');

describe('Notices API', () => {
  it('creates and lists notices', async () => {
    const payload = { title: 'Test', description: 'desc', department: 'CSE', year: '3rd', expiry: new Date(Date.now()+100000).toISOString(), createdBy: 'prof@test' };
    const res = await request(app).post('/api/notices').send(payload).expect(201);
    expect(res.body.title).toBe('Test');

    const list = await request(app).get('/api/notices').expect(200);
    expect(Array.isArray(list.body)).toBe(true);
    expect(list.body.length).toBeGreaterThan(0);
  });
});
