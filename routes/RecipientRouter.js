const RecipientRouter = require("express").Router();
const RecipientContoller = require("../controller/RecipientController");

RecipientRouter.post("/recipients/:eventId", RecipientContoller.addRecipients)
RecipientRouter.get("/recipients/:certificateNumber", RecipientContoller.getRecipient)
RecipientRouter.delete("/recipients/:recipientId", RecipientContoller.deleteRecipient)
RecipientRouter.put("/recipients/:eventId/:recipientId", RecipientContoller.putRecipient)


module.exports = RecipientRouter;
