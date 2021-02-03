const nodemailer = require('nodemailer')
const expressHbs = require('express-handlebars');

// TODO: maybe move to env
const GMAIL_USER = 'no-reply@dream-portrait.com'
const GMAIL_PASSWORD = '8yZXRM&htyu'

function init () {
  if (global.transporter) {
    return
  }

  global.transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PASSWORD
    }
  })
}

async function sendEmail({ to, subject, html }) {
  const DEFAULT_SUBJECT = 'DreamPortrait new order'
  const DEFAULT_FROM = 'no-reply@dream-portrait.com'

  return await transporter.sendMail({
    from: DEFAULT_FROM,
    to: to,
    subject: subject || DEFAULT_SUBJECT,
    html: html,
  });
}

async function sendOrderEmail (user, orderId) {
  const email = 'rishko92@gmail.com'
  const html = await _getEmailHtml('order_email', { orderName: 'test' })

  await sendEmail({ to: email, html })
}

// --- Private ---

async function _getEmailHtml (emailTemplateName, context) {
  return await expressHbs
    .create({ layout: false, extname: '.hbs' })
    .render(`views/email_templates/${emailTemplateName}.hbs`, context)
}

module.exports = {
  init,
  sendEmail,
  sendOrderEmail
}
