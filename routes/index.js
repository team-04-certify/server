const router = require("express").Router();
const EventRouter = require("./EventRouter");
const RecipientRouter = require("./RecipientRouter");
const OrganizerRouter = require("./OrganizerRouter");

router.use(EventRouter);
router.use(RecipientRouter);
router.use(OrganizerRouter);

module.exports = router;
