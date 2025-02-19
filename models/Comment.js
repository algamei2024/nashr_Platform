const mongoose = require('mongoose');
const Post = require('./Post'); 
const User = require('./User');

const commentSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comment: {
        type: String,      
    },
    report: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    ],
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
commentSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Comment = mongoose.model('Comment', commentSchema, 'comments');
module.exports = Comment;