import { rest } from 'msw';
import Faker from 'faker';

const fakePatients = [];
for (let index = 1; index <= 50; index++) {
    fakePatients.push({
        id: index,
        name: Faker.name.findName(),
        email: Faker.internet.email(),
        gender: Faker.name.gender(),
        mobile: Faker.phone.phoneNumber()
    })
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
    rest.get('/api/patients', (req, res, ctx) => {
        //check query params
        
        return res(
            ctx.status(200),
            ctx.json({
                "data": fakePatients
            })
        )
    })
]
