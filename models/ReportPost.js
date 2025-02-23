const mongoose = require('mongoose');
const User = require('./User');
const Post = require('./Post');

const ReportPostSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    reports: [{
        type: String,
        required: true
    }],
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    }
});

let ReportPost = mongoose.model('ReportPost', ReportPostSchema, 'reportsPost');
module.exports = ReportPost;