const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/nashr').then((con) => {
    //console.log('successfully');
}).catch((err) => {
    console.log('error');
});