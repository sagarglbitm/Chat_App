const mongoose = require("mongoose")

const tweetSchema = new mongoose.Schema({

    description: {
        type: String,
        required: true
    },
    like: {
        type: Array,
        default:[]
       
    },
    
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"userChat"
       
    },
},{timestamps:true})

const tweet=mongoose.model("tweet",tweetSchema)

module.exports=tweet

