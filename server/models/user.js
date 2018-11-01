const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: String,
    diet: String,
    preferences: [Boolean],
    favFoodsIDs: [String]  
});

module.exports = mongoose.model('User', userSchema);