var path = require('path');
var fs = require('fs');
var sourceDir = path.resolve(__dirname, '../src/data/products');
var targetPath = path.resolve(__dirname, '../s3build/');
var data = [];
var list = fs.readdirSync(sourceDir);

function leftPadNumber(number) {
  if (number <= 9) {
    return '0' + number;
  }

  return number;
}

list.forEach(function(filename){
  data = data.concat(require(path.resolve(sourceDir, filename)));
});

!fs.existsSync(targetPath) && fs.mkdirSync(targetPath);
var now = new Date();
var timeStamp = now.getFullYear() + '-' + leftPadNumber(now.getMonth()) + '-' + leftPadNumber(now.getDate());
fs.writeFileSync(path.resolve(targetPath,  timeStamp + '.json'), JSON.stringify(data));
