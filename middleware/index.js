//Middlewares.
var Campground = require("../models/campground")
var Comment = require("../models/comments")
var middlewareObj = {};
middlewareObj.checkCampgroundsProprietorship = function(req, res, next) {
    if (req.isAuthenticated()) {
        //User checking ,if user owns that campground.
        Campground.findById(req.params.id, (err, foundCampground) => {
            if (err) {
                req.flash("error","Campground not found");
                res.redirect("/campgrounds");
            } else {
                if (foundCampground.author.id.equals(req.user._id) || req.user.isAdmin)
                    next();
                else{
                    req.flash("error","You dont't have permission to do that")
                    res.redirect("back")
                }
            }
        })

    } else {
        req.flash("error","You need to be Logged In")
        res.redirect("back")
    }
} 

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,(err,foundComment)=>{
            if(err){
                res.redirect("campgrounds/"+req.params.id);
            }else{
                if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                }else{
                    req.flash("error","You don't have permission to do that !!!")
                    res.redirect("back");
                }
            }
        })
    } else{
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be Logged In")
    res.redirect("/login");
}

module.exports = middlewareObj;