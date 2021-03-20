const EventRouter = require("express").Router();
const EventController = require("../controller/EventController");

// EventRouter.get("/:organizerName", EventController.getOrganizerEvents);

EventRouter.get("/:organizerName/:eventId", EventController.getOrganizerEvent);

EventRouter.post("/events/:organizerId", EventController.addEvent);

EventRouter.put("/events/:eventId", EventController.editEvent);

EventRouter.delete("/events/:eventId", EventController.deleteEvent);

module.exports = EventRouter;
