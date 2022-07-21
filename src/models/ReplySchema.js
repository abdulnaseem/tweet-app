const mongoose = require('mongoose')

const ReplySchema = new mongoose.Schema({
    tweetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tweet'
    },
    repliedBy: {
        type: String,
        required: true,
        ref: 'User'
    },
    content: {
        type: String,
        required: true,
        trim: true,
        maxLength: 144
    }

})

const Reply = mongoose.model('Reply', ReplySchema)

module.exports = Reply