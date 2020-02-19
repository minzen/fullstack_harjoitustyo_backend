const nodemailer = require('nodemailer')
require('dotenv').config()

/**
 * The async function main() takes care of sending an email based on the parameters listed below.
 * @param {email address to which the email shall be sent} toAddress
 * @param {email subject} subject
 * @param {message body text as plaintext} messageBody
 * @param {message body text as HTML (not mandatory)} messageBodyHtml
 */
const main = async (toAddress, subject, messageBody, messageBodyHtml) => {
  if (!toAddress || !subject || !messageBody) {
    throw new Error(
      'Missing parameter(s). You have to at least provide a toAddress, subject, messageBody plus optionally a messageBodyHtml to be able to send an email'
    )
  }

  console.log(
    'Sending an email to:',
    toAddress,
    '\n',
    'subject:',
    subject,
    '\n',
    'messageBody:',
    messageBody,
    '\n',
    'messageBodyHtml:',
    messageBodyHtml
  )

  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  })

  try {
    let info = await transporter.sendMail({
      from: 'Memory Tracks <do.not.reply@INVALID>',
      to: toAddress,
      subject: subject,
      text: messageBody,
      html: messageBodyHtml
    })
    console.log('Message sent: %s', info.messageId)
  } catch (error) {
    console.log('Error when sending email.', error)
  }
}

exports.main = main
