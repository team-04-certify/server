const request = require("supertest");
const app = require("../app");
const { Organizer, Event, Recipient } = require("../models");
const jwt = require('jsonwebtoken')

describe("Fail test cases CRUD recipient", function () {
  let organizerId = null;
  let eventId = null;
  let jwtToken = null;
  let recipientId = null;
  beforeEach(async () => {
    try{
    const organizerForm = {
      name: "AdminTestCorp",
      email: "adminnnn@mail.com",
      password: "123456",
    };
    const organizerBf = await Organizer.create(organizerForm)
    organizerId = +organizerBf.id;
    jwtToken = jwt.sign({id: organizerId, name: organizerForm.name, email: organizerForm.email}, process.env.SECRET_KEY);
    invalidJwtToken = jwt.sign({id: organizerId, name: "A CORP", email: "lala@mil.com", password: 'qwerty'}, process.env.SECRET_KEY)
    const eventForm = {
      title: "Workshop Admins",
      date: "04/12/2021",
      type: "Workshop",
      OrganizerId: organizerId,
      banner: null,
      templatePath: null
    };
    const eventBf = await Event.create(eventForm)
    eventId = +eventBf.id
      } catch(err){
        // console.log(err);
      }
  });

  afterEach(async () => {
    try{
      await Organizer.destroy({ truncate: true })
      await Event.destroy({ truncate: true })
    } catch(err){
      // console.log(err);
    }

  });

  describe("GET /certificates/:eventId/:templateNumber", function () {

    it("should return status 400 when there are no recipients", function (done) {
      request(app)
        .get(`/certificates/${eventId}/1`)
        .set("access_token", jwtToken)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.status).toEqual(400);
          expect(res.body).toEqual({name: 'CustomError', code: 400, message: 'at least one certificate recipient is required'});
          
          return done();
        });
    });

  });
});

describe("Success  test cases CRUD recipient with user template", function () {
  let organizerId = null;
  let eventId = null;
  let jwtToken = null;
  let recipientId = null;
  beforeEach(async () => {
    try{
    const organizerForm = {
      name: "AdminTestCorp",
      email: "adminnnn@mail.com",
      password: "123456",
    };
    const organizerBf = await Organizer.create(organizerForm)
    organizerId = +organizerBf.id;
    jwtToken = jwt.sign({id: organizerId, name: organizerForm.name, email: organizerForm.email}, process.env.SECRET_KEY);
    invalidJwtToken = jwt.sign({id: organizerId, name: "A CORP", email: "lala@mil.com", password: 'qwerty'}, process.env.SECRET_KEY)
    const eventForm = {
      title: "Workshop Admins",
      date: "04/12/2021",
      type: "Workshop",
      OrganizerId: organizerId,
      banner: null,
      templatePath: "https://certifyfilebucket.s3.ap-southeast-1.amazonaws.com/1616588622447-ppt-text1.pptx"
    };
    const eventBf = await Event.create(eventForm)
    eventId = +eventBf.id
    const recipientForm = {
      name: "johndoe",
      email: "participantbeforeall@mail.com",
      birthDate: "04/03/1991",
      certificateNumber: "aaa123",
      role: "attendee",
      EventId: eventId,
      certificateLink: "www.google.com",
      status: 'not yet sent'
      
    };
    const recipientBf = await Recipient.create(recipientForm)
    recipientId = +recipientBf.id
      } catch(err){
        // console.log(err);
      }
  });

  afterEach(async () => {
    try{
      await Organizer.destroy({ truncate: true })
      await Event.destroy({ truncate: true })
    } catch(err){
      // console.log(err);
    }

  });

  describe("GET /certificates/:eventId/:templateNumber", function () {

    it("should return status 200 when user using uploaded template", function (done) {
      request(app)
        .get(`/certificates/${eventId}/1`)
        .set("access_token", jwtToken)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.status).toEqual(200);
          expect(res.body.message).toEqual('success');

          return done();
        });
    });

  });
});


describe("Success test cases CRUD recipient", function () {
  let organizerId = null;
  let eventId = null;
  let jwtToken = null;
  let recipientId = null;
  beforeEach(async () => {
    try{
    const organizerForm = {
      name: "AdminTestCorp",
      email: "adminnnn@mail.com",
      password: "123456",
    };
    const organizerBf = await Organizer.create(organizerForm)
    organizerId = +organizerBf.id;
    jwtToken = jwt.sign({id: organizerId, name: organizerForm.name, email: organizerForm.email}, process.env.SECRET_KEY);
    invalidJwtToken = jwt.sign({id: organizerId, name: "A CORP", email: "lala@mil.com", password: 'qwerty'}, process.env.SECRET_KEY)
    const eventForm = {
      title: "Workshop Admins",
      date: "04/12/2021",
      type: "Workshop",
      OrganizerId: organizerId,
      banner: null,
      templatePath: null,
    };
    const eventBf = await Event.create(eventForm)
    eventId = +eventBf.id
    const recipientForm = {
      name: "johndoe",
      email: "participantbeforeall@mail.com",
      birthDate: "04/03/1991",
      certificateNumber: "aaa123",
      role: "attendee",
      EventId: eventId,
      certificateLink: "www.google.com",
      status: 'not yet sent'
      
    };
    const recipientBf = await Recipient.create(recipientForm)
    recipientId = +recipientBf.id
      } catch(err){
        // console.log(err);
      }
  });

  afterEach(async () => {
    try{
      await Organizer.destroy({ truncate: true })
      await Event.destroy({ truncate: true })
      await Recipient.destroy({ truncate: true })
    } catch(err){
      // console.log(err);
    }

  });

  describe("GET /certificates/:eventId/:templateNumber", function () {

    jest.setTimeout(70000)
    it("should return status 200 with a success message", function (done) {
      request(app)
        .get(`/certificates/${eventId}/1`)
        .set("access_token", jwtToken)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.status).toEqual(200);
          expect(res.body.message).toEqual('success');
          
          return done();
        });
    });

  });

  describe("GET /certificates/:eventId/templateNumber error no recipient", function () {
    it("should return status 401 when jwt not provided", function (done) {

      request(app)
        .get(`/certificates/${eventId}/1`)
        // .set("access_token", jwtToken)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.status).toEqual(401);
          expect(res.body).toEqual({"message": "jwt is required"});
          
          return done();
        });
    });

    it("should return status 401 when jwt invalid", function (done) {

      request(app)
        .get(`/certificates/${eventId}/1`)
        .set("access_token", 'errortoken')
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).toEqual(401);
          expect(res.body).toEqual({
            name: "JsonWebTokenError",
            message: "jwt malformed",
          });
          
          return done();
        });
    });

  });
});



