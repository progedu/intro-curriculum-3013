'use strict';

// httpのモジュールを読み込む
const http = require('http');

// サーバーを作成
const server = http.createServer((req, res) => {
    // ログを出力
    const now = new Date();
    console.info(`[ ${now} Requested by ${req.connection.remoteAddress}`);
    // レスポンスヘッダ
    res.writeHead(200, {
        'Content-Type' : 'text/plain; charset=utf-8'
    });
    // レスポンスの内容
    switch(req.method){
        // GETメソッドの場合
        case 'GET':
            res.write('GET ' + req.url);
            break;
        // POSTメソッドの場合
        case 'POST':
            res.write('POST ' + req.url);
            let rawData = '';
            req.on('data', (chunk) => {
                rawData = rawData + chunk;
            }).on('end', () => {
                console.info(`[${now}] Data posted: ` + rawData);
            });
			break;
		// DELETEメソッドの場合
		case 'DELETE':
			res.write('DELETE ' + req.url);
			break;
        default:
            break;
    }
    res.end();
// サーバエラーのエラーログを出力
}).on('error', (e) => {
    console.error(`[ ${new Date()} ] Server Error`, e);
// クライアントエラーのエラーログを出力
}).on('clientError', (e) => {
    console.error(`[ ${new Date()} ] client Error`, e);
});

// httpが起動するポートを設定
const port = 8000;
// サーバーを起動
server.listen(port, () => {
	// ログを出力
	console.info(`[ ${new Date()} ] Listening on ${port}`);
});
