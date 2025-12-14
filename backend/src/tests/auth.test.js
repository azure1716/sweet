const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app'); // Will error until created

let mongoServer;

// Setup in-memory DB
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

// Cleanup
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Clear DB between tests
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

describe('Auth Endpoints', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should not register duplicate email', async () => {
    // Register first
    await request(app).post('/api/auth/register').send({
        email: 'dup@example.com',
        password: '123'
    });

    // Register second
    const res = await request(app).post('/api/auth/register').send({
        email: 'dup@example.com',
        password: '456'
    });

    expect(res.statusCode).toEqual(400);
  });
});

// ... existing register tests ...

  it('should login a registered user', async () => {
    // First, register a user
    await request(app).post('/api/auth/register').send({
        email: 'login@example.com',
        password: 'password123'
    });

    // Now try to login
    const res = await request(app).post('/api/auth/login').send({
        email: 'login@example.com',
        password: 'password123'
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should reject login with wrong password', async () => {
    await request(app).post('/api/auth/register').send({
        email: 'wrongpass@example.com',
        password: 'password123'
    });

    const res = await request(app).post('/api/auth/login').send({
        email: 'wrongpass@example.com',
        password: 'wrongpassword'
    });

    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toBe('Invalid credentials');
  });