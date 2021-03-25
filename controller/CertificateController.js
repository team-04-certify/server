const { Organizer, Event, Recipient } = require('../models')
const request = require('request')
const https = require('https')
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const path = require('path')
const fs = require('fs')
const assert = require('assert')
const QRCode = require('qrcode')
const nodemailer = require('nodemailer')
let filepath = null
let isLinkTemplate = false
const CloudmersiveConvertApiClient = require('cloudmersive-convert-api-client');
const { run } = require('../helpers/pdflib');

const htmlTemplate = require("../storage/html-template/index");
const logo =
  "https://certifyfilebucket.s3-ap-southeast-1.amazonaws.com/Certify.png";
const top =
  "https://d1oco4z2z1fhwp.cloudfront.net/templates/default/2966/Top.png";
const bottom =
  "https://d1oco4z2z1fhwp.cloudfront.net/templates/default/2966/Btm.png";

class CertificateController {
    static async generateCertificate(req,res, next) {
        try{
        const eventId = +req.params.eventId
        const templateNumber = +req.params.templateNumber
        const responseEvent = await Event.findOne({where: {id: eventId}})
        const organizerId = +req.organizer.id
        const defaultClient = CloudmersiveConvertApiClient.ApiClient.instance;
        const Apikey = defaultClient.authentications['Apikey'];
        // Apikey.apiKey = 'c7d7af25-2841-440a-97a2-7eea43454226'; // punya Rizky HABIS
        Apikey.apiKey = 'a04c172a-dcd9-463e-b4fd-53158f19f8a4'; // punya Robi
        // Apikey.apiKey = '5c227385-6b3d-477b-a9ee-db4622a5bf1a'; // punya aldi
        
        const organizer = await Organizer.findOne({
            where: {
                id: organizerId
            },
            include: [{
                model: Event,
                where: { id: eventId },
                include: [{
                    model: Recipient,
                    where: {status: "not yet sent"}
                }]
            }]
        })
        if(!organizer){
            throw {name: 'CustomError', code: 400, message: 'at least one certificate recipient is required'}
        }

        const recipients = organizer.Events[0].Recipients
        // ================
        function stream() {
          return new Promise((resolve, reject) => {
            const file = fs.createWriteStream(`./storage/templates/ppt-template-link.pptx`, 'utf8')
            request(organizer.Events[0].templatePath).pipe(file)
            file.on('finish', () => {
              resolve()
            })
          })
        }
        if(organizer.Events[0].templatePath) {
          filepath = `../storage/templates/ppt-template-link.pptx`
          await stream()
        
        } else {
          filepath = `../storage/templates/ppt-text${templateNumber}.pptx`
          isLinkTemplate = false
        }
        
        let payloads = recipients.map(recipient => {
            
            return {
                organizerName: organizer.name,
                eventTitle: organizer.Events[0].title,
                eventDate:  organizer.Events[0].date.toString().slice(0, 15),
                eventType: organizer.Events[0].type,
                recipientId: recipient.id,
                name: recipient.name,
                role: recipient.role,
                email: recipient.email,
                certificateNumber: recipient.certificateNumber,
                certificateLink: recipient.certificateLink,
                namedFolder: recipient.name.split(' ').join('-'),

            }
        })
        payloads.forEach(async (payload, index, payloads) => {
            try{
                await QRCode.toFile(`./storage/qrcodes/${payload.namedFolder}.png`, payload.certificateLink)
                console.log('QR code was generated')
                const content = fs.readFileSync(path.resolve(__dirname, filepath), 'binary');
                console.log(content, '<<<<<< ini contentnya')
                const zip = new PizZip(content);
                let doc;
                
                doc = await new Docxtemplater(zip)
                await doc.setData(payload);
                await doc.render()
                
        
                const filename = `${payload.namedFolder}`
                const buf = doc.getZip().generate({ type: 'nodebuffer' });
                fs.writeFileSync(path.resolve(__dirname, `../storage/inputs/${filename}.pptx`), buf);
                console.log('input pptx created >>>>>>>>>>>>');
                //////////////////////CONVERT PPT TO PDF ////////////////////////////////
                const apiInstance = new CloudmersiveConvertApiClient.ConvertDocumentApi();
        
                const inputFile = Buffer.from(fs.readFileSync(`./storage/inputs/${payload.namedFolder}.pptx`).buffer); // File | Input file to perform the operation on.
                const callback = function (error, data, response) {
                    if (error) {
                        throw {error}
                    } else {
                        fs.writeFile(`./storage/outputs/${payload.namedFolder}.pdf`, data, "binary", function (err) {
                            if (err) {
                                throw {err}
                            } else {
                                console.log("new pdf (without qrcode) is saved");
                                const ERRORS = {
                                    ARGUMENTS: 'Please provide a path to the PDF file as a first argument and path to an image as the second argument'
                                };
                                const pathToPDF = `./storage/outputs/${payload.namedFolder}.pdf`
                                assert.notStrictEqual(pathToPDF, null, ERRORS.ARGUMENTS)
                                const pathToImage = `./storage/qrcodes/${payload.namedFolder}.png`
                                assert.notStrictEqual(pathToImage, null, ERRORS.ARGUMENTS)
                    
                                run(pathToPDF, pathToImage, `./storage/inputs/${payload.namedFolder}.pptx`)
                                //  
                                .then (_ => {
                                  fs.readFile(`./storage/results/${payload.namedFolder}-result.pdf`, (err, data) => {
                                      if (err) {
                                          throw {err}
                                      } else {
                                          console.log('result pdf is saved')
                                          let transporter = nodemailer.createTransport({
                                              service: "gmail",
                                              auth: {
                                                  user: "certify.sendmail@gmail.com",
                                                  pass: "certify123",
                                              },
                                          });
                      
                                          const mailOptions = {
                                              from: "sender@email.com", // sender address
                                              to: `${payload.email}`,
                                              subject: "Subject of your email", // Subject line
                                              html: htmlTemplate(
                                                top,
                                                bottom,
                                                payload.eventTitle,
                                                payload.certificateLink,
                                                logo
                                              ), // plain text body
                                              attachments: [
                                                  {
                                                      filename: `${payload.namedFolder}-result.pdf`,
                                                      path: `./storage/results/${payload.namedFolder}-result.pdf`,
                                                  },
                                              ],
                                          };
                                          console.log('set up mail options done')
                      
                                          transporter.sendMail(mailOptions, function (err, info) {
                                              if (err) {
                                                  throw {err}
                                              }
                                              else {
                                                  fs.unlink(`./storage/results/${payload.namedFolder}-result.pdf`, (err) => {
                                                    if(err) {
                                                      throw(err)
                                                    }
                                                  })
                                                  Recipient.update({status: 'sent'}, {where: {id: payload.recipientId}})
                                                  if(index === payloads.length - 1){
                                                      res.status(200).json({message: 'success'})
                                                  }
                                              }
                                          });
                                      }
                                  })

                                })
                                .catch(err => {
                                  throw(err)
                                })
    
                            }
                        });
                    }
                };
                apiInstance.convertDocumentPptxToPdf(inputFile, callback);
                console.log('pptx was converted to PDF')
            } catch(error) {
                throw(error)
            }
        })
        } catch (error){
            console.log(error)
            next(error)
        }
        
    }
}

module.exports = CertificateController
