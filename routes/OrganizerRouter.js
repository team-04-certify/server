const OrganizerRouter = require("express").Router();
const OrganizerController = require("../controller/OrganizerController");

OrganizerRouter.post('/register', OrganizerController.register)
OrganizerRouter.post('/login', OrganizerController.login)
OrganizerRouter.get('/:organizerName', OrganizerController.home)

module.exports = OrganizerRouter;
