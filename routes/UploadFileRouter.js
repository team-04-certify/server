const UploadFileRouter = require("express").Router();
const authentication = require("../middlewares/authentication");
const upload = require("../middlewares/unggah");
const UploadFileController = require("../controller/UploadFileController")

UploadFileRouter.post("/upload/banner/:eventId", authentication, upload.single('file'), UploadFileController.uploadBanner);
UploadFileRouter.post("/upload/template/:eventId", authentication, upload.single('file'), UploadFileController.uploadTemplate);

module.exports = UploadFileRouter;
