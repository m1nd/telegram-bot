import express from 'express';
import https from 'https';
import fs from 'fs';
import bodyParser from 'body-parser';

import packageInfo from './package.json';
//import db from './db';

const options = {
  key: fs.readFileSync("privkey.pem"),
  cert: fs.readFileSync("fullchain.pem")
};

const app = express();
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.json({ version: packageInfo.version });
});

https.createServer(options, app)
  .listen(process.env.PORT, "0.0.0.0", () => {
   console.log('Web server started!');
 });

module.exports = (bot) => {
  app.post('/' + bot.token, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
  });
};
