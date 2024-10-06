const userChat = require("../model/userSchema")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")


const register=async(req,res)=>{
    try{
        const {name,username,email,password}=req.body

        // Check all deatils is filled or not
        if(!name || !username || !email || !password){
            return res.status(400).json({msg:"please filled all deatils"})
        }

        // check user is already exist or not by using email
        const user=await userChat.findOne({email})

        if(user){
            return res.status(400).json({msg:"user already exist"})

        }

        // hash the password
        const hashedPassword=await bcrypt.hash(password,16)


        // create 
        await userChat.create({
            name,
            username,
            email,
            password:hashedPassword
        })

        return res.status(201).json({msg:"account created successfully"})


    }
    catch(e){
        console.log(e)
        return res.status(500).json({ msg: "Internal Server Error" })
    }
}


// login

const loginUser=async(req,res)=>{
    try{

        const{email,password}=req.body

        // Check all deatils is filled or not
        if( !email || !password){
            return res.status(401).json({msg:"please fill all deatils"})
        }
        

        // check user is registered or not bcz when user is registered then only they can try login
        const user=await userChat.findOne({email})

        if(!user){
            return res.status(401).json({msg:"user does not  exist with this email"})

        }

        // check password is correct ot not it gives boolean value
        const isPasswordMatch=await bcrypt.compare(password,user.password)

        if(!isPasswordMatch){
            return res.status(401).json({msg:"passsword is incorrect"})

        }

        // token generate

        const tokenData={
            userId:user._id
        }

        const token =await jwt.sign(tokenData ,process.env.SECRET_KEY,{expiresIn:"1d"})


        // store cookie
        return res.status(201).cookie("token",token,{expiresIn:"1d",httpsOnly:true}).json({msg:`welcome back ${user.name}`,user})

    }
    catch(e){
        console.log(e)
        return res.status(500).json({ msg: "Internal Server Error" })
    }
}

// logout

const logOut=async(req,res)=>{
    try{

        return res.cookie("token","",{expiresIn:new Date(Date.now())}).json({msg:"user logout successfully"})

    }
    catch(e){
        console.log(e)
        return res.status(500).json({ msg: "Internal Server Error" })
    }
}


// usrr is bookmarks tweet
const bookmarks=async(req,res)=>{

    try{


        const isLoggedIn=req.body.id;
        const tweetId=req.params.id;

        const userDetails=await userChat.findById(isLoggedIn);

        if(userDetails.bookmarks.includes(tweetId))
        {
            // remove
            await userChat.findByIdAndUpdate(
                isLoggedIn,
                {
                    $pull:{
                        bookmarks:tweetId
                    }
                }
            )
            return res.status(200).json({ msg: `user is remove boookmarks of ${tweetId} tweet` })
        }

        else{
            // add 

            await userChat.findByIdAndUpdate(
                isLoggedIn,
                {
                    $push:{
                       bookmarks: tweetId
                    }
                }
            )
            return res.status(200).json({ msg: `user is add boookmarks of ${tweetId} tweet` })
        }
    }
catch(e){
        console.log(e)
        return res.status(500).json({ msg: "Internal Server Error" })
    }
}


const profile=async(req,res)=>{

    try{
        const {id}=req.params;

        // it gives user details without password by using select method and usning -sihn
        const user=await userChat.findById(id).select("-password")

        console.log("usrr",user)
        

        return res.status(200).json({ msg: "user details ",user })


    }
    catch(e){
        console.log(e)
        return res.status(500).json({ msg: "Internal Server Error" })
    }


}
// get all otherser
const allUser =async(req,res)=>{

    try{
        const {id}=req.params

        // this ne find all which is notequal to this user 
        const otherUser=await userChat.find({_id:{$ne:id}}).select("-password")

        if(!otherUser){
            return res.status(404).json({ msg: "not found other user list" ,otherUser})
        }

        return res.status(200).json({ msg: "other user list" ,otherUser})


    }
    catch(e){
        console.log(e)
        return res.status(500).json({ msg: "Internal Server Error" })
    }

}

const follow =async (req,res)=>{

    try{

        // if first user wants to follow second user then in first user of following array have second user id and in second user
        // of folllowers array have first userid

        const logedIn =req.body.id
        const followUserId=req.params.id

        const logedInDetails=await userChat.findById(logedIn)

        const followerUserDetails=await userChat.findById(followUserId)

        // it means it does not follow other user
        if(!followerUserDetails.followers.includes(logedIn)){

             // now we update the followers array of folloerUserDetails 
             await followerUserDetails.updateOne({
                $push:{
                    followers:logedIn
                }
            })

            // and also we update the following  array of logedin user

            await logedInDetails.updateOne({
                $push:{
                    following:followUserId
                }
            })

          

        }
        else{
            return res.status(400).json({ msg: `logedIn user ${logedInDetails.name} already followed to other user ${followerUserDetails.name}` })

           
        }
        return res.status(200).json({ msg: `logedIn user ${logedInDetails.name}  followed to other user ${followerUserDetails.name}`})

    }
    catch(e){
        console.log(e)
        return res.status(500).json({ msg: "Internal Server Error" })
    }


}
const unfollow=async(req,res)=>{

    try{


        const logedIn =req.body.id
        const unFollowUserId=req.params.id

        const logedInDetails=await userChat.findById(logedIn)

        const unfollowerUserDetails=await userChat.findById(unFollowUserId)

        // it means it does not follow other user
        if(logedInDetails.following.includes(unFollowUserId)){

             // now we update the followers array of folloerUserDetails 
             await unfollowerUserDetails.updateOne({
                $pull:{
                    followers:logedIn
                }
            })

            // and also we update the following  array of logedin user

            await logedInDetails.updateOne({
                $pull:{
                    following:unFollowUserId
                }
            })

          

        }
        else{
            return res.status(400).json({ msg: `logedIn user ${logedInDetails.name} has not followed to other user ${unfollowerUserDetails.name}` })

           
        }
        return res.status(200).json({ msg: `logedIn user ${logedInDetails.name}  unfollowed to other user ${unfollowerUserDetails.name}`})

    }
    catch(e){
        console.log(e)
        return res.status(500).json({ msg: "Internal Server Error" })
    }

}
module.exports={register,loginUser,logOut,bookmarks,profile,allUser,follow,unfollow}