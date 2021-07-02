const mongoose = require('mongoose');

const thingSchema = mongoose.Schema({
    
    name: {type: String, required: true},
    manufacturer: {type: String, required: true},
    description: {type: String, required: true},
    mainPepper: {type: String, required: true},
    imageUrl: {type: String, required: true},
    heat: {type: Number, min:1, max: 10, required: true},
    likes: {type: Number, required: true},
    dislikes: {type: Number, required: true},
    usersLiked: {type: Array},
    usersDisliked: {type: Array},
});

module.exports = mongoose.model('Things', thingSchema);