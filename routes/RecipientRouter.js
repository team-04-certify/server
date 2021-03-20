const RecipientRouter = require("express").Router();
const RecipientContoller = require("../controller/RecipientController");
const authentication = require('../middlewares/authentication')
// RecipientRouter.use(authentication)
RecipientRouter.post("/recipients/:eventId",authentication, RecipientContoller.addRecipients)
RecipientRouter.get("/recipients/:certificateNumber",authentication, RecipientContoller.getRecipient)
RecipientRouter.delete("/recipients/:recipientId",authentication, RecipientContoller.deleteRecipient)
RecipientRouter.put("/recipients/:eventId/:recipientId",authentication, RecipientContoller.putRecipient)


module.exports = RecipientRouter;
