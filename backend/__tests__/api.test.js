const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const User = require('../models/User');
const Mosque = require('../models/Mosque');

// Use test database
process.env.MONGODB_URI = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/mosque-timing-test';
process.env.JWT_SECRET = 'test-secret-key';

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

afterEach(async () => {
    await User.deleteMany({});
    await Mosque.deleteMany({});
});

describe('Authentication Routes', () => {
    describe('POST /api/auth/register-imam', () => {
        it('should register a new imam with mosque', async () => {
            const response = await request(app)
                .post('/api/auth/register-imam')
                .send({
                    email: 'imam@test.com',
                    password: 'password123',
                    mosqueName: 'Test Mosque',
                    mosqueAddress: '123 Test St',
                    imamName: 'Imam Test'
                });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.token).toBeDefined();
            expect(response.body.user.email).toBe('imam@test.com');
            expect(response.body.user.role).toBe('imam');
            expect(response.body.mosque.name).toBe('Test Mosque');
        });

        it('should reject duplicate email', async () => {
            await User.create({
                email: 'imam@test.com',
                password: 'password123',
                role: 'imam'
            });

            const response = await request(app)
                .post('/api/auth/register-imam')
                .send({
                    email: 'imam@test.com',
                    password: 'password123',
                    mosqueName: 'Test Mosque',
                    mosqueAddress: '123 Test St',
                    imamName: 'Imam Test'
                });

            expect(response.status).toBe(409);
            expect(response.body.error).toBe('Email already registered');
        });

        it('should validate required fields', async () => {
            const response = await request(app)
                .post('/api/auth/register-imam')
                .send({
                    email: 'invalid-email',
                    password: '123'
                });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Validation failed');
        });
    });

    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            const user = await User.create({
                email: 'imam@test.com',
                password: 'password123',
                role: 'imam'
            });

            await Mosque.create({
                name: 'Test Mosque',
                address: '123 Test St',
                imamName: 'Imam Test',
                imamId: user._id,
                timings: {
                    fajr: '05:00 AM',
                    dhuhr: '01:00 PM',
                    asr: '04:30 PM',
                    maghrib: '06:00 PM',
                    isha: '08:00 PM',
                    jummah: '01:30 PM'
                }
            });
        });

        it('should login successfully', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'imam@test.com',
                    password: 'password123'
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.token).toBeDefined();
            expect(response.body.mosque).toBeDefined();
        });

        it('should reject invalid credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'imam@test.com',
                    password: 'wrongpassword'
                });

            expect(response.status).toBe(401);
            expect(response.body.error).toBe('Invalid credentials');
        });
    });
});

describe('Mosque Routes', () => {
    let token;
    let mosqueId;
    let userId;

    beforeEach(async () => {
        const user = await User.create({
            email: 'imam@test.com',
            password: 'password123',
            role: 'imam'
        });
        userId = user._id;

        const mosque = await Mosque.create({
            name: 'Test Mosque',
            address: '123 Test St',
            imamName: 'Imam Test',
            imamId: userId,
            timings: {
                fajr: '05:00 AM',
                dhuhr: '01:00 PM',
                asr: '04:30 PM',
                maghrib: '06:00 PM',
                isha: '08:00 PM',
                jummah: '01:30 PM'
            }
        });
        mosqueId = mosque._id;

        const jwt = require('jsonwebtoken');
        token = jwt.sign(
            { userId, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
    });

    describe('GET /api/mosques', () => {
        it('should get all mosques', async () => {
            const response = await request(app)
                .get('/api/mosques');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.mosques).toHaveLength(1);
        });
    });

    describe('PUT /api/mosques/:id/timings', () => {
        it('should update timings with valid token', async () => {
            const response = await request(app)
                .put(`/api/mosques/${mosqueId}/timings`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    timings: {
                        fajr: '05:30 AM',
                        dhuhr: '01:15 PM',
                        asr: '04:45 PM',
                        maghrib: '06:15 PM',
                        isha: '08:15 PM',
                        jummah: '01:45 PM'
                    }
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.mosque.timings.fajr).toBe('05:30 AM');
        });

        it('should reject without authentication', async () => {
            const response = await request(app)
                .put(`/api/mosques/${mosqueId}/timings`)
                .send({
                    timings: {
                        fajr: '05:30 AM',
                        dhuhr: '01:15 PM',
                        asr: '04:45 PM',
                        maghrib: '06:15 PM',
                        isha: '08:15 PM',
                        jummah: '01:45 PM'
                    }
                });

            expect(response.status).toBe(401);
        });
    });
});
