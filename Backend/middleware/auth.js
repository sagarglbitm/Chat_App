const  jwt =require("jsonwebtoken")


const isAuthenticated=async(req,res,next)=>{

    try{

        // get token from cookies
        const token=req.cookies.token
        if(!token){
            return res.status(401).json({ msg: "user is not authenticated" })
    

        }
        // then decode
        console.log(process.env.SECRET_KEY,token)
        const decode=await jwt.verify(token,process.env.SECRET_KEY)
        // const decode=await jwt.verify(token,process.env.SECRET_KEY)
        if(!decode){
            return res.status(401).json({msg:"invalid token"})
        }
        console.log(decode)

        req.user=decode.userId
        
        // then call next function
        next();


    }
    // try{
    //     const token=req.cookies.token
    //     if(!token){
    //         return res.status(401).json({msg:"user is not authenticated"})
    //     }

    //     const decode=await jwt.verify(token,process.env.SECRET_KEY)

    //     if(!decode){
    //         return res.status(401).json({msg:"invalid token"})
    //     }

    //     req._id=decode.userId;
    //     next()

    // }
    catch(e){
        console.log(e)
        return res.status(500).json({ msg: "Internal Server Error" })
    }
}


module.exports={isAuthenticated}