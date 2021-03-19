const { Recipient } = require('../models')

class RecipientContoller {
  static async addRecipients(req, res, next) {
    try {
      const eventId = +req.params.eventId
      const recipientsFromCSV = req.body.recipients
      let recipientsWithEventId = recipientsFromCSV.map((recipient, index) => {
        if(index > 0){
          return {name: recipient.data[0], email:recipient.data[1], birthDate:recipient.data[2], certificateNumber:recipient.data[3], role:recipient.data[4], EventId: eventId}
        }
      })
      const recipients = await Recipient.bulkInsert(recipientsWithEventId)
      res.status(201).json(recipients)

    } catch (error) {
      next(error)
    }
  }

  static async getRecipient(req, res, next) {
    try {
      const certificateNumber = req.params.certificateNumber
      const recipient = await Recipient.findOne({where: {certificateNumber}})
      res.status(200).json(recipient)
    } catch (error) {
      next(error)
    }
  }
  static async deleteRecipient(req, res, next) {
    try {
      const recipientId = req.params.recipientId
      await Recipient.destroy({where: {recipientId}})
      res.status(200).json({message: 'recipient was deleted successfully'})
    } catch (error) {
      next(error)
    }
  }
  static async putRecipient(req, res, next) {
    try {
      const recipientId = req.params.recipientId
      const eventId = +req.params.eventId
      const { name, email, birthdate, certificateNumber, role } = req.body
      const recipient = Recipient.update({ name, email, birthdate, certificateNumber, role, eventId }, {where: {recipientId}})
      res.status(200).json(recipient)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = RecipientContoller;
