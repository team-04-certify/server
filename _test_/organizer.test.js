const request = require("supertest");
const app = require("../app");
const { Organizer, Event, Recipient } = require("../models");
const jwt = require("jsonwebtoken");

let access_token = "";
let organizerName = "";
beforeAll(() => {
  const organizerData = {
    name: "Certify",
    email: "admin@mail.com",
    password: "123456",
  };
  access_token = jwt.sign(
    { name: organizerData.name, email: organizerData.email },
    "certifyjayaaaselole123123"
  );
  Organizer.create(organizerData)
    .then((response) => {
      organizerName = response.name;
    })
    .catch((err) => {
      console.log(err);
    });
});
afterAll(async () => {
  try{
    await Organizer.destroy({ truncate: true })
    await Event.destroy({ truncate: true })
    await Recipient.destroy({ truncate: true })
  } catch(err){
    console.log(err);
  }

});

// ============ register success============
describe("POST /register", function () {
  it("should return status 201", function (done) {
    let body = {
      name: "Certify Seminar",
      email: "robi@mail.com",
      password: "robi123",
    };
    request(app)
      .post("/register")
      .send(body)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.status).toEqual(201);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("name");
        expect(typeof res.body.name).toEqual("string");
        expect(res.body).toHaveProperty("email");
        expect(typeof res.body.email).toEqual("string");
        done();
      });
  });
});
// ============ register error name unique ============
describe("POST /register", function () {
  it("should return status 201", function (done) {
    let body = {
      name: "Certify Seminar",
      email: "robi@mail.com",
      password: "robi123",
    };
    request(app)
      .post("/register")
      .send(body)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.status).toEqual(400);
        expect(Array.isArray(res.body)).toEqual(true);
        expect(res.body[0]).toHaveProperty("message");
        done();
      });
  });
});

// ============ register error email unique ============
describe("POST /register", function () {
  it("should return status 201", function (done) {
    let body = {
      name: "Certify Seminar2",
      email: "robi@mail.com",
      password: "robi123",
    };
    request(app)
      .post("/register")
      .send(body)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.status).toEqual(400);
        expect(Array.isArray(res.body)).toEqual(true);
        expect(res.body[0]).toHaveProperty("message");
        done();
      });
  });
});

// ============ register error validation password min length 6 characters============
describe("POST /register", function () {
  it("should return status 201", function (done) {
    let body = {
      name: "Seminar",
      email: "kantorSeminar@gmail.com",
      password: "23",
    };
    request(app)
      .post("/register")
      .send(body)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.status).toEqual(400);
        expect(Array.isArray(res.body)).toEqual(true);
        expect(res.body[0]).toHaveProperty("message");
        done();
      });
  });
});

// ============ register error validation password min length 6 characters and empty name and empty email============
describe("POST /register", function () {
  it("should return status 400", function (done) {
    let body = {
      name: "",
      email: "",
      password: "23",
    };
    request(app)
      .post("/register")
      .send(body)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.status).toEqual(400);
        expect(Array.isArray(res.body)).toEqual(true);
        done();
      });
  });
});
// ============ login success============
describe("POST /login", function () {
  it("should return status 200", function (done) {
    let body = {
      email: "robi@mail.com",
      password: "robi123",
    };
    request(app)
      .post("/login")
      .send(body)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.status).toEqual(200);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("access_token");
        done();
      });
  });
});
// ============ login error  no email adn password=============
describe("POST /login", function () {
  it("should return status 400", function (done) {
    let body = {
      email: "",
      password: "",
    };
    request(app)
      .post("/login")
      .send(body)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.status).toEqual(400);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toEqual("invalid email or password");
        done();
      });
  });
});
// ============ login error email is empty in database=============
describe("POST /login", function () {
  it("should return status 400", function (done) {
    let body = {
      email: "tahu@mail.com",
      password: "robi123",
    };
    request(app)
      .post("/login")
      .send(body)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.status).toEqual(400);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toEqual("invalid email or password");
        done();
      });
  });
});
// ============ login error  no email=============
describe("POST /login", function () {
  it("should return status 400", function (done) {
    let body = {
      email: "",
      password: "robi123",
    };
    request(app)
      .post("/login")
      .send(body)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.status).toEqual(400);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toEqual("invalid email or password");
        done();
      });
  });
});
// ============ login error  no password=============
describe("POST /login", function () {
  it("should return status 400", function (done) {
    let body = {
      email: "robi@mail.com",
      password: "",
    };
    request(app)
      .post("/login")
      .send(body)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.status).toEqual(400);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toEqual("invalid email or password");
        done();
      });
  });
});

// ================== show organization by id==================
describe("GET /", function () {
  it("should return status 200", function (done) {
    request(app)
      .get(`/`)
      .set("access_token", access_token)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.status).toEqual(200);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("id");
        expect(res.body).toHaveProperty("name");
        expect(res.body).toHaveProperty("email");
        expect(res.body).toHaveProperty("Events");
        done();
      });
  });
});
// ================== show organization no access token==================
describe("GET /", function () {
  it("should return status 401", function (done) {
    request(app)
      .get(`/`)
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
