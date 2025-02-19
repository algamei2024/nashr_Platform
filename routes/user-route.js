const express = require('express');
const router = express.Router();
const multer = require('multer');
const passport = require('passport');
const User = require('../models/User');
const Post = require('../models/Post');
const fs = require('fs');
const path = require('path');
//=========================================
isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

router.get('/login', (req, res) => {
    res.render('user/login', {
        error: req.flash('error')
    });
});
router.post('/login', passport.authenticate('local.login', {
    successRedirect: '/',
    failureRedirect: '/login',
    passReqToCallback: true
}));
router.get('/signup', (req, res) => {
    res.render('user/signup', {
        error: req.flash('error')
    });
});
router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/avatar',
    failureRedirect: '/signup',
    failureFlash: true
}));

router.get('/profile', isAuthenticated, (req, res) => {
    res.render('user/profile');
});
router.get('/edit', isAuthenticated, (req, res) => {
    res.render('user/edit');
});
router.post('/edit', isAuthenticated, (req, res) => {
    let newFields = {
        name: req.body.name,
        description: req.body.description
    };
    User.updateOne({ _id: req.user._id }, newFields).then((result) => {
        console.log('successfully');
        res.redirect('/profile');
    }).catch((err) => {
        res.status(400).send('Filed.');
        res.redirect('/edit', {
            error: 'حاول مرة اخرى.'
        });
    });
});
router.get('/avatar', isAuthenticated, (req, res) => {
    res.render('user/avatar');
});
var storageAvatar = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/profiles')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});
var uAvatar = multer({ storage: storageAvatar });
router.post('/avatar', uAvatar.single('file'), (req, res) => {
    let oldAvatar = req.user.avatar;
    if (oldAvatar != "uploads/profiles/profile.png") {
        filePath = path.join(__dirname, '../' + oldAvatar);
        console.log(filePath);
        fs.unlink(filePath, (error) => {
            if (error) {
                console.error('حدث خطأ أثناء حذف الملف:', err);
            }
            else {
                console.log('تم حذف الملف بنجاح', filePath);
            }
        });
    }
    let newFields = {
        avatar: req.file.path
    };
    User.updateOne({ _id: req.user._id }, newFields).then((result) => {
        console.log('successfully');
        res.status(200).send('File uploaded and saved to database.');
    }).catch((err) => {
        res.status(400).send('Filed.');
        res.redirect('/descrip');
    });
});
router.get('/descrip', isAuthenticated, (req, res) => {
    res.render('user/descrip');
});
router.post('/descrip', isAuthenticated, (req, res) => {
    let newFields = {
        description: req.body.description
    };
    User.updateOne({ _id: req.user._id }, newFields).then((result) => {
        //console.log('yes e');
        res.redirect('/');
    }).catch((err) => {
        res.redirect('/descrip');
    });
});
router.get('/logout',(req, res) => {
    req.logout;
    res.redirect('/login');
});
const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|tiff|svg|webp|heic|ico)$/i;
router.get('/user/about/:userId', async (req, res) => {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    const posts = await Post.find({ userId: userId }).populate('lastLike','name');
    res.render('user/about', {
        user,
        posts,
        imageExtensions
    });
});
module.exports = router;