var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware")
var request = require("request");
router.get("/", (req, res)=>{
    //Get all campgrounds from DB.
    Campground.find({}, (err, campground)=>{
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index",{campground:campground})
        }
    })
   // res.render("campgrounds",{campground: campground});
})

router.post("/",middleware.isLoggedIn ,(req, res)=>{
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.desc;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    
    //Create a new Campground and save to the DB.
    var loc = req.body.location;
    request(`https://api.opencagedata.com/geocode/v1/json?q=${loc},CA&key=55e31e9f895648eeaa6d7392b4b24119`,function(err,resp,body){
        if(err && resp.statusCode != 200){
           req.flash("error","Invalid Address");
           return res.redirect("back");
        }
        var parsedData = JSON.parse(body);
        console.log("Remaining calls to API : "+parsedData.rate.remaining);
        var lat = parsedData.results[0].geometry.lat;
        var lng = parsedData.results[0].geometry.lng;
        var location = parsedData.results[0].formatted;
        var newCampground = {name:name,price:price,image:image,description:desc,location:location,lat:lat,lng:lng,author:author};
        Campground.create(newCampground,(err, newlyCreated)=>{
            if(err){
                console.log(err);
            }else{
                console.log(newlyCreated);
                res.redirect("/campgrounds")
            }
        })
    })
})

router.get("/new",middleware.isLoggedIn,(req, res)=>{
    res.render("campgrounds/newCamp");
})

router.get("/:id", (req, res)=>{
    //Show descriptive information aboot the campground.
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground)=>{
        if(err){
            console.log(err)
        }else
        {
            res.render("campgrounds/show", {campground: foundCampground})
        }
    })
})

//EDIT CAMPGROUND ROUTE.
router.get("/:id/edit",middleware.checkCampgroundsProprietorship,(req, res)=>{
        Campground.findById(req.params.id, (err,foundCampground)=>{
           res.render("campgrounds/edit",{campgrounds:foundCampground});
        })
})
//UPDATE CAMPGROUND ROUTE.
router.put("/:id",middleware.checkCampgroundsProprietorship,(req, res)=>{
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.desc;
    var price = req.body.price;
    var loc = req.body.location;
    
    request(`https://api.opencagedata.com/geocode/v1/json?q=${loc},CA&key=55e31e9f895648eeaa6d7392b4b24119`,function(err,resp,body){
        if(err && resp.statusCode != 200){
            req.flash("error","Invalid Address");
            return res.redirect("back");
         }
         var parsedData = JSON.parse(body);
         var lat = parsedData.results[0].geometry.lat;
         var lng = parsedData.results[0].geometry.lng;
         var location = parsedData.results[0].formatted;
         var data = {
            name:name,
            price:price,
            image:image,
            description:desc,
            location:location,
            lat:lat,
            lng:lng
        }
        Campground.findByIdAndUpdate(req.params.id,data,(err,updatedcampground)=>{
            if(err){
                res.redirect("/campgrounds");
            }else{
                res.redirect("/campgrounds/"+req.params.id);
            }
        })
    })
})

//DESTROY CAMPGROUND ROUTE.

router.delete("/:id",middleware.checkCampgroundsProprietorship,(req, res)=>{
    Campground.findByIdAndRemove(req.params.id,(err)=>{
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    })
})

module.exports = router;

