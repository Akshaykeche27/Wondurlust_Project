const express = require("express");
const router=express.Router({mergeParams:true});
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

// const {listingSchema}=require("../schema.js");
// const {reviewsSchema}=require("../schema.js")

const {validateReview,isloggedIn, isreviewAuthor, isOwner}=require("../middleware.js")


const reviewControler=require("../controllers/review.js")


// Reviews...//Post Route..
router.post("/",isloggedIn,validateReview,wrapAsync(reviewControler.createNewReview));
   
   
   //delete reviews...
   router.delete("/:reviewId",isloggedIn,isreviewAuthor,wrapAsync(reviewControler.deleteReview));
   

   module.exports=router;