import dotenv from 'dotenv';

dotenv.config();

export default {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    persistence:  process.env.PERSISTENCE,
    enivornment: process.env.NODE_ENV,
    adminName: process.env.ADMIN_NAME,
    adminPassword: process.env.ADMIN_PASSWORD,
    mailing: {
        service: process.env.MAILING_SERVICE,
        port: process.env.MAIL_PORT,
        user: process.env.MAILING_USER,
        password: process.env.MAILING_PASSWORD
    }
}