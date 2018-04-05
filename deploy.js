var Client = require('ftp');
var chalk = require('chalk');
var Promise = require('bluebird');
var fs = require('fs');
var path = require('path');
var ENV = process.env;
var BUILD_PATH = path.resolve(__dirname, ENV.FTP_BUILD_PATH || 'build');
var TARGET_PATH = ENV.FTP_SERVER_PATH;
var USERNAME = ENV.FTP_USERNAME;
var PASSWORD = ENV.FTP_PASSWORD;
var HOST = ENV.FTP_SERVER_HOST;
var PORT = ENV.FTP_SERVER_PORT || 21;

function getSyncTargets(serverList) {
  var localList = fs.readdirSync(BUILD_PATH);
  var serverFilenameList = serverList.map(function(obj) {
    return obj.name;
  });
  // console.log('local', serverFilenameList);
  var syncList = getSyncList(localList, serverFilenameList);
  var uploadList = [];
  var deleteList = [];
  syncList.forEach(function(sync) {
    var target = {
      action: sync.action,
      local: path.resolve(BUILD_PATH, sync.filename),
      target: path.join(TARGET_PATH, sync.filename),
    };

    if (sync.action === 'upload') {
      uploadList.push(target);
    }

    if (sync.action === 'delete') {
      deleteList.push(target);
    }
  });

  return {
    uploadList: uploadList,
    deleteList: deleteList,
  };
}

function matchFiles(filenameList, filename, extension) {
  var result = [];
  var extensionEx = new RegExp('\.' + extension + '$');
  filenameList.forEach(function(f) {
    if (f.indexOf(filename) >= 0 && extensionEx.test(f)) {
      result.push(f);
    }
  });

  return result;
}

function parseFilename(filename) {
  var hasHash = /-[a-z0-9]{8}/.test(filename);
  var ret = null;

  if (hasHash) {
    ret = /^(.+)-([a-z0-9]+)\.([\w\d]+)$/.exec(filename) || {};
    return {
      name: ret[1],
      extension: ret[3],
      hash: ret[2],
    };
  }

  ret = /^(.+)\.([\w\d]+)$/.exec(filename) || {};

  return {
    name: ret[1],
    extension: ret[2],
    hash: null,
  };
}

function getSyncList(localList, serverList) {
  const syncList = [];
  localList.forEach(filename => {
    var fileObj = parseFilename(filename);

    if (fileObj.extension !== 'map') {
      if (fileObj.hash) {
        var fileExists = false;
        var matchedFiles = matchFiles(serverList, fileObj.name, fileObj.extension);
        // console.log(filename, matchedFiles, fileObj);
        // process.exit();
        matchedFiles.forEach(function(serverFilename) {
          if (serverFilename !== filename) {
            syncList.push({
              action: 'delete',
              filename: serverFilename
            });
          } else {
            fileExists = true;
          }
        });

        if (!fileExists) {
          syncList.push({
            action: 'upload',
            filename: filename
          });
        }
      } else {
        syncList.push({
          action: 'upload',
          filename: filename
        });
      }
    }
  });

  return syncList;
}

function uploadFile(client, local, target) {
  console.log(chalk.blue('start upload'), local + chalk.grey(' --> ') + target);
  return new Promise(function(resolve) {
    client.put(local, target, function(err) {
      if (err) {
        console.error(chalk.red('error uploading'), local + chalk.grey(' --> ') + target);
        console.error(err.message);
        resolve({
          success: false,
          error: err,
          local: local,
          target: target,
        });
      } else {
        console.info(chalk.green('success uploaded'), local + chalk.grey(' --> ') + target);
        resolve({
          success: true,
          local: local,
          target: target,
        });
      }
    });
  });
}

function deleteFile(client, target) {
  console.log(chalk.blue('start delete'), target);
  return new Promise(function(resolve) {
    client.delete(target, function(err) {
      if (err) {
        console.error(chalk.red('error deleting'), target);
        console.error(err.message);
        resolve({
          success: false,
          error: err,
          target: target,
        });
      } else {
        console.info(chalk.green('success deleted'), target);
        resolve({
          success: true,
          target: target,
        });
      }
    });
  });
}

var client = new Client();
client.on('greeting', function(msg) {
  console.log(chalk.green('greeting'), msg);
});
client.on('ready', function() {
  client.list(TARGET_PATH, function(err, serverList) {
    console.log(chalk.green('get list from server.'));
    if (err) {
      console.error(chalk.red('error getting list from server'));
      console.error(err.message);
      throw err;
    }
    var targetList = getSyncTargets(serverList);
    var uploadList = targetList.uploadList;
    var deleteList = targetList.deleteList;
    var uploadSuccess = [];
    var uploadErrors = [];

    console.log(chalk.green('------ files need to upload ------'));
    uploadList.forEach(function(file) {
      console.log(file.local + chalk.grey(' --> ') + file.target);
    });
    console.log(chalk.green('------ files need to delete -----'));
    deleteList.forEach(function(file) {
      console.log(file.target);
    });

    console.log(chalk.green('------ Start to upload files -----'));

    Promise.reduce(uploadList, function(finished, target) {
      return uploadFile(client, target.local, target.target).then(function(result) {
        finished--;
        console.log(chalk.grey('( ' + finished + '/' + uploadList.length + ' )'));
        if (result.success) {
          uploadSuccess.push(result);
        } else {
          uploadErrors.push(result);
        }
        return finished;
      });
    }, uploadList.length).then(function() {
      console.log(chalk.green('------- upload process finished ------'));
      console.log(chalk.green('success: ') + chalk.grey(uploadSuccess.length));
      uploadSuccess.forEach(function(result) {
        console.log(result.local + chalk.grey(' --> ') + result.target);
      });

      if (uploadErrors.length) {
        console.log(chalk.grey('error: ') + chalk.grey(uploadErrors.length));
        uploadErrors.forEach(function(result) {
          console.log(result.local + chalk.grey(' --> ') + result.target, result.error);
        });
      }

      var deleteSuccess = [];
      var deleteErrors = [];

      console.log(chalk.green('------ Start to delete useless files -----'));

      Promise.reduce(deleteList, function(finished, target) {
        return deleteFile(client, target.target).then(function(result) {
          finished--;
          console.log(chalk.grey('( ' + finished + '/' + deleteList.length + ' )'));
          if (result.success) {
            deleteSuccess.push(result);
          } else {
            deleteErrors.push(result);
          }
          return finished;
        });
      }, deleteList.length).then(function() {
        console.log(chalk.green('------ delete process finished ------'));
        console.log(chalk.green('success: ') + chalk.grey(deleteSuccess.length));
        deleteSuccess.forEach(function(result) {
          console.log(result.target);
        });

        if (deleteErrors.length) {
          console.log(chalk.red('error: ') + chalk.grey(deleteErrors.length));
          deleteErrors.forEach(function(result) {
            console.log(result.target, result.error);
          });
        }

      }).then(function() {
        console.log(chalk.green('All Done'));
        client.end();
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
