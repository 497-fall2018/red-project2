const mongoose = require('mongoose');

const diningSchema = new mongoose.Schema({
    name: String,
    rating: Number,
    hours: String,
    isHall: Boolean,
    menuIds: [String],
    foodIds: [String]
});

module.exports = mongoose.model('Dining', diningSchema);