if(process.env.NODE_ENV != "production") {
require('dotenv').config()
}


const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");
const {listingSchema}=require("./schema.js");
const {reviewsSchema}=require("./schema.js")
const flash=require("connect-flash");


const dburl=process.env.ATLUSDB_URL
const MongoStore=require("connect-mongo");





const passport=require("passport")
const LocalStrategy=require("passport-local");
const passportLocalMongoose=require("passport-local-mongoose") //local setup..
const User=require("./models/user.js")


//database session 
const store=MongoStore.create({
  mongoUrl:dburl,
  crypto:{
    secret:process.env.SECRET,
  },
    touchAfter:24 * 60 * 60 * 1000,
})


store.on("error",()=>{
  console.log("Error in Mongo Session Store", err);
})

//flash message require..
const session = require("express-session");
const sessiooption = {
  store:store,
  secret:process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires:Date.now()*7*24*60*60*1000,
    maxAge:7 * 24 * 60 * 60 * 1000,
    httpOnly:true,
  }
};


const app = express();
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");


// View Engine Setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const listingsRouter=require("./routes/listings.js");
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");



// Connect to MongoDB

async function main() {
 
    await mongoose.connect(dburl);
  }
main()
.then(() => console.log("Connected to DB..."))
.catch((err) => console.error(err));

app.use(session(sessiooption));
app.use(flash());

///passport....authenticates
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
  res.locals.currUser=req.user;
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  next();
})


app.use("/",userRouter);

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews/",reviewsRouter)


// Error handler
app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
res.render("listings/err.ejs",{message ,err,status})
});

// Start server
app.listen(8080, () => {
  console.log("Server is running at http://localhost:8080/listings");
});
