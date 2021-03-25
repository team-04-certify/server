const request = require("supertest");
const app = require("../app");
const jwt = require("jsonwebtoken");
const { Organizer, Event, Recipient } = require("../models");

let access_token = "";
let fakeAccess_token = "";
let organizerId = 0;
let organizerName = ""
let eventId = 0;
  beforeEach(async () => {
    try{
    const organizerForm = {
      id: 1,
      name: "AdminTestCorp",
      email: "admin@mail.com",
      password: "123456",
    };
    access_token = jwt.sign(organizerForm, "certifyjayaaaselole123123");
    fakeAccess_token = jwt.sign({id:10, name: 'aaAdminTestCorp', email: organizerForm.email, password: organizerForm.password}, "certifyjayaaaselole123123");
    const organizerBf = await Organizer.create(organizerForm)
    organizerId = +organizerBf.id;
    organizerName = organizerBf.name
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

describe("POST /events/:organizerId", function () {
  it("should return status 201 with message", (done) => {
    let body = {
      title: "SEMINAR NGODING SE JAWA",
      date: "07/14/2021",
      type: "Seminar",
      organizerId: 1,
    };
    request(app)
      .post(`/events`)
      .send(body)
      .set("access_token", access_token)
      .end((err, res) => {
        if (err) {
          console.log(err);
          done(err);
        }
        expect(res.status).toEqual(201);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("event");
        done();
      });
  });


  it("should return status 400 with message (error no acces token)", function (done) {
    let body = {
      title: "SEMINAR NGODING SE JAWA",
      date: "07/14/2021",
      type: "Seminar",
      organizerId: 1,
    };
    request(app)
      .post(`/events`)
      .send(body)
      .set("access_token", '')
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.status).toEqual(401);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toEqual('jwt is required');
        done();
      });
  });
});

describe("GET /:organizerName/:eventId Table", function () {
  it("should return status 200 with data of event", function (done) {
    request(app)
      .get(`/events/${eventId}`)
      .set("access_token", access_token)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.status).toEqual(200);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("event");
        expect(Array.isArray(res.body.event)).toEqual(true);
        done();
      });
  });

  it("should return status 401 with error message", function (done) {
    request(app)
      .get(`/events/${eventId}`)
      // .get(`/events/robi/1`)
      .set("access_token", fakeAccess_token)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.status).toEqual(401);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toEqual("invalid jwt");
        done();
      });
  });

  it("should return status 401 with error message (no access token)", function (done) {
    request(app)
      .get(`/${organizerName}/${eventId}`)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.status).toEqual(401);
        expect(res.body).toHaveProperty("message");
        done();
      });
  });
});

describe("PUT /events/:eventId", () => {
  it("should return status 200 with message succes", function (done) {
    let body = {
      title: "SEMINAR NGODING SE LOMBOK",
      date: "07/14/2021",
      type: "Seminar",
    };

    request(app)
      .put(`/events/${eventId}`)
      .send(body)
      .set("access_token", access_token)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.status).toEqual(200);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("event");
        done();
      });
  });


  it("should return status 401 with message (error no acces token)", function (done) {
    let body = {
      event: "SEMINAR NGODING SE LOMBOK",
      date: "07/14/2021",
      type: "Seminar",
      organizerId: 1,
    };
    request(app)
      .put(`/events/${eventId}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.status).toEqual(401);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toEqual("jwt is required");
        done();
      });
  });
});

describe("DELETE /events/eventId", () => {
  it("should return status 200 with message succes", (done) => {
    request(app)
      .delete(`/events/${eventId}`)
      .set("access_token", access_token)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty("message");
        done();
      });
  });

  it("should return status 404 with mesage error", (done) => {
    request(app)
      .delete("/events/10")
      .set("access_token", access_token)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.status).toEqual(404);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("message");
        expect(res.body).toHaveProperty("code");
        expect(res.body).toHaveProperty("name");
        done();
      });
  });

  it("should return status 401 with mesage error(no access token)", (done) => {
    request(app)
      .delete(`/events/${eventId}`)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.status).toEqual(401);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toEqual("jwt is required");
        done();
      });
  });
});
