//all middleware code here
const middlewareObj = {};
const Campground = require("../models/campground");
const Comment = require("../models/comment");

middlewareObj.checkCampgroundOwnership = function(req, res,next){
        if(req.isAuthenticated()){ 
            Campground.findById(req.params.id, function( err, foundCampground){
                if(err || !foundCampground){
                    req.flash("error", "Campground not found");
                    res.redirect("back");
                }else{
                    //does user own campground?
                    if(foundCampground.author.id.equals(req.user._id)){
                        next(); // this is if user is the right user  and logged in, they can continue doing what they wanted
                    }else{
                        req.flash("error", "You don't have permisson to do that!");
                        res.redirect("back");
                    }
                }
            });
        }else{
            req.flash("You must be signed in to do that!");
            res.redirect("back");
        }
}

middlewareObj.checkCommentOwnership = function(req,res,next){
        if(req.isAuthenticated()){
            
            Comment.findById(req.params.comment_id, function( err, foundComment){
                if(err || !foundComment){
                    req.flash("error","Comment not found");
                    res.redirect("back");
                }else{
                    //does user own comment?
                    if(foundComment.author.id.equals(req.user._id)){
                        next(); // this is if user is the right user  and logged in, they can continue doing what they wanted
                    }else{
                        req.flash("error", "You don't have permission to do that!");
                        res.redirect("back");
                    }
                }
            });
        }else{
            req.flash("error", "You must be signed in to do that");
            res.redirect("back");
        }     
}

middlewareObj.isLoggedIn = function(req,res,next){
        //middleware to check if they are logged in before adding new campground
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error","You must be signed in to do that!"); //determines if its green or red// just giving ability to access flash
        res.redirect("/login");
 
}
module.exports = middlewareObj;