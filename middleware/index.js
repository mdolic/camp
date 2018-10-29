//all middleware code here
const middlewareObj = {};
const Campground = require("../models/campground");
const Comment = require("../models/comment");

middlewareObj.checkCampgroundOwnership = function(req, res,next){
        if(req.isAuthenticated()){
            
            Campground.findById(req.params.id, function( err, foundCampground){
                if(err){
                    res.redirect("back");
                }else{
                    //does user own campground?
                    if(foundCampground.author.id.equals(req.user._id)){
                        next(); // this is if user is the right user  and logged in, they can continue doing what they wanted
                    }else{
                        res.redirect("back");
                    }
                }
            });
        }else{
            res.redirect("back");
        }
}

middlewareObj.checkCommentOwnership = function(req,res,next){
        if(req.isAuthenticated()){
            
            Comment.findById(req.params.comment_id, function( err, foundComment){
                if(err){
                    res.redirect("back");
                }else{
                    //does user own comment?
                    if(foundComment.author.id.equals(req.user._id)){
                        next(); // this is if user is the right user  and logged in, they can continue doing what they wanted
                    }else{
                        res.redirect("back");
                    }
                }
            });
        }else{
            res.redirect("back");
        }     
}

middlewareObj.isLoggedIn = function(req,res,next){
        //middleware to check if they are logged in before adding new campground
        if(req.isAuthenticated()){
            return next();
        }
        res.redirect("/login");
 
}
module.exports = middlewareObj;