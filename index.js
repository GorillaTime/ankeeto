'use strict';
const fs = require('fs');
const http = require('http');
const pug = require('pug');
const auth = require('http-auth');
const basic = auth.basic(
  { realm: 'Enquetes Area.' },
  (username, password, callback) => {
    callback(username === 'gorilla' && password === 'uhouho');
  });
const server = http.createServer(basic, (req, res) => {
  const now = new Date();
  console.info('[' + now + '] Requested by ' + req.connection.remoteAddress);

  if (req.url === '/logout') {
    res.writeHead(401, {
      'Content-Type': 'text/plain; charset=utf-8'
    });
    res.end('ログアウトしました');
    return;
  }
  if(req.url === '/favicon.ico') {
    var fav = fs.readFileSync("./favicon-16x16.png");
    res.writeHead(200,{
      'Content-Type': 'image/png; charset=utf-8'
    });
  } else {
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8'
  });
}
var firstITEM = '(´・ω・｀)URLいじっちゃイヤよ';
var secondITEM = '(´・ω・｀)URLいじっちゃ駄目よ';
  switch (req.method) {
    case 'GET':
      if (req.url === '/enquetes/yaki-shabu') {
          firstITEM = 'バナナ';
          secondITEM = '熟したバナナ';
      }else if(req.url === '/enquetes/rice-bread') {
          firstITEM =　'ばなな';
          secondITEM = 'BANANA';
      }
      res.write(pug.renderFile('./form.pug', {
        path: req.url,
        firstItem: firstITEM,
        secondItem: secondITEM
      }));
      res.end(fav);
      break;
    case 'POST':
      let rawData = '';
      req.on('data', (chunk) => {
        rawData = rawData + chunk;
      }).on('end', () => {
        const decoded = decodeURIComponent(rawData);
        console.info('[' + now + '] 投稿: ' + decoded);
        res.write('<!DOCTYPE html><html lang="ja"><body><h1>' +
          decoded + 'が投稿されました</h1></body></html>');
        res.end(fav);
      });
      break;
    default:
      break;
  }
}).on('error', (e) => {
  console.error('[' + new Date() + '] Server Error', e);
}).on('clientError', (e) => {
  console.error('[' + new Date() + '] Client Error', e);
});
const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.info('[' + new Date() + '] Listening on ' + port);
});