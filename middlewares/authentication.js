const { verify } = require('../helpers/jwt')
const {Organizer} = require('../models')

module.exports = async (req, res, next) => {
  const access_token = req.headers.access_token

  if(!access_token) {
    return next({
      name: 'jwt is required',
      message: 'jwt is required'
    })
  }
  try {
    const payload =  verify(access_token)
    console.log(payload, "CHECK PAYLOAD IN AUTHENTICATION");

    const organizer = await Organizer.findOne({
      where: {
        name: payload.name
      }
    })
    if(!organizer) {
      return next({
        name: 'invalid jwt',
        message: 'invalid jwt'
      })
    }

    req.organizer = payload
    next()
  }
  catch (err) {
    next(err)
  }
}