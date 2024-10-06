const tweet = require("../model/tweetSchema");
const userChat = require("../model/userSchema");



const createTweet = async (req, res) => {

    try {

        const { description, id } = req.body;

        if (!description || !id) {
            return res.status(401).json({ msg: "please fill all the fields" })

        }
        const tweetdetails = await tweet.create({
            description,
            userId: id
        })
        return res.status(201).json({ msg: "twwet created successfully", tweetdetails })

    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ msg: "Internal Server Error" })
    }






}

const deleteTweet = async (req, res) => {

    try {


        const { id } = req.params.id;
        await tweet.findByIdAndDelete(id)

        return res.status(200).json({ msg: "Tweet delete successfully" })

    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ msg: "Internal Server Error" })

    }


}

const likeOrDislike = async (req, res) => {

    try {

        // firstly we want to know which is  login user ,bcz it has only power to like or dislike and also wnat to which tweet 
        // is wanted to like or likeOrDislike

        const isLoggedIn = req.body.id;
        const tweetId = req.params.id;

        const tweetDetails = await tweet.findById(tweetId)

        // we write include bcz ilike is an array and if in like array , loggin userid is present it means it already like the tweet
        // then he can only dislike and if not he can like
        if (tweetDetails.like.includes(isLoggedIn)) {
            // dislike
            await tweet.findByIdAndUpdate(
                tweetId,
                // using pull it remove id and using push it add id
                {
                    $pull: {
                        like: isLoggedIn
                    }
                }
            )
            return res.status(200).json({ msg: `tweet is dislike by ${isLoggedIn} user` })


        }
        else {

            // like
            await tweet.findByIdAndUpdate(
                tweetId,
                // using pull it remove id and using push it add id
                {
                    $push: {
                        like: isLoggedIn
                    }
                }
            )
            return res.status(200).json({ msg: `tweet is like by ${isLoggedIn} user` })


        }



    } catch (e) {
        console.log(e)
        return res.status(500).json({ msg: "Internal Server Error" })

    }

}

const allTweets=async(req,res)=>{


    
    // in this we have to be seen all logedin user tweets and also which they follow  can also see their tweets also bcz he have follow 
    // logedinusertweets + folloing person tweets
    try{
        // logedusertweets
        const id=req.params.id;
        const logedInUser= await userChat.findById(id)

        if(!logedInUser){
            return res.status(400).json({ msg: "No user found" })

        }

        const logedInUserTweets=await tweet.find({userId:id})

        // it has an array of following in which multiple id is stored for this we have use promise
        const followingUserTweets = await Promise.all(logedInUser.following.map((otherUserId)=>{
            return  tweet.find({userId:otherUserId})

        }))

        return res.status(200).json({ msg: "here is your list of tweets",tweets:logedInUserTweets.concat(...followingUserTweets) })


    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ msg: "Internal Server Error" })

    }

}

const followingTweets=async(req,res)=>{


    try{
         // logeduser
         const id=req.params.id;
         const logedInUser= await userChat.findById(id)
 
         if(!logedInUser){
             return res.status(400).json({ msg: "No user found" })
 
         }
 
 
         // it has an array of following in which multiple id is stored for this we have use promise
         const followingUserTweets = await Promise.all(logedInUser.following.map((otherUserId)=>{
             return  tweet.find({userId:otherUserId})
 
         }))
 
         return res.status(200).json({ msg: "here is your list of tweets",tweets:[].concat(...followingUserTweets) })
        

    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ msg: "Internal Server Error" })

    }
}





module.exports = { createTweet, deleteTweet, likeOrDislike,allTweets,followingTweets}