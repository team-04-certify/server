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
      banner: "abc",
      templatePath: 'cccc'
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

  })

  describe("POST /upload/banner/2", function () {
    it("should return status 200", function(done){
      const formdata = new FormData();
      formdata.append("file", '../storage/templates/ppt-text1.pptx');
      request(app)
        .post(`/upload/banner/${eventId}`)
        .set("access_token", jwtToken)
        .send(formdata)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.status).toEqual(201);
          expect(res.body.Success).toEqual('Success upload!');
          return done();
        })
    })
  })

  describe("POST /upload/template/2", function () {
    it("should return status 200", function(done){
      const formdata = new FormData();
      formdata.append("file", '../storage/templates/ppt-text1.pptx');
      request(app)
        .post(`/upload/template/${eventId}`)
        .set("access_token", jwtToken)
        .send(formdata)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.status).toEqual(201);
          expect(res.body.Success).toEqual('Success upload!');
          return done();
        })
    })
  })

})
