const mongoose = require('mongoose')
const path = require('path')
// require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

async function connectDB() {
    const mongoURI = process.env.MONGODB_URI

    if (!mongoURI) {
        throw new Error('MONGODB_URI is not configured')
    }

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
