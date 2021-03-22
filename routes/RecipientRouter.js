const RecipientRouter = require("express").Router();
const RecipientController = require("../controller/RecipientController");
const authentication = require('../middlewares/authentication')
// RecipientRouter.use(authentication)
RecipientRouter.post("/recipients/:eventId",authentication, RecipientController.addRecipients)
RecipientRouter.get("/recipients/:recipientId",authentication, RecipientController.getRecipient)
RecipientRouter.delete("/recipients/:recipientId",authentication, RecipientController.deleteRecipient)
RecipientRouter.put("/recipients/:eventId/:recipientId",authentication, RecipientController.putRecipient)
RecipientRouter.get("/recipients/all/:eventId",authentication, RecipientController.getRecipients)

module.exports = RecipientRouter;
