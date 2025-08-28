const Listing=require("./models/listing")
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema}=require("./schema.js");
const Review = require("./models/review.js");
const {reviewsSchema}=require("./schema.js");
// const Review = require("./models/review.js");

module.exports.isloggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        //redirect url .
        req.session.redirectUrl=req.originalUrl

        req.flash("error","You must be logged in to create listing")
       return res.redirect("/login")
      }
      next();
}


module.exports.saveredirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}


module.exports.isOwner=(async (req,res,next)=>{
    const { id } = req.params;
    let listing= await Listing.findById(id);
   if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error","You Are Not A Owner of Listing..Sorry")
   return res.redirect(`/listings/${id}`) //if we want to [Next operation] is not perform then return ...
   }
   next();
})

module.exports.listingvalidation=(req,res,next)=>{
  let {error}=listingSchema.validate(req.body);
  if(error){
    let errmsg=error.details.map((el)=>el.message).join(",")
    throw new ExpressError(400,error);
  }else{
    next();
  }
}



module.exports.validateReview=(req,res,next)=>{
  let {error}=reviewsSchema.validate(req.body);
  if(error){
    let errmsg=error.details.map((el)=>el.message).join(",")
    throw new ExpressError(400,errmsg);
    
  }else{
    next();
  }
}


module.exports.isreviewAuthor=async(req,res,next)=>{
    // console.log(req);
    const { id,reviewId } = req.params;
    let review = await Review.findById(reviewId);
    // console.log(res.locals)
   if(!review.author._id.equals(res.locals.currUser._id)){
    req.flash("error","You Are Not A author of this review")
   return res.redirect(`/listings/${id}`) //if we want to [Next operation] is not perform then return ...
   }
   next();
}

