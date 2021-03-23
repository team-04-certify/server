const { Organizer, Event } = require("../models");

class EventController {

  static async getOrganizerEvent(req, res, next) {
    console.log('masuk getorganizer event<<<<')
    try {
      const { eventId } = req.params;
      const { name } = req.organizer

      const organizer = await Organizer.findOne({
        where: { name },
        include: Event,
      });

      if (organizer === null) {
        throw { name: "CustomError", code: 404, message: "Organizer not found" };
      }

      const event = await organizer.Events.filter(
        (event) => event.id === Number(eventId)
      );
      res.status(200).json({ event });
    } catch (err) {
      next(err);
    }
  }

  static async addEvent(req, res, next) {
    console.log('masuk addEvent')
    try {
      const { id } = req.organizer;
      const { title, date, type } = req.body;

      const eventData = await Event.create({
        title,
        date,
        type,
        OrganizerId: +id,
      });
      res.status(201).json({ event: eventData });
    } catch (err) {
      next(err);
    }
  }

  static async editEvent(req, res, next) {
    try {
      const { title, date, type } = req.body;
      const { eventId } = req.params;
      const eventData = await Event.update(
        {
          title,
          date,
          type,
        },
        {
          where: { id: +eventId },
          returning: true
        }
      );

      res.status(200).json({ event: eventData });
    } catch (err) {
      next(err);
    }
  }

  static async deleteEvent(req, res, next) {
    try {
      const { eventId } = req.params;

      const event = await Event.destroy({ where: { id: +eventId }, returning: true });

      console.log(event);
      if(event === 0) {
        throw { name: "CustomError", code: 404, message: "Event not found" };
      }
      res.status(200).json({ message: "Event deleted" });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

module.exports = EventController;
