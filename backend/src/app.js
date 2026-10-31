require("dotenv").config();

const express = require('express')
const cors = require('cors')

const { connectDB } = require('./config/database')

const cookieParser = require('cookie-parser')

const authRoutes = require("./routes/auth");
const profileRoutes=require("./routes/profile")
const requestRoutes=require('./routes/request')
const chatRoutes=require('./routes/chat')
const http=require('http')
const app = express()

const initialiseSocket=require('./utils/socket')
const server=http.createServer(app)

initialiseSocket(server)

app.use(cookieParser())
app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials:true,
    maxAge:600
}))

app.use("/",authRoutes)
app.use("/",profileRoutes)
app.use("/",requestRoutes)
app.use("/",chatRoutes)

connectDB()
    .then(() => {
        console.log('Connected to DB')
        server.listen(3000, () => console.log('Server is running on port 3000'))
    })
    .catch((err) => {
        console.log('Error in connecting to DB')
        console.log(err.message)
    })


