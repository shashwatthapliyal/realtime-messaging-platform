const jwt=require('jsonwebtoken')
const User=require('../model/user')

const userAuth=async(req,res,next)=>{
try{
const token=req.cookies.token
if(!token) throw new Error("Please Login")

const decodedObj=jwt.verify(token,process.env.JWT_SECRET)
// console.log(decodedObj)
const {_id}=decodedObj

// Check if user present with this id 
const user =await User.findById(_id)
if(!user) throw new Error("User not found")

req.user=user    
next()
}
catch(err){
    res.status(400).send(err.message)
}
}

module.exports=userAuth