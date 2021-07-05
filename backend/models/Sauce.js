const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
    
    name: { type: String, required: true, maxLength:15 },
    manufacturer: { type: String, required: true, maxLength:15},
    description: { type: String, required: true, minLength:10 },
    heat: { type: Number, required: true, max:10 },
    likes: { type: Number, required: true },
    dislikes: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    mainPepper: { type: String, required: true, maxLength:15 },
    usersLiked: { type: [String], required: true},
    usersDisliked: { type: [String], required: true},
    userId: { type: String, required: true },
});

module.exports = mongoose.model('Sauce', sauceSchema);