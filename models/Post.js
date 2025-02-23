const mongoose = require('mongoose');
const User = require('./User');

const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String
    },
    files: [{ type: String }],
    countF: {
        type: Number,
        default:0
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    lastLike: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    show: {
        type: String,
        default: '1',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now,
        required: true
    }
});

postSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});
const Post = mongoose.model('Post', postSchema, 'posts');
module.exports = Post;