const express = require("express");
const app = express();
const session = require("express-session");

const path = require("path");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
const flash=require("connect-flash");
app.use(flash());
const sessiooption = {
  secret: "loinistheking",
  resave: false,
  saveUninitialized: true,
};

app.use(
   session(sessiooption)
)

// app.get("/count",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count=1;
//     }

//    res.send(` count: ${req.session.count}`)
// })

// app.get("/test",(requestAnimationFrame,res)=>{
// res.send("test successfule")
// })

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
})


app.get("/reg",(req,res)=>{

  
    let {name="Anonymouse"}=req.query;
    req.session.name=name;
    console.log(req.session.name);
    if(name==="Anonymouse"){
        req.flash("error","user not registered")
    }else{
    req.flash("success","user registered successfuly")
    // res.send(name);
    }
    res.redirect("/hello")
})


app.get("/hello",(req,res)=>{
    // res.locals.success=req.flash("success");
    // res.locals.error=req.flash("error");
    //it is use in middle ware flash messages......
    res.render("page.ejs",{name:req.session.name})
})


app.listen(3030, () => {
    console.log("Server is running at http://localhost:3030");
});
