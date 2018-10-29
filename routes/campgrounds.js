
const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const middleware = require("../middleware");
//INDEX ROUTE TO SHOW ALL CAMPGROUNDS
//when we have a page that shows all of the campgrounds
router.get("/", function(req,res){
        
    //need to get all campgrounds from Db here
    Campground.find({},function(err,allCampgrounds){
       if(err){
            console.log(err);
       } else{
         res.render("campgrounds/index", {campgrounds: allCampgrounds}); // second campgrounds is where the data is being passed in
       }
    });
});

//CREATE ROUTE - ADD NEW CAMPGROUND TO DB
//when we have page that we want to create a new request
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, image: image, description: description, author:author}
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
});
//NEW - SHOW FORM TO CREATE NEW CAMPGROUND
//restful convention which should show form that will send data to the post route
router.get("/new",middleware.isLoggedIn, function(req,res){
    res.render("campgrounds/new");
});

//show route that will show detail about one particular thing
router.get("/:id", function(req,res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
       if(err){
           console.log(err);
       }else{
           //render show template with that campground
           console.log(foundCampground);
           res.render("campgrounds/show", {campground:foundCampground});
       }
    });
        req.params.id
});

//edit campground route 
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
        Campground.findById(req.params.id, function( err, foundCampground){
                    res.render("campgrounds/edit", {campground: foundCampground});
        });
});

//update campground route 
router.put("/:id", middleware.checkCampgroundOwnership, function(req,res){
       //find and update the correct campground

       Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err,updatedCampground){
                if(err){
                    res.redirect("/campgrounds");
                }else{
                    //redirect showere(show page)
                    res.redirect("/campgrounds/" + req.params.id); 
                }
       });
       
});

//destroy campground route 
router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    });
});


module.exports = router;