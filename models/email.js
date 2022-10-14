const sgMail = require('@sendgrid/mail')
require('dotenv').config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const email = {
    sendEmail: async function sendEmail () {
        let result;
        const msg = {
            to: 'andreas.thiberg@gmail.com', // Change to your recipient
            from: 'anth21@student.bth.se', // Change to your verified sender
            subject: 'Inbjudan att redigera dokument (JSRamverk)',
            text: 'http://localhost:3000/?regId=100&name=testdokument',
            html: 'http://localhost:3000/?regId=100&name=testdokument',
          }
          await sgMail
            .send(msg)
            .then(() => {
              result = "Email sent"
            })
            .catch((error) => {
              result = error
            })
        return result;
    }
}

module.exports = email;