const request = require("supertest");
const app = require("../app");
const { Organizer, Event, Recipient } = require("../models");
const jwt = require('jsonwebtoken')

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
          certificateLink: "www.google.com"
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

    jest.setTimeout(50000)
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

    jest.setTimeout(50000)
    it("should return status 400 and a message when there is no recipients found", function (done) {
      Recipient.destroy({ truncate: true })
      request(app)
        .get(`/certificates/${eventId}/1`)
        .set("access_token", jwtToken)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.status).toEqual(400);
          expect(res.body).toEqual({
            "name": "CustomError",
            "code": 400,
            "message": "at least one certificate recipient is required",
          });
          
          return done();
        });
    });

    it("should return status 401 when jwt not provided", function (done) {
      Recipient.destroy({ truncate: true })
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
      Recipient.destroy({ truncate: true })
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

// const request = require("supertest");
// const app = require("../app");
// const { Organizer, Event, Recipient } = require("../models");
// const jwt = require('jsonwebtoken')

// describe("Success test cases CRUD recipient", function () {
//   let organizerId = null;
//   let eventId = null;
//   let jwtToken = null;
//   let recipientId = null;
//   beforeEach(async () => {
//     try{
//     const organizerForm = {
//       name: "AdminTestCorp",
//       email: "adminnnn@mail.com",
//       password: "123456",
//     };
//     // const body = {
//     //   recipients: [
//     //     {data: ["name", "email", "birthdate", "certificateNumber", "role", "certificateLink"]},
//     //     {data: ["JohnDoe", "johndoe@mail.com", "03/04/1993", "ads2sd334", "attendee", "www.google.com"]}
//     //   ]
//     // }
//     const organizerBf = await Organizer.create(organizerForm)
//     organizerId = +organizerBf.id;
//     jwtToken = jwt.sign({id: organizerId, name: organizerForm.name, email: organizerForm.email}, process.env.SECRET_KEY);
//     invalidJwtToken = jwt.sign({id: organizerId, name: "A CORP", email: "lala@mil.com", password: 'qwerty'}, process.env.SECRET_KEY)
    
//         const eventForm = {
//           title: "Workshop Admins",
//           date: "04/12/2021",
//           type: "Workshop",
//           OrganizerId: organizerId,
//         };
//     const eventBf = await Event.create(eventForm)
//     eventId = +eventBf.id
//         const recipientForm = {
//           name: "johndoe",
//           email: "participantbeforeall@mail.com",
//           birthDate: "04/03/1991",
//           certificateNumber: "aaa123",
//           role: "attendee",
//           EventId: eventId,
//           certificateLink: "www.google.com"
//         };
//     const recipientBf = await Recipient.create(recipientForm)
//     recipientId = +recipientBf.id
//       } catch(err){
//         console.log(err);
//       }
//   });

//   afterEach(async () => {
//     try{
//       await Organizer.destroy({ truncate: true })
//       await Event.destroy({ truncate: true })
//       await Recipient.destroy({ truncate: true })
//     } catch(err){
//       console.log(err);
//     }

//   });

//   describe("GET /certificates/:eventId", function () {
//     jest.setTimeout(30000)
//     it("should return status 200 with a success message", function (done) {
//       const body = {
//        recipients: [
//          {data: ["name", "email", "birthdate", "certificateNumber", "role", "certificateLink"]},
//          {data: ["John Doe", "johndoe@mail.com", "03/04/1993", "ads2sd334", "attendee", "www.google.com"]}
//        ]
//       };
//       request(app)
//         .get(`/certificates/${eventId}`)
//         .set("access_token", jwtToken)
//         .send(body)
//         .end((err, res) => {
//           if (err) return done(err);

//           expect(res.status).toEqual(200);
//           expect(res.body.message).toEqual('success');
          
//           return done();
//         });
//     }, 50000);
//   });
// });


