const request = require('supertest')
const app = require('../app')
const { Organizer, Event } = require('../model')

describe('Success test cases CRUD participant', function () {
    let organizerId = null
    let eventId = null
    let jwtToken = null
    let certificateNumberBf = null
    let participantId = null
    beforeEach(() => {
        const organizerForm = {
            Organization: 'AdminTestCorp',
            Email: 'admin@mail.com',
            Password: '123456'
        }
        jwtToken = jwt.sign(organizerForm, 'certify');

        Organizer.create(organizerForm)
            .then(response => {
                organizerId = +response.id
            })
            .catch(err => {
                console.log(err)
            })
        const eventForm = {
            Event: "Workshop Admins",
            Date: "04/12/2021",
            Type: "Workshop",
            OrganizerId: organizerId
        }
        Event.create(eventForm)
            .then(response => {
                eventId = +response.id
            })
            .catch(err => {
                console.log(err)
            })
        const participantForm = { 
            Name: "John Doe BeforeAll",
            Email: "participantbeforeall@mail.com",
            Gender: "female",
            Birthdate: "04/30/1990",
            CertificateNumber: "",
            Role: "attendee",
            EventId: EventId
        }
        Participant.create(participantForm)
            .then(response => {
                certificateNumberBf = response.CertificateNumber
                participantId = response.participantId
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

        Event.destroy({truncate: true})
        .then(response => {

        })
        .catch(response => {

        })

        Participant.destroy({truncate: true})
        .then(response => {

        })
        .catch(response => {

        })
    })
        
        
    describe('POST /participant/:organizerId/:eventId', function () {
        it('should return status 201 with newly created datas', function (done) {
            const body = { 
                Name: "John Doe",
                Email: "participant@mail.com",
                Gender: "female",
                Birthdate: "04/30/1990",
                CertificateNumber: "",
                Role: "attendee",
                EventId: EventId
            }
            request(app)
                .post(`participant/:${organizerId}/:${eventId}`)
                .set('access_token', jwtToken)
                .send(body)
                .end((err, res) => {
                    if (err) return done(err)
                    expect(res.status).toEqual(201)
                    expect(res.body.Name).toEqual(body.Name)
                    expect(res.body.Email).toEqual(body.Email)
                    expect(res.body.Gender).toEqual(body.Gender)
                    expect(res.body.Birthdate).toEqual(body.Birthdate)
                    // expect(res.body.CertificateNumber).toEqual(body.CertificateNumber)
                    expect(res.body.Role).toEqual(body.Role)
                    expect(res.body.EventId).toEqual(body.EventId)
                    return done()
                })
        })
    })

    describe('GET /participant/:certificateNumber', function () {
        it('should return status 200 with datas', function (done) {
            request(app)
                .get(`/participant/:${certificateNumberBf}`)
                .set('access_token', jwtToken)
                .end((err, res) => {
                    if (err) return done(err)
                    expect(res.status).toEqual(200)
                    expect(typeof res.body).toEqual('object')
                    return done()
                })
        })
    })

    describe('PUT /participant/:participantId', function () {
        it('should return status 200 with updated data', function (done) {
            const body = {
                Name: "John Doe Edit",
                Email: "participantedit@mail.com",
                Gender: "male",
                Birthdate: "01/29/1991",
                CertificateNumber: "",
                Role: "interviewee",
                EventId: EventId
            }

            request(app)
                .put(`/participant/${participantId}`)
                .set('access_token', jwtToken)
                .send(body)
                .end((err, res) => {
                    if (err) return done(err)
                    expect(res.status).toEqual(200)
                    expect(res.body.Name).toEqual(body.Name)
                    expect(res.body.Email).toEqual(body.Email)
                    expect(res.body.Gender).toEqual(body.Gender)
                    expect(res.body.Birthdate).toEqual(body.Birthdate)
                    expect(res.body.CertificateNumber).toEqual(body.CertificateNumber)
                    expect(res.body.Role).toEqual(body.Role)
                    expect(res.body.EventId).toEqual(body.CertificateNumber)
                    
                    return done()
                })
        })
    })

    describe('DELETE /participant/:participantId', function () {
        it('should return status 200 with a message', function (done) {
            request(app)
                .delete(`/participant/${participantId}`)
                .set('access_token', jwtToken)
                .end((err, res) => {
                    if (err) return done(err)
                    expect(res.status).toEqual(200)
                    expect(res.body).toEqual({ message: "participant successfully deleted" })
                    return done()
                })
        })
    })
})


describe('Failed test cases CRUD participant', function () {
    let organizerId = null
    let eventId = null
    let jwtToken = null
    let certificateNumberBf = null
    let participantId = null
    beforeEach(() => {
        const organizerForm = {
            Organization: 'AdminTestCorp',
            Email: 'admin@mail.com',
            Password: '123456'
        }
        jwtToken = jwt.sign(organizerForm, 'certify');

        Organizer.create(organizerForm)
            .then(response => {
                organizerId = +response.id
            })
            .catch(err => {
                console.log(err)
            })
        const eventForm = {
            Event: "Workshop Admins",
            Date: "04/12/2021",
            Type: "Workshop",
            OrganizerId: organizerId
        }
        Event.create(eventForm)
            .then(response => {
                eventId = +response.id
            })
            .catch(err => {
                console.log(err)
            })
        const participantForm = { 
            Name: "John Doe BeforeAll",
            Email: "participantbeforeall@mail.com",
            Gender: "female",
            Birthdate: "04/30/1990",
            CertificateNumber: "",
            Role: "attendee",
            EventId: EventId
        }
        Participant.create(participantForm)
            .then(response => {
                certificateNumberBf = response.CertificateNumber
                participantId = response.participantId
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

        Event.destroy({truncate: true})
        .then(response => {

        })
        .catch(response => {

        })

        Participant.destroy({truncate: true})
        .then(response => {

        })
        .catch(response => {

        })
    })

    describe('POST /participant/:organizerId/:eventId', function () {
        it('should return status 401 when access_token is not provided', function (done) {
            const body = { 
                Name: "John Doe",
                Email: "participant@mail.com",
                Gender: "female",
                Birthdate: "04/30/1990",
                CertificateNumber: "",
                Role: "attendee",
                EventId: EventId
            }
            request(app)
                .post(`participant/:${organizerId}/:${eventId}`)
                .send(body)
                .end((err, res) => {
                    if (err) return done(err)
                    expect(res.status).toEqual(401)
                    expect(res.body).toEqual({ errorName: 'JsonWebTokenError', errorCode: 401, errorMessage: 'jwt must be provided' })
                    return done()

                })
        })


        it('should return status 400 when required fields is empty', function (done) {
            const body = { 
                Name: "",
                Email: "",
                Gender: "",
                Birthdate: "04/30/1990",
                CertificateNumber: "",
                Role: "",
                EventId: EventId
            }
            request(app)
                .post(`participant/:${organizerId}/:${eventId}`)
                .set('access_token', jwtToken)
                .send(body)
                .end((err, res) => {
                    if (err) return done(err)
                    expect(res.status).toEqual(400)
                    expect(res.body).toEqual({ errorName: 'SequelizeValidationError', errorCode: 400, errorMessages: [
                        "Participant's Name is required",
                        "Participant's Email is required",
                        "Participant's Gender is required",
                        "Participant's Birthdate is required",
                        "Participant's Role is required"
                      ]})
                    return done()
                })
        })

    describe('GET /participants/:certificateNumber', function () {
        it('should return status 404 when certificate number is not found', function (done) {
            request(app)
                .get(`/participant/:1000`)
                .set('access_token', jwtToken)
                .end((err, res) => {
                    if (err) return done(err)
                    expect(res.status).toEqual(404)
                    expect(err.body).toEqual({ errorName: 'SequelizeValidationError', errorCode: 404, errorMessage: "certificate number was not found"})
                    return done()
                })
        })
    })

    describe('PUT /participant/:participantId', function () {
        it('should return status 401 when access_token is not provided', function (done) {
            const body = { 
                Name: "John Doe",
                Email: "participant@mail.com",
                Gender: "female",
                Birthdate: "04/30/1990",
                CertificateNumber: "",
                Role: "attendee",
                EventId: EventId
            }
            request(app)
                .put(`participant/:${organizerId}/:${eventId}`)
                .send(body)
                .end((err, res) => {
                    if (err) return done(err)
                    expect(res.status).toEqual(401)
                    expect(res.body).toEqual({ errorName: 'JsonWebTokenError', errorCode: 401, errorMessage: 'jwt must be provided' })
                    return done()

                })
        })


        it('should return status 400 when required fields is empty', function (done) {
            const body = { 
                Name: "",
                Email: "",
                Gender: "",
                Birthdate: "",
                CertificateNumber: "",
                Role: "",
                EventId: EventId
            }
            request(app)
                .post(`participant/:${organizerId}/:${eventId}`)
                .set('access_token', jwtToken)
                .send(body)
                .end((err, res) => {
                    if (err) return done(err)
                    expect(res.status).toEqual(400)
                    expect(res.body).toEqual({ errorName: 'SequelizeValidationError', errorCode: 400, errorMessages: [
                        "Participant's Name is required",
                        "Participant's Email is required",
                        "Participant's Gender is required",
                        "Participant's Birthdate is required",
                        "Participant's Role is required"
                      ]})
                    return done()
                })
        })
    })

    describe('DELETE /participant/:participantId', function () {
        it('should return status 401 when access_token is not provided', function (done) {
            request(app)
                .delete(`/participant/${participantId}`)
                .end((err, res) => {
                    if (err) return done(err)
                    expect(res.status).toEqual(401)
                    expect(res.body).toEqual({ errorName: 'JsonWebTokenError', errorCode: 401, errorMessage: 'jwt must be provided' })
                    return done()
                })
        })
    })
})