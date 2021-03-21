const { Recipient, Event } = require('../models')

class RecipientContoller {
  static async addRecipients(req, res, next) {
    try {
      const eventId = +req.params.eventId
      const event = await Event.findOne({where: {id: eventId}})
      if(!event){
        throw { name: 'CustomError', code: 404, message: 'event not found'}
      }
      const recipientsFromCSV = req.body.recipients
      let recipientsWithEventId = []
      recipientsFromCSV.forEach((recipient, index) => {
        if(index !== 0){
          recipientsWithEventId.push({name: recipient.data[0], email:recipient.data[1], birthDate:recipient.data[2], certificateNumber:recipient.data[3], role:recipient.data[4], EventId: eventId})

        }
      })
      const recipients = await Recipient.bulkCreate(recipientsWithEventId, {attributes: ['id']})
      let temp = recipients.map( recipient => {
        return {
          id: recipient.id,
          name: recipient.name, 
          email: recipient.email, 
          birthDate: recipient.birthDate, 
          certificateNumber: recipient.certificateNumber, 
          certificateLink: `https://firebase/validate/${recipient.id}`, 
          role: recipient.role, 
          EventId: recipient.EventId}
        }) 
      const updatedRecipients = await Recipient.bulkCreate(temp, {updateOnDuplicate: ['certificateLink']})
      res.status(201).json(updatedRecipients)
    } catch (error) {
      next(error)
    }
  }

  static async getRecipient(req, res, next) {
    try {

      const id = +req.params.recipientId
      const recipient = await Recipient.findOne({where: {id}})
      if(!recipient){
        throw { name: 'CustomError', code: 404, message: 'recipient not found'}
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
