const mongoose = require("mongoose");

//yelpcamp schema setup
let campgroundSchema = new mongoose.Schema({
    name:String,
    price:String,
    image:String,
    description: String,
    author:
    {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    },
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
    ]
});
//model that will use the above schema
module.exports = mongoose.model("Campground",campgroundSchema);
