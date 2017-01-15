var page = require('webpage').create();
var fs = require('fs');
var system = require('system');
var args = system.args;
var baseURL = args[1];
var filepath = args[2];

function getProductListFromURL(url, callback) {
  page.open(url, function(status) {
    console.log('opened page ', url, 'start to get list');
    setTimeout(function(){
      var result = page.evaluate(function() {
        var selectorProductListContainer = '.product-list-container';
        var selectorProductList = 'td';
        var selectorProductId = '.PageGroupSKUs';
        var selectorLinkContainer = '.product-container';
        var selectorProductImage = '.product-image img';
        var selectorProductPrice = '.Price';
        var selectorNextPage = '.next-page';
        var selectorPriceDropDown = '.product-image .product_image_overlay';

        var nextPageEl = document.querySelector(selectorNextPage);
        var productList = document.querySelector(selectorProductListContainer).querySelectorAll(selectorProductList);
        var productListData = [];

        var product = null;
        var link = null;
        var idInput = null;
        var img = null;
        var priceEl = null;
        var priceDropdown = null;

        for(var index = 0; index < productList.length; index++) {
          product = productList[index];
          link = product.querySelector(selectorLinkContainer);
          idInput = product.querySelector(selectorProductId);
          img = product.querySelector(selectorProductImage);
          priceEl = product.querySelector(selectorProductPrice);
          priceDropdown = !!product.querySelector(selectorPriceDropDown);
          if (link && idInput && img && priceEl) {
            productListData.push({
              id: idInput.value,
              pic: 'https://static.chemistwarehouse.com.au/ams/media/productimages/' + idInput.value + '/original.jpg',
              name: link.getAttribute('title'),
              link: link.getAttribute('href'),
              price: priceEl.innerHTML.trim().replace('$', ''),
              priceDroppedDown: priceDropdown,
            });
          }
        }
        return {
          list: productListData,
          next: nextPageEl ? document.location.origin + nextPageEl.getAttribute('href') : null,
        };
      });

      callback(result);
    }, 1000);
  });
}

function getCompleteProductListFromURL(url, list, callback) {
  getProductListFromURL(url, function(result) {
    console.log('get list from page', url, result.list.length);
    list = list.concat(result.list);
    var nextURL = result.next;
    if (nextURL && nextURL !== url) {
      console.log('go to next page');
      getCompleteProductListFromURL(nextURL, list, callback);
    } else {
      console.log('no more page');
      callback(list);
    }
  });
}

function getDescriptionForList(list, done) {
  // fs.write('./swisse.json', JSON.stringify(list), 'w');
  console.log('get product list successfuly');

  function getProductDescription(product, callback) {
    var url = 'http://www.chemistwarehouse.com.au/' + product.link;
    console.log('start to get desc from ', url);
    page.open(url, function(status){
      setTimeout(function(){
        var desc = page.evaluate(function() {
          var infoContainer = document.querySelector('.product-info-container');
          if (infoContainer) {
            return infoContainer.textContent;
          }
          return '';
        });
        callback(desc);
      }, 1000);
    });
  }

  var resultList = [];

  function getNextProductDesc() {
    if (list.length) {
      var product = list.shift();
      getProductDescription(product, function(desc) {
        product.description = desc;
        console.log('get desc complete for product', product.id, '( ' + list.length + ' more )');
        resultList.push(product);
        getNextProductDesc();
      });
    } else {
      console.log('all desc have been fetched');
      done(resultList);
    }
  }
  getNextProductDesc();
}

getCompleteProductListFromURL(baseURL, [], function(list){
  console.log('get complete list', list.length);
  // getDescriptionForList(list, function(result){
  //   fs.write(filepath, JSON.stringify(result), 'w');
  //   phantom.exit();
  // });

  fs.write(filepath, JSON.stringify(list), 'w');
  phantom.exit();
});
