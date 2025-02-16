const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required :true
    },
    email: {
        type: String,
        required:true
    },
    password: {
        type: String,
        required:true
    },
    avatar: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

userSchema.methods.hashPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

userSchema.methods.comparePassword = (password, hash) => {
    return bcrypt.compareSync(password, hash);
}
let User = mongoose.model("User", userSchema, 'users');

module.exports = User;