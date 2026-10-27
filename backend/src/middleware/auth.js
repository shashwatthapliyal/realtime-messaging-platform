const jwt=require('jsonwebtoken')
const User=require('../model/user')

const userAuth=async(req,res,next)=>{
try{
const token=req.cookies.token
if(!token) return res.status(401).send("Please Login")
if(!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not configured")

const decodedObj=jwt.verify(token,process.env.JWT_SECRET)
// console.log(decodedObj)
const {_id}=decodedObj

// Check if user present with this id 
const user =await User.findById(_id).select("-password")
if(!user) return res.status(401).send("User not found")

req.user=user    
next()
}
catch(err){
    res.status(401).send(err.message)
}
}

module.exports=userAuth