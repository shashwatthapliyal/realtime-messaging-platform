const mongoose = require('mongoose')

async function connectDB() {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/chatApp'

    try {
        await mongoose.connect(mongoURI)
        return mongoose.connection
    }
    catch (err) {
        console.error('Cant connect to DB')
        throw err
    }
}

module.exports = { connectDB }
