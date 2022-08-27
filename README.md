# Exercise Tracker

This is the boilerplate for the Exercise Tracker project. Instructions for building your project can be found at https://www.freecodecamp.org/learn/apis-and-microservices/apis-and-microservices-projects/exercise-tracker

**i tried even this. but date didn't work.**

```js
const aggregate = [{ $match: { userId: { $eq: user._id } } }];

if (req.query.from || req.query.to) {
  aggregate[0].$match.date = {};
}

if (req.query.from) {
  aggregate[0].$match.date.$gte = new Date(req.query.from);
}

if (req.query.to) {
  aggregate[0].$match.date.$lte = new Date(req.query.to);
}
// let logs = await Exercise.find().where('userId', user._id)

if (req.query.limit) {
  aggregate.push({ $limit: ~~req.query.limit });
}

aggregate.push({
  $project: {
    duration: "$duration",
    description: "$description",
    date: {
      $dateToString: {
        date: "$date",
        format: format("$date", "eee LLL dd yyyy"),
      },
      convert,
    },
  },
});
let logs = await Exercise.aggregate(aggregate);
```

# controller file copied from replit

```js
const User = require("./models/user");
const Exercise = require("./models/exercise");
const { format } = require("date-fns");

const catchAsync = (f) => {
  return async (req, res, next) => {
    await f(req, res, next).catch(next);
  };
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-__v");
    return res.json(users);
  } catch (error) {
    console.log(error);
  }
};

exports.createNewUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    return res.json(user);
  } catch (error) {
    return res.json({ error: "invalid input" });
  }
};

exports.createExerciseEntryForUser = async (req, res) => {
  try {
    let user = await User.findById(req.params._id);
    const exercise = await Exercise.create({ ...req.body, userId: user._id });

    const data = {
      _id: user._id,
      username: user.username,
      description: exercise.description,
      duration: exercise.duration,
      date: exercise.date,
    };

    return res.json(data);
  } catch (error) {
    return res.json({ error: "invalid input" });
  }
};

exports.getAllLogsForUser = async (req, res) => {
  try {
    const user = await User.findById(req.params._id);
    const filter = { userId: user._id };

    const { to, from, limit } = req.query;

    if (to || from) {
      filter.date = {};
    }

    if (to) {
      filter.date.$lte = new Date(to);
    }

    if (from) {
      filter.date.$gte = new Date(from);
    }

    let query = Exercise.find(filter);
    if (limit) {
      query = query.limit(~~limit);
    }

    let log = await query;

    if (!log) {
      return res.send("invalid input");
    }

    log = log.map((l) => ({
      description: l.description,
      duration: l.duration,
      date: l.date,
    }));

    const data = {
      username: user.username,
      count: log.length,
      _id: user._id.toString(),
      log: log,
    };

    console.log(req.originalUrl, data);

    return res.json(data);
  } catch (error) {
    console.log(error);
    res.json({ error: "invalid input" });
  }
};

// exports.getAllLogsForUser = (req, res) => {
//   const { from, to, limit } = req.query;
//   const {_id} = req.params;
//   User.findById(_id, (err, userData) => {
//     if(err || !userData) {
//       res.send("Could not find user");
//     }else{
//       let dateObj = {}
//       if(from){
//         dateObj["$gte"] = new Date(from)
//       }
//       if(to){
//         dateObj["$lte"] = new Date(to)
//       }
//       let filter = {
//         userId: _id
//       }
//       if(from || to ){
//         filter.date = dateObj
//       }
//       let nonNullLimit = limit ?? 500
//       Exercise.find(filter).limit(+nonNullLimit).exec((err, data) => {
//         if(err || !data){
//           res.json([])
//         }else{
//           const count = data.length
//           const rawLog = data
//           const {username} = userData;
//           const log= rawLog.map((l) => ({
//             description: l.description,
//             duration: l.duration,
//             date: l.date
//           }))
//           res.json({username, count, _id, log})
//         }
//       })
//     }
//   })
// }
```
