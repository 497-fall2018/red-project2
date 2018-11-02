const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    date: String,
    timeOfDay: String,
    diningId: String,
    foodIds: [String]
});