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
    jwtToken = jwt.sign(organizerForm, "certifyjayaaaselole123123");
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
    it("should return status 201 with newly created datas", function (done) {
      const body = {
       recipients: [
         {data: ["name", "email", "birthdate", "certificateNumber", "role"]},
         {data: ["John Doe", "johndoe@mail.com", "03/04/1993", "ads2sd334", "attendee"]}
       ]
      };
      request(app)
        .post(`/recipients/${eventId}`)
        .set("access_token", jwtToken)
        .send(body)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.status).toEqual(201);
          expect(res.body[0].name).toEqual(body.recipients[1].data[0]);
          expect(res.body[0].email).toEqual(body.recipients[1].data[1]);
          expect(new Date(res.body[0].birthDate)).toEqual(new Date(body.recipients[1].data[2]));
          expect(res.body[0].certificateNumber).toEqual(body.recipients[1].data[3])
          expect(res.body[0].role).toEqual(body.recipients[1].data[4]);
          expect(res.body[0].EventId).toEqual(eventId);
          return done();
        });
    });
  });

  describe("GET /recipients/:certificateNumber", function () {
    it("should return status 200 with datas", function (done) {
      request(app)
        .get(`/recipients/${certificateNumberBf}`)
        .set("access_token", jwtToken)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).toEqual(200);
          expect(typeof res.body).toEqual("object");
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

// describe("Failed test cases CRUD participant", function () {
//   let organizerId = null;
//   let eventId = null;
//   let jwtToken = null;
//   let certificateNumberBf = null;
//   let recipientId = null;
//   beforeEach(() => {
//     const organizerForm = {
//       name: "AdminTestCorp",
//       email: "admin@mail.com",
//       password: "123456",
//     };
//     jwtToken = jwt.sign(organizerForm, "certify");

//     Organizer.create(organizerForm)
//       .then((response) => {
//         organizerId = +response.id;
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//     const eventForm = {
//       event: "Workshop Admins",
//       date: "04/12/2021",
//       type: "Workshop",
//       OrganizerId: organizerId,
//     };
//     Event.create(eventForm)
//       .then((response) => {
//         eventId = +response.id;
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//     const recipientForm = {
//       name: "John Doe BeforeAll",
//       email: "recipientbeforeall@mail.com",
//       gender: "female",
//       birthdate: "04/30/1990",
//       certificateNumber: "errortest",
//       role: "attendee",
//       EventId: EventId,
//     };
//     Recipient.create(recipientForm)
//       .then((response) => {
//         certificateNumberBf = response.certificateNumber;
//         recipientId = response.recipientId;
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   });

//   afterAll(() => {
//     Organizer.destroy({ truncate: true })
//       .then((response) => {})
//       .catch((response) => {});

//     Event.destroy({ truncate: true })
//       .then((response) => {})
//       .catch((response) => {});

//     Recipient.destroy({ truncate: true })
//       .then((response) => {})
//       .catch((response) => {});
//   });

//   describe("POST /recipient/:eventId", function () {
//     it("should return status 401 when access_token is not provided", function (done) {
//       const body = {
//         name: "John Doe",
//         email: "recipient@mail.com",
//         gender: "female",
//         birthdate: "04/30/1990",
//         certificateNumber: "asdf1234",
//         role: "attendee",
//         EventId: EventId,
//       };
//       request(app)
//         .post(`recipient/:${eventId}`)
//         .send(body)
//         .end((err, res) => {
//           if (err) return done(err);
//           expect(res.status).toEqual(401);
//           expect(res.body).toEqual({
//             errorName: "JsonWebTokenError",
//             errorCode: 401,
//             errorMessage: "jwt must be provided",
//           });
//           return done();
//         });
//     });

//     it("should return status 401 when access_token is invalid", function (done) {
//       const body = {
//         name: "John Doe",
//         email: "recipient@mail.com",
//         gender: "female",
//         birthdate: "04/30/1990",
//         certificateNumber: "asd1234",
//         role: "attendee",
//         EventId: EventId,
//       };
//       request(app)
//         .post(`recipient/:${eventId}`)
//         .set("access_token", 'errortest')
//         .send(body)
//         .end((err, res) => {
//           if (err) return done(err);
//           expect(res.status).toEqual(401);
//           expect(res.body).toEqual({
//             errorName: "JsonWebTokenError",
//             errorCode: 401,
//             errorMessage: "jwt must be provided",
//           });
//           return done();
//         });
//     });

//     it("should return status 400 when required fields is empty", function (done) {
//       const body = {
//         Name: "",
//         Email: "",
//         Gender: "",
//         Birthdate: "04/30/1990",
//         CertificateNumber: "",
//         Role: "",
//         EventId: EventId,
//       };
//       request(app)
//         .post(`participant/:${organizerId}/:${eventId}`)
//         .set("access_token", jwtToken)
//         .send(body)
//         .end((err, res) => {
//           if (err) return done(err);
//           expect(res.status).toEqual(400);
//           expect(res.body).toEqual({
//             errorName: "SequelizeValidationError",
//             errorCode: 400,
//             errorMessages: [
//               "Participant's Name is required",
//               "Participant's Email is required",
//               "Participant's Gender is required",
//               "Participant's Birthdate is required",
//               "Participant's Role is required",
//             ],
//           });
//           return done();
//         });
//     });
//   });
//   describe("GET /recipients/:certificateNumber", function () {
//     it("should return status 401 when jwt is not provided", function (done) {
//       request(app)
//         .get(`/recipients/${certificateNumberBf}`)
//         .end((err, res) => {
//           if (err) return done(err);
//           expect(res.status).toEqual(404);
//           expect(err.body).toEqual({
//             errorName: "JsonWebTokenError",
//             errorCode: 401,
//             errorMessage: "jwt must be provided",
//           });
//           return done();
//         });
//     });
//     it("should return status 401 when access_token is invalid", function (done) {
//       request(app)
//         .get(`/recipients/${certificateNumberBf}`)
//         .end((err, res) => {
//           if (err) return done(err);
//           expect(res.status).toEqual(404);
//           expect(err.body).toEqual({
//             errorName: "JwtMalformed",
//             errorCode: 401,
//             errorMessage: "jwt can",
//           });
//           return done();
//         });
//     });
//     it("should return status 404 when certificate number is not found", function (done) {
//       request(app)
//         .get(`/recipients/${certificateNumberBf}`)
//         .set("access_token", jwtToken)
//         .end((err, res) => {
//           if (err) return done(err);
//           expect(res.status).toEqual(404);
//           expect(err.body).toEqual({
//             errorName: "SequelizeValidationError",
//             errorCode: 404,
//             errorMessage: "certificate number was not found",
//           });
//           return done();
//         });
//     });
//   });

//   describe("PUT /recipient/:eventId/:recipientId", function () {
//     it("should return status 401 when access_token is not provided", function (done) {
//       const body = {
//         name: "John Doe",
//         email: "recipient@mail.com",
//         gender: "female",
//         birthdate: "04/30/1990",
//         certificateNumber: "aaa123",
//         role: "attendee",
//         EventId: EventId,
//       };
//       request(app)
//         .put(`recipient/:${eventId}/:${recipientId}`)
//         .send(body)
//         .end((err, res) => {
//           if (err) return done(err);
//           expect(res.status).toEqual(401);
//           expect(res.body).toEqual({
//             errorName: "JsonWebTokenError",
//             errorCode: 401,
//             errorMessage: "jwt must be provided",
//           });
//           return done();
//         });
//     });
//     it("should return status 401 when access_token is invalid", function (done) {
//       const body = {
//         name: "John Doe",
//         email: "recipient@mail.com",
//         gender: "female",
//         birthdate: "04/30/1990",
//         certificateNumber: "aaa123",
//         role: "attendee",
//         EventId: EventId,
//       };
//       request(app)
//         .put(`recipient/:${eventId}/:${recipientId}`)
//         .set('access_token', 'errortest')
//         .send(body)
//         .end((err, res) => {
//           if (err) return done(err);
//           expect(res.status).toEqual(401);
//           expect(res.body).toEqual({
//             errorName: "JsonWebTokenError",
//             errorCode: 401,
//             errorMessage: "jwt must be provided",
//           });
//           return done();
//         });
//     });

//     it("should return status 400 when required fields is empty", function (done) {
//       const body = {
//         name: "",
//         email: "",
//         gender: "",
//         birthdate: "",
//         certificateNumber: "",
//         role: "",
//         EventId: EventId,
//       };
//       request(app)
//         .post(`participant/:${organizerId}/:${eventId}`)
//         .set("access_token", jwtToken)
//         .send(body)
//         .end((err, res) => {
//           if (err) return done(err);
//           expect(res.status).toEqual(400);
//           expect(res.body).toEqual({
//             errorName: "SequelizeValidationError",
//             errorCode: 400,
//             errorMessages: [
//               "Participant's Name is required",
//               "Participant's Email is required",
//               "Participant's Gender is required",
//               "Participant's Birthdate is required",
//               "Participant's Role is required",
//             ],
//           });
//           return done();
//         });
//     });
//   });

//   describe("DELETE /participant/:participantId", function () {
//     it("should return status 401 when access_token is not provided", function (done) {
//       request(app)
//         .delete(`/participant/${participantId}`)
//         .end((err, res) => {
//           if (err) return done(err);
//           expect(res.status).toEqual(401);
//           expect(res.body).toEqual({
//             errorName: "JsonWebTokenError",
//             errorCode: 401,
//             errorMessage: "jwt must be provided",
//           });
//           return done();
//         });
//     });
//     it("should return status 401 when access_token is invalid", function (done) {
//       request(app)
//         .delete(`/participant/${participantId}`)
//         .set('access_token', 'errortest')
//         .end((err, res) => {
//           if (err) return done(err);
//           expect(res.status).toEqual(401);
//           expect(res.body).toEqual({
//             errorName: "JsonWebTokenError",
//             errorCode: 401,
//             errorMessage: "jwt must be provided",
//           });
//           return done();
//         });
//     });
//     it("should return status 404 when id is not found", function (done) {
//       request(app)
//         .delete(`/participant/1000`)
//         .end((err, res) => {
//           if (err) return done(err);
//           expect(res.status).toEqual(404);
//           expect(res.body).toEqual({
//             errorName: "JsonWebTokenError",
//             errorCode: 401,
//             errorMessage: "jwt must be provided",
//           });
//           return done();
//         });
//     });
//   });
// });
