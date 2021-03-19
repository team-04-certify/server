const request = require("supertest");
const app = require("../app");
const jwt = require("jsonwebtoken");
const { Organizer, Event, Recipient } = require("../models");

let tokenUser = "";
let organizeData;
let eventData;

beforeAll(() => {
  let user = {
    id: 1,
    name: "Certify",
    email: "admin@mail.com",
    password: "123456",
  };

  tokenUser = jwt.sign(user, "certify");

  Organizer.create(user)
    .then((response) => {
      organizerName = response;
    })
    .catch((err) => {
      console.log(err);
    });
});

afterAll(() => {
  Organizer.destroy({ truncate: true })
    .then((response) => {})
    .catch((response) => {});

  Event.destroy({ truncate: true })
    .then((response) => {})
    .catch((response) => {});

  Recipient.destroy({ truncate: true })
    .then((response) => {})
    .catch((response) => {});
});

describe("POST /events/:organizerId", () => {
  it("should return status 201 with message", (done) => {
    let body = {
      event: "SEMINAR NGODING SE JAWA",
      date: "07/14/2021",
      type: "Seminar",
    };
    request(app)
      .post(`/events/${organizeData.id}`)
      .send(body)
      .set("access_token", tokenUser)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.status).toEqual(201);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("event");
        done();
      });
  });

  it("should return status 400 with message (error empty)", (done) => {
    let body = {
      event: "",
      date: "",
      type: "Seminar",
      organizerId: 1,
    };

    request(app)
      .post(`/events/${organizeData.id}`)
      .send(body)
      .set("access_token", tokenUser)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.status).toEqual(400);
        expect(res.body).toHaveProperty("message");
        done();
      });
  });

  it("should return status 401 with message (error no acces token)", (done) => {
    let body = {
      event: "SEMINAR NGODING SE JAWA",
      date: "07/14/2021",
      type: "Seminar",
      organizerId: 1,
    };
    request(app)
      .post(`/events/${organizeData.id}`)
      .send(body)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.status).toEqual(401);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toEqual("Unauthorized");
        done();
      });
  });
});

describe("GET /:organizerName/:eventId Table", function () {
  it("should return status 200 with data of event", function (done) {
    request(app)
      .get(`/${organizeData.name}/1`)
      .set("access_token", tokenUser)
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

  it("should return status 404 with error message", function (done) {
    request(app)
      .get(`/${organizeData.name}/1`)
      .set("access_token", tokenUser)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.status).toEqual(404);
        expect(res.body).toHaveProperty("message");
        done();
      });
  });

  it("should return status 401 with error message (no access token)", function (done) {
    request(app)
      .get(`/${organizeData.name}/1`)
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

describe("PUT /events/eventId", () => {
  it("should return status 200 with message succes", (done) => {
    let body = {
      event: "SEMINAR NGODING SE LOMBOK",
      date: "07/14/2021",
      type: "Seminar",
    };

    request(app)
      .put("/events/1")
      .send(body)
      .set("access_token", tokenUser)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.status).toEqual(200);
        expect(typeof res.body).toEqual("object");
        expect(res.body.message).toHaveProperty("event");
        done();
      });
  });

  it("should return status 4000 with error message", (done) => {
    let body = {
      event: "",
      date: "",
      type: "Seminar",
      organizerId: 1,
    };

    request(app)
      .put("/events/1")
      .send(body)
      .set("access_token", tokenUser)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.status).toEqual(400);
        expect(res.body).toHaveProperty("message");
        done();
      });
  });

  it("should return status 401 with message (error no acces token)", (done) => {
    let body = {
      event: "SEMINAR NGODING SE LOMBOK",
      date: "07/14/2021",
      type: "Seminar",
      organizerId: 1,
    };
    request(app)
      .post("/events/1")
      .send(body)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.status).toEqual(401);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toEqual("Unauthorized");
        done();
      });
  });
});

describe("DELETE /events/eventId", () => {
  it("should return status 200 with message succes", (done) => {
    request(app)
      .delete("/events/1")
      .set("access_token", tokenUser)
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
      .delete("/events/1")
      .set("access_token", tokenUser)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.status).toEqual(404);
        expect(res.body).toHaveProperty("message");
        done();
      });
  });

  it("should return status 401 with mesage error(no access token)", (done) => {
    request(app)
      .delete("/events/1")
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.status).toEqual(401);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toEqual("Unauthorized");
        done();
      });
  });
});
