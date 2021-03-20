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
      if(!recipient){
        throw { name: 'CustomError', code: 404, message: 'certificate not found'}
      }
      res.status(200).json(recipient)
    } catch (error) {
      next(error)
    }
  }
  static async deleteRecipient(req, res, next) {
    try {
      const recipientId = +req.params.recipientId
      const recipient = await Recipient.findByPk(recipientId)
      if(!recipient){
        throw { name: 'CustomError', code: 404, message: 'recipient was not found'}
      }
      await Recipient.destroy({where: {id: recipientId}})
      res.status(200).json({message: 'recipient was deleted successfully'})
    } catch (error) {
      next(error)
    }
  }
  static async putRecipient(req, res, next) {
    try {
      const recipientId = req.params.recipientId
      const recipient = await Recipient.findByPk(recipientId)
      if(!recipient){
        throw { name: 'CustomError', code: 404, message: 'recipient was not found'}
      }
      const eventId = +req.params.eventId
      const { name, email, birthDate, certificateNumber, role } = req.body
      const updatedRecipient = await Recipient.update({ name, email, birthDate, certificateNumber, role, eventId }, {returning: true, where: {id: recipientId}})
      res.status(200).json(updatedRecipient[1][0])
    } catch (error) {
      next(error)
    }
  }
}

module.exports = RecipientContoller;
