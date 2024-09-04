const express=require('express')
const router =express.Router()
const wrapAsync=require('../utils/wrapAsync')
const passport=require('passport')
const {saveRedirectPath}=require('../middleware.js')
const userController=require('../controllers/user.js')

router.route("/signup")
.get(userController.signupForm)
.post(wrapAsync(userController.signup)
)

router.route('/login')
.get(userController.loginForm)
.post(saveRedirectPath,passport.authenticate('local',{failureRedirect:"/login",failureFlash:true}),userController.login)

router.get('/logout',userController.logout)


module.exports=router;