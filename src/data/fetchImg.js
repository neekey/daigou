var path = require('path');

var a2Data = require('./a2.json');
var aptamilData = require('./aptamil.json');
var bellamyData = require('./bellamy.json');
var bioIslandData = require('./bio_island.json');
var bioglanData = require('./bioglan.json');
var blackmores = require('./blackmores.json');
var karicareData = require('./karicare.json');
var natures = require('./natures_way.json');
var swisse = require('./swisse.json');


const data = []
  .concat(a2Data)
  .concat(aptamilData)
  .concat(bellamyData)
  .concat(bioIslandData)
  .concat(bioglanData)
  .concat(karicareData)
  .concat(swisse)
  .concat(blackmores)
  .concat(natures);

var fs = require('fs'),
  request = require('request');

var download = function(uri, filename){
  return new Promise(function(resolve) {
    request.head(uri, function(){
      request(uri).pipe(fs.createWriteStream(filename)).on('close', resolve);
    });
  });
};

data.forEach(item => {
  const url = item.pic.replace('https', 'http');
  let filename = url
    .replace('http://static.chemistwarehouse.com.au/', '')
    .replace(/\//g, '_');
  filename = path.resolve(__dirname, './images', filename);
  console.log(item.name, 'start to download, will save to', filename);

  download(url, filename).then(() => {
    console.log(item.name, 'download successfully');
  })
});


