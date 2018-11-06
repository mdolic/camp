const express = require("express");
const router = express.Router({mergeParams: true});
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");
//===========================================================================
//comments nested routers
//===========================================================================

//islogged function added here to verify if user is logged in before they can comment
//if user is not logged in, it will redirect them
//comments new
router.get("/new", middleware.isLoggedIn, function(req,res){ 
    //find campground by id here
    Campground.findById(req.params.id, function(err,campground){ // you get a null property error so you add in the mergeparams true upabove to resolve
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground: campground});
        }
    });
});
//comments create
router.post("/", middleware.isLoggedIn, function(req,res){
    //look up campground using ID
    Campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            console.log();
            Comment.create(req.body.comment,function(err,comment){//create new comment
                if(err){
                    console.log(err);
                }else{
                    //add username and id to comment here
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    
                    campground.comments.push(comment);  //connect new comment to campground
                    campground.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect("/campgrounds/" + campground._id);    //redirect campground show page
                }
            });
        }
    });
});
//comments edit route 

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error","No campground found!");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err,foundComment){
            if(err){
                res.redirect("back");
            }else{
                res.render("comments/edit", {campground_id: req.params.id, comment:foundComment});
            }
        });
    });
});

//comments update route 
//campgrounds/:id/comments/:comment_id
router.put("/:comment_id", middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err,UpdatedComment){
        if(err){
            res.redirect("back");
        }else{
            //sends back to show page of comment id
            req.flash("success","Successfully updated comment");
            res.redirect("/campgrounds/"+ req.params.id);
        }
    });
});

//comment destroy route 
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req,res){
   Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }else{
            req.flash("success", "Comment successfully deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});
 

module.exports = router;