'use strict';
const http = require('http');
const server = http.createServer((req, res) => {
	const now = new Date();
	console.info('[' + now + '] Requested by ' + req.connection.remoteAddress);
	res.writeHead(200, {
		'Content-Type': 'text/plain',
		'charset': 'utf-8'
	});

	switch (req.method) {
		case 'GET':
			res.write('GET ' + req.url + '\n');
			break;
		case 'POST':
			res.write('POST ' + req.url + '\n');
			req.on('data', (data) => {
				console.info('[' + now + '] Data posted: ' + data);
			});
			break;
		case 'DELETE':
			res.write('DELETE ' + req.url + '\n');
			break;
		default:
			res.write(req.method + ' method not supported now \n');
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
