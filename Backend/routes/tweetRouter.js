const express=require("express")
const { createTweet, deleteTweet, likeOrDislike, allTweets, followingTweets } = require("../controllers/tweet_controller")
const { isAuthenticated } = require("../middleware/auth")


const tweetRouter=express.Router()

tweetRouter.post("/createTweet",isAuthenticated,createTweet)
tweetRouter.delete("/deleteTweet/:id",isAuthenticated,deleteTweet)
tweetRouter.put("/likeOrDislike/:id",isAuthenticated,likeOrDislike)
tweetRouter.get("/allTweet/:id",isAuthenticated,allTweets)
tweetRouter.get("/followingTweet/:id",isAuthenticated,followingTweets)


module.exports={tweetRouter}