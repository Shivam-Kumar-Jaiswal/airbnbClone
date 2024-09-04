const List=require("./models/listing.js");
const Review=require("./models/review.js");
const {listingSchema,reviewsSchema}=require('./schema.js');
const ExpressError=require('./utils/ExpressError.js')

module.exports.isValidate=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectPath=req.originalUrl;
        req.flash("error",'You are not logged in, Login to Create List')
         return res.redirect('/login')
     }
     next();
}

module.exports.saveRedirectPath=(req,res,next)=>{
    if(req.session.redirectPath){
       res.locals.redirectUrl=req.session.redirectPath;
    }
    next();
}

module.exports.isOwner=async (req,res,next)=>{
    let{id}=req.params;
    const listing=await List.findById(id)
    if(!res.locals.isUserExist._id.equals(listing.owner._id)){
        console.log('edited successfully')
        req.flash("error","You are not the owner of the list")
        return res.redirect(`/listing/${id}`)
    }
    next();
}

module.exports.validateListing= (req,res,next)=>{
    let {error} =listingSchema.validate(req.body) 
    if(error){
        throw new ExpressError(400,error)
    }else
      {
         next();
    }
}

module.exports.validateReview= (req,res,next)=>{
    let {error} =reviewsSchema.validate(req.body) 
    if(error){
     throw new ExpressError(400,error)
    }else{
         next();
    }
}

module.exports.isAuthor=async (req,res,next)=>{
    let{id,reviewId}=req.params;
    const review=await Review.findById(reviewId)
    if(!res.locals.isUserExist._id.equals(review.author._id)){
        req.flash("error","You are not the owner of the review")
        return res.redirect(`/listing/${id}`)
    }
    next();
}