'use strict';
const http = require('http');
const fs = require('fs');
const fileName = './log.json';
let log = new Map();
try {
  const allDate = fs.readFileSync(fileName, 'utf8');
  log = new Map(JSON.parse(allDate));
  } catch (ignore) {
    console.log('過去のログはありません');
  }

const server = http.createServer((req, res) => {
  const now = new Date();
  let time_Obj = {
    month:now.getMonth() + 1,
    day:now.getDate(),
    year:now.getFullYear(),
    week:["日","月","火","水","木","金","土"][(now.getDay())],
    Hours:now.getHours(),
    Minutes:now.getMinutes(),
    Seconds:now.getSeconds()
  }
  let logData = `${time_Obj.year}/${time_Obj.month}/${time_Obj.day}(${time_Obj.week}) ${time_Obj.Hours}:${time_Obj.Minutes}:${time_Obj.Seconds}「${req.connection.remoteAddress}」からアクセスあり`;
  log.set(now, logData);
  saveTasks();
  console.info(logData);

  res.writeHead(200, {
    'Content-Type': 'text/plain; charset=utf-8'
  });
  switch (req.url) {
    case '/log':
      res.write(logData);
      break;
    default:
      break;
  }
  switch (req.method) {
    case 'GET':
      res.write(`GET ${req.url}\n`);
      break;
    case 'POST':
      res.write(`POST ${req.url}\n`);
      let body = "";
      req.on('data', (chunk) => {
        body += chunk;
      }).on('end', () => {
        // body = Buffer.concat(body).toString();
        console.info(`[ ${now} ] Data Posted: ${body}`);
      });
      break;
    case 'DELETE':
      res.write(`DELETE ${req.url}\n`);
      break;
    default:
      break;
  }
  res.end();
  }).on('error', e => {
      console.error(`[ ${new Date()} ] Server Error`, e);
  }).on('clienterror', e => {
      console.error(`[ ${new Date()} ] Client Error`, e);
  });
const port = 8000;
server.listen(port, () => {
    console.log(`[ ${new Date()} ] Listening On ${port}`);
});

function saveTasks() {
  fs.writeFileSync(fileName, JSON.stringify(Array.from(log)), 'utf8');
}
