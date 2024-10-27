const fs = require('fs-extra');
const path = require("path");
const { Sequelize } = require('sequelize');

// Load environment variables if the .env file exists
if (fs.existsSync('set.env')) {
    require('dotenv').config({ path: __dirname + '/set.env' });
}

const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined ? databasePath : process.env.DATABASE_URL;
module.exports = {
    session: process.env.SESSION_ID || 'FLASH-MD-WA-BOT;;;=>eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoieU84cXUzZUg3dmVURmV6bmVZclJ2OHhGM1preitqSFZtWGM1c1pMY2RYcz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiTExuQ3NWelVMYlY0M3gyNjIzVmwxUkhWaHFxVFA4bnM3ZHBtSWJDNlBDcz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJBTWxDVGtnclBMSGxQOUdqOEJsMDJxNm9uSHJSTmtpeUpNTjZReDgxdjFFPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJ0WS9jY29ZVTFITnMvL0RHVngyK1ExOElIc09DR2RnSkx4Nzg0MDdYazE4PSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkFEWVAycko3TUNwaUM5aWV5SzBSbVZWTlJXbGJ6QnZVNHFGM3RITW9kRlU9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjhrL3V4c3ZKNUhFbGdZQVBnbnJaT014bEN3MnZlSzQwM0xqSVJicEc1RWs9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiRUl4OEZUd3VkSzdCN051eEY2ZWgzK09BaXp6L1cralk4Z1A0Q3dDY1ExZz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiTkN5eEpRWHZSTlpFcEJpWVI5dTRmWVhCK0R4cE5JWEx0b1dWeFVkemtBWT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IiszbUtidkR0aEVzdGx1WTZ2aWJrRTA3ZktmMmxlQ2pqczhoQlg2U2ZzZGNDdTk2dS9Yc2VLWEdCaVlteGpQc3h4M1pHKzNEbWhtV2lEWmtFTzVHK0FRPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MzMsImFkdlNlY3JldEtleSI6IldEaWNPd3hxMm00NDNGUVRJSDVFRkZSTXdkWVE0T3c0YUNVYlNQZjlGbEE9IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbXSwibmV4dFByZUtleUlkIjozMSwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjMxLCJhY2NvdW50U3luY0NvdW50ZXIiOjAsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJkZXZpY2VJZCI6ImNlR2xvVFVrUlB1Y0loWTZDRjVGeFEiLCJwaG9uZUlkIjoiZGY5YTVmM2UtNmQ2MS00Zjk5LTkxYzgtYmY2Zjg3OTc3MmNlIiwiaWRlbnRpdHlJZCI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IndDZlRpV2wrcU5SYzR6UzFwRENCeE9VL0VBVT0ifSwicmVnaXN0ZXJlZCI6dHJ1ZSwiYmFja3VwVG9rZW4iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJmY29QRnZQdFp4SzRHdURCanZ6OEE4cFRCSnM9In0sInJlZ2lzdHJhdGlvbiI6e30sInBhaXJpbmdDb2RlIjoiU1hYM00zUlIiLCJtZSI6eyJpZCI6IjI2MDk2NzgzODE0NDozNkBzLndoYXRzYXBwLm5ldCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDS1RBN3BnQkVKbVcrTGdHR0FVZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5Ijoid3lRZVRGMlNITXpvY1RVcENOYzM4YmhiTGVuNTVKcURoektPTVVEN1p5QT0iLCJhY2NvdW50U2lnbmF0dXJlIjoicWtqVFVLS1VHMUVlUU0wMWdyM0hFVU9rWHR2TzFKbWcrZFQ1Um91bktORVVEWUpjalEydFRWcUUvbFFyMHh2WmRTMncxemozVlh1Z0RZMUsxZ2tYQkE9PSIsImRldmljZVNpZ25hdHVyZSI6IndCZGlKWlIvbDdadlMxUUxscmFZeWNoNzhqeU5wenpEZ1pnNVRsZUlrK3d1d1h0UG5FSlAvTmdQYnNPTzF2SG1rNFdYdWZXUFhyaXRxODJmMjlRVEFRPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjYwOTY3ODM4MTQ0OjM2QHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQmNNa0hreGRraHpNNkhFMUtRalhOL0c0V3kzcCtlU2FnNGN5ampGQSsyY2cifX1dLCJwbGF0Zm9ybSI6ImFuZHJvaWQiLCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3MzAwMjIxODJ9',
    PREFIXES: (process.env.PREFIX || '').split(',').map(prefix => prefix.trim()).filter(Boolean),
    OWNER_NAME: process.env.OWNER_NAME || "MR2K TECH",
    OWNER_NUMBER: process.env.OWNER_NUMBER || "260967838144",
    AUTO_READ_STATUS: process.env.AUTO_VIEW_STATUS || "on",
    AUTOREAD_MESSAGES: process.env.AUTO_READ_MESSAGES || "off",
    CHATBOT: process.env.CHAT_BOT || "on",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_SAVE_STATUS || 'off',
    A_REACT: process.env.AUTO_REACTION || 'on',
    AUTO_BLOCK: process.env.BLOCK_ALL || 'off',
    URL: process.env.BOT_MENU_LINKS || 'https://static.animecorner.me/2023/08/op2.jpg',
    MODE: process.env.BOT_MODE || "public",
    PM_PERMIT: process.env.PM_PERMIT || 'on',
    HEROKU_APP_NAME: process.env.HEROKU_APP_NAME,
    HEROKU_API_KEY: process.env.HEROKU_API_KEY,
    WARN_COUNT: process.env.WARN_COUNT || '3',
    PRESENCE: process.env.PRESENCE || 'online',
    ADM: process.env.ANTI_DELETE || 'on',
    TZ: process.env.TIME_ZONE || 'Africa/Nairobi',
    DP: process.env.STARTING_MESSAGE || "off",
    ANTICALL: process.env.ANTICALL || 'on',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://giftedtech_ke:9BzoUeUQO2owLEsMjz5Vhshva91bxF2X@dpg-crice468ii6s73f1nkt0-a.oregon-postgres.render.com/api_gifted_tech"
        : "postgresql://giftedtech_ke:9BzoUeUQO2owLEsMjz5Vhshva91bxF2X@dpg-crice468ii6s73f1nkt0-a.oregon-postgres.render.com/api_gifted_tech",
    /* new Sequelize({
        dialect: 'sqlite',
        storage: DATABASE_URL,
        logging: false,
    })
    : new Sequelize(DATABASE_URL, {
        dialect: 'postgres',
        ssl: true,
        protocol: 'postgres',
        dialectOptions: {
            native: true,
            ssl: { require: true, rejectUnauthorized: false },
        },
        logging: false,
    }), */
};

// Watch for changes in this file and reload it automatically
const fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`Updated ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
