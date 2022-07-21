const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/UserSchema')
const { userOneId, userOne, setDatabase } = require('./fixtures/db')

beforeEach(setDatabase)

test('Should sign up a new user', async () => {
    const response = await request(app)
        .post('/api/v1.0/tweets/register')
        .send({
            firstName: 'Steve',
            lastName: 'Brann',
            email: 'steve.brann@outlook.com',
            loginId: 'steve89',
            password: 'steve123',
            contactNumber: '07541222457'
        })
        .expect(201)

        const user = await User.findById(response.body.user._id)
        expect(user).not.toBeNull()

})

test('Should NOT sign up a user with existing email', async () => {
    await request(app)
        .post('/api/v1.0/tweets/register')
        .send({
            firstName: 'Jaher',
            lastName: 'Ahmed',
            email: 'jaher@outlook.com',
            loginId: 'jaher9888',
            password: 'jaher123',
            contactNumber: '07988554647'
        })
        .expect(400)
})

test('Should NOT sign up a user with existing loginid/username', async () => {
    await request(app)
        .post('/api/v1.0/tweets/register')
        .send({
            firstName: 'Jaher',
            lastName: 'Ahmed',
            email: 'jaher98@outlook.com',
            loginId: 'jaher98',
            password: 'jaher123',
            contactNumber: '07988554647'
        })
        .expect(400)
})

test('Should login existing user', async () => {
    await request(app)
        .post('/api/v1.0/tweets/login')
        .send({
            email: userOne.email,
            password: userOne.password
        })
        .expect(200)
})

test('Should NOT login non-existing user', async () => {
    await request(app)
        .post('/api/v1.0/tweets/login')
        .send({
            email: 'harry@outlook.com',
            password: 'harry123'
        })
        .expect(400)
})

test('Should get user profile', async () => {
    await request(app)
        .get('/api/v1.0/tweets/users/profile')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get user profile for unauthenticated user', async () => {
    await request(app)
        .get('/api/v1.0/tweets/users/profile')
        .send()
        .expect(401)
})