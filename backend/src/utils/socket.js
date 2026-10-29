const {Server}=require('socket.io')
const Chat=require("../model/chat")


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

        socket.on("sendMessage",async({firstName,userId,targetUserId,text})=>{
            try{
                const roomId=[userId,targetUserId].sort().join("_")

                let chat =await Chat.findOne({
                    participants:{$all:[userId,targetUserId]}
                })
                if(!chat){
                    chat=new Chat({
                        participants:[userId,targetUserId],messages:[]
                    })
                }
                chat.messages.push({
                    senderId:userId,
                    text
                })
                await chat.save()
                io.to(roomId).emit("messageReceived",{firstName,text,senderId:userId})
            }
            catch(err){
                console.log(err.message)
            }
        })
    })
}

module.exports=initializeSocket