const express=require("express")
const { register, loginUser, logOut, bookmarks, profile, allUser, follow, unfollow } = require("../controllers/user_controller")
const { isAuthenticated } = require("../middleware/auth")

const userRouter=express.Router()

userRouter.post("/register",register)
userRouter.post("/login",loginUser)
userRouter.get("/logout",logOut)
userRouter.get("/allUser/:id",isAuthenticated,allUser)
userRouter.get("/profile/:id",isAuthenticated,profile)
userRouter.put("/bookmarks/:id",isAuthenticated,bookmarks)

userRouter.post("/follow/:id",isAuthenticated,follow)
userRouter.post("/unfollow/:id",isAuthenticated,unfollow)


module.exports={userRouter}