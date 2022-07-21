const express = require('express')
const User = require('../models/UserSchema')
const router = new express.Router()
const auth = require('../middleware/auth')
const producerRun = require('../../kafka/kafka-producer')
const startConsumer = require('../../kafka/kafka-consumer')

router.post('/api/v1.0/tweets/register', async (req, res) => {
    const user = new User(req.body)

    try {
        producerRun(user).then(() => {
            startConsumer()
        })

        await user.save()
        const token = user.generateAuthToken() 
 
        res.status(201).send({ user })

    } catch(e) {
        res.status(400).send(e)
    }
})

router.post('/api/v1.0/tweets/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()

        producerRun({user, token}).then(() => {
            startConsumer()
        })

        res.send({ user, token })
    } catch(e) {
        res.status(400).send()
    }
})

router.post('/api/v1.0/tweets/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        await req.user.save()

        res.send()
    } catch(e) {
        res.status(500).send()
    }
})

router.post('/api/v1.0/tweets/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()

        res.send()
    } catch(e) {
        res.status(500).send()
    }
})



router.get('/api/v1.0/tweets/users/all', auth, async (req, res) => {
    try {
        const users = await User.find({})

        producerRun(users).then(() => {
            startConsumer()
        })

        res.send(users)
    } catch(e) {
        res.status(500).send()
    }
})

router.get('/api/v1.0/tweets/users/profile', auth, async (req, res) => {
    res.send(req.user)
})

router.get('/api/v/1.0/tweets/user/search/:username', auth, async (req, res) => {
    const loginId = req.params.username
    
    try {
        const user = await User.findOne({ loginId }, 
            {_id:0, password:0, tokens:0, createdAt:0, updatedAt:0, __v:0})

        if(!user) {
            return res.status(404).send()
        }

        producerRun(user).then(() => {
            startConsumer()
        })
        
        res.send(user)
    } catch(e) {
        res.status(500).send()
    }
})

router.patch('/api/v1.0/tweets/:username/forgot', auth, async (req, res) => {
    const loginId = req.params.username

    const password = req.body.password
    try {
        
        if(loginId !== req.user.loginId) {
            throw new Error()
        }

        const user = await User.findOneAndUpdate({loginId}, {password})
        await user.save()
        console.log(user)

        res.send({user})
    } catch(e) {
        res.status(500).send()
    }
})

module.exports = router