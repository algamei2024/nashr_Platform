const express = require('express');
const router = express.Router();
const multer = require('multer');
const passport = require('passport');
const Post = require('../models/Post');
const fs = require('fs');
const path = require('path');
const { route } = require('./user-route');
const { runInNewContext } = require('vm');
const User = require('../models/User');
const Comment = require('../models/Comment');
const { count } = require('console');


//=========================================
isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}
//=============================================
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/posts/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});
var upload = multer({ storage: storage });
router.get('/create', isAuthenticated, (req, res) => {
    res.render('comm/uploadA');
});

router.post('/create', upload.single('file'), (req, res) => {
    //countF ممكن كحماية يعني كلما يرفع ملف ينقص العدد الي ان يصبح 0 واذا اصبح صفر خلاص ما عاد اخليه يرفع
    if (req.body.postId === "none") {
        let newPost = new Post();
        newPost.userId = req.user._id;
        newPost.content = req.body.content;
        newPost.files = [req.file.path];
        let countFile = parseInt(req.body.countF);
        newPost.countF = countFile;
        newPost.save().then((post) => {
            let postId = post._id;
            res.status(200).json({
                message: "file upload success",
                postId: postId
            });
        }).catch((error) => {
            res.status(200).json({
                message: "Error upload file in upload",
                error: error
            });
        })
    }
    else {
        let postId = req.body.postId;
        filePath = req.file.path;
        Post.findByIdAndUpdate(postId, { $push: { files: filePath } }, { new: true }).then((post) => {
            res.status(200).json({
                message: "file update success",
                postId: post._id
            });
        }).catch((error) => {
            res.status(200).json({
                message: "Error upload file in update",
                error: error
            });
        });
    }
});

const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|tiff|svg|webp|heic|ico)$/i;
router.get('/mePosts', isAuthenticated, (req, res) => {
    Post.find({ userId: req.user._id }).then((posts) => {
        res.render('comm/mePosts', {
            posts: posts,
            imageExtensions: imageExtensions
        })
    }).catch((error) => {
        console.log('error in get posts');
    });
});
//edit post
router.post('/editPost', isAuthenticated, (req, res) => {
    Post.findById(req.body.postId).then((post) => {
        res.render('comm/editPost', {
            post,
            imageExtensions
        });
    }).catch((error) => {
        res.redirect('/');
    });
});
//update
router.post('/update', upload.single('file'), (req, res) => {
    let postId = req.body.postId;
    if (req.body.fileDel) {
        let fileDel = JSON.parse(req.body.fileDel);
        fileDel.forEach((file) => {
            //del from storage
            filePath = path.join(__dirname, '../' + file);
            console.log(filePath);
            fs.unlink(filePath, (error) => {
                if (error) {
                    console.error('حدث خطأ أثناء حذف الملف:', err);
                }
                else {
                    console.log('تم حذف الملف بنجاح', filePath);
                    //del from database
                    Post.findByIdAndUpdate(postId, {
                        $pull: { files: file }
                    }, { new: true }).then((post) => {

                    }).catch((error) => {
                    });
                }
            });
        });
        filePath = req.file.path;
        Post.findByIdAndUpdate(postId,
            {
                $push: { files: filePath },
                $set: { content: req.body.content }
            },
            { new: true }).then((post) => {
                res.status(200).json({
                    message: "file update success"
                });
            }).catch((error) => {
                res.status(200).json({
                    message: "Error upload file in update one update error",
                    error: error
                });
            });
    }
    else {
        filePath = req.file.path;
        Post.findByIdAndUpdate(postId, { $push: { files: filePath } }, { new: true }).then((post) => {
            res.status(200).json({
                message: "file update success",
                postId: post._id
            });
        }).catch((error) => {
            res.status(200).json({
                message: "Error upload file in update",
                error: error
            });
        });
    }
});
//delete post
router.post('/delete', isAuthenticated, (req, res) => {
    Post.findById(req.body.postId).then((post) => {
        let files = post.files;
        files.forEach((file) => {
            filePath = path.join(__dirname, '../' + file);
            console.log(filePath);
            fs.unlink(filePath, (error) => {
                if (error) {
                    console.error('حدث خطأ أثناء حذف الملف:', err);
                }
                else {
                    console.log('تم حذف الملف بنجاح', filePath);
                }
            });
        });
    }).catch((err) => {
        res.redirect('/');
    });
    Post.deleteOne({ _id: req.body.postId }).then((post) => {
        res.redirect('/post/mePosts');
    }).catch((error) => {
        console.log('error');
    });
});
//post like
router.get('/like/:postId', isAuthenticated, (req, res) => {
    const { postId } = req.params;
    const userId = req.user._id;
    //=
    countLikes = 0;
    Post.findById(postId).then(async(post) => {
        const index = post.likes.indexOf(userId);
        if (index !== -1) {
            lastLikeUser = null;
            post.likes.splice(index, 1);
            countLikes = post.likes.length;
            if (index == 0) {
                post.lastLike = '';
            }
            else {
                post.lastLike = post.likes[index - 1];
                lastLikeUser = await User.findById(post.likes[index - 1]);
            }
            post.save().then((result) => {
                return res.status(200).json({
                    message: "no",
                    countLikes,
                    lastLikeUser: lastLikeUser.name
                });
            }).catch((error) => { });
        }
        else {
            post.likes.push(userId);
            post.lastLike = req.user._id;
            countLikes = post.likes.length;
            post.save().then((result) => {
                return res.status(200).json({
                    message: "yes",
                    countLikes
                });
            }).catch((error) => { });
        }
       
    }).catch((err) => {

    });
});
router.post('/like/users', isAuthenticated, async (req, res) => {
    const postId = req.body.postId;
    const postLikeUser = await Post.findById(postId).populate('likes', 'name avatar').exec();
    res.render('comm/likesP', {
        postLikeUser
    });
});
router.post('/comment', isAuthenticated, async (req, res) => {
    const postId = req.body.postId;
    let post = await Post.findById(postId).populate('userId', 'name avatar').populate('lastLike','name avatar').exec();
    const comments = await Comment.find({ postId: postId }).populate('userId', 'name avatar');
    post.comments = comments;
    res.render('comm/comment.ejs', {
        post,
        imageExtensions,
    });
});
router.post('/addComment', isAuthenticated, (req, res) => {
    const postId = req.body.postId;
    const userId = req.user._id;
    const comment = req.body.comment;
    let newComment = new Comment();
    newComment.postId = postId;
    newComment.userId = userId;
    newComment.comment = comment;
    newComment.save().then((comment) => {
        res.redirect('/');
    }).catch((err) => { });
});
router.post('/editComment', isAuthenticated, (req, res) => {
    const commentId = req.body.commentId;
    const comment = req.body.comment;
    Comment.findByIdAndUpdate(commentId, {
        comment: comment
    }).then(result => {
        res.redirect('/');
    }).catch(err => { })
});
router.post('/delComment', isAuthenticated, (req, res) => {
    const commentId = req.body.commentId;
    Comment.findOneAndDelete({ _id: commentId, userId: req.user._id }).then(result => {
        res.redirect('/');
    }).catch(err => { });
});
router.get('/comment/report/:commentId', isAuthenticated, async (req, res) => {
    const commentId = req.params.commentId;
    const userId = req.user._id;
    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            throw new Error('Comment not found');
        }
        if (comment.report.length > 200) {
            await Comment.findByIdAndDelete(commentId);
        } else {
            if (!comment.report.includes(userId)) {
                comment.report.push(userId);
                await comment.save();
            }
        }
        res.redirect('/');
    } catch (ex) {
        res.redirect('/');
    }
});
module.exports = router;