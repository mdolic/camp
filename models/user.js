const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose"); //methods that we can use for user authentication


const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

userSchema.plugin(passportLocalMongoose); ///adds the mongoose/passport to userschema 
module.exports = mongoose.model("User",userSchema);