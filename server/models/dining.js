const mongoose = require('mongoose');

const diningSchema = new mongoose.Schema({
    name: String,
    rating: Number,
    hours: String,
    foodIDs: [String]
});

module.exports = mongoose.model('Dining', diningSchema);