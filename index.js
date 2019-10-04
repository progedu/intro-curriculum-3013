'use strict';
const http = require('http');
const fs = require('fs');
const fileName = './log.json';
let log = new Map();
try {
    const allData = fs.readFileSync(fileName, 'utf8');
    log = new Map(JSON.parse(allData));
  } catch (ignore) {
    console.log('過去ログ無し');
	}
	
const server = http.createServer((req, res) => {
	var now = new Date();
	let time_Obj = {
	month:now.getMonth() + 1,
	day:now.getDate(),
	year:now.getFullYear(),
	week:["日","月","火","水","木","金","土"][(now.getDay())],
	Hours:now.getHours(),
	Minutes:now.getMinutes(),
	Seconds:now.getSeconds()
	}
	let logData = `${time_Obj.year}/${time_Obj.month}/${time_Obj.day}(${time_Obj.week}) ${time_Obj.Hours}:${time_Obj.Minutes}:${time_Obj.Seconds}「${req.connection.remoteAddress}」からアクセス有り`;
	log.set(now, logData);
  saveTasks();
  console.info(logData);

	res.writeHead(200, {
		'Content-Type': 'text/plain; charset=utf-8'
	});
	switch (req.url){
		case '/log':
			res.write(logData);
				break;
		default:
				break;
	}
	switch (req.method) {
		case 'GET':
			res.write('GET ' + req.url);
			break;
		case 'POST':
			res.write('POST ' + req.url);
			let body = "";
			req.on('data', (chunk) => {
				body += chunk;
			}).on('end', () => {
				//body = Buffer.concat(body).toString();
				console.info('[' + now + '] Data posted: ' + body);
			});
		case 'DELETE':
			res.write('DELETE' + req.url);
			break;
		default:
			break;
	}
	res.end();
}).on('error', (e) => {
	console.error('[' + new Date() + '] Server Error', e);
}).on('clientError', (e) => {
	console.error('[' + new Date() + '] Client Error', e);
});
const port = 8000;
server.listen(port, () => {
	console.info('[' + new Date() + '] Listening on ' + port);
});

function saveTasks() {
	fs.writeFileSync(fileName, JSON.stringify(Array.from(log)), 'utf8');
}