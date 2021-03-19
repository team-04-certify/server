const { Recipient } = require('../models')

class RecipientContoller {
  static async addRecipients(req, res, next) {
    try {
      const eventId = +req.params.eventId
      const recipientsFromCSV = req.body.recipients
      let recipientsWithEventId = []
      recipientsFromCSV.forEach((recipient, index) => {
        if(index !== 0){
          recipientsWithEventId.push({name: recipient.data[0], email:recipient.data[1], birthDate:recipient.data[2], certificateNumber:recipient.data[3], role:recipient.data[4], EventId: eventId})
        }
      })
      
      console.log(recipientsWithEventId);
      const recipients = await Recipient.bulkCreate(recipientsWithEventId)
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
      await Recipient.destroy({where: {id: recipientId}})
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
      const recipient = await Recipient.update({ name, email, birthdate, certificateNumber, role, eventId }, {returning: true, where: {id: recipientId}})
      console.log(recipient);
      res.status(200).json(recipient[1][0])
    } catch (error) {
      next(error)
    }
  }
}

module.exports = RecipientContoller;
