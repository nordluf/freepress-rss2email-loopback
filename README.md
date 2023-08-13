You must provide **R2M_USERNAME** and **R2M_PASSWORD** as env variables to connect to the mailbox.
Another necessary variable is **R2M_RSS_FEED** with the link to RSS feed to parse.

By default, IMAP and SMTP from Google are used. You can change that by using **R2M_IMAP_HOST**, **R2M_IMAP_PORT**, **R2M_SMTP_HOST**, **R2M_SMTP_PORT**.

**R2M_INTERVAL** (in seconds, 60 by default) specifies how often the app retrieves updates from Google and RSS. Also, there are **R2M_INTERVAL_RSS** and **R2M_INTERVAL_MAIL** if you want to override that timeout per service.
**R2M_RSS_NUM** (3 by default) allows you to change the number of items to send. This value could be set via the e-mail header.
**R2M_RSS_MAXNUM** (20 by default) is the maximum number of items to send. The hard limit cannot be exceeded.

**R2M_TIMEZONE** (Europe/Moscow by default) allows you to control the timezone for the news feed
**R2M_LOCALE** (ru-RU by default) allows you to control the locale for date generation
**R2M_SUBJECT** specifies the title of the e-mail to send back. {{day}} and {{time}} allows you to put inside the subject current date and time
By using **R2M_TEMPLATE** the default e-mail template could be overwritten. So, if you want to use, for example, example.hbs template, you have to save this file in the root directory of the project and set environment variable R2M_TEMPLATE as: 'example'. Inside the template, you can use handlebars syntax with predefined variables:
    - year (current year)
    - subject (email subject)
    - news (full news feed. All news usually appears under news.items key)

Pay attention! The application relies on read\unread statuses of e-mails, so don't change statuses via the online interface if you want this application to work.
Also, to be honest, I didn't even try to test anything except GMail.

To run this project you can simply use docker-compose file by setting there all the necessary variables and then run `docker-compose up -d`
