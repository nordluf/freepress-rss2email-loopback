import { timeouts } from './helpers.mjs';
import { getNewEmails, sendMail } from './mail.mjs';
import { isReady } from './rss.mjs';

console.error((new Date()) + ' application started'); // to add separate line into logs
console.log((new Date()) + ' application started'); // and to share info that app restarted

async function processEmails () {
  const emails = await getNewEmails();

  for (const record of emails) {
    await sendMail(record);
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  setTimeout(processEmails, timeouts.mail);
}

await isReady;
await processEmails();
