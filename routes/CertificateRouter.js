const CertificateRouter = require('express').Router()
const CertificateController = require('../controller/CertificateController')
const authentication = require('../middlewares/authentication')
CertificateRouter.get('/certificates/:eventId',authentication , CertificateController.generateCertificate)

module.exports = CertificateRouter