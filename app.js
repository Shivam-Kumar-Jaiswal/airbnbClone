//mongo db database user= shivamjaiswal; password=88eZcNB5BVAWJBaa;
//require
if(process.env.NODE_ENV!="production"){
require('dotenv').config()
}


// const bodyParser = require('body-parser');
// const Instamojo = require('instamojo-node');
// const axios = require('axios');



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

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());



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
// Import required libraries



// Instamojo API keys and Sandbox mode
//Instamojo.setKeys('6fda05cd226b2d00831aad29b406fb57', 'e1b3bb163fd962f6e9f96d5c6c9ae8ce');
//Instamojo.isSandboxMode(true);  // Set to false for live mode

// const API_KEY = '6fda05cd226b2d00831aad29b406fb57';
// const AUTH_TOKEN = 'e1b3bb163fd962f6e9f96d5c6c9ae8ce';
// const BASE_URL =  'https://www.instamojo.com/api/1.1';  // For live transactions

// // Route to handle payment request
// app.post('/payment',async (req, res) => {
//     const { name, from, to ,amount } = req.body;
//     const paymentData = {
//         purpose: 'HomelyStay Booking',
//         amount: amount,
//         buyer_name :name,
//         from :from,
//         to :to,
//         amount:amount,
        
//         redirect_url: 'http://localhost:8080/payment-success'
//     };

//     // const data = new Instamojo.PaymentData();
//     // data.purpose = "HomelyStay Booking";
//     // data.amount = 10;  // Dynamic amount based on booking
//     // data.buyer_name = name;
//     // data.from = from;
//     // data.to = to;
//     // data.redirect_url = "http://localhost:8080/payment-success";


// //     // Create Payment Request
// //     Instamojo.createPayment(data, '6fda05cd226b2d00831aad29b406fb57', 'e1b3bb163fd962f6e9f96d5c6c9ae8ce',(error, response) => {
// //         if (error) {
// //             return res.status(400).json({ error });
// //         } else {
// //             const paymentUrl = JSON.parse(response).payment_request.longurl;
// //             res.redirect(paymentUrl);  // Redirect user to payment page
// //         }
// //     });
// // });

// // // Route to handle payment success
// // app.get('/payment-success', (req, res) => {
// //     const paymentRequestId = req.query.payment_request_id;
// //     const paymentId = req.query.payment_id;

// //     Instamojo.getPaymentRequestStatus(paymentRequestId, (error, response) => {
// //         if (error) {
// //             return res.status(400).json({ error });
// //         } else {
// //             const status = JSON.parse(response).payments[0].status;
// //             if (status === 'Credit') {
// //                 res.send('Payment successful! Thank you for booking with HomelyStay.');
// //             } else {
// //                 res.send('Payment failed! Please try again.');
// //             }
// //         }
// //     });
// // });
// try {
//     // Create Payment Request
//     const response = await axios.post(`${BASE_URL}/payment-requests/`, paymentData, {
//         headers: {
//             'X-Api-Key': API_KEY,
//             'X-Auth-Token': AUTH_TOKEN
//         }
//     });

//     const paymentUrl = response.data.payment_request.longurl;
//     res.redirect(paymentUrl);  // Redirect user to Instamojo payment page
// } catch (error) {
//     console.error('Error creating payment request:', error.response.data);
//     res.status(500).json({ error: 'Payment request failed' });
// }
// });

// // Route to handle payment success
// app.get('/payment-success', async (req, res) => {
// const paymentRequestId = req.query.payment_request_id;

// try {
//     // Get Payment Status
//     const response = await axios.get(`${BASE_URL}/payment-requests/${paymentRequestId}/`, {
//         headers: {
//             'X-Api-Key': API_KEY,
//             'X-Auth-Token': AUTH_TOKEN
//         }
//     });

//     const paymentStatus = response.data.payment_request.payments[0].status;
//     if (paymentStatus === 'Credit') {
//         res.send('Payment successful! Thank you for booking with HomelyStay.');
//     } else {
//         res.send('Payment failed! Please try again.');
//     }
// } catch (error) {
//     console.error('Error fetching payment status:', error.response.data);
//     res.status(500).json({ error: 'Failed to fetch payment status' });
// }
// });
