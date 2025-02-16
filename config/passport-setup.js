const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('../models/User');

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id).then((user) => {
        done(null, user);
    }).catch((err) => {
        done(err, false);
    });
});

//sing Strategy in passport
passport.use('local.signup', new localStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
}, (req, username, password, done) => {
    if (req.body.password.length <8) {
        return done(null, false, req.flash('error', '* يجب ان تكون كلمة السر اكثر من 8 رموز'));
    }
    else if (req.body.password != req.body.confirm_password) {
        return done(null, false,req.flash('error','* كلمة المرور غير متطابقة'));
    }
    else if(req.body.name.trim().length < 3) {
        return done(null, false, req.flash('error', '* لقد نسيت اسمك!'));
    }
    else {
        User.findOne({ email: username }).then((user) => {
            if (user) {
                return done(null, false, req.flash('error','* الحساب موجود من قبل'));
            }
            else {
                let newUser = new User();
                newUser.name = req.body.name;
                newUser.email = req.body.email;
                newUser.password = newUser.hashPassword(req.body.password);
                newUser.avatar = "uploads/profiles/profile.png";
                newUser.description = "ذكر الله احلى لا اله الا الله";
                newUser.save().then((user) => {
                    return done(null, user, req.flash('successf','اهلاً بك نورت منصتنا...'));
                }).catch((err) => {
                    console.log('error in insert new user');
                });
            }
        }).catch((err) => {
            console.warn(err)
        });
    }
}));
//======================

passport.use('local.login', new localStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback:true
}, (req, username, password, done) => {
    User.findOne({ email: username }).then((user) => {
        if (user) {
            if (user.comparePassword(password, user.password)) {
                return done(null, user, req.flash('successf', 'نورة المنصة اهلاً بعودتك لقد افتقدناك'));
            }
            else {
                return done(null, false, req.flash('error', '* كلمة المرور غلط'));
            }
        }
        else {
            return done(null, false, req.flash('error', '* لا يوجد حساب بهذا الايميل'));
        }
    }).catch((err) => {
        console.warn(err)
    });
}));