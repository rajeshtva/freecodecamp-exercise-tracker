const { MongoMemoryServer } = require("mongodb-memory-server");
const supertest = require("supertest");
const app = require("./app");
const mongoose = require('mongoose');
const User = require("./models/user");
const Exercise = require("./models/exercise");
const { format } = require("date-fns");

describe("features", () => {

    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());
    })

    afterAll(async () => {
        await mongoose.disconnect();
        mongoose.connection.close();
    })

    test("/api/users returns list of all users,", async () => {
        await User.insertMany([{ username: 'rajeshtva' }, { username: 'HelloWorld' }]);

        const { statusCode, body } = await supertest(app).get('/api/users')
        // console.log(await User.find().select('-__v'))
        expect(body.length).toBe(2);
        expect(statusCode).toBe(200);
    })

    test('/api/post throws error when duplicate username is posted', async () => {
        const data = { username: 'rajeshtva' }
        const response = await supertest(app).post('/api/users').send(data)
            .set('Content-type', 'application/x-www-form-urlencoded');

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                error: 'invalid input'
            })
        )

    })

    test('/api/post creates a user and returns data in desired format.', async () => {
        const data = { username: 'rajeshtva2' };

        const response = await supertest(app)
            .post('/api/users')
            .send(data)
            .set('Content-type', 'application/x-www-form-urlencoded');

        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual(
            expect.objectContaining({
                _id: expect.any(String),
                username: expect.any(String)
            }))
    })

    test('/api/users/_id/exercises --> POST works with valid data', async () => {
        const user = await User.create({ username: 'user3' })
        const data = {
            duration: 30,
            description: 'One step for moon',
            date: 'Mon Jan 01 1990'
        }

        const response = await supertest(app).post(`/api/users/${user._id.toString()}/exercises`)
            .set('Content-type', 'application/x-www-form-urlencoded')
            .send(data)

        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual(
            expect.objectContaining({
                _id: expect.any(String),
                username: expect.any(String),
                description: expect.any(String),
                duration: expect.any(Number),
                date: expect.any(String)
            }))

    })

    test('/api/users/:_id/logs returns all logs', async () => {
        let exerciseData = [
            { duration: 30, description: 'lorem ipsum2', date: 'Jan 04 1992 UTC', },
            { duration: 50, description: 'lorem ipsum3', date: 'Jan 04 1993 UTC', },
            { duration: 90, description: 'lorem ipsum4', date: 'Jan 04 1994 UTC', },
        ]
        let user = await User.create({ username: 'user4' })
        // exerciseData = exerciseData.map((it => { it.userId = user._id.toString(); return it; }));

        // exerciseData = await Exercise.insertMany(exerciseData)
        user.exercises.push(...exerciseData);
        user = await user.save();
        // console.log(user);

        const { statusCode, body } = await supertest(app).get(`/api/users/${user._id.toString()}/logs`);

        expect(statusCode).toBe(200);
        expect(body.log.length).not.toBe(0);
    })

    test('/GET --> /api/users/:_id/logs?limit=&from=&to=', async () => {
        let exerciseData = [
            { duration: 30, description: 'lorem ipsum2', date: 'Jan 04 1994 UTC', },
            { duration: 50, description: 'lorem ipsum3', date: 'Jan 05 1994 UTC', },
            { duration: 90, description: 'lorem ipsum4', date: 'Feb 08 1994 UTC', },
            { duration: 90, description: 'lorem ipsum4', date: 'Mar 10 1994 UTC', },
            { duration: 90, description: 'lorem ipsum4', date: 'Apr 11 1994 UTC', },
            { duration: 90, description: 'lorem ipsum4', date: 'Apr 15 1994 UTC', },
            { duration: 90, description: 'lorem ipsum4', date: 'Apr 16 1994 UTC', },
            { duration: 90, description: 'lorem ipsum4', date: 'Apr 17 1994 UTC', },
            { duration: 80, description: 'lorem ipsum5', date: 'Apr 17 1994 UTC', },
            { duration: 90, description: 'lorem ipsum4', date: 'May 02 1994 UTC', },
            { duration: 90, description: 'lorem ipsum4', date: 'May 04 1994 UTC', },
            { duration: 90, description: 'lorem ipsum4', date: 'May 10 1994 UTC', },
            { duration: 90, description: 'lorem ipsum4', date: 'May 11 1994 UTC', },
            { duration: 90, description: 'lorem ipsum4', date: 'May 14 1994 UTC', },
        ]
        const user = await User.create({ username: 'user5', exercises: exerciseData })

        const { statusCode, body } = await supertest(app)
            .get(`/api/users/${user._id.toString()}/logs?from=1994-04-01&to=1994-05-14`);

        expect(statusCode).toBe(200);
        expect(body.log.length).not.toBe(0);
        expect(body.log.length).toBe(10);
        // console.log(body)
    })

})
