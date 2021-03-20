const EventRouter = require("express").Router();
const EventController = require("../controller/EventController");
const authentication = require("../middlewares/authentication");
// EventRouter.get("/:organizerName", EventController.getOrganizerEvents);
// EventRouter.use(authentication)
EventRouter.get("/events/:organizerName/:eventId", authentication, EventController.getOrganizerEvent);

EventRouter.post("/events/:organizerId", authentication, EventController.addEvent);

EventRouter.put("/events/:eventId", authentication, EventController.editEvent);

EventRouter.delete("/events/:eventId", authentication,  EventController.deleteEvent);

module.exports = EventRouter;
