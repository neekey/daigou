var path = require('path');
var fs = require('fs');
var chalk = require('chalk');
var targetDataPath = path.resolve(__dirname, '../src/data/products');
var configs = require('./products.json');
var dictionary = require('./translateDictionary.json');

function translate(products) {
  return products.map(function(product){
    if (!product.chinese_name) {
      product.chinese_name = product.name;
      for(var key in dictionary) {
        product.chinese_name = product.chinese_name.replace(new RegExp('\\b' + key + '\\b', 'ig'), dictionary[key]);
      }
    }

    return product;
  });
}

configs.forEach(function(obj) {
  if (obj.translate) {
    var filename = path.resolve(__dirname, targetDataPath, obj.name + '.json');
    var products = require(filename);
    console.log(chalk.green('start to translate '), chalk.grey(obj.name));
    fs.writeFileSync(filename, JSON.stringify(translate(products)));
    console.log(chalk.green('finish translation for '), chalk.grey(obj.name));
  }
});

console.log(chalk.green('All done '));
