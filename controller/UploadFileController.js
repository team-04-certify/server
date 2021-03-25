const { Event } = require('../models')

class UploadFileController {
  static async uploadBanner(req, res) {
    const url = req.body.file
    const eventId = +req.params.eventId
    console.log('Upload berhasil')
    await Event.update({banner: url}, { where: {id: eventId}})
    res.status(201).json({Success: 'Success upload!'})
  }

  static async uploadTemplate(req, res) {
    const url = req.body.file
    const eventId = req.params.eventId
    console.log('Upload berhasil')
    await Event.update({templatePath: url}, { where: {id: eventId}})
    res.status(201).json({Success: 'Success upload!'})
  }
}

module.exports = UploadFileController