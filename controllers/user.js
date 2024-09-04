const User = require('../models/user')

module.exports.signupForm=(req,res)=>{
    res.render('../views/users/signup.ejs')
}

module.exports.signup=async(req,res,next)=>{
    try{
    const {username,email,password}=req.body;
    let newUser= new User({
        email,username
    })
    const registeredUser=await User.register(newUser,password)
    req.login(registeredUser,(err)=>{
        if(err){
            next(err)
        }
        req.flash("success",'Registered Successfully')
        res.redirect("/listing");
    })
    }catch(e){
   req.flash("error",e.message)
   res.redirect("/signup")
}}

module.exports.loginForm=(req,res)=>{
    res.render("../views/users/login.ejs")
}

module.exports.login=async(req,res)=>{
    req.flash('success','logged in successfully')
    const redirectRoute=res.locals.redirectUrl||"/listing"
    res.redirect(redirectRoute)
}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
       if(err)
        {next(err)}
       req.flash("success","Logged Out Successfully")
       res.redirect("/listing")
   }
   )
}