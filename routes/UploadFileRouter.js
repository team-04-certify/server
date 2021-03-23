const UploadFileRouter = require("express").Router();
const authentication = require("../middlewares/authentication");
const upload = require("../middlewares/unggah");

UploadFileRouter.post("/upload/banner", upload.single('file'), (req, res) => {
  console.log('Upload berhasil', req.body.file)
});

module.exports = UploadFileRouter;
