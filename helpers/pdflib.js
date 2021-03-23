const { PDFDocument } = require('pdf-lib')
const path = require('path')
const fs = require('fs')

const run = async (pathToPDF, pathToImage, pathPPT) => {
    console.log(pathToPDF, 'check pdf doc????>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    const pdfDoc = await PDFDocument.load(fs.readFileSync(pathToPDF).buffer)
    // const img = await pdfDoc.embedPng(Buffer.from(fs.readFileSync(pathToImage)).buffer)
    console.log(pathToImage, '<<<<<<<<< path to image')
    console.log(fs.readFileSync(pathToImage, 'base64'), 'readfilesiync <<<<<<<<<<<<<')
    const img = await pdfDoc.embedPng(fs.readFileSync(pathToImage, 'base64'))
    console.log('22222222????>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    const imagePage = pdfDoc.getPage(0)
    imagePage.drawImage(img, {
        x: 0,
        y: 0,
        width: 100,
        height: 100
    })
    const pdfBytes = await pdfDoc.save()
    const newFilePath = `./storage/results/${path.basename(pathToPDF, '.pdf')}-result.pdf`
    console.log(newFilePath, 'check new file path >>>>>>>>>>>>>>')
    fs.writeFileSync(newFilePath, pdfBytes)
    fs.unlink(pathToPDF, (err) => {
      if (err) {
        throw(err)
      }
    })
    fs.unlink(pathToImage, (err) => {
      if (err) {
        throw(err)
      }
    })
    fs.unlink(pathPPT, (err) => {
      if (err) {
        throw(err)
      }
    })
    // const coba = require('../storage/results/')

}


module.exports = { run }