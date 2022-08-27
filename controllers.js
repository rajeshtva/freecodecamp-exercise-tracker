const User = require('./models/user')
const Exercise = require('./models/exercise')
const { format } = require('date-fns')
const fs = require('fs')
const { exit } = require('process')

let reqWriteStream = fs.createWriteStream('./req.json')


const catchAsync = (f) => {
    return async (req, res, next) => {
        await f(req, res, next).catch(next)
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-__v');
        return res.json(users)

    } catch (error) {
        console.log(error)
    }
}

exports.createNewUser = async (req, res) => {


    try {
        reqWriteStream.write(JSON.stringify([req.body, req.query, req.params]))
        const user = await User.create(req.body);
        return res.json(user)
    } catch (error) {
        return res.json({ error: 'invalid input' })
    }
}

exports.createExerciseEntryForUser = async (req, res) => {
    try {
        // reqWriteStream.write(JSON.stringify([req.body, req.query, req.params]))

        let user = await User.findById(req.params._id)

        if (!req.body.date) {
            req.body.date = new Date().toISOString().substring(0, 10);
        }

        await Exercise.validate(req.body);
        user.exercises.push(req.body)
        user = await user.save()

        const latestExercise = user.exercises[user.exercises.length - 1]

        const data = {
            _id: user._id,
            username: user.username,
            description: latestExercise.description,
            duration: latestExercise.duration,
            date: latestExercise.date.toDateString(),
        }

        return res.json(data);
    } catch (error) {
        console.log(error)
        return res.json({ error: 'invalid input' })
    }
}

exports.getAllLogsForUser = async (req, res) => {
    try {
        const user = await User.findById(req.params._id).select('username _id, exercises');
        const { to, from, limit } = req.query;
        let fromDate = new Date(0), toDate = new Date();

        if (to) {
            toDate = new Date(to)
        }

        if (from) {
            fromDate = new Date(from)
        }

        toDate = toDate.getTime();
        fromDate = fromDate.getTime();

        let log = user.exercises.filter((item) => {
            let itemDate = new Date(item.date).getTime()

            return fromDate <= itemDate && itemDate <= toDate;
        })

        if (limit) {
            log = log.splice(0, +limit);
        }

        if (!log) { return res.send('invalid input') }

        log = log.map(l => ({
            description: l.description,
            duration: l.duration,
            date: l.date.toDateString()
        }));

        const data = {
            username: user.username,
            count: log.length,
            _id: user._id.toString(),
            log,
        }

        return res.json(data)
    } catch (error) {
        console.log(error)
        res.json({ error: 'invalid input' })
    }
}
