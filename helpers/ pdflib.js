const { PDFDocument } = require('pdf-lib')
const path = require('path')
const fs = require('fs')

const run = async (pathToPDF, pathToImage) => {
    console.log(pathToPDF, 'check pdf doc????>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    const pdfDoc = await PDFDocument.load(fs.readFileSync(pathToPDF).buffer)
    const img = await pdfDoc.embedPng(fs.readFileSync(pathToImage))
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
    // const coba = require('../storage/results/')

}


module.exports = { run }