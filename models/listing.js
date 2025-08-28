const mongoose=require("mongoose");
const Review=require("./review.js");
const { required } = require("joi");
const Schema=mongoose.Schema;

const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },

    description:{
        type:String,
    },

    image:{
      
        filename:String,
        url:String,
    },
    price:Number,
    location:String,
    country:String,
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    reviews:[
        {
        type:Schema.Types.ObjectId,
        ref:"Review",
       }
    ],
   
    
})


listingSchema.post("findOneAndDelete",async(listings)=>{
    if(listings){
    await Review.deleteMany({_id:{$in:listings.reviews}})
    }
})


const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;