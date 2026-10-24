const mongoose = require('mongoose')

function validateGender(gender) {
    return ['male', 'female', 'others'].includes(gender)
}

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    lastName: {
        type: String,
        trim: true,
        lowercase: true,
    },
    age: {
        type: Number,
    },
    gender: {
        type: String,
        validate: {
            validator: validateGender,
            message: 'Invalid Gender',
        },
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
})

userSchema.methods.createJWT = async function () {
    const token = jwt.sign(
        { _id: this._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )
    return token
}


const User = mongoose.model('User', userSchema)

module.exports = User
