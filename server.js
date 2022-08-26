const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app')

require('dotenv').config()
dotenv.config({ path: './sample.env' });

mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log('mongodb connection successful')
})

const port = process.env.PORT || 3000;
const listener = app.listen(port, () => {
    console.log('Your app is listening on port ' + listener.address().port)
})
