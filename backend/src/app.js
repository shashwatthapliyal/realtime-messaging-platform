require("dotenv").config();
const express = require('express')

const { connectDB } = require('./config/database')
const User = require('./model/user')

const cookieParser = require('cookie-parser')

const authRoutes = require("./routes/auth");
const profileRoutes=require("./routes/profile")
const requestRoutes=require('./routes/request')

const app = express()

app.use(cookieParser())
app.use(express.json())


app.use("/",authRoutes)
app.use("/",profileRoutes)
app.use("/",requestRoutes)


connectDB()
    .then(() => {
        console.log('Connected to DB')
        app.listen(3000, () => console.log('Server is running on port 3000'))
    })
    .catch((err) => {
        console.log('Error in connecting to DB')
        console.log(err.message)
    })



