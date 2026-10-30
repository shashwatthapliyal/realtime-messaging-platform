
const User = require('../model/user')
const jwt = require("jsonwebtoken")

const socketAuth = async (socket, next) => {
    try {
        const token = socket.request.cookies?.token
        if (!token) return next(new Error("Unauthorized"))

        const { _id } = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(_id)
        if (!user) return next(new Error('Unauthorized'))
        socket.data._id = _id
        socket.data.firstName = user.firstName

        next()

    }
    catch {
        next(new Error("Unauthorized"))
    }

}

module.exports = socketAuth