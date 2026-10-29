const bcrypt = require('bcrypt')
const express = require('express')

const jwt = require('jsonwebtoken')
const User = require('../model/user')
const validateSignUpData = require('../utils/validation')
const userAuth = require('../middleware/auth')
const router = express.Router()

router.post('/signup', async (req, res) => {
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

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            throw new Error('Email and password are required')
        }
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not configured')
        }

        const user = await User.findOne({ email: String(email).toLowerCase().trim() })

        if (!user) {
            throw new Error('Invalid credentials')
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            throw new Error('Invalid credentials')
        }
        else {
            const token = jwt.sign(
                { _id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            )
            res.cookie("token", token, {
                httpOnly: true,
                sameSite: "lax",
                maxAge: 24 * 60 * 60 * 1000
            })


            // console.log(JSON.stringify(req.cookies))
            return res.json({
                message: "Login successful",
                user: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    gender: user.gender,
                    age: user.age,
                    email: user.email
                }
            }
            )
        }

    }
    catch (err) {
        return res.status(401).send(err.message)
    }
})

router.post('/logout', (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "lax"
        })
        res.send("Logged out ......")
    }
    catch {
        res.status(400).send("Logout failed .....")
    }
})
module.exports = router