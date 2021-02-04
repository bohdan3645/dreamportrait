const nodemailer = require('nodemailer')
const expressHbs = require('express-handlebars');

const GMAIL_USER = process.env.GMAIL_USER
const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD

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

async function sendOrderEmail (order) {
  const email = order.products[0].email // all products have the same email for one order
  const context = _getOrderData(order)
  const html = await _getEmailHtml('order_email', context)

  await sendEmail({ to: email, html })
}

// --- Private ---

function _getOrderData (order) {
  const result = Object.assign({}, order.toJSON())

  result.totalPrice = 0

  result.products.forEach(product => {
    result.totalPrice += product.price
    product.doublePrice = product.price * 2
  })

  return result
}

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
