const RecipientRouter = require("express").Router();
const RecipientContoller = require("../controller/RecipientController");
const authentication = require('../middlewares/authentication')
// RecipientRouter.use(authentication)
RecipientRouter.post("/recipients/:eventId", RecipientContoller.addRecipients)
RecipientRouter.get("/recipients/:certificateNumber", RecipientContoller.getRecipient)
RecipientRouter.delete("/recipients/:recipientId", RecipientContoller.deleteRecipient)
RecipientRouter.put("/recipients/:eventId/:recipientId", RecipientContoller.putRecipient)


module.exports = RecipientRouter;
