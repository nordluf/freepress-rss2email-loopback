import { config } from 'dotenv';

config();

const env = process.env;

export const rss = {
  feed: env.R2M_RSS_FEED || false,
  items: parseInt(env.R2M_RSS_NUM) || 3,
  maxitems: parseInt(env.R2M_RSS_MAXNUM) || 20
};

if (!rss.feed) {
  throw new Error('You must provide rss feed link through env variables. View README.md');
}

export const imapConfig = {
  user: env.R2M_USERNAME || false,
  password: env.R2M_PASSWORD || false,
  host: env.R2M_IMAP_HOST || 'imap.gmail.com',
  port: env.R2M_IMAP_PORT || 993,
  tls: true,
  tlsOptions: { rejectUnauthorized: false }
};

if (!imapConfig.user || !imapConfig.password) {
  throw new Error('You must provide username and password through env variables. View README.md');
}

export const smtpConfig = {
  user: imapConfig.user,
  password: imapConfig.password,
  host: env.R2M_SMTP_HOST || 'smtp.gmail.com',
  port: env.R2M_SMTP_PORT || 587
};

export const timeouts = {
  mail: (parseInt(env.R2M_INTERVAL_MAIL || env.R2M_INTERVAL) || 60) * 1000,
  rss: (parseInt(env.R2M_INTERVAL_RSS || env.R2M_INTERVAL) || 60) * 1000
};

export const emailConfig = {
  subject: env.R2M_SUBJECT || 'Самые важные новости на данный момент: {{day}} {{time}} (по московскому времени)',
  locale: env.R2M_LOCALE || 'ru-RU',
  timezone: env.R2M_TIMEZONE || 'Europe/Moscow',
  template: env.R2M_TEMPLATE || 'template'
};

export function debug (msg) {
  env.R2M_DEBUG && console.log(msg);
}
