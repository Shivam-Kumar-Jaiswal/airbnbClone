const List=require("../models/listing.js");
const Review=require('../models/review.js')

module.exports.addReview=async(req,res)=>{
    let listing=await List.findById(req.params.id);
    const review1=new Review(req.body.review)
    review1.author=req.user._id
    await review1.save();
    listing.reviews.push(review1);
    await listing.save();
    res.redirect(`/listing/${req.params.id}`)
}

module.exports.destroyReview=async(req,res)=>{
    const {id,reviewId}=req.params;
    await List.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/listing/${id}`)
}