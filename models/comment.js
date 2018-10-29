const mongoose = require("mongoose");


//schema for comments
const commentSchema = mongoose.Schema({
    text: String,
    author:
    {
        id:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    }
});



module.exports = mongoose.model("Comment",commentSchema);