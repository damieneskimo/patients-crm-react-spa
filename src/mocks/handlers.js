import { rest } from 'msw';
import Faker from 'faker';

const fakePatients = [];
const fakeNotes = [];
const numOfPatients = 50;
for (let index = 1; index <= numOfPatients; index++) {
    fakePatients.push({
        id: index,
        name: Faker.name.findName(),
        email: Faker.internet.email(),
        gender: Faker.random.arrayElement([
            'male', 'female', 'rather not say'
        ]),
        mobile: Faker.phone.phoneNumber()
    })

    fakeNotes[index] = [];
    for (let i = 1; i <= 5; i++) {
        fakeNotes[index].push({
            id: i,
            content: Faker.lorem.sentences(),
            created_at: new Date(Faker.date.past()).toDateString()
        })
    }
}

export const handlers = [
    rest.get('/sanctum/csrf-cookie ', (req, res, ctx) => {
        // req.headers({'withCredentials': true})
        return res(
            // Calling `ctx.cookie()` sets given cookies
            // on `document.cookie` directly.
            ctx.cookie('XSRF-TOKEN', 'abc-123'),
        )
    }),
    rest.post('/login', (req, res, ctx) => {
        console.log(req.cookies)

        // Persist user's authentication in the session
        sessionStorage.setItem('loggedIn', 'true')

        return res(
            // Respond with a 204 status code
            ctx.status(204),
        )
    }),
    rest.post('/logout', (req, res, ctx) => {
        // clear the session
        sessionStorage.clear()

        return res(
            // Respond with a 204 status code
            ctx.status(204),
        )
    }),
    rest.get('/api/patients', (req, res, ctx) => {
        //todo: check query params

        return res(
            ctx.status(200),
            ctx.json({
                "data": fakePatients
            })
        )
    }),
    rest.get('/api/patients/:patientId/notes', (req, res, ctx) => {
        const { patientId } = req.params
        return res(
            ctx.status(200),
            ctx.json({
                "data": fakeNotes[patientId]
            })
        )
    })
]
