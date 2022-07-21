const mongoose = require('mongoose')
const validator = require('validator')

const PostSchema = new mongoose.Schema({
    createdBy: {
        type: String,
        required: true,
        ref: 'User'
    },
    content: {
        type: String,
        required: true,
        trim: true,
        maxLength: 144
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    replyTo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reply'
    }]
},  {
        timestamps: true
})

const Post = mongoose.model('Post', PostSchema)

module.exports = Post