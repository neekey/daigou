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

function getUploadList(serverList) {
  var localList = fs.readdirSync(BUILD_PATH);
  var syncList = getSyncList(localList, serverList);
  return syncList.map(function(filename) {
    return {
      local: path.resolve(BUILD_PATH, filename),
      target: path.join(TARGET_PATH, filename),
    };
  });
}

function getHashFromFilename(filename) {
  var ret = /^.+-([a-z0-9]+)\.\w+$/.exec(filename);
  return (ret || [])[1];
}

function getActuallFilename(filename) {
  var ret = /^(.+)-([a-z0-9]+)\.\w+$/.exec(filename);
  return (ret || [])[1];
}

function matchFileFromServer(filename, serverList, ext) {
  var target = null;
  serverList.forEach(function(item) {
    var serverExt = path.extname(item.name);
    if (item.name.indexOf(filename) >= 0 && ext === serverExt) {
      target = item;
    }
  });

  return target;
}

function getSyncList(localList, serverList) {
  const syncList = [];
  localList.forEach(filename => {
    if (/\.(jpg|png|ttf|eot|woff|woff2|svg|)$/.test(filename)) {
      var actualFilename = getActuallFilename(filename);
      var extension = path.extname(filename);
      var serverMatch = matchFileFromServer(actualFilename, serverList, extension);
      if (!serverMatch || (serverMatch && filename !== serverMatch.name)) {
        syncList.push(filename);
      }
    } else {
      syncList.push(filename);
    }
  });

  return syncList;
}

var client = new Client();
client.on('greeting', function(msg) {
  console.log(chalk.green('greeting'), msg);
});
client.on('ready', function() {
  client.list(TARGET_PATH, function(err, serverList) {
    console.log(chalk.green('get list from server.'));
    var uploadList = getUploadList(serverList);
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
          throw err;
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
});
// connect to localhost:21 as anonymous
client.connect({
  host: HOST,
  port: PORT,
  user: USERNAME,
  password: PASSWORD,
});
