const express=require('express')
const router=express.Router({mergeParams:true});
const wrapAsync=require('../utils/wrapAsync.js');
const {validateReview,isValidate,isAuthor}=require('../middleware.js')
const reviewController=require('../controllers/review.js')

router.post("/",isValidate,validateReview,wrapAsync(reviewController.addReview))

router.delete("/:reviewId",isAuthor,wrapAsync(reviewController.destroyReview))

module.exports=router;