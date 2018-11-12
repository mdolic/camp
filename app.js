const express = require("express");
const app = express(); 
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const Campground = require("./models/campground");
const Comment = require("./models/comment");
const User = require("./models/user");
const seedDB = require("./seeds");
const methodOverride = require("method-override");
const flash = require("connect-flash");

//required route files
const commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    authRoutes = require("./routes/auth")


app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs"); //this just lets me set the view so its ejs and i dont ahve to use ejs below in renderr
app.use(express.static(__dirname + "/public"));
//seedDB(); //executes a remove or add of comments/users/campgrounds
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');

//=====================
//passport configuration
//============================
app.use(require("express-session")({
    secret: "i love my son Amari",
    resave:false,
   saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user; //inside template available
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next(); //to run next route handler
});

app.use(authRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);


//mongoose.connect('mongodb://<dbuser></dbuser>:<password>@ds159273.mlab.com:59273/dkrogue', { useNewUrlParser: true });
mongodb://<dbuser>:<dbpassword>@ds143241.mlab.com:43241/yelpcamp

var port = process.env.PORT || 3000;
mongoose.connect(port);
//heroku + mongo labs listens on localhost:5000
app.listen(port);

// //just locally on 3000 listens on localhost:3000
// app.listen(3000,function(){ 
//     console.log("Yelp camp server has started!");
// });