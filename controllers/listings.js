const Listing=require("../models/listing")
const {listingSchema}=require("../schema.js");

module.exports.index=async (req, res) => {
  
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
    let city_name=req.body;
  
  }
 


 module.exports.find=async(req,res)=>{
    let city_name=req.body.name;
    console.log(city_name);
      const allListings = await Listing.find({country:city_name});
      res.render("listings/index.ejs", { allListings });
  }

 module.exports.renderNewForm=(req, res) => {
    console.log(req.user);
    res.render("listings/new");
  }


module.exports.createListing=async (req, res, next) => {
  let url=req.file.path;
  let filename=req.file.filename;
  console.log(url,filename)
   let result= listingSchema.validate(req.body);
    if (!req.body.listing) throw new ExpressError(400, "Invalid listing data");
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success","New Listing Create");
    res.redirect("/listings");
  };



module.exports.showListing=async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{
      path:"author",
    },
  }).populate('owner');
   if(!listing){
    req.flash("error","Listing Not Exist...");
    res.redirect("/listings")
   }else{
    res.render("listings/show", { listing });
  }
  }



module.exports.rendereditform=async (req, res) => {
      const { id } = req.params;
      const listing = await Listing.findById(id);

      if(!listing){
        req.flash("error","Listing you requested fro does not exits");
        res.redirect("/listings")
      }

      let OriginalImgUrl=listing.image.url;
      OriginalImgUrl.replace("/upload","/upload/w_250");
      res.render("listings/edit", { listing ,OriginalImgUrl});
    }

module.exports.updateListing=async (req, res) => {

    const { id } = req.params;
  //  next operation...

   let listing= await Listing.findByIdAndUpdate(id, {...req.body.listing});
   if(typeof req.file !== "undefined"){
   let url=req.file.path;
   let filename=req.file.filename;
   listing.image={url,filename};

   await listing.save();
   }
    req.flash("success","Successfully..");
    res.redirect(`/listings/${id}`);
  }

module.exports.deletListing=async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted Successfuly");
    res.redirect("/listings");
  }