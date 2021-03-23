const router = require("express").Router();
const EventRouter = require("./EventRouter");
const RecipientRouter = require("./RecipientRouter");
const OrganizerRouter = require("./OrganizerRouter");
const CertificateRouter = require("./CertificateRouter");
const UploadFileRouter = require("./UploadFileRouter");

router.use(EventRouter);
router.use(RecipientRouter);
router.use(CertificateRouter);
router.use(OrganizerRouter);
router.use(UploadFileRouter);

module.exports = router;
