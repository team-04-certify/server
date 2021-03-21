const router = require("express").Router();
const EventRouter = require("./EventRouter");
const RecipientRouter = require("./RecipientRouter");
const OrganizerRouter = require("./OrganizerRouter");
const CertificateRouter = require("./CertificateRouter");

router.use(EventRouter);
router.use(RecipientRouter);
router.use(CertificateRouter);
router.use(OrganizerRouter);

module.exports = router;
