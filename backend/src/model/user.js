const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true
    },
    age:{
        type:Number,
        min:5
    },
    email:{
        type:String,
        required:true
    }
})

const User=mongoose.model("User",userSchema)

module.exports=User