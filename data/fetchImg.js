var path = require('path');
var fs = require('fs');
var request = require('request');
var chalk = require('chalk');

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
        .replace(/^https?:\/\/[^\/]+\//, '')
        .replace(/\//g, '_');
      filename = path.resolve(targetPath, filename);

      if(fs.existsSync(filename)) {
        console.log(chalk.blue('image already existed'), chalk.grey(product.name + '-->' + filename));
        downloadNextProductImage();
      } else {
        console.log(chalk.blue('start to download'), chalk.grey(product.name + '-->' + filename));
        download(url, filename).then(function() {
          console.log(chalk.green('download successfully'), chalk.grey(product.name + '-->' + filename));
          downloadNextProductImage();
        }, function(err) {
          console.log(chalk.error('download error'), chalk.grey(product.name), err.message);
          downloadNextProductImage();
        });
      }

    } else {
      console.log(chalk.green('all images finished'));
      callback();
    }
  }

  downloadNextProductImage();
}

module.exports = downloadProductImages;


