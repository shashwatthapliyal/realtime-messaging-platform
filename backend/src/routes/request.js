
const ConnectionRequest = require("../model/connection")
const User = require("../model/user")
const userAuth = require('../middleware/auth')
const express = require('express')
const router = express.Router()


const app = express()


router.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id
        const { status, toUserId } = req.params

        const toUser = await User.findById(toUserId)
        if (!toUser) throw new Error("User Dont exist")

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId: toUser._id,
            status,
        })


        const data = await connectionRequest.save()
        res.json({
            message: "Connection request sent successfully",
            data
        })

    }
    catch (err) {
        console.error(err);
        res.status(400).send("ERROR: " + err.message);
    }

})

router.get("/user/request/recieved",userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user

        const recievedRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        })
        .populate("fromUserId","firstName lastName age gender")
        res.json(recievedRequests)
    }
    catch (err) {
        res.status(400).send("ERRRRR",err.message)
    }
})

module.exports = router