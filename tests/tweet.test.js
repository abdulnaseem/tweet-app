const request = require('supertest')
const app = require('../src/app')
const Post = require('../src/models/PostSchema')
const { userOneId, userOne, setDatabase } = require('./fixtures/db')

beforeEach(setDatabase)

test('Should create a tweet for user', async () => {
    const response = await request(app)
        .post('/api/v1.0/tweets/jaher98/add')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            content: 'Cant wait for tomorrows footy'
        })
        .expect(201)
})

test('Should not create tweet if content is above 144 characters', async () => {
    const response = await request(app)
        .post('/api/v1.0/tweets/jaher98/add')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            content: 'This year, on June 4, millions of people across the United States will hit the trail, any trail, to celebrate the 30th annual American Hiking Society’s National Trails Day. I'
        })
        .expect(404)
})

test('Should update a tweet for user', async () => {
    const response = await request(app)
        .put('/api/v1.0/tweets/jaher98/update/62d6e17f095394563bda1c3c')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            content: 'Why is it so hot today! I need some cold breeze.'
        })
        .expect(200)
})

//for the endpoint change the id .../delete/[id] according to the new tweet created
/* 
test('Should delete a tweet for user', async () => {
    const response = await request(app)
        .delete('/api/v1.0/tweets/jaher98/delete/62d6e3092a9a05f8ab950a7e')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})
*/

test('Should like a tweet for user', async () => {
    const response = await request(app)
        .put('/api/v1.0/tweets/jaher98/like/62d6e17f095394563bda1c3c')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should be able to reply to a tweet', async () => {
    const response = await request(app)
        .put('/api/v1.0/tweets/jaher98/reply/62d6e17f095394563bda1c3c')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            content: "very truee!"
        })
        .expect(201)
})

test('Should not create reply if content is above 144 characters', async () => {
    const response = await request(app)
        .put('/api/v1.0/tweets/jaher98/reply/62d6e17f095394563bda1c3c')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            content: "This year, on June 4, millions of people across the United States will hit the trail, any trail, to celebrate the 30th annual American Hiking Society’s National Trails Day. I"
        })
        .expect(400)
})
