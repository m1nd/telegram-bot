import * as express from 'express';
import * as https from 'https';
import * as fs from 'fs';
import * as bodyParser from 'body-parser';

import Connect from './db';
const { MONGO_USERNAME, MONGO_PASSWORD, MONGO_HOSTNAME, MONGO_PORT, MONGO_DB } = process.env;

const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=bot`;

console.log(process.env.PORT);

const options = {
  key: fs.readFileSync('privkey.pem'),
  cert: fs.readFileSync('fullchain.pem'),
};

const app = express();
app.use(bodyParser.json());

// app.get('/', function (req, res) {

// });

Connect(url);

https.createServer(options, app).listen(port, '0.0.0.0', () => {
  console.log(`Web server started on port ${port}`);
});

module.exports = bot => {
  app.post('/' + bot.token, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
  });
};
