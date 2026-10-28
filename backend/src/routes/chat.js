
const mongoose=require('mongoose')
const express = require('express')
const router = express.Router()
const Chat = require('../model/chat')
const userAuth = require('../middleware/auth')

router.get("/chat/:targetUserId", userAuth, async (req, res) => {
  try {
    const { targetUserId } = req.params

    if (!mongoose.isValidObjectId(targetUserId)) {
      return res.status(400).json({ message: "Invalid target user ID" })
    }

    const chat = await Chat.findOne({
      participants: {
        $all: [req.user._id, targetUserId],
        $size: 2,
      },
    })

    return res.json({
      chat: chat || null,
      messages: chat?.messages || [],
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: "Internal server error" })
  }
})


router.post("/chat/:targetUserId/message", userAuth, async (req, res) => {
    try {
        const { targetUserId } = req.params
        const text = req.body.text?.trim()

        if (!text) {
            res.status(400).json({ message: "Message text is required" })
        }
        let chat = await Chat.findOne({
            participants: { $all: [req.user._id, targetUserId] }
        })
        if (!chat) {
            chat = new Chat({ participants: [req.user._id, targetUserId], messages: [] })
        }

        chat.messages.push({ senderId: req.user._id ,text})
        await chat.save()

        return res.status(201).json({
            message: chat.messages[chat.messages.length - 1],
        })
    }
    catch (err) {
        console.error(err)
        return res.status(500).json({ message: "Internal server error" })
    }
})

module.exports = router