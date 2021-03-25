const request = require("supertest");
const app = require("../app");
const { Organizer, Event, Recipient } = require("../models");
const jwt = require('jsonwebtoken')

describe("Success test cases CRUD recipient", function () {
  let organizerId = null;
  let eventId = null;
  let jwtToken = null;
  let certificateNumberBf = null;
  let recipientId = null;
  beforeEach(async () => {
    try{
    const organizerForm = {
      name: "AdminTestCorp",
      email: "admin@mail.com",
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
        };
    const eventBf = await Event.create(eventForm)
    eventId = +eventBf.id
        const recipientForm = {
          name: "John Doe BeforeAll",
          email: "participantbeforeall@mail.com",
          birthDate: "04/03/1991",
          certificateNumber: "aaa123",
          role: "attendee",
          EventId: eventId,
        };
    const recipientBf = await Recipient.create(recipientForm)
    certificateNumberBf = recipientBf.certificateNumber;
    recipientId = +recipientBf.id
      } catch(err){
        console.log(err);
      }
  });

  afterEach(async () => {
    try{
      await Organizer.destroy({ truncate: true })
      await Event.destroy({ truncate: true })
      await Recipient.destroy({ truncate: true })
    } catch(err){
      console.log(err);
    }

  });

  describe("POST /recipients/:eventId", function () {
    it("should return status 201 with newly created datas", function (done) {
      const body = [
        {
          name: 'robi',
          email: 'robiultriawali@gmail.com',
          birthDate: '03/12/1998',
          certificateNumber: 'aa-ab23',
          role: 'attended',
        },
        {
          name: 'aldi',
          email: 'rinaldiadrian5@gmail.com',
          birthDate: '03/12/1998',
          certificateNumber: 'aa-ab24',
          role: 'attended'
        }
      ];
      request(app)
        .post(`/recipients/${eventId}`)
        .set("access_token", jwtToken)
        .send(body)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.status).toEqual(201);
          expect(res.body[0].name).toEqual(body[0].name);
          expect(res.body[0].email).toEqual(body[0].email);
          expect(new Date(res.body[0].birthDate)).toEqual(new Date(body[0].birthDate));
          expect(res.body[0].certificateNumber).toEqual(body[0].certificateNumber)
          expect(res.body[0].role).toEqual(body[0].role);
          expect(res.body[0].EventId).toEqual(eventId);
          expect(res.body[0].status).toEqual("not yet sent");
          expect(res.body[0].certificateLink).toEqual(`https://firebase/certificate/${res.body[0].id}`);
          return done();
        });
    });
  });

  describe("GET /recipients/:recipientId", function () {
    it("should return status 200 with datas", function (done) {
      request(app)
        .get(`/recipients/${recipientId}`)
        .set("access_token", jwtToken)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).toEqual(200);
          expect(typeof res.body).toEqual("object");
          return done();
        });
    });
  });

  describe("GET /recipients/all/:eventId", function () {
    it("should return status 200 with datas", function (done) {
      request(app)
        .get(`/recipients/all/${eventId}`)
        .set("access_token", jwtToken)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).toEqual(200);
          expect(typeof res.body).toEqual("object");
          return done();
        });
    });
  });

  describe("GET /recipients/all/:eventId", function () {
    it("should return status 200 with datas", function (done) {
      request(app)
        .get(`/recipients/all/${eventId}`)
        .set("access_token", jwtToken)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).toEqual(200);
          expect(Array.isArray(res.body)).toEqual(true);
          return done();
        });
    });
  });
  describe("GET /recipients/all/:eventId error no access token", function () {
    it("should return status 401 with message", function (done) {
      request(app)
        .get(`/recipients/all/${eventId}`)
        .set("access_token", '')
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).toEqual(401);
          expect(res.body).toHaveProperty("message");
          expect(res.body.message).toEqual("jwt is required");
          return done();
        });
    });
  });

  describe("PUT /recipients/:eventId/:recipientId", function () {
    it("should return status 200 with updated data", function (done) {
      const body = {
        name: "John Doe Edit",
        email: "recipientedit@maile.com",
        birthDate: "04/03/1994",
        certificateNumber: "aaaa1",
        role: "interviewee",
        EventId: eventId,
      };

      request(app)
        .put(`/recipients/${eventId}/${recipientId}`)
        .set("access_token", jwtToken)
        .send(body)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).toEqual(200);
          expect(res.body.name).toEqual(body.name);
          expect(res.body.email).toEqual(body.email);
          expect(new Date(res.body.birthDate)).toEqual(new Date(body.birthDate));
          expect(res.body.certificateNumber).toEqual(body.certificateNumber);
          expect(res.body.role).toEqual(body.role);
          expect(res.body.EventId).toEqual(body.EventId);

          return done();
        });
    });
  });

  describe("DELETE /recipients/:recipientId", function () {
    it("should return status 200 with a message", function (done) {
      request(app)
        .delete(`/recipients/${recipientId}`)
        .set("access_token", jwtToken)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).toEqual(200);
          expect(res.body).toEqual({
            message: "recipient was deleted successfully"
          });
          return done();
        });
    });
  });
});

describe("Failed test cases CRUD participant", function () {
  let organizerId = null;
  let eventId = null;
  let jwtToken = null;
  let certificateNumberBf = null;
  let recipientId = null;
  beforeEach(async () => {
    try{
    const organizerForm = {
      name: "AdminTestCorp",
      email: "admin@mail.com",
      password: "123456",
    };
    jwtToken = jwt.sign(organizerForm, process.env.SECRET_KEY);
    const organizerBf = await Organizer.create(organizerForm)
    organizerId = +organizerBf.id;
        const eventForm = {
          title: "Workshop Admins",
          date: "04/12/2021",
          type: "Workshop",
          OrganizerId: organizerId,
        };
    const eventBf = await Event.create(eventForm)
    eventId = +eventBf.id
        const recipientForm = {
          name: "John Doe BeforeAll",
          email: "participantbeforeall@mail.com",
          birthDate: "04/03/1991",
          certificateNumber: "aaa123",
          role: "attendee",
          EventId: eventId,
        };
    const recipientBf = await Recipient.create(recipientForm)
    certificateNumberBf = recipientBf.certificateNumber;
    recipientId = +recipientBf.id
      } catch(err){
        console.log(err);
      }
  });

  afterEach(async () => {
    try{
      await Organizer.destroy({ truncate: true })
      await Event.destroy({ truncate: true })
      await Recipient.destroy({ truncate: true })
    } catch(err){
      console.log(err);
    }

  });

  describe("POST /recipients/:eventId", function () {
    it("should return status 401 when user was not authenticated", function (done) {
      const body = {
        recipients: [
          {data: ["name", "email", "birthdate", "certificateNumber", "role"]},
          {data: ["John Doe", "johndoe@mail.com", "03/04/1993", "ads2sd334", "attendee"]}
        ]
      }
      request(app)
        .post(`/recipients/${eventId}`)
        .set("access_token", invalidJwtToken)
        .send(body)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).toEqual(401);
          expect(res.body).toEqual({
            message: 'invalid jwt'
          });
          return done();
        });
    });
    it("should return status 404 when eventId was not found", function (done) {
      const body = {
        recipients: [
          {data: ["name", "email", "birthdate", "certificateNumber", "role"]},
          {data: ["John Doe", "johndoe@mail.com", "03/04/1993", "ads2sd334", "attendee"]}
        ]
      }
      request(app)
        .post(`/recipients/1000`)
        .set("access_token", jwtToken)
        .send(body)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).toEqual(404);
          expect(res.body).toEqual({
            name: "CustomError",
            code: 404,
            message: "event not found",
          });
          return done();
        });
    });
    it("should return status 401 when access_token is not provided", function (done) {
      const body = {
        recipients: [
          {data: ["name", "email", "birthdate", "certificateNumber", "role"]},
          {data: ["John Doe", "johndoe@mail.com", "03/04/1993", "ads2sd334", "attendee"]}
        ]
      }
      request(app)
        .post(`/recipients/${eventId}`)
        .send(body)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).toEqual(401);
          expect(res.body).toEqual({"message": "jwt is required"});
          return done();
        });
    });

    it("should return status 401 when access_token is invalid", function (done) {
      const body = {
        recipients: [
          {data: ["name", "email", "birthdate", "certificateNumber", "role"]},
          {data: ["John Doe", "johndoe@mail.com", "03/04/1993", "ads2sd334", "attendee"]}
        ]
      }
      request(app)
        .post(`/recipients/${eventId}`)
        .set("access_token", 'errortest')
        .send(body)
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
  describe("GET /recipients/all/:eventId", function () {
    it("should return status 401 when jwt is not provided", function (done) {
      request(app)
        .get(`/recipients/all/${eventId}`)
        // .set("access_token", jwtToken)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).toEqual(401);
          expect(res.body).toEqual({"message": "jwt is required"});
          return done();
        });
    });
    it("should return status 401 when jwt is not provided", function (done) {
      request(app)
        .get(`/recipients/all/${eventId}`)
        .set("access_token", "errortoken")
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
  describe("GET /recipients/:recipientId", function () {
    it("should return status 404 when recipient is not found", function (done) {
      request(app)
        .get(`/recipients/1000`)
        // .set("access_token", jwtToken)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).toEqual(404);
          expect(res.body).toEqual({
            name: "CustomError",
            code: 404,
            message: "recipient not found",
          });
          return done();
        });
    });
  });

  describe("PUT /recipients/:eventId", function () {
    it("should return status 401 when access_token is not provided", function (done) {
      const body = {
        name: "John Doea",
        email: "recipient@maila.com",
        gender: "female",
        birthdate: "04/30/1990",
        certificateNumber: "aaa123",
        role: "attendee",
        EventId: eventId,
      };
      request(app)
        .put(`/recipients/${eventId}/${recipientId}`)
        .send(body)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).toEqual(401);
          expect(res.body).toEqual({"message": "jwt is required"});
          return done();
        });
    });
    it("should return status 404 when id is not found", function (done) {
      const body = {
        name: "John Doeu",
        email: "recipient@mailu.com",
        gender: "female",
        birthdate: "04/30/1990",
        certificateNumber: "aaa123",
        role: "attendee",
        EventId: eventId,
      };
      request(app)
        .put(`/recipients/${eventId}/1000`)
        .set("access_token", jwtToken)
        .send(body)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).toEqual(404);
          expect(res.body).toEqual({
            name: "CustomError",
            code: 404,
            message: "recipient was not found",
          });
          return done();
        });
    });
    it("should return status 401 when access_token is invalid", function (done) {
      const body = {
        name: "John Doeu",
        email: "recipient@mailu.com",
        gender: "female",
        birthdate: "04/30/1990",
        certificateNumber: "aaa123",
        role: "attendee",
        EventId: eventId,
      };
      request(app)
        .put(`/recipients/${eventId}/${recipientId}`)
        .set('access_token', 'errortest')
        .send(body)
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

  describe("DELETE /participant/:participantId", function () {
    it("should return status 401 when access_token is not provided", function (done) {
      request(app)
        .delete(`/recipient/${recipientId}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).toEqual(401);
          expect(res.body).toEqual({"message": "jwt is required"});
          return done();
        });
    });
    it("should return status 401 when access_token is invalid", function (done) {
      request(app)
        .delete(`/recipient/${recipientId}`)
        .set('access_token', 'errortest')
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
    it("should return status 404 when id is not found", function (done) {
      request(app)
        .delete(`/recipients/1000`)
        .set('access_token', jwtToken)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).toEqual(404);
          expect(res.body).toEqual({
            name: "CustomError",
            code: 404,
            message: "recipient was not found",
          });
          return done();
        });
    });
  });
});
