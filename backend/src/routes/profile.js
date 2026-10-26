const express=require('express')
const User = require('../model/user')
const userAuth = require('../middleware/auth')
const router=express.Router()




router.get("/profile", userAuth, (req, res) => {
    try {
        const user = req.user
        if (!user) throw new Error("Please Login")
        res.send(user)
    }
    catch (err) {
        res.status(400).send(err.message)
    }
})

router.patch('/user/:id',userAuth, async (req, res) => {
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


// router.get('/feed',userAuth, async (req, res) => {
//     try {
//         const loggedInUser=req.user
//         const feed = await User.find({
//             $or:[
//                 {
//                     fromUser:loggedInUser._id
//                 },
//                 {
//                     toUserId:loggedInUser._id
//                 }
//             ]
//         })
//         return res.status(200).json(feed)
//     }
//     catch (err) {
//         return res.status(400).send(err.message)
//     }
// })
module.exports=router