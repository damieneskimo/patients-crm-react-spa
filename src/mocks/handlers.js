import {
  rest
} from 'msw';
import Faker, { fake } from 'faker';

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
    mobile: Faker.phone.phoneNumber(),
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
  rest.post('/login', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        user: {
          email: 'admin@test.com',
          name: 'admin',
          token: 'test-token'
        }
      })
    )
  }),
  rest.post('/logout', (req, res, ctx) => {
    return res(
      // Respond with a 204 status code
      ctx.status(204),
    )
  }),
  rest.get('/api/me', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        "user": {
          "id": 1,
          "name": "admin",
          "email": "admin@test.com",
        }
      })
    )
  }),
  rest.get('/api/patients', (req, res, ctx) => {
    const page = req.url.searchParams.get('page')
    let start = 0 + 15 * (page - 1);
    let end = 14 + 15 * (page - 1);

    let data = fakePatients.slice(start, end);
    const keywords = req.url.searchParams.get('keywords');
    if (keywords !== null) {
      data = data.filter(item => {
        let nameEmail = (item.name + ' ' + item.email).toLowerCase();

        return nameEmail.includes(keywords)
      })
    }

    return res(
      ctx.status(200),
      ctx.json({
        page: page ? parseInt(page) : 1,
        per_page: 15,
        last_page: Math.ceil(numOfPatients / 15),
        data,
      })
    )
  }),
  rest.get('/api/patients/:id', (req, res, ctx) => {
    const {
      id
    } = req.params;
    const patient = fakePatients.find(p => p.id == id)

    return res(
      ctx.status(200),
      ctx.json(patient)
    )
  }),
  rest.post('/api/patients', (req, res, ctx) => {
    const {
      email,
      gender,
      mobile,
      name
    } = req.body;
    return res(
      ctx.status(201),
      ctx.json({
        id: fakePatients.length + 1,
        name,
        email,
        gender,
        mobile,
      })
    )
  }),
  rest.put('/api/patients/:id', (req, res, ctx) => {
    const {
      email,
      gender,
      mobile,
      name
    } = req.body;
    const {
      id
    } = req.params;
    const patient = fakePatients[id];
    patient.email = email;
    patient.gender = gender;
    patient.mobile = mobile;
    patient.name = name;

    return res(
      ctx.status(200),
      ctx.json(patient)
    )
  }),
  rest.patch('/api/patients/:id', (req, res, ctx) => {
    const reqData = req.body;
    const {
      id
    } = req.params;
    let patient = fakePatients.find(p => p.id == id);
    let updated = {
      ...patient,
      ...reqData
    }

    return res(
      ctx.status(200),
      ctx.json(updated)
    )
  }),
  rest.get('/api/patients/:patientId/notes', (req, res, ctx) => {
    const {
      patientId
    } = req.params
    return res(
      ctx.status(200),
      ctx.json(
        fakeNotes[patientId]
      )
    )
  }),
  rest.post('/api/patients/:patientId/notes', (req, res, ctx) => {
    const {
      data
    } = req.body;
    const {
      patientId
    } = req.params;

    return res(
      ctx.status(201),
      ctx.json({
        id: fakeNotes[patientId].length + 1,
        content: data,
        created_at: new Date().toISOString().slice(0, 10)
      })
    )
  }),
]
