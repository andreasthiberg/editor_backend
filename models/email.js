const sgMail = require('@sendgrid/mail')
require('dotenv').config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const email = {
    sendEmail: async function sendEmail (email,docId, name) {
        let result;
        const msg = {
            to: email, // Change to your recipient
            from: 'anth21@student.bth.se', // Change to your verified sender
            subject: 'Inbjudan att redigera dokument ' + name,
            text: `http://localhost:3000/?regId=${docId}&name=${name}`,
            html: `http://localhost:3000/?regId=${docId}&name=${name}`,
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