// global variables
let products;

/**
 * Read a JSON file from local
 * @param {*} filePath - path to file, for reading
 */
function readTextFile(filePath) {
  var rawFile = new XMLHttpRequest();
  rawFile.open('GET', filePath, false);
  rawFile.onreadystatechange = function() {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status == 0) {
        var allText = rawFile.responseText;
        products = JSON.parse(allText);
      }
    }
  };
  rawFile.send(null);
}

/**
 * Open product on Amazon
 */
function openProduct() {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    let productLink = '';
    chrome.storage.sync.get(['productLink'], response => {
      console.log('product link fetched from chrome!', response.productLink);
      productLink = response.productLink.toString();
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, { todo: 'openProductPage', params: { productLink } });
      });
    });
  });
}

/**
 * Store product preference in chrome and start timer
 */
function storeProductPreference() {
  const choiceElement = document.getElementById('productChoiceList');
  const selectedProduct = choiceElement.options[choiceElement.selectedIndex].value;
  const saleTimeElement = document.getElementById('saleTime');
  const selectedTime = saleTimeElement.value;
  const filePath = `../js/products.json`;
  // happens in sync
  readTextFile(filePath);
  const productLink = products[selectedProduct];
  console.log('selected product link =>', productLink);
  console.log('selected time =>', selectedTime);
  chrome.storage.sync.set({ productLink }, () => {
    console.log('product link stored in chrome!', productLink);
  });
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, { todo: 'startNotificationTimer', params: { selectedTime } });
  });
}

/**
 * Set default time to aid user
 */
function setDefaultDateTime() {
  // format to make -> 2019-06-12T12:00
  const saleTimeElement = document.getElementById('saleTime');
  let currentDate = new Date().toLocaleDateString();
  const [day, month, year] = currentDate.split('/');
  const currentTime = '12:00';
  const finalDefaultTime = `${year}-${month}-${day}T${currentTime}`;
  saleTimeElement.value = finalDefaultTime;
}

/**
 * Action once the pop-up DOM is loaded.
 * Contains all the necessary listeners to add
 */
function onLoad() {
  const saveProductButton = document.getElementById('saveProductButton');
  const goButton = document.getElementById('surfNow');
  setDefaultDateTime();
  saveProductButton.addEventListener('click', storeProductPreference, false);
  goButton.addEventListener('click', openProduct, false);
}

function popup() {
  document.addEventListener('DOMContentLoaded', onLoad, false);
}

popup();

/*
function() {
      if (selectedValue == '1') {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          loadPage(
            tabs,
            'https://www.amazon.in/Everycom-Silver-Lightweight-Tripod-Phone/dp/B077KYPP5Q/ref=sr_1_2_sspa?s=electronics&ie=UTF8&qid=1526034701&sr=1-2-spons&keywords=phone+tripod&psc=1'
          );
        });
      } else if (selectedValue == '2') {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          loadPage(
            tabs,
            'https://www.amazon.in/Everycom-Silver-Lightweight-Tripod-Phone/dp/B077KYPP5Q/ref=sr_1_2_sspa?s=electronics&ie=UTF8&qid=1526034701&sr=1-2-spons&keywords=phone+tripod&psc=1'
          );
        });
      } else if (selectedValue == '3') {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          loadPage(
            tabs,
            'https://www.amazon.in/Everycom-Silver-Lightweight-Tripod-Phone/dp/B077KYPP5Q/ref=sr_1_2_sspa?s=electronics&ie=UTF8&qid=1526034701&sr=1-2-spons&keywords=phone+tripod&psc=1'
          );
        });
      }
    }
*/
