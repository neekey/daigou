var PRODUCTS_CONFIG = require('./products.json');
var productsConfig = PRODUCTS_CONFIG.concat([]);
var exec = require('child_process').exec;
var path = require('path');
var fs = require('fs');
var chalk = require('chalk');
var PHANTOM_EXEC_PATH = path.resolve(__dirname, '../node_modules/.bin/phantomjs');
var targetDataPath = path.resolve(__dirname, '../src/data/products');
var jobScriptPath = path.resolve(__dirname, './phantom_task.js');

function execProduct(product, filepath, callback) {
  console.log(chalk.blue('start to fetch product ' + product.name));
  var child = exec(PHANTOM_EXEC_PATH + ' ' + jobScriptPath + ' ' + product.url + ' ' + filepath, function(err) {
    if (!err) {
      var products = require(filepath);
      callback(null, products);
    } else {
      callback(err);
    }
  });
  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);
}

function execNextProduct(callback) {
  const product = productsConfig.shift();
  if (product) {
    const filePath = path.resolve(targetDataPath, product.name + '.raw.json');
    execProduct(product, filePath, function(err){
      if (err) {
        console.log(chalk.red('error occured when fetch product' + product.name));
      } else {
        console.log(chalk.green('fetch product success ' + product.name));
      }

      execNextProduct(callback);
    })
  } else {
    console.log(chalk.blue('all products are finished'));
    callback();
  }
}

function updatePriceAndDescription() {
  console.log(chalk.blue('start to update existing data'));
  PRODUCTS_CONFIG.forEach(function(product){
    var raw = require(path.resolve(targetDataPath, product.name + '.raw.json'));
    var target = path.resolve(targetDataPath, product.name + '.json');

    // add tags to raw
    raw.forEach(function(item) {
      item.tags = product.tags;
    });

    if (fs.existsSync(target)) {
      var targetData = require(target);
      raw.forEach(function(item) {
        var match = false;
        targetData.forEach(function(targetItem) {
          if (targetItem.id === item.id) {
            match = true;
            targetItem.price = item.price;
            targetItem.tags = item.tags;
            targetItem.priceDroppedDown = item.priceDroppedDown;
          }
        });

        if (!match) {
          targetData.push(item);
        }
      });

      fs.writeFileSync(target, JSON.stringify(targetData), 'utf-8');
    } else {
      fs.writeFileSync(target, JSON.stringify(raw), 'utf-8');
    }
  });

  console.log(chalk.blue('Over'));
}

execNextProduct(updatePriceAndDescription);
