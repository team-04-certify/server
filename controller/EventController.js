const { Organizer, Event } = require("../models");

class EventController {
  static async getOrganizerEvents(req, res, next) {
    try {
      const { organizerName } = req.params;

      const organizer = await Organizer.findOne({
        where: { name: organizerName },
        include: Event,
      });

      res.status(200).json({ organizer });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async getOrganizerEvent(req, res, next) {
    try {
      const { organizerName, eventId } = req.params;

      const organizer = await Organizer.findOne({
        where: { name: organizerName },
        include: Event,
      });

      if (organizer === null) {
        throw { status: 404, message: "Organizer not found" };
      }

      const event = organizer.Events.filter(
        (event) => event.id === Number(eventId)
      );

      res.status(200).json({ event });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async addEvent(req, res, next) {
    try {
      const { organizerId } = req.params;
      const { title, event, date, type } = req.body;

      const eventData = await Event.create({
        title,
        date,
        type,
        OrganizerId: +organizerId,
      });

      res.status(201).json({ event, eventData });
    } catch (err) {
      console.log(err);
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
        { where: { id: +eventId } }
      );

      res.status(200).json({ event: eventData });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async deleteEvent(req, res, next) {
    try {
      const { eventId } = req.params;

      const event = await Event.destroy({ where: { id: +eventId } });

      console.log(event);
      res.status(200).json({ message: "Event deleted" });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

module.exports = EventController;
