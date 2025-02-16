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
module.exports = router;