const express = require("express");
const router=express.Router({mergeParams:true});
// const listing=required("../routes/listings.js");
const Listing = require("../models/listing.js");
// const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema}=require("../schema.js");
const listingControler=require("../controllers/listings.js")

//middleware...................
const {isloggedIn,isOwner,listingvalidation}=require("../middleware.js")

const {storage}=require("../CloudConfig.js");



//image uplode use multer package
const multer=require("multer");
const { Store } = require("express-session");
const upload=multer({storage});

// const {isloggedIn} =require("../middleware.js");


  
  // Show all listings
  router.route("/")
  .get(wrapAsync(listingControler.index))
  .post(
    isloggedIn,
    upload.single("listing[image]"),
    listingvalidation,
  wrapAsync(listingControler.createListing)
  );
  
  router.post("/search",listingControler.find);
  // Form to create new listing
  router.get("/new",isloggedIn, listingControler.renderNewForm);
  
  // Create listing
  router.post("/",isloggedIn,listingvalidation, wrapAsync(listingControler.createListing));
  

  // Show specific listing
  router.get("/:id",listingvalidation, wrapAsync(listingControler.showListing))
  

  
  // Form to edit listing
  router.get("/:id/edits",isloggedIn,isOwner,wrapAsync(listingControler.rendereditform));
  
  
  // Update listing
  router.put("/:id",isloggedIn,isOwner, upload.single("listing[image]"), wrapAsync(listingControler.updateListing));
  
  // Delete listing
  router.delete("/:id",isloggedIn,isOwner, wrapAsync(listingControler.deletListing));
  
 

  module.exports=router;