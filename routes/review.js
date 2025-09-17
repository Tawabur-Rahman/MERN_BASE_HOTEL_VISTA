const express=require("express");
const router=express.Router({mergeParams:true});
//Require Schema==============
const Review=require("../models/review.js")
const Listing=require("../models/listing.js");
//Error Handel===============
const WrapAsync=require("../utils/wrapAsync");
const ExpressError=require("../utils/expressError");
//Joi for Validation
const {reviewSchema}=require("../schema.js");
const { isLoggedIn, isReviewOwner } = require("../middleware.js");
//MVC
const reviewController=require("../controllers/reviews.js")

//Validate Review
const ValidateReview=(req,res,next)=>{
let {error}=reviewSchema.validate(req.body);
if(error){
let errMsg=error.details.map((el)=>el.message).join(",")
throw new ExpressError(400,errMsg)
}else{
next();
}
}


//Review Route Create Start=========================

router.post("/",isLoggedIn,ValidateReview,WrapAsync(reviewController.createReview))

//Delete Review Comment
router.delete("/:reviewId",isLoggedIn,isReviewOwner,WrapAsync(reviewController.distroyReview))



module.exports=router


