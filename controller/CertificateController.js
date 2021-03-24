const { Organizer, Event, Recipient } = require("../models");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const path = require("path");
const fs = require("fs");
const assert = require("assert");
const QRCode = require("qrcode");
const nodemailer = require("nodemailer");
let filepath = "";
const CloudmersiveConvertApiClient = require("cloudmersive-convert-api-client");
const { run } = require("../helpers/pdflib");

const htmlTemplate = require("../storage/html-template/index");
const logo =
  "https://certifyfilebucket.s3-ap-southeast-1.amazonaws.com/Certify.png";
const top =
  "https://d1oco4z2z1fhwp.cloudfront.net/templates/default/2966/Top.png";
const bottom =
  "https://d1oco4z2z1fhwp.cloudfront.net/templates/default/2966/Btm.png";

class CertificateController {
  static async generateCertificate(req, res, next) {
    try {
      const eventId = +req.params.eventId;
      const templateNumber = +req.params.templateNumber;
      filepath = `../storage/templates/ppt-text${templateNumber}.pptx`;
      console.log(
        `../storage/templates/ppt-text${templateNumber}.pptx`,
        "  file template numbbbberrrrrrrrrrr<<<<<<<<<<<<<<<<<<<<<<<"
      );
      const organizerId = +req.organizer.id;
      const defaultClient = CloudmersiveConvertApiClient.ApiClient.instance;
      const Apikey = defaultClient.authentications["Apikey"];
      // Apikey.apiKey = 'c7d7af25-2841-440a-97a2-7eea43454226'; // punya Rizky HABIS
      // Apikey.apiKey = 'a04c172a-dcd9-463e-b4fd-53158f19f8a4'; // punya Robi

      Apikey.apiKey = "5c227385-6b3d-477b-a9ee-db4622a5bf1a";
      const organizer = await Organizer.findOne({
        where: {
          id: organizerId,
        },
        include: [
          {
            model: Event,
            where: { id: eventId },
            include: [Recipient],
          },
        ],
      });
      const recipients = organizer.Events[0].Recipients;
      if (recipients.length <= 0) {
        console.log(recipients, "log recipients>>>>>>>>");
        throw {
          name: "CustomError",
          code: 400,
          message: "at least one certificate recipient is required",
        };
      }
      let payloads = recipients.map((recipient) => {
        return {
          organizerName: organizer.name,
          eventTitle: organizer.Events[0].title,
          eventDate: organizer.Events[0].date.toString().slice(0, 15),
          eventType: organizer.Events[0].type,
          name: recipient.name,
          role: recipient.role,
          email: recipient.email,
          certificateNumber: recipient.certificateNumber,
          certificateLink: recipient.certificateLink,
          namedFolder: recipient.name.split(" ").join("-"),
        };
      });
      console.log(payloads, "payloads >>>>>>>>>>>>");

      payloads.forEach(async (payload, index, payloads) => {
        try {
          await QRCode.toFile(
            `./storage/qrcodes/${payload.namedFolder}.png`,
            payload.certificateLink
          );
          console.log("QR code was generated");
          ///////////////////ERROR HANDLER FROM DOCXTEMPLATER
          // function replaceErrors(key, value) {
          //     if (value instanceof Error) {
          //         return Object.getOwnPropertyNames(value).reduce(function (error, key) {
          //             error[key] = value[key];
          //             return error;
          //         }, {});
          //     }
          //     return value;
          // }

          // function errorHandler(error) {
          //     console.log(JSON.stringify({ error: error }, replaceErrors));
          //     if (error.properties && error.properties.errors instanceof Array) {
          //         const errorMessages = error.properties.errors.map(function (error) {
          //             return error.properties.explanation;
          //         }).join("\n");
          //         console.log('errorMessages', errorMessages);
          //     }
          //     throw error;
          // }
          ///////////////////ERROR HANDLER FROM DOCXTEMPLATER

          const content = fs.readFileSync(
            path.resolve(__dirname, filepath),
            "binary"
          );
          const zip = new PizZip(content);
          let doc;
          // try {
          //     doc = new Docxtemplater(zip);
          // } catch (error) {
          //     errorHandler(error);
          // }
          doc = await new Docxtemplater(zip);
          await doc.setData(payload);
          await doc.render();
          // try {
          //     doc.render()
          // }
          // catch (error) {
          //     errorHandler(error);
          // }

          const filename = `${payload.namedFolder}`;
          const buf = doc.getZip().generate({ type: "nodebuffer" });
          fs.writeFileSync(
            path.resolve(__dirname, `../storage/inputs/${filename}.pptx`),
            buf
          );
          console.log("input pptx created >>>>>>>>>>>>");
          //////////////////////CONVERT PPT TO PDF ////////////////////////////////
          const apiInstance = new CloudmersiveConvertApiClient.ConvertDocumentApi();

          const inputFile = Buffer.from(
            fs.readFileSync(`./storage/inputs/${payload.namedFolder}.pptx`)
              .buffer
          ); // File | Input file to perform the operation on.
          const callback = function (error, data, response) {
            if (error) {
              throw { error };
            } else {
              fs.writeFile(
                `./storage/outputs/${payload.namedFolder}.pdf`,
                data,
                "binary",
                function (err) {
                  if (err) {
                    throw { err };
                  } else {
                    console.log("new pdf (without qrcode) is saved");
                    const ERRORS = {
                      ARGUMENTS:
                        "Please provide a path to the PDF file as a first argument and path to an image as the second argument",
                    };
                    const pathToPDF = `./storage/outputs/${payload.namedFolder}.pdf`;
                    assert.notStrictEqual(pathToPDF, null, ERRORS.ARGUMENTS);
                    const pathToImage = `./storage/qrcodes/${payload.namedFolder}.png`;
                    assert.notStrictEqual(pathToImage, null, ERRORS.ARGUMENTS);

                    run(
                      pathToPDF,
                      pathToImage,
                      `./storage/inputs/${payload.namedFolder}.pptx`
                    )
                      //
                      .then((_) => {
                        fs.readFile(
                          `./storage/results/${payload.namedFolder}-result.pdf`,
                          (err, data) => {
                            if (err) {
                              throw { err };
                            } else {
                              console.log("result pdf is saved");
                              let transporter = nodemailer.createTransport({
                                service: "gmail",
                                auth: {
                                  user: "certify.sendmail@gmail.com",
                                  pass: "certify123",
                                },
                              });

                              const mailOptions = {
                                from: "certify.sendmail@gmail.com", // sender address
                                to: `${payload.email}`,
                                subject: `Certificate ${payload.eventTitle}`, // Subject line
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
                              console.log("set up mail options done");

                              transporter.sendMail(
                                mailOptions,
                                function (err, info) {
                                  if (err) {
                                    throw { err };
                                  } else {
                                    fs.unlink(
                                      `./storage/results/${payload.namedFolder}-result.pdf`,
                                      (err) => {
                                        if (err) {
                                          throw err;
                                        }
                                      }
                                    );
                                    if (index === payloads.length - 1) {
                                      res
                                        .status(200)
                                        .json({ message: "success" });
                                    }
                                  }
                                }
                              );
                            }
                          }
                        );
                      })
                      .catch((err) => {
                        throw err;
                      });
                  }
                }
              );
            }
          };
          apiInstance.convertDocumentPptxToPdf(inputFile, callback);
          console.log("pptx was converted to PDF");
        } catch (error) {
          throw error;
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CertificateController;

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
// const { Organizer, Event, Recipient } = require('../models')
// const PizZip = require('pizzip');
// const Docxtemplater = require('docxtemplater');
// const path = require('path')
// const fs = require('fs')
// const assert = require('assert')
// const { PDFDocument } = require('pdf-lib')
// const QRCode = require('qrcode')
// const nodemailer = require('nodemailer')
// const CloudmersiveConvertApiClient = require('cloudmersive-convert-api-client');
// const filepath = '../storage/templates/ppt-text.pptx'
// class CertificateController {
//     static generateCertificate(req, res) {
//         const eventId = +req.params.eventId
//         const organizerId = +req.organizer.id
//         console.log('MASUK CErtificate', organizerId);
//         const defaultClient = CloudmersiveConvertApiClient.ApiClient.instance;
//         const Apikey = defaultClient.authentications['Apikey'];
//         Apikey.apiKey = 'c7d7af25-2841-440a-97a2-7eea43454226';
//         Organizer.findOne({
//             where: {
//                 id: organizerId
//             },
//             include: [{
//                 model: Event,
//                 where: { id: eventId },
//                 include: [Recipient]
//             }]
//         })
//             .then((response) => {

//                 const recipients = response.Events[0].Recipients
//                 let payloads = recipients.map(recipient => {
//                     return {
//                     eventTitle: response.Events[0].title,
//                     eventType: response.Events[0].type,
//                     name: recipient.name,
//                     role: recipient.role,
//                     email: recipient.email,
//                     certificateLink: recipient.certificateLink,
//                     namedFolder: recipient.name.split(' ').join('-')
//                     }
//                 })
//                 // console.log(payloads, '<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
//                 //////////////////////////////////////GENERATE PDF ////////////////////////////////////////
//                 payloads.forEach((payload, index, payloads) => {
//                     QRCode.toFile(`./storage/qrcodes/${payload.namedFolder}.png`, payload.certificateLink, {}, (err) => {
//                         if (err) console.log(err)
//                         else console.log('Success create qrCode <<<<<<<<<<')
//                     })
//                     function replaceErrors(key, value) {
//                         if (value instanceof Error) {
//                             return Object.getOwnPropertyNames(value).reduce(function (error, key) {
//                                 error[key] = value[key];
//                                 return error;
//                             }, {});
//                         }
//                         return value;
//                     }

//                     function errorHandler(error) {
//                         console.log(JSON.stringify({ error: error }, replaceErrors));
//                         if (error.properties && error.properties.errors instanceof Array) {
//                             const errorMessages = error.properties.errors.map(function (error) {
//                                 return error.properties.explanation;
//                             }).join("\n");
//                             console.log('errorMessages', errorMessages);
//                         }
//                         throw error;
//                     }

//                     const content = fs.readFileSync(path.resolve(__dirname, filepath), 'binary');

//                     const zip = new PizZip(content);
//                     let doc;
//                     try {
//                         doc = new Docxtemplater(zip);
//                     } catch (error) {
//                         errorHandler(error);
//                     }

//                     doc.setData(payload);

//                     try {
//                         doc.render()
//                     }
//                     catch (error) {
//                         errorHandler(error);
//                     }

//                     const filename = `${payload.namedFolder}`

//                     const buf = doc.getZip()
//                         .generate({ type: 'nodebuffer' });
//                     fs.writeFileSync(path.resolve(__dirname, `../storage/inputs/${filename}.pptx`), buf);
//                     //////////////////////CONVERT PPT TO PDF ////////////////////////////////
//                     const apiInstance = new CloudmersiveConvertApiClient.ConvertDocumentApi();

//                     const inputFile = Buffer.from(fs.readFileSync(`./storage/inputs/${payload.namedFolder}.pptx`).buffer); // File | Input file to perform the operation on.

//                     const callback = function (error, data, response) {
//                         if (error) {
//                             console.error(error);
//                             throw {error}
//                         } else {
//                             fs.writeFile(`./storage/outputs/${payload.namedFolder}.pdf`, data, "binary", function (err) {
//                                 if (err) {
//                                     console.log(err);
//                                     throw {err}
//                                 } else {
//                                     console.log("The file was saved!");
//                                     CertificateController.embedPng(req, res, payload, index, payloads.length - 1)
//                                 }
//                             });
//                             // console.log('Successful - done.');
//                         }
//                     };
//                     apiInstance.convertDocumentPptxToPdf(inputFile, callback);

//                     //////////////////////CONVERT PPT TO PDF ////////////////////////////////

//                 })

//                 //////////////////////////////////////GENERATE PDF ////////////////////////////////////////
//             })
//             .catch(err => {
//                 console.log(err);
//                 res.status(500).json(error)
//             })

//     }

//     static embedPng(req, res, payload, index, maxArrLength) {
//         const run = async (pathToPDF, pathToImage) => {
//             console.log(pathToPDF, 'check pdf doc????>>>>>>>>>>>>>>>>>>>>>>>>>>>');
//             const pdfDoc = await PDFDocument.load(fs.readFileSync(pathToPDF).buffer)
//             console.log('22222222????>>>>>>>>>>>>>>>>>>>>>>>>>>>');
//             const img = await pdfDoc.embedPng(fs.readFileSync(pathToImage))
//             // const img = await pdfDoc.embedPng(fs.readFileSync(pathToImage))
//             const imagePage = pdfDoc.getPage(0)
//             imagePage.drawImage(img, {
//                 x: 0,
//                 y: 0,
//                 width: 100,
//                 height: 100
//             })
//             const pdfBytes = await pdfDoc.save()
//             const newFilePath = `./storage/results/${path.basename(pathToPDF, '.pdf')}-result.pdf`
//             console.log(newFilePath, 'check new file path >>>>>>>>>>>>>>')
//             fs.writeFileSync(newFilePath, pdfBytes)
//         }
//         const ERRORS = {
//             ARGUMENTS: 'Please provide a path to the PDF file as a first argument and path to an image as the second argument'
//         };

//         const pathToPDF = `./storage/outputs/${payload.namedFolder}.pdf`
//         assert.notStrictEqual(pathToPDF, null, ERRORS.ARGUMENTS)
//         const pathToImage = `./storage/qrcodes/${payload.namedFolder}.png`
//         assert.notStrictEqual(pathToImage, null, ERRORS.ARGUMENTS)

//         run(pathToPDF, pathToImage)
//             .then(_ => {
//                 fs.readFile(`./storage/results/${payload.namedFolder}-result.pdf`, (err, data) => {
//                     if (err) {
//                         // res.statusCode = 500
//                         // res.send(err)
//                         // res.end(err)
//                         throw {err}
//                     } else {
//                         var transporter = nodemailer.createTransport({
//                             service: "gmail",
//                             auth: {
//                                 user: "appomailcoming@gmail.com",
//                                 pass: "appoqwe123",
//                             },
//                         });

//                         const mailOptions = {
//                             from: "sender@email.com", // sender address
//                             to: `${payload.email}`,
//                             subject: "Subject of your email", // Subject line
//                             html: "<p>Your html here</p>", // plain text body
//                             attachments: [
//                                 {
//                                     filename: `${payload.namedFolder}.pdf`,
//                                     path: `./storage/results/${payload.namedFolder}-result.pdf`,
//                                 },
//                             ],
//                         };

//                         transporter.sendMail(mailOptions, function (err, info) {
//                             if (err) {
//                                 throw {err}
//                             }
//                             else {
//                                 if(index === maxArrLength){
//                                     res.status(200).json({message: 'success'})
//                                 }
//                             }
//                         });
//                         //////>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//                     }
//                 })
//             })
//             .catch(error => {
//                 console.log(error, 'examine ===>>>>>>> error');
//                 res.status(500).json(error)
//             })
//         /////////////////////////////////////////////////
//     }
// }

// module.exports = CertificateController
