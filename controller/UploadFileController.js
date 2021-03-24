class UploadFileController {
  static uploadBanner(req, res) {
    const url = req.body.file
    const eventId = req.params.eventId
    console.log('Upload berhasil', url, eventId)
    res.status(201).json({Success: 'Success upload!'})
  }

  static uploadTemplate(req, res) {
    const url = req.body.file
    const eventId = req.params.eventId
    console.log('Upload berhasil', url, eventId)
    res.status(201).json({Success: 'Success upload!'})
  }
}

module.exports = UploadFileController