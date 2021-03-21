const { Organizer, Event, Recipient } = require('../models')
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const path = require('path')
const fs = require('fs')
const assert = require('assert')
const { PDFDocument } = require('pdf-lib')
const QRCode = require('qrcode')
const nodemailer = require('nodemailer')
const CloudmersiveConvertApiClient = require('cloudmersive-convert-api-client');
const filepath = '../storage/templates/ppt-text.pptx'
class CertificateController {
    static generateCertificate(req, res) {
        const eventId = +req.params.eventId
        const organizerId = +req.organizer.id
        console.log('MASUK CErtificate');
        const defaultClient = CloudmersiveConvertApiClient.ApiClient.instance;
        const Apikey = defaultClient.authentications['Apikey'];
        Apikey.apiKey = 'c7d7af25-2841-440a-97a2-7eea43454226';
        Organizer.findOne({
            where: {
                id: organizerId
            },
            include: [{
                model: Event,
                where: { id: eventId },
                include: [Recipient]
            }]
        })
            .then((response) => {
                const recipients = response.Events[0].Recipients
                let payloads = recipients.map(recipient => {
                    return {
                    eventTitle: response.Events[0].title.trim(),
                    eventType: response.Events[0].type,
                    name: recipient.name,
                    role: recipient.role,
                    email: recipient.email,
                    certificateLink: 'https://www.google.com',
                    namedFolder: recipient.name.split(' ').join('-')
                    }
                })
                console.log(payloads, '<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
                //////////////////////////////////////GENERATE PDF ////////////////////////////////////////
                payloads.forEach(payload => {
                    QRCode.toFile(`./storage/qrcodes/${payload.namedFolder}.png`, payload.certificateLink, {}, (err) => {
                        if (err) console.log(err)
                        else console.log('Success')
                    })
                    function replaceErrors(key, value) {
                        if (value instanceof Error) {
                            return Object.getOwnPropertyNames(value).reduce(function (error, key) {
                                error[key] = value[key];
                                return error;
                            }, {});
                        }
                        return value;
                    }
        
                    function errorHandler(error) {
                        console.log(JSON.stringify({ error: error }, replaceErrors));
                        if (error.properties && error.properties.errors instanceof Array) {
                            const errorMessages = error.properties.errors.map(function (error) {
                                return error.properties.explanation;
                            }).join("\n");
                            console.log('errorMessages', errorMessages);
                        }
                        throw error;
                    }
        
                    const content = fs
                        .readFileSync(path.resolve(__dirname, filepath), 'binary');
        
                    const zip = new PizZip(content);
                    let doc;
                    try {
                        doc = new Docxtemplater(zip);
                    } catch (error) {
                        errorHandler(error);
                    }
        
                    doc.setData(payload);
        
                    try {
                        doc.render()
                    }
                    catch (error) {
                        errorHandler(error);
                    }
        
                    const filename = `${payload.namedFolder}`
        
                    const buf = doc.getZip()
                        .generate({ type: 'nodebuffer' });
                    fs.writeFileSync(path.resolve(__dirname, `../storage/inputs/${filename}.pptx`), buf);
                    //////////////////////CONVERT PPT TO PDF ////////////////////////////////
                    const apiInstance = new CloudmersiveConvertApiClient.ConvertDocumentApi();
        
                    const inputFile = Buffer.from(fs.readFileSync(`./storage/inputs/${payload.namedFolder}.pptx`).buffer); // File | Input file to perform the operation on.
        
                    const callback = function (error, data, response) {
                        if (error) {
                            console.error(error);
                        } else {
                            fs.writeFile(`./storage/outputs/${payload.namedFolder}.pdf`, data, "binary", function (err) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log("The file was saved!");
                                    CertificateController.embedPng(req, res, payload)
                                }
                            });
                            console.log('Successful - done.');
                        }
                    };
                    apiInstance.convertDocumentPptxToPdf(inputFile, callback);
                    //////////////////////CONVERT PPT TO PDF ////////////////////////////////
                })
                res.status(200).json({message: 'success'})
                //////////////////////////////////////GENERATE PDF ////////////////////////////////////////
            })
            .catch(err => {
                console.log(err);
            })
        
    }

    static embedPng(req, res, payload) {
        const run = async (pathToPDF, pathToImage) => {
            const pdfDoc = await PDFDocument.load(fs.readFileSync(pathToPDF))
            const img = await pdfDoc.embedPng(fs.readFileSync(pathToImage))
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
        }
        const ERRORS = {
            ARGUMENTS: 'Please provide a path to the PDF file as a first argument and path to an image as the second argument'
        };

        const pathToPDF = `./storage/outputs/${payload.namedFolder}.pdf`
        assert.notStrictEqual(pathToPDF, null, ERRORS.ARGUMENTS)
        const pathToImage = `./storage/qrcodes/${payload.namedFolder}.png`
        assert.notStrictEqual(pathToImage, null, ERRORS.ARGUMENTS)


        run(pathToPDF, pathToImage)
            .then(_ => {
                fs.readFile(`./storage/results/${payload.namedFolder}-result.pdf`, (err, data) => {
                    if (err) {
                        console.log(err, "Checkkkk >>>>>>");
                        // res.statusCode = 500
                        // res.send(err)
                        // res.end(err)
                        return err
                    } else {
                        var transporter = nodemailer.createTransport({
                            service: "gmail",
                            auth: {
                                user: "appomailcoming@gmail.com",
                                pass: "appoqwe123",
                            },
                        });

                        const mailOptions = {
                            from: "sender@email.com", // sender address
                            to: `${payload.email}`,
                            subject: "Subject of your email", // Subject line
                            html: "<p>Your html here</p>", // plain text body
                            attachments: [
                                {
                                    filename: `${payload.namedFolder}.pdf`,
                                    path: `./storage/results/${payload.namedFolder}-result.pdf`,
                                },
                            ],
                        };

                        transporter.sendMail(mailOptions, function (err, info) {
                            if (err) console.log(err);
                            else console.log(info);
                        });
                        //////>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>



                    }
                })
            })
            .catch(console.error)
        ///////////////////////////////////////////////// 
    }
}

module.exports = CertificateController