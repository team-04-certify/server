const request = require('supertest')
const app = require('../app')

describe('get /', function() {
  it('coba', function(done) {
    request(app)
      .get('/')
      .end((err, res) => {
        if(err) {
          done(err)
        }
        expect(typeof(res.body)).toEqual('object')
        done()
      })
  })
})