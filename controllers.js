const User = require('./models/user')
const Exercise = require('./models/exercise')
const { format } = require('date-fns')
const fs = require('fs')

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
        reqWriteStream.write(JSON.stringify([req.body, req.query, req.params]))
        let user = await User.findById(req.params._id)
        const exercise = await Exercise.create({ ...req.body, userId: user._id });

        const data = {
            _id: user._id,
            username: user.username,
            description: exercise.description,
            duration: exercise.duration,
            date: exercise.date.toDateString(),
        }

        return res.json(data);
    } catch (error) {
        return res.json({ error: 'invalid input' })
    }
}

exports.getAllLogsForUser = async (req, res) => {
    try {
        reqWriteStream.write(JSON.stringify([req.body, req.query, req.params]))
        const user = await User.findById(req.params._id);
        const filter = { userId: user._id }

        const { to, from, limit } = req.query;

        if (to || from) {
            filter.date = {}
        }

        if (to) {
            filter.date.$lt = new Date(to)
        }

        if (from) {
            filter.date.$gt = new Date(from)
        }

        let query = Exercise.find(filter)
        if (limit) {
            query = query.limit(+limit)
        }

        let log = await query;

        if (!log) { return res.send('invalid input') }

        log = log.map(l => ({
            description: l.description,
            duration: l.duration,
            date: l.date.toDateString()
        }))

        const data = {
            username: user.username,
            count: log.length,
            _id: user._id.toString(),
            log: log,
        }
        return res.json(data)
    } catch (error) {
        console.log(error)
        res.json({ error: 'invalid input' })
    }
}
