const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//const Author=require('./campmodel');
const reviewSchema = new Schema({
   
    rating: Number,
    body: String,
    author:'String'
});

module.exports = mongoose.model("Review", reviewSchema);

