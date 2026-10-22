const mongoose=require('mongoose')

async function connectDB(){
   try{
     await mongoose.connect("mongodb+srv://shashwat:xfz9c0crhejHmH4S@cluster0.7ftbbub.mongodb.net/user")
   }
   
   catch(err){
    console.log("Cant connect to DB")
    throw(err)
    // console.log(err)
   }
}




module.exports={connectDB}