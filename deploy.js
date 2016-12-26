var Client = require('ftp');
var chalk = require('chalk');
var fs = require('fs');
var path = require('path');
var ENV = process.env;
var BUILD_PATH = path.resolve(__dirname, ENV.FTP_BUILD_PATH || 'build');
var TARGET_PATH = ENV.FTP_SERVER_PATH || 'htdocs/daigou';
var USERNAME = ENV.FTP_USERNAME || 'qxu1589780199';
var PASSWORD = ENV.FTP_PASSWORD || 'aA306598288';
var HOST = ENV.FTP_SERVER_HOST || 'qxu1589780199.my3w.com';
var PORT = ENV.FTP_SERVER_PORT || 21;

function getUploadList() {
  return fs.readdirSync(BUILD_PATH).map(function(filename) {
    return {
      local: path.resolve(BUILD_PATH, filename),
      target: path.join(TARGET_PATH, filename),
    };
  });
}

var client = new Client();
client.on('greeting', function(msg) {
  console.log(chalk.green('greeting'), msg);
});
client.on('ready', function() {
  var uploadList = getUploadList();
  var total = uploadList.length;
  var uploadCount = 0;
  var errorList = [];
  uploadList.forEach(function(file) {
    console.log(chalk.blue('start'), file.local + chalk.grey(' --> ') + file.target);
    client.put(file.local, file.target, function(err) {
      uploadCount++;
      if (err) {
        console.error(chalk.red('error'), file.local + chalk.grey(' --> ') + file.target);
        console.error(err.message);
        errorList.push(file);
      } else {
        console.info(chalk.green('success'), file.local + chalk.grey(' --> ') + file.target, chalk.grey('( ' + uploadCount + '/' + total + ' )'));
      }

      if (uploadCount === total) {
        client.end();
        if (errorList.length === 0) {
          console.info(chalk.green('All files uploaded!'));
        } else {
          console.log(chalk.red('Failed files:'));
          errorList.forEach(function(file) {
            console.log(file.local + chalk.grey(' --> ') + file.target);
          });
          throw 'Total Failed: ' + errorList.length;
        }
      }
    });
  });
});
// connect to localhost:21 as anonymous
client.connect({
  host: HOST,
  port: PORT,
  user: USERNAME,
  password: PASSWORD,
});