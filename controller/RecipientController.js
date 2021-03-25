const { Recipient, Event, Organizer } = require('../models')

class RecipientController {
  static async addRecipients(req, res, next) {
    try {
      const eventId = +req.params.eventId
      const event = await Event.findOne({ where: { id: eventId } })
      if (!event) {
        throw { name: 'CustomError', code: 404, message: 'event not found' }
      }
      const recipientsFromCSV = req.body.map(recipient => {
        return {
          name: recipient.name,
          email: recipient.email,
          birthDate: recipient.birthDate,
          certificateNumber: recipient.certificateNumber,
          role: recipient.role,
          EventId: eventId,
          status: "not yet sent"
        }
      })
      const recipients = await Recipient.bulkCreate(recipientsFromCSV, { attributes: ['id'] })
      let temp = recipients.map(recipient => {
        return {
          id: recipient.id,
          name: recipient.name,
          email: recipient.email,
          birthDate: recipient.birthDate,
          certificateNumber: recipient.certificateNumber,
          certificateLink: `https://certify.helsinki-fox.tech/certificate/${recipient.id}`,
          role: recipient.role,
          EventId: recipient.EventId,
          status: recipient.status
        }
      })
      const updatedRecipients = await Recipient.bulkCreate(temp, { updateOnDuplicate: ['certificateLink'] })
      res.status(201).json(updatedRecipients)
    } catch (error) {
      next(error)
    }
  }

  static async getRecipient(req, res, next) {
    try {
      const id = +req.params.recipientId
      const recipient = await Recipient.findOne({
        where: { id },
        include: {
          model: Event,
          include: Organizer
        }
      })
      if (!recipient) {
        throw { name: 'CustomError', code: 404, message: 'recipient not found' }
      }
      res.status(200).json(recipient)
    } catch (error) {
      next(error)
    }
  }
  static async getRecipients(req, res, next) {
    try {
      console.log('masuk')
      const eventId = +req.params.eventId
      const event = await Event.findOne({
        where: {
          id: eventId
        },
        include: [{
          model: Recipient
        }]
      })
      if (!event) {
        throw { name: 'CustomError', code: 404, message: 'event id not found' }
      }
      const recipients = event.Recipients
      res.status(200).json(recipients)
    } catch (error) {
      next(error)
    }
  }
  static async deleteRecipient(req, res, next) {
    try {
      const recipientId = +req.params.recipientId
      const recipient = await Recipient.findByPk(recipientId)
      if (!recipient) {
        throw { name: 'CustomError', code: 404, message: 'recipient was not found' }
      }
      await Recipient.destroy({ where: { id: recipientId } })
      res.status(200).json({ message: 'recipient was deleted successfully' })
    } catch (error) {
      next(error)
    }
  }
  static async putRecipient(req, res, next) {
    try {
      const recipientId = req.params.recipientId
      const recipient = await Recipient.findByPk(recipientId)
      if (!recipient) {
        throw { name: 'CustomError', code: 404, message: 'recipient was not found' }
      }
      const eventId = +req.params.eventId
      const { name, email, birthDate, certificateNumber, role } = req.body
      const updatedRecipient = await Recipient.update({ name, email, birthDate, certificateNumber, role, eventId }, { returning: true, where: { id: recipientId } })
      res.status(200).json(updatedRecipient[1][0])
    } catch (error) {
      next(error)
    }
  }
}

module.exports = RecipientController;
