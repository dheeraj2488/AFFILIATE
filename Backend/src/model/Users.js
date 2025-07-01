const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email : { type: String ,required: true, unique: true},
    password : { type: String ,required: false},
    name : {type: String , required: true, },
    isGoogleUser: { type: String, required: false },
    googleId: { type: String, required: false },
    role:{type : String, default: "admin"},
    adminId : {type : mongoose.Schema.Types.ObjectId, ref: 'Users', index: true}, // index is used for faster lookups , for faster queries
    // we are doing role based authentication
    //now we have different users under different admins
    //for example now :
    //role :Admin : id : 1234 
    //role :developer : id : 4567, adminId : 1234
    //role :viewer : id : 8910, adminId : 1234

    // so these both developer and viewer are under admin 1234
});

const Users = mongoose.model('Users', userSchema);

module.exports = Users;