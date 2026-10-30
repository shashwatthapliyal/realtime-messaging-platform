const mongoose = require('mongoose')
const ConnectionRequest = require('../model/connection')


async function canChat(userId, targetUserId) {
    if (
        !mongoose.isValidObjectId(targetUserId) ||
        String(userId) === String(targetUserId)
    ) {
        return false;
    }

    return Boolean(await ConnectionRequest.exists({
        status: "accepted",
        $or: [

            { fromUserId: userId, toUserId: targetUserId },
            { fromUserId: targetUserId, toUserId: userId },
        ]
    }))
}

module.exports=canChat