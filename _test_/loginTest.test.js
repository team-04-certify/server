const request = require('supertest')
const app = require('../app')

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
        expect(res.body).toHaveProperty('email')
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
