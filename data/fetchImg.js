var path = require('path');
var fs = require('fs');
var request = require('request');

function download(uri, filename){
  return new Promise(function(resolve) {
    request.head(uri, function(){
      request(uri).pipe(fs.createWriteStream(filename)).on('close', resolve);
    });
  });
}

function downloadProductImages(products, targetPath, callback) {
  var items = products.concat([]);
  function downloadNextProductImage() {
    var product = items.shift();
    if (product) {
      var url = product.pic.replace('https', 'http');
      var filename = url
        .replace('http://static.chemistwarehouse.com.au/', '')
        .replace(/\//g, '_');
      filename = path.resolve(targetPath, filename);

      if(fs.existsSync(filename)) {
        console.log(product.name, 'already has images', filename);
        downloadNextProductImage();
      } else {
        console.log(product.name, 'start to download, will save to', filename);
        download(url, filename).then(function() {
          console.log(product.name, 'download successfully');
          downloadNextProductImage();
        }, function(err) {
          console.log(product.name, 'download error', err.message);
          downloadNextProductImage();
        });
      }

    } else {
      console.log('all images finished');
      callback();
    }
  }

  downloadNextProductImage();
}

module.exports = downloadProductImages;


