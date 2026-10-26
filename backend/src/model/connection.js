const mongoose = require('mongoose')
const User = require('./user')
const connectionRequestSchema = new mongoose.Schema({

    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    status: {
        type: String,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: "{VALUE} is an invalid request type"
        }
    }
},
{
    timestamps:true,
}
)

connectionRequestSchema.index({fromUserId:1,toUserId:1})
connectionRequestSchema.pre("save",function(){
    if(this.fromUserId==this.toUserId) throw new Error("Cant send connection request to yourself.....")
})

const ConnectionRequest=mongoose.model("connectionRequest",connectionRequestSchema)
module.exports=ConnectionRequest