import imaps from 'imap-simple';
import { debug, imapConfig, smtpConfig, rss, emailConfig } from './helpers.mjs';
import { getLatestNews } from './rss.mjs';

import { createTransport } from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';

export async function getNewEmails () {
  const connection = await imaps.connect({ imap: imapConfig });
  await connection.openBox('INBOX');
  const messages = await connection.search(['UNSEEN'], { bodies: ['HEADER'], markSeen: true });
  await connection.end();

  return messages.map(getFrom);
}

function getFrom (message) {
  const emails = [];
  const subjects = [];
  const parts = message?.parts?.filter(part => part.which === 'HEADER');
  for (const { body } of (parts || [])) {
    for (const one of (body?.from || [])) {
      emails.push(one);
    }
    for (const one of (body?.subject || [])) {
      subjects.push(parseInt(one) || rss.items);
    }
  }
  if (emails.length > 1 || subjects.length > 1) {
    const err = new Error('More than one email in the field From');
    console.log(err);
    console.log(emails);
    console.dir(message, { depth: null });
    throw err;
  }
  return [emails[0], subjects[0]];
}

export async function sendMail (record) {
  const [email, items] = record;
  const date = new Date();
  const today = date.toLocaleDateString(emailConfig.locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: emailConfig.timezone
  });
  const now = date.toLocaleTimeString(emailConfig.locale, { timeStyle: 'short', timeZone: emailConfig.timezone });
  const subject = emailConfig.subject.replaceAll('{{day}}', today).replaceAll('{{time}}', now);

  const news = getLatestNews(items);

  const transporter = createTransport({
    host: smtpConfig.host,
    port: smtpConfig.port,
    auth: {
      user: smtpConfig.user,
      pass: smtpConfig.password
    }
  });
  transporter.use('compile', hbs({
    viewEngine: {
      extName: '.hbs',
      layoutsDir: './',
      defaultLayout: false,
      partialsDir: './'
    },
    viewPath: './',
    extName: '.hbs'
  }));

  const sendConfig = {
    from: smtpConfig.user,
    to: email,
    subject,
    template: emailConfig.template,
    context: {
      subject,
      news,
      year: date.getFullYear()
    }
  };
  await transporter.sendMail(sendConfig, function (error, info) {
    if (error) {
      console.error(error);
      console.dir(sendConfig, { depth: null });
      throw error;
    } else {
      debug(`Email to ${email} sent: ` + info.response);
    }
  });
}
