const express = require('express')
require('./db/mongoose')
const userRouter = require('./router/user')
const postRouter = require('./router/post')


const app = express()

app.use(express.json())
app.use(userRouter)
app.use(postRouter)

module.exports = app

