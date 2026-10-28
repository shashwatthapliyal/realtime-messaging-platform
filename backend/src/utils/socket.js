const {Server}=require('socket.io')



const initializeSocket=(server)=>{
    console.log("Initialized....")

    const io=new Server(server,{
        cors:{
            origin:"http://localhost:5173",
            credentials:true,
        }
    })

    io.on("connection",(socket)=>{
        
        socket.on("joinChat",({userId,targetUserId})=>{
            const roomId=[userId,targetUserId].sort().join("_")
            socket.join(roomId)
            console.log(roomId)
        })
    })
}

module.exports=initializeSocket