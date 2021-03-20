const request = require("supertest");
const app = require("../app");
const jwt = require("jsonwebtoken");
const { Organizer, Event, Recipient } = require("../models");

let access_token = "";
let organizerId = 0;
let organizerName = ""
// let eventData;

// let organizer = {
//   name: "Certify",
//   email: "admin@mail.com",
//   password: "123456",
// };
// beforeEach(() => {
//   tokenUser = jwt.sign(organizer, "certifyjayaaaselole123123");
// });

beforeAll(() => {
  let organizer = {
    name: "Certify",
    email: "admin@mail.com",
    password: "123456",
  };
  access_token = jwt.sign(organizer, "certifyjayaaaselole123123");
  Organizer.create(organizer)
    .then((response) => {
      organizerId = response.id;
      organizerName = response.name
    })
    .catch((err) => {
      console.log(err);
    });
});

afterAll(() => {
  Organizer.destroy()
    .then((response) => {
      return Event.destroy()
    })
    .then((response) => {
      return Recipient.destroy()
    })
    .catch((response) => {});
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
      .post(`/events/1`)
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

  // it("should return status 400 with message (error empty)", function (done) {
  //   let body = {
  //     event: null,
  //     date: "07/14/2021",
  //     type: null,
  //     organizerId: 1,
  //   };
  //   console.log(body, 'ini bodinya <<<<<<<<<')
  //   request(app)
  //     .post(`/events/1`)
  //     .send(body)
  //     .set("access_token", access_token)
  //     .end((err, res) => {
  //       if (err) {
  //         done(err);
  //       }
  //       expect(res.status).toEqual(400);
  //       expect(Array.isArray(res.body)).toEqual(true);
  //       expect(res.body[0]).toHaveProperty("message");
  //       done();
  //     });
  // });

  it("should return status 400 with message (error no acces token)", function (done) {
    let body = {
      title: "SEMINAR NGODING SE JAWA",
      date: "07/14/2021",
      type: "Seminar",
      organizerId: 1,
    };
    request(app)
      .post(`/events/1`)
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
      .get(`/events/Certify/1`)
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

  // it("should return status 404 with error message", function (done) {
  //   request(app)
  //     .get(`/events/Certify/1`)
  //     .set("access_token", access_token)
  //     .end((err, res) => {
  //       if (err) {
  //         done(err);
  //       }
  //       expect(res.status).toEqual(404);
  //       expect(res.body).toHaveProperty("message");
  //       done();
  //     });
  // });

  it("should return status 401 with error message (no access token)", function (done) {
    request(app)
      .get(`/${organizerName}/1`)
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
      .put("/events/1")
      .send(body)
      .set("access_token", access_token)
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

  // it("should return status 4000 with error message", function (done) {
  //   let body = {
  //     event: "",
  //     date: "",
  //     type: "Seminar",
  //     organizerId: 1,
  //   };

  //   request(app)
  //     .put("/events/1")
  //     .send(body)
  //     .set("access_token", tokenUser)
  //     .end((err, res) => {
  //       if (err) {
  //         done(err);
  //       }
  //       expect(res.status).toEqual(400);
  //       expect(res.body).toHaveProperty("message");
  //       done();
  //     });
  // });

  // it("should return status 401 with message (error no acces token)", function (done) {
  //   let body = {
  //     event: "SEMINAR NGODING SE LOMBOK",
  //     date: "07/14/2021",
  //     type: "Seminar",
  //     organizerId: 1,
  //   };
  //   request(app)
  //     .post("/events/1")
  //     .send(body)
  //     .end((err, res) => {
  //       if (err) {
  //         done(err);
  //       }
  //       expect(res.status).toEqual(401);
  //       expect(res.body).toHaveProperty("message");
  //       expect(res.body.message).toEqual("Unauthorized");
  //       done();
  //     });
  // });
});

// describe("DELETE /events/eventId", () => {
//   it("should return status 200 with message succes", (done) => {
//     request(app)
//       .delete("/events/1")
//       .set("access_token", tokenUser)
//       .end((err, res) => {
//         if (err) {
//           done(err);
//         }
//         expect(res.status).toEqual(200);
//         expect(res.body).toHaveProperty("message");
//         done();
//       });
//   });

//   it("should return status 404 with mesage error", (done) => {
//     request(app)
//       .delete("/events/1")
//       .set("access_token", tokenUser)
//       .end((err, res) => {
//         if (err) {
//           done(err);
//         }
//         expect(res.status).toEqual(404);
//         expect(res.body).toHaveProperty("message");
//         done();
//       });
//   });

//   it("should return status 401 with mesage error(no access token)", (done) => {
//     request(app)
//       .delete("/events/1")
//       .end((err, res) => {
//         if (err) {
//           done(err);
//         }
//         expect(res.status).toEqual(401);
//         expect(res.body).toHaveProperty("message");
//         expect(res.body.message).toEqual("Unauthorized");
//         done();
//       });
//   });
// });
