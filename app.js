const express = require('express')
const cors = require('cors')
const controller = require('./controllers')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
});

app.get('/api/users', controller.getAllUsers)
app.post('/api/users', controller.createNewUser);
app.post('/api/users/:_id/exercises', controller.createExerciseEntryForUser)
app.get('/api/users/:_id/logs', controller.getAllLogsForUser)


module.exports = app;

