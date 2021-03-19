const request = require('supertest')
const app = require('../app')
const jwt = require('jsonwebtoken')

let access_token = ''
let organizerName = ''
beforeEach(() => {
  const organizerData = {
    organizer: 'Certify',
    email: 'admin@mail.com',
    password: '123456'
  }
  access_token = jwt.sign(organizerData, 'Sertify');
  Organizer.create(organizerData)
    .then(response => {
      organizerName = response.organizer
    })
    .catch(err => {
        console.log(err)
    })

})
afterAll(() => {
  Organizer.destroy({truncate: true})
      .then(response => {

      })
      .catch(response => {

      })
})  

// ============ register success============
describe('POST /register', function() {
  it('should return status 201', function(done) {
    let body = {
      organization: 'Certify Seminar',
      email: 'robi@mail.com',
      password: 'robi123'
    }
    request(app)
      .post('/register')
      .send(body)
      .end((err, res) => {
        if(err) {
          done(err)
        }
        expect(res.status).toEqual(201)
        expect(typeof(res.body)).toEqual('object')
        expect(res.body).toHaveProperty('organization')
        expect(typeof(res.body.organization)).toEqual('string')
        expect(res.body).toHaveProperty('email')
        expect(typeof(res.body.email)).toEqual('string')
        done()
      })
  })
})
// ============ register error organization unique ============
describe('POST /register', function() {
  it('should return status 201', function(done) {
    let body = {
      organization: 'Certify Seminar',
      email: 'robi@mail.com',
      password: 'robi123'
    }
    request(app)
      .post('/register')
      .send(body)
      .end((err, res) => {
        if(err) {
          done(err)
        }
        expect(res.status).toEqual(201)
        expect(Array.isArray(res.body)).toEqual(true)
        expect((res.body[0])).toHaveProperty('message')
        done()
      })
  })
})

// ============ register error email unique ============
describe('POST /register', function() {
  it('should return status 201', function(done) {
    let body = {
      organization: 'Certify Seminar2',
      email: 'robi@mail.com',
      password: 'robi123'
    }
    request(app)
      .post('/register')
      .send(body)
      .end((err, res) => {
        if(err) {
          done(err)
        }
        expect(res.status).toEqual(201)
        expect(Array.isArray(res.body)).toEqual(true)
        expect((res.body[0])).toHaveProperty('message')
        done()
      })
  })
})

// ============ register error validation password min length 6 characters============
describe('POST /register', function() {
  it('should return status 201', function(done) {
    let body = {
      organization: 'Seminar',
      email: 'kantorSeminar@gmail.com',
      password: '23'
    }
    request(app)
      .post('/register')
      .send(body)
      .end((err, res) => {
        if(err) {
          done(err)
        }
        expect(res.status).toEqual(201)
        expect(Array.isArray(res.body)).toEqual(true)
        expect((res.body[0])).toHaveProperty('message')
        done()
      })
  })
})
// ============ login success============
describe('POST /login', function() {
  it('should return status 200', function(done) {
    let body = {
      email: 'robi@mail.com',
      password: 'robi123'
    }
    request(app)
      .post('/login')
      .send(body)
      .end((err, res) => {
        if(err) {
          done(err)
        }
        expect(res.status).toEqual(200)
        expect(typeof(res.body)).toEqual('object')
        expect(res.body).toHaveProperty('access_token')
        done()
      })
  })
})
// ============ login error  no email adn password=============
describe('POST /login', function() {
  it('should return status 400', function(done) {
    let body = {
      email: '',
      password: ''
    }
    request(app)
      .post('/login')
      .send(body)
      .end((err, res) => {
        if(err) {
          done(err)
        }
        expect(res.status).toEqual(400)
        expect(typeof(res.body)).toEqual('object')
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toEqual('invalid email or password')
        done()
      })
  })
})
// ============ login error email is empty in database=============
describe('POST /login', function() {
  it('should return status 400', function(done) {
    let body = {
      email: 'tahu@mail.com',
      password: 'robi123'
    }
    request(app)
      .post('/login')
      .send(body)
      .end((err, res) => {
        if(err) {
          done(err)
        }
        expect(res.status).toEqual(400)
        expect(typeof(res.body)).toEqual('object')
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toEqual('invalid email or password')
        done()
      })
  })
})
// ============ login error  no email=============
describe('POST /login', function() {
  it('should return status 400', function(done) {
    let body = {
      email: '',
      password: 'robi123'
    }
    request(app)
      .post('/login')
      .send(body)
      .end((err, res) => {
        if(err) {
          done(err)
        }
        expect(res.status).toEqual(400)
        expect(typeof(res.body)).toEqual('object')
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toEqual('invalid email or password')
        done()
      })
  })
})
// ============ login error  no password=============
describe('POST /login', function() {
  it('should return status 400', function(done) {
    let body = {
      email: 'robi@mail.com',
      password: ''
    }
    request(app)
      .post('/login')
      .send(body)
      .end((err, res) => {
        if(err) {
          done(err)
        }
        expect(res.status).toEqual(400)
        expect(typeof(res.body)).toEqual('object')
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toEqual('invalid email or password')
        done()
      })
  })
})


// ================== show organization by id==================
describe('GET /:organizername', function() {
  it('should return status 200', function(done) {
    request(app)
      .get(`/${organizerName}`)
      .set('access_token', access_token)
      .end((err, res) => {
        if(err) {
          done(err)
        }
        curentIdProduct = +res.body.id 
        expect(res.status).toEqual(200)
        expect(typeof(res.body)).toEqual('object')
        expect((res.body)).toHaveProperty('id')
        expect((res.body)).toHaveProperty('organizer')
        expect((res.body)).toHaveProperty('email')
        expect((res.body)).toHaveProperty('Events')
        done()
      })
  })
})

