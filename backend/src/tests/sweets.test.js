const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const User = require('../models/User');
const Sweet = require('../models/Sweet'); // Added this import for direct DB checks

let mongoServer;
let adminToken;
let userToken;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  // 1. Create an Admin User
  const admin = await User.create({
    email: 'admin@test.com',
    password: 'hashedpassword',
    role: 'ADMIN'
  });
  
  // Generate Admin Token
  const jwt = require('jsonwebtoken');
  adminToken = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET || 'secret');

  // 2. Create a Normal User
  const user = await User.create({
    email: 'user@test.com',
    password: 'hashedpassword',
    role: 'USER'
  });
  
  // Generate User Token
  userToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret');
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  // Clean up Sweets collection only (keep users for tokens)
  await Sweet.deleteMany({});
});

describe('Sweets API', () => {

  // --- ADD SWEETS ---
  describe('POST /api/sweets', () => {
    it('should allow Admin to add a sweet', async () => {
      const res = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Chocolate Fudge',
          category: 'Chocolate',
          price: 5.99,
          quantity: 100
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.name).toBe('Chocolate Fudge');
    });

    it('should NOT allow normal User to add a sweet', async () => {
      const res = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Forbidden Candy',
          category: 'Candy',
          price: 2.00,
          quantity: 50
        });

      expect(res.statusCode).toEqual(403);
    });

    it('should NOT allow adding sweet without token', async () => {
      const res = await request(app)
        .post('/api/sweets')
        .send({
            name: 'Ghost Candy', 
            price: 10, 
            quantity: 10 
        });

      expect(res.statusCode).toEqual(401);
    });
  });

  // --- LIST SWEETS ---
  describe('GET /api/sweets', () => {
    it('should list all sweets for authenticated user', async () => {
        // Seed database
        await request(app)
            .post('/api/sweets')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'Sweet 1', category: 'C', price: 10, quantity: 10 });

        // Get list as normal user
        const res = await request(app)
            .get('/api/sweets')
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].name).toBe('Sweet 1');
    });
  });

  // --- PURCHASE SWEETS ---
  describe('POST /api/sweets/:id/purchase', () => {
    let sweetId;

    beforeEach(async () => {
        const res = await request(app)
            .post('/api/sweets')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'Purchase Test', category: 'Test', price: 10, quantity: 5 });
        sweetId = res.body._id;
    });

    it('should decrease quantity by 1 when purchased', async () => {
        const res = await request(app)
            .post(`/api/sweets/${sweetId}/purchase`)
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.quantity).toBe(4); // Was 5, now 4
    });

    it('should return 400 if sweet is out of stock', async () => {
        // Set quantity to 0 directly in DB
        await Sweet.findByIdAndUpdate(sweetId, { quantity: 0 });

        const res = await request(app)
            .post(`/api/sweets/${sweetId}/purchase`)
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toMatch(/out of stock/i);
    });
  });

  // --- RESTOCK SWEETS ---
  describe('POST /api/sweets/:id/restock', () => {
    let sweetId;

    beforeEach(async () => {
        const res = await request(app)
            .post('/api/sweets')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'Restock Item', category: 'Test', price: 10, quantity: 5 });
        sweetId = res.body._id;
    });

    it('should allow ADMIN to restock items', async () => {
        const res = await request(app)
            .post(`/api/sweets/${sweetId}/restock`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ quantity: 10 });

        expect(res.statusCode).toEqual(200);
        expect(res.body.quantity).toBe(15); // 5 + 10
    });

    it('should NOT allow normal USER to restock', async () => {
        const res = await request(app)
            .post(`/api/sweets/${sweetId}/restock`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({ quantity: 10 });

        expect(res.statusCode).toEqual(403);
    });

    it('should validate restock quantity is positive', async () => {
        const res = await request(app)
            .post(`/api/sweets/${sweetId}/restock`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ quantity: -5 });

        expect(res.statusCode).toEqual(400);
    });
  });

});