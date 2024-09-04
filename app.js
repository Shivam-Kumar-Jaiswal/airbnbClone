//mongo db database user= shivamjaiswal; password=88eZcNB5BVAWJBaa;
//require
if(process.env.NODE_ENV!="production"){
require('dotenv').config()
}

const express=require("express");
const app=express();
const mongoose=require('mongoose');
const ejsMate=require('ejs-mate');

const listingRouter=require('./routes/listing.js')
const reviewRouter=require('./routes/review.js')
const userRouter=require('./routes/user.js') 

const wrapAsync=require('./utils/wrapAsync.js');
const ExpressError=require('./utils/ExpressError.js')

const methodOverride=require('method-override')
app.use(methodOverride('_method'))

app.use(express.urlencoded({extended:true}))
const path=require('path');
const { nextTick } = require("process");

const passport =require('passport')
const LocalStrategy=require("passport-local")
const User=require("./models/user.js")

const session = require('express-session')
const MongoStore = require('connect-mongo');

const flash=require('connect-flash');
const user = require("./models/user.js");

main()
.then(console.log("system connected"))
.catch(err=>console.log(err));

async function main(){
      //await mongoose.connect('mongodb://127.0.0.1:27017/wonder');
        await mongoose.connect(process.env.MONGO_URL);
}

app.engine("ejs",ejsMate);
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs")
app.use(express.static(path.join(__dirname,"public")))

const store=MongoStore.create({
    mongoUrl:process.env.MONGO_URL,
    crypto: {
        secret:process.env.SECRET
    },
    touchAfter: 24 * 3600 
})
const sessionOption={
     store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}
app.use(session(sessionOption))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash('error');
    res.locals.isUserExist=req.user;
    next();
})
// app.get('/registerUser',async(req,res)=>{
//    let fakeUser=new User({
//     email:'shivam@gmail.com',
//     username:"shivam"
//    })
//    const newUser= await User.register(fakeUser,"helloWorld");
//    res.send(newUser);
// })

//Routing to the ROOT PATH
app.get("/",(req,res)=>{
   res.send("successfull");
})
//routes
app.use("/listing",listingRouter)
app.use("/listing/:id/reviews",reviewRouter)
app.use("/",userRouter)

app.all("*",(req,res,next)=>{
    next(new ExpressError(400,"page not found"));
})
app.use((err,req,res,next)=>{
    let{statusCode=500,message="something went wrong"}=err;
    res.status(statusCode).render("listing/error.ejs",{message})
})
app.listen(8080,()=>console.log("app is listening on port 8080"))

// <% if(isUserExist&&isUserExist._id.equals(data.owner._id)){ %>
//<% } %> 