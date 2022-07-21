const express = require('express')
const User = require('../models/UserSchema')
const Post = require('../models/PostSchema')
const Reply = require('../models/ReplySchema')
const router = new express.Router()
const auth = require('../middleware/auth')
const producerRun = require('../../kafka/kafka-producer')
const startConsumer = require('../../kafka/kafka-consumer')


router.post('/api/v1.0/tweets/:username/add', auth, async (req, res) => {

    try {
        if(req.params.username !== req.user.loginId) {
            throw new Error('Error', 'Username does not exist!')
        }
    
        const tweet = new Post({
            createdBy: req.params.username,
            ...req.body,
            owner: req.user.id
        }) 

        producerRun(tweet).then(() => {
            startConsumer()
        })

        await tweet.save()
        res.status(201).send(tweet)
    } catch(e) {
        res.status(404).send(e)
    }
})

router.get('/api/v1.0/tweets/all', auth, async (req, res) => {
    try {
        const tweets = await Post.find({}, {__v:0})

        producerRun(tweets).then(() => {
            startConsumer()
        })

        res.send(tweets)
    } catch(e) {
        res.status(500).send()
    }
})

router.get('/api/v1.0/tweets/:username', auth, async (req, res) => {
    try {
        const tweet = await Post.find({ createdBy: req.params.username })

        if(!tweet) {
            res.status(404).send()
        }

        producerRun(tweet).then(() => {
            startConsumer()
        })

        res.send(tweet)
    } catch(e) {
        res.status(500).send()
    }
})

router.put('/api/v1.0/tweets/:username/update/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['content']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const tweet = await Post.findOne({ _id:req.params.id })

        if (!tweet) {
            return res.status(404).send()
        }

        updates.forEach((update) => tweet[update] = req.body[update])
        await tweet.save()

        producerRun(tweet).then(() => {
            startConsumer()
        })

        res.send(tweet)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/api/v1.0/tweets/:username/delete/:id', auth, async (req, res) => {
    try {
        const tweet = await Post.findOneAndDelete({ _id: req.params.id, createdBy: req.params.username })

        if(!tweet){
            res.status(404).send()
        }

        producerRun(tweet).then(() => {
            startConsumer()
        })

        res.send(tweet)
    } catch(e) {
        res.status(500).send()
    }
})

router.put('/api/v1.0/tweets/:username/like/:id', auth, async (req, res) => {
    const _username = req.params.username
    const _postId = req.params.id
    const _id = req.user.id

    const isLiked = req.user.likes && req.user.likes.includes(_postId);

    const option = isLiked ? "$pull" : "$addToSet";

    // Insert user like
    req.user = await User.findByIdAndUpdate(_id, { [option]: { likes: _postId } }, { new: true})
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })

    // Insert post like
    const post = await Post.findByIdAndUpdate(_postId, { [option]: { likes: _id } }, { new: true})
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })

    producerRun(post).then(() => {
        startConsumer()
    })

    res.status(200).send(post)

})


router.put('/api/v1.0/tweets/:username/reply/:id', auth, async (req, res) => {
    const _username = req.params.username
    const _postParamsId = req.params.id 

    try {

        const user = await User.findOne({ loginId: _username })

        if(!user) {
            throw new Error()
        }

        const _postId = await Post.findOne({ _id: _postParamsId })
    
        if(!_postId) {
            return res.status(404).send()
        }
        const tweet = new Reply({
            postId: _postId,
            repliedBy: _username,
            ...req.body
        })

        await tweet.save()

        const post = await Post.findByIdAndUpdate({_id:req.params.id }, {replyTo: tweet})
        
        producerRun(post).then(() => {
            startConsumer()
        })

        res.status(201).send(post)
    } catch(e) {
        res.status(400).send(e)
    }

})

module.exports = router
