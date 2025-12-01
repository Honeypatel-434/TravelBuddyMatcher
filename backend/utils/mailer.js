const nodemailer = require('nodemailer');

function createTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = port === 465;
  if (!host || !user || !pass) throw new Error('SMTP credentials missing');
  return nodemailer.createTransport({ host, port, secure, auth: { user, pass } });
}

async function sendEmail({ to, subject, text, html }) {
  const from = process.env.FROM_EMAIL || process.env.SMTP_USER;
  const transporter = createTransport();
  const info = await transporter.sendMail({ from, to, subject, text, html });
  return { messageId: info.messageId };
}

module.exports = { sendEmail };

