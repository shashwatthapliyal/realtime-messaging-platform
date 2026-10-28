const mongoose=require('mongoose')
const User=require('./user')

const messageSchema=new  mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:User
    },
    text:{
        type:String,
        required:true,
        trim:true
    }
})

const ChatSchema=new mongoose.Schema({
    participants: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
        ref:"User"
    },
    messages: [messageSchema]
})


module.exports=mongoose.model("Chat",ChatSchema)