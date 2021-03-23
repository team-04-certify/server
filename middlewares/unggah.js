const unggah = require('unggah')

const storage = unggah.s3({
  endpoint: 's3.ap-southeast-1.amazonaws.com',
  accessKeyId: 'AKIATVLSBK6EPPK3GXGF',
  secretAccessKey: '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',
  bucketName: 'certifyfilebucket',
  rename: (req, file) => {
    return `${Date.now()}-${file.originalname}`
  }
})

upload = unggah({
  limits: {
    fileSize: 1e6 // in bytes
  },
  storage: storage // storage configuration for google cloud storage or S3
})

module.exports = upload
