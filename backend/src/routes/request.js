
const ConnectionRequest = require("../model/connection")
const User = require("../model/user")
const userAuth = require('../middleware/auth')
const express = require('express')
const router = express.Router()
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";


router.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id
        const { status, toUserId } = req.params

        if (!["interested", "ignored"].includes(status)) {
            return res.status(400).send("Invalid connection request status")
        }

        const toUser = await User.findById(toUserId)
        if (!toUser) throw new Error("User Dont exist")

        const existingRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId: toUser._id },
                { fromUserId: toUser._id, toUserId: fromUserId }
            ]
        })
        if (existingRequest) {
            return res.status(400).send("Connection request already exists")
        }

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

router.get("/user/request/recieved", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user

        const recievedRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        })
            .populate("fromUserId", "firstName lastName age gender")
        res.json(recievedRequests)
    }
    catch (err) {
        res.status(400).send("ERRRRR " + err.message)
    }
})

router.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user
        const connectionRequest = await ConnectionRequest.find({
            $and: [
                {
                    $or: [
                        { toUserId: loggedInUser._id },
                        { fromUserId: loggedInUser._id }

                    ]
                },
                { status: "accepted" }
            ]
        })
        .populate("fromUserId",USER_SAFE_DATA)
        .populate("toUserId",USER_SAFE_DATA)

        const data = connectionRequest.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        })
        // console.log(data)
        res.json(
            {
                message: "Connections fetched....",
                data
            }
        )
    }
    catch (err) {
        res.status(401).send("ERR", err.message)
    }
})
module.exports = router