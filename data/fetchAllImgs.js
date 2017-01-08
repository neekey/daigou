var path = require('path');
var fs = require('fs');
var chalk = require('chalk');
var targetDataPath = path.resolve(__dirname, '../src/data/products');
var targetImagePath = path.resolve(__dirname, '../src/images');
var fetchImages = require('./fetchImg');

function getAllProducts() {
  var list = fs.readdirSync(targetDataPath);
  var products = [];
  list.forEach(function(filename) {
    if (filename.indexOf('.raw.json') < 0) {
      products = products.concat(require(path.resolve(targetDataPath, filename)));
    }
  });
  return products;
}

function fetchProductImages(products, callback) {
  fetchImages(products, targetImagePath, callback);
}


console.log(chalk.green('------ start to fetch all images ------'));

fetchProductImages(getAllProducts(), function() {
  console.log(chalk.green('All done'));
});
