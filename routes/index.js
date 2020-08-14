var express = require("express");
var locus = require("locus")
var router = express.Router();
var passport = require("passport");
var user = require("../models/user")
var campground = require("../models/campground");
var middleware = require("../middleware/index");
router.get("/",(req, res)=>{
    res.render("landingpage")
})

router.get("/register",(req, res)=>{
    res.render("register");
})
//Sign up handler.
router.post("/register",(req, res)=>{
    let newUser = new user(
        {
           username : req.body.username,
           firstName: req.body.firstName,
           lastName : req.body.lastName,
           email    : req.body.email,
           avatar   : req.body.avatar,
           about    : req.body.about,
        })
        if(req.body.admin === 'claireDunphy#23')
            newUser.isAdmin = true;
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
    req.flash("success","Aloha, Come back soon.");
    res.redirect("/campgrounds")
})
// Users profile.
router.get("/users/:id",middleware.isLoggedIn,(req, res)=>{
    user.findById(req.params.id,(error,profile)=>{
        if(error){
            req.flash("error","Profile Not Found");
            req.redirect("/");
        }else{
            campground.find().where('author.id').equals(profile._id).exec((err,campgrounds)=>{
                res.render("users/show",{profile:profile,campgrounds:campgrounds});
            })
            
        }
    })
})

module.exports = router;