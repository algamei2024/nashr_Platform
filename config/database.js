const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://malgamei2024:<ZtMZJQZhwogM0hqb>@nashr.j42io.mongodb.net/<nashr>?retryWrites=true&w=majority&appName=Nashr').then((con) => {
    //console.log('successfully');
}).catch((err) => {
    console.log('error');
});
