const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Email is not valid!')
            }
        }
    },
    loginId: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        trim: true,
        validate(value) {
            if(value.toLowerCase().includes("password")) {
                throw new Error('Password cannot include password')
            }
        }
    },
    contactNumber: {
        type: Number,
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tweet'
    }],
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
},  {
    timestamps: true
})

UserSchema.virtual('tweets', {
    ref:'Tweet', 
    localField:'_id',
    foreignField:'owner'
})

UserSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({ _id:user._id.toString() }, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({ token })

    await user.save()
    return token
}

UserSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if(!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

// userSchema.virtual('passwordConfirmation')
// .get(() => this._confirmPassword)
// .set((value) => {
//     this._confirmPassword = value
// })


// userSchema.pre('validate', function(next) {
//     const user = this
//     if(user.password !== user.confirmPassword) {
//         this.invalidate('confirmPassword', 'Passwords do not match!')
//     }
//     next()
// })

UserSchema.pre('save', async function(next) {
    const user = this
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8) 
    }
    next()
})




const User = mongoose.model('User', UserSchema)

module.exports = User