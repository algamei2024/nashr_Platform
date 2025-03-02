const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://malgamei2024:<db_password>@nashr.j42io.mongodb.net/?retryWrites=true&w=majority&appName=Nashr').then((con) => {
    //console.log('successfully');
}).catch((err) => {
    console.log('error');
});
