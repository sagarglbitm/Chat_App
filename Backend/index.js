
const express=require("express")
const dotenv =require(  "dotenv");
const connectDb = require("./utils/db");
const cookieParser = require("cookie-parser");
const { userRouter } = require("./routes/userRouter");
const { tweetRouter } = require("./routes/tweetRouter");
const cors =require( "cors");
const app =express();
dotenv.config({})

// for using dotenv always firstly import dotenv and secondly write dotenv.config
const port=process.env.PORT



// compulsory middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

const corsOptions={
    origin:"http://localhost:3000",
    credentials:true
}
app.use(cors(corsOptions))


// api
app.use("/chat",userRouter)

app.use("/tweet",tweetRouter)

app.listen(port,()=>{
    connectDb()
    console.log(`server is started at port no ${port}`)
})