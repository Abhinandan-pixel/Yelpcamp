var express = require("express");
var locus = require("locus")
var router = express.Router();
var passport = require("passport");
var user = require("../models/user")
router.get("/",(req, res)=>{
    res.render("landingpage")
})

router.get("/register",(req, res)=>{
    res.render("register");
})
//Sign up handler.
router.post("/register",(req, res)=>{
    let newUser = new user({username:req.body.username})
    user.register(newUser,req.body.password,(err,user)=>{
        if(err){
            req.flash("error",err.message);
            res.redirect("/register")
        }
        passport.authenticate("local")(req,res, ()=>{
            req.flash("success",`welcome aboard ${user.username}`)
            res.redirect("/campgrounds");
        })

    });
});
//Login handler.
router.get("/login",(req, res)=>{
    res.render("login");
})
//app.post("/login",middleware,callback).
router.post("/login",passport.authenticate("local",
    {
        successRedirect:"/campgrounds",
        failureRedirect:"/login",
        failureFlash: true,
    }), (req, res)=>{
        failureFlash: req.flash("error","Invalid username or password.")
    })
//Logout ROUTE.
router.get("/logout",function(req, res){
    req.logOut();
    req.flash("success","Logged you out!");
    res.redirect("/campgrounds")
})

module.exports = router;