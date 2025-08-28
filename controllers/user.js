
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const passport=require("passport");
const { saveredirectUrl } = require("../middleware.js");


module.exports.renderSignUpForm=(req, res) => {
    res.render("users/signup.ejs");
  }


module.exports.signUp=async (req, res) => {
    try {
      let { username, email, password } = req.body;
      let newuser = new User({ email, username });
      const registerduser = await User.register(newuser, password);
      req.login(registerduser,(err)=>{
        if(err){
          return next(err);
        }
        req.flash("success", "Wlecome to Wonderlust...");
        console.log(registerduser);
       res.redirect("/listings");
      })
      
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/signup");
    }
  }


module.exports.renderloginForm=(req, res) => {
    res.render("users/login.ejs");
  }


module.exports.login= async(req,res)=>{
    req.flash("success","welcome to Wonderlust")
    // res.send("welcome to wonderlusts") 
    let redirecturl=res.locals.redirectUrl || "/listings";
    res.redirect(redirecturl);
  }

module.exports.logOut=(req,res,next)=>{
    req.logout((err)=>{
     if(err){
      return next(err);
     }
     req.flash("success","You are logged out")
     res.redirect("/listings")
    })
  }