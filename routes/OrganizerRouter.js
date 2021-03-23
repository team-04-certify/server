const OrganizerRouter = require("express").Router();
const OrganizerController = require("../controller/OrganizerController");
const authentication = require("../middlewares/authentication");

OrganizerRouter.post("/register", OrganizerController.register);
OrganizerRouter.post("/login", OrganizerController.login);
OrganizerRouter.use(authentication);
OrganizerRouter.get("/", OrganizerController.home);

module.exports = OrganizerRouter;
