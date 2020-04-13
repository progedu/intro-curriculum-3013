  case 'POST':
     res.write('POST ' + req.url);
     let rawData = '';
     req.on('data', (chunk) => {
       rawData = rawData + chunk;
     }).on('end', () => {
       console.info('[' + now + '] Data posted: ' + rawData);
     });
     break;
  case 'DELETE':
    res.write('DELETE ' + req.url);
     break;
   default:
     break;
}
