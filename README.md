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
