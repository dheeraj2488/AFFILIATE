const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email : { type: String ,required: true, unique: true},
    password : { type: String ,required: false},
    name : {type: String , required: true, },
    isGoogleUser: { type: String, required: false },
    googleId: { type: String, required: false },

});

const Users = mongoose.model('Users', userSchema);

module.exports = Users;