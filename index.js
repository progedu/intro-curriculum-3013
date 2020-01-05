'use strict';
const http = require('http');
const fs = require('fs');
const fileName = './log.json';
//let log = new Map();

//try文でしっかり例外処理にも対応
try {
	const allData = fs.readFileSync(fileName, 'utf8');
} catch (ignore) {
	console.log(`過去ログ無し`);
}

const server = http.createServer((req, res) => {
	saveLog(req.connection.remoteAddress);
	//console.info(`[${now}] Requested by ${req.connection.remoteAddress}`);
	//console.info('[' + now + '] Requested by ' + req.connection.remoteAddress);
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

	//req.methodは文字列
	switch (req.method) {
		case 'GET':
			res.write(`GET ${req.url}\n`);
			//res.write('GET ' + req.url);
			//saveLog(req.connection.remoteAddress);
			break;
		case 'POST':
			res.write(`POST ${req.url}\n`);
			let body = [];
			req.on('data', (chunk) => {
				//body.push(chunk);
				body += chunk;
			}).on('end', () => {
				//body = Buffer.concat(body).toString();
				console.info(`[${now}] Data posted: ${body}`);
				//console.info('[' + now + '] Data posted: ' + body);
			});
			break;
		case 'DELETE':
			res.write(`デリーーーーーーーーートーーーーーーーーー ${req.url}\n`);
            //res.write('デリーーーーーーーーーートーーーーーーー ' + req.url);
			break;
		case 'PUT':
			res.write(`設置します ${req.url}\n`);
			break;
		default:
			break;
	}
	res.end();
}).on('error', (e) => {
	console.error(`[${now}] Server Error`, e);
	//console.error('[' + new Date() + '] Server Error', e);
}).on('clientError', (e) => {
	console.error(`[${now}] Server Error`, e);
	//console.error('[' + new Date() + '] Client Error', e);
});
const port = 8000;
server.listen(port, () => {
	console.info(`[${new Date()}] Listening on ${port}`);
	//console.info('[' + new Date() + '] Listening on ' + port);
});

function saveTasks(now, logData) {
	//JSON.stringfyでJSONに直してる
	const log = new Map();
	log.set(now,logData);
	fs.appendFileSync(fileName, JSON.stringify(Array.from(log), null, '    '), 'utf8');
	//fs.writeFileSync(fileName, JSON.stringify(Array.from(Log), null, '    '), 'utf8');
} 

function saveLog(remoteAddress) {
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
	let logData = `${time_Obj.year}/${time_Obj.month}/${time_Obj.day}(${time_Obj.week}) ${time_Obj.Hours}:${time_Obj.Minutes}:${time_Obj.Seconds}「${remoteAddress}」からアクセス有り`;
	//log.set(now, logData);
	//データ管理に使う
	saveTasks(now, logData);
	//console.info(logData);
}