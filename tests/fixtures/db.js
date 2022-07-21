const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/UserSchema')

const userOneId = new mongoose.Types.ObjectId()

const userOne = {
    _id: userOneId,
    firstName: 'Jaher',
    lastName: 'Ahmed',
    email: 'jaher@outlook.com',
    loginId: 'jaher98',
    password: 'jaher123',
    contactNumber: '07988554647',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

const setDatabase = async () => {
    await User.deleteMany()
    await new User(userOne).save()
}

module.exports = {
    userOneId,
    userOne,
    setDatabase
}