const EventRouter = require("express").Router();
const EventController = require("../controller/EventController");
const authentication = require("../middlewares/authentication");
// EventRouter.get("/:organizerName", EventController.getOrganizerEvents);
EventRouter.use(authentication)
EventRouter.get("/events/:organizerName/:eventId", EventController.getOrganizerEvent);

EventRouter.post("/events/:organizerId", EventController.addEvent);

EventRouter.put("/events/:eventId", EventController.editEvent);

EventRouter.delete("/events/:eventId", EventController.deleteEvent);

module.exports = EventRouter;
