const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    diet: String,
    preferences: [String],
    faveFoodIds: [String]  
});

module.exports = mongoose.model('User', userSchema);