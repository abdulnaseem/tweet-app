const mongoose = require('mongoose')

// mongoose.connect(('mongodb+srv://naseem123:naseem123@tweet-database.cuemnre.mongodb.net/?retryWrites=true&w=majority'), {
//     useNewurlParser: true
// })

mongoose.connect((process.env.MONGODB_URL), {
    useNewurlParser: true
})