require('dotenv').config()
const nodeMailer = require("nodemailer");

const transporter = nodeMailer.createTransport({
    service: 'gmail',
    secure: false,//true
    port: 25,//465
    auth: {
        user: process.env.email,
        pass: process.env.password,
    }, tls: {
        rejectUnauthorized: false
    }
});

transporter.sendEMail = function (mailRequest) {
  return new Promise(function (resolve, reject) {
    transporter.sendMail(mailRequest, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve("The message was sent!");
      }
    });
  });
}

module.exports = transporter;