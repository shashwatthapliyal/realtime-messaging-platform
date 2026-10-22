const {connectDB}=require('./config/database')

const express=require('express')
const User=require('./model/user')
const app=express()

app.use(express.json())

app.post("/signup",async(req,res)=>{
//  console.log(req.body)

const {fname,lname,age,email}=req.body
const user=new User({
    firstName:fname,
    age,
    email
})

await user.save()
console.log("user saved")
res.end("User created")
 
})

// connect to server
connectDB().then(()=>{
    console.log("Connected to DB")
    app.listen(3000,()=>console.log("Server is running on port 3000")   )
})
.catch((err)=>{console.log("Error in connecting to DB")
    console.log(err.message)
})