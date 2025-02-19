const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const db = require('./config/database');
const Post = require('./models/Post');
const User = require('./models/User');
const passportSetup = require('./config/passport-setup');
const multer = require('multer');
const upload = multer({ dest: '/uploads' });
app.set('view engine', 'ejs');
//======
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//=========
app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(express.static('uploads'));
app.use(express.static('nashr'));
//=========
app.use(session({
    secret: 'algamei-dsa33dla3l',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 * 15 }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
//=========
app.use('*', (req, res, next) => {
    res.locals.user = req.user || null;
    next();
})
//=========
isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}
const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|tiff|svg|webp|heic|ico)$/i;
app.get('/', isAuthenticated, async(req, res) => {
    try {
        const posts = await Post.find().populate('userId', 'name email avatar').populate('lastLike','name avatar').exec();
        res.render('comm/index', {
            successf: req.flash('successf'),
            posts,
            imageExtensions
        });
    } catch (ex) {
        
    }
});
//========user route=========
const users = require('./routes/user-route');
app.use('/', users);
//===========post route===============
const posts = require('./routes/user-post-route');
app.use('/post', posts);
app.get('/test', (req, res) => {
    res.render('comm/test');
});
app.listen(3000, () => {
    //console.log('server listen');
})