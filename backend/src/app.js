const express = require('express')
const bcrypt = require('bcrypt')
const { connectDB } = require('./config/database')
const User = require('./model/user')
const validateSignUpData = require('./utils/validation')

const app = express()

app.use(express.json())

app.post('/signup', async (req, res) => {
    try {
        validateSignUpData(req)

        const { firstName, lastName, age, gender, email, password } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = new User({
            firstName,
            lastName,
            age,
            gender,
            email,
            password: hashedPassword,
        })

        await user.save()
        return res.status(201).send({ message: 'User created', userId: user._id })
    }
    catch (err) {
        return res.status(400).send(err.message)
    }
})

app.get('/feed', async (req, res) => {
    try {
        const feed = await User.find()
        return res.status(200).json(feed)
    }
    catch (err) {
        return res.status(400).send(err.message)
    }
})

app.patch('/user/:id', async (req, res) => {
    const data = req.body
    const { id } = req.params

    const allowedUpdates = ['firstName', 'lastName', 'gender']

    try {
        const isUpdateAllowed = Object.keys(data).every((key) => allowedUpdates.includes(key))

        if (!isUpdateAllowed) {
            return res.status(400).send('Update not allowed')
        }

        const user = await User.findOneAndUpdate({ _id: id }, data, { new: true, runValidators: true })

        if (!user) {
            return res.status(404).send('User not available')
        }

        return res.status(200).json(user)
    }
    catch (err) {
        return res.status(400).send(err.message)
    }
})

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            throw new Error('Email and password are required')
        }

        const user = await User.findOne({ email: String(email).toLowerCase().trim() })

        if (!user) {
            throw new Error('Invalid credentials')
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            throw new Error('Invalid credentials')
        }

        return res.status(200).send('Login successful')
    }
    catch (err) {
        return res.status(401).send(err.message)
    }
})

module.exports = { app, connectDB }

if (require.main === module) {
    connectDB()
        .then(() => {
            console.log('Connected to DB')
            app.listen(3000, () => console.log('Server is running on port 3000'))
        })
        .catch((err) => {
            console.log('Error in connecting to DB')
            console.log(err.message)
        })
}
