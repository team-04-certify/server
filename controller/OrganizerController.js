const { compare } = require("../helpers/bcrypt");
const { createToken } = require("../helpers/jwt");
const {Organizer, Event, Recipient} = require("../models");


class OrganizerController {
  static register (req, res, next) {
    console.log('masuk sini register<<')
    const {name, email, password} = req.body
    Organizer.create({
      name,
      email,
      password
    })
      .then(dataOrganizer => {
        res.status(201).json({
          name: dataOrganizer.name,
          email: dataOrganizer.email
        })
      })
      .catch(err  => {
        next(err)
      })
    // res.send('masuk regiter')
  }
  static login (req, res, next) {
    console.log('masuk login<<<<<<')
    const {email, password} = req.body
    Organizer.findOne({
      where: {
        email
      }
    })
      .then(organizerData => {
        if(!organizerData) throw {name:'invalid email or password', message: 'invalid email or password'}
        const checkPass = compare(password, organizerData.password)
        if(!checkPass) throw {name:'invalid email or password', message: 'invalid email or password'}
        const access_token = createToken({
          name: organizerData.name,
          email: organizerData.email
        })
        res.status(200).json({
          access_token
        })
      })
      .catch(err => {
        next(err)
      })
  }
  static home(req, res, next) {
    console.log(req.organizer)
    const { organizerName } = req.params
    Organizer.findOne({
      where: {
        name: organizerName
      },
      include: {
        model: Event,
        include: Recipient
      }
    })
      .then(dataOrganizer => {
        if(!dataOrganizer) {
          return next({
            message: "Can't find organizer"
          })
        }
        console.log(dataOrganizer, 'masuk sini<<<<<<')
        res.status(200).json(dataOrganizer)
      })
      .catch(err => {
        next(err)
      })
    // console.log(req.params)
    // res.send(organizerName)
  }
}

module.exports = OrganizerController;
