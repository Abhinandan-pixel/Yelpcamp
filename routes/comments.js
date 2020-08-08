var express = require("express");
var router = express.Router();
var Campground = require("../models/campground")
var Comment = require("../models/comments");
var middleware = require("../middleware")
const { route } = require("./campgrounds");
router.get("/campgrounds/:id/comments/new",middleware.isLoggedIn,(req, res)=>{
    Campground.findById(req.params.id,(err, campground)=>{
        if(err){
            console.log("err");
        }else
        {
            res.render("comments/new",{campground:campground})
        }
    })
})

router.post("/campgrounds/:id/comments",middleware.isLoggedIn,(req, res)=>{
    Campground.findById(req.params.id,(err, campground)=>{
        if(err){
            console.log("error");
        }else{
            let text = req.body.text;
            let comment = {
                text:text
            }
            Comment.create(comment,(err,comment)=>{
                if(err){
                    req.flash("error","Something went wrong !!!")
                    res.redirect("/campgrounds");
                }else{
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success","Successfully added comment");
                    res.redirect(`/campgrounds/${campground._id}`);
                }
            })
        }
    })
});
//EDIT ROUTE.
router.get("/campgrounds/:id/comments/:comment_id/edit",middleware.checkCommentOwnership,(req, res)=>{
    var campground_id = req.params.id;
    Comment.findById(req.params.comment_id,(err,comment)=>{
        if(err){
            res.redirect("back");
        }else{
            res.render("comments/edit",{campground_id:campground_id,comment:comment});
        }
    })
})
//UPDATE ROUTE.
router.put("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership,(req, res)=>{
    var data = {
        text: req.body.text
    }
    Comment.findByIdAndUpdate(req.params.comment_id,data,(err,updateComment)=>{
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})
// DESTROY ROUTE.
router.delete("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership,(req, res)=>{
    Comment.findByIdAndRemove(req.params.comment_id,(err)=>{
        if(err){
            res.redirect("back");
        }else{
            req.flash("success","Comment deleted");
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
})
module.exports = router;


