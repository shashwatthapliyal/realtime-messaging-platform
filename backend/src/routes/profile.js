

const cloudinary = require('../config/cloudinary')
const upload = require('../middleware/upload')
const express = require('express')
const User = require('../model/user')
const userAuth = require('../middleware/auth')
const router = express.Router()
const Connection = require('../model/connection')
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";



async function uploadImage(req) {
    const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "profilePictures",
                resource_type: "image"
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }

                resolve(result);
            }
        );
        stream.end(req.file.buffer);
        console.log("File uploaded")
    })
    return result
}



router.get("/profile", userAuth, (req, res) => {
    try {
        const user = req.user
        if (!user) throw new Error("Please Login")
        res.send(user)
    }
    catch (err) {
        res.status(401).send(err.message)
    }
})

router.patch('/user/:id', userAuth, async (req, res) => {
    const data = req.body
    const { id } = req.params

    const allowedUpdates = ['firstName', 'lastName', 'gender']

    try {
        const isUpdateAllowed = Object.keys(data).every((key) => allowedUpdates.includes(key))

        if (!isUpdateAllowed) {
            return res.status(400).send('Update not allowed')
        }

        if (Object.keys(data).length === 0) {
            return res.status(400).send('At least one field is required')
        }

        if (req.user._id.toString() !== id) {
            return res.status(403).send('You can only update your own profile')
        }

        const user = await User.findOneAndUpdate({ _id: req.user._id }, data, {
            new: true,
            runValidators: true,
            select: USER_SAFE_DATA
        })

        if (!user) {
            return res.status(404).send('User not available')
        }

        return res.status(200).json(user)
    }
    catch (err) {
        return res.status(400).send(err.message)
    }
})


router.get('/feed', userAuth, async (req, res) => {
    try {
        const page = Number.parseInt(req.query.page, 10) || 1
        const limit = Number.parseInt(req.query.limit, 10) || 10

        if (page < 1 || limit < 1 || limit > 100) {
            return res.status(400).send('Page must be at least 1 and limit must be between 1 and 100')
        }



        const loggedInUser = req.user
        const connectionRequests = await Connection.find({
            $or: [
                {
                    fromUserId: loggedInUser._id
                },
                {
                    toUserId: loggedInUser._id
                }
            ]
        }).select(["fromUserId", "toUserId"])

        const hideUsersFromFeed = new Set()

        connectionRequests.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString())
            hideUsersFromFeed.add(req.toUserId.toString())
        })

        const feed = await User.find({
            $and: [
                {
                    _id: { $nin: Array.from(hideUsersFromFeed) }
                },
                {
                    _id: { $ne: loggedInUser._id }
                }

            ]
        }).select(USER_SAFE_DATA).skip((page - 1) * limit).limit(limit)
        res.status(200).json(feed)
    }
    catch (err) {
        return res.status(400).send(err.message)
    }
})



router.patch("/profile/profilePicture", upload.single("profilePicture"), userAuth, async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file received" })
        }
        // console.log(req.file)
        // res.json({ message: "Upload received" });

        const result = await uploadImage(req)
        const user = req.user;
        user.profilePicture = result.secure_url
        await user.save()
        res.status(200).json({
            message: "Image uploaded successfully",
            imageUrl: result.secure_url,
            publicId: result.public_id
        });

    }
    catch (err) {
        console.log(err.message)
    }
})
module.exports = router