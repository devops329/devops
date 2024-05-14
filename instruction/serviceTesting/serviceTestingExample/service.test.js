const request = require('supertest');
const app = require('./service');

test('hello world', () => {
  expect(true).toBe(true);
});

test('get cities', async () => {
  const getCitiesRes = await request(app).get('/cities');
  expect(getCitiesRes.status).toBe(200);
  expect(getCitiesRes.headers['content-type']).toMatch('application/json; charset=utf-8');
  expect(getCitiesRes.body).toMatchObject([{ name: 'Provo', population: 116618 }]);
});

test('login', login);
async function login() {
  const loginRes = await request(app).post('/login');

  expect(loginRes.status).toBe(200);
  expect(loginRes.headers['content-type']).toMatch('application/json; charset=utf-8');
  expect(loginRes.body).toMatchObject({ message: 'Success' });

  const cookies = loginRes.headers['set-cookie'];
  expect(cookies[0]).toMatch(/token=.+; Path=\/; HttpOnly; Secure; SameSite=Strict/);
  return cookies;
}

test('add cities', async () => {
  const cookies = await login();

  const city = { name: 'Orem', population: 89932 };
  const addCitiesRes = await request(app).post('/cities').set('Cookie', cookies).send(city);

  expect(addCitiesRes.status).toBe(200);
  expect(addCitiesRes.headers['content-type']).toMatch('application/json; charset=utf-8');
  expect(addCitiesRes.body).toMatchObject([
    { name: 'Provo', population: 116618 },
    { name: 'Orem', population: 89932 },
  ]);
});

test('add cities no auth', async () => {
  const city = { name: 'Orem', population: 89932 };
  const addCitiesRes = await request(app).post('/cities').send(city);
  expect(addCitiesRes.status).toBe(401);
});
