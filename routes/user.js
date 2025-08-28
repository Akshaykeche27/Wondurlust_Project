const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const passport=require("passport");
const { saveredirectUrl } = require("../middleware.js");

const usercontroler=require("../controllers/user.js")

//sing up

router.get("/signup", usercontroler.renderSignUpForm);


//signup
router.post(
  "/signup",
  wrapAsync(usercontroler.signUp)
);

//login
router.get("/login", usercontroler.renderloginForm);


// login in db check
router.post(
  "/login",
  saveredirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  usercontroler.login
);


// logout
router.get("/logout",usercontroler.logOut)



module.exports = router;
