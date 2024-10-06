
const mongoose=require("mongoose")

const connectDb=async()=>{

    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("mongodb is connected")

    }
    catch(e){

        console.log(e)

    }
    
}

module.exports=connectDb