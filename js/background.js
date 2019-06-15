function notifyUser() {
  const notificationOptions = {
    type: 'basic',
    iconUrl: '../res/get_started48.png',
    title: 'Amazon Sale in 5 min',
    message: 'Make sure browser is open and you are signed into your amazon account'
  };
  chrome.notifications.create('SaleNotification', notificationOptions);
}

function calculateSleepTime(timeOfSale) {
  let sleepTime = 0;
  const saleDate = new Date(timeOfSale).toLocaleDateString();
  const currentDate = new Date().toLocaleDateString();
  if (saleDate !== currentDate) {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, { todo: 'alertDayMismatch' });
    });
  } else {
    const saleISOTimestamp = new Date(timeOfSale).getTime();
    const currentISOTimestamp = new Date().getTime();
    const fiveMinutesInMilliSeconds = 5 * 60 * 1000;
    if (saleISOTimestamp - currentISOTimestamp < 0) {
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, { todo: 'alertSaleMissed' });
      });
    } else if (saleISOTimestamp - currentISOTimestamp < fiveMinutesInMilliSeconds) {
      sleepTime = 10;
    } else {
      sleepTime = saleISOTimestamp - (currentISOTimestamp + fiveMinutesInMilliSeconds);
    }
  }
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, { todo: 'timerSet', params: { sleepTime } });
  });
  return sleepTime;
}

function sleep(ms) {
  setTimeout(notifyUser, ms);
}

// listen to messages sent from content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const action = request.todo;
  const params = request.params;
  switch (action) {
    case 'showPageAction': {
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.pageAction.show(tabs[0].id);
      });
      break;
    }
    case 'startBackGroundNotificationTimer': {
      const timeOfSale = params.selectedTime;
      const timeToSleep = calculateSleepTime(timeOfSale);
      if (timeToSleep > 0) {
        sleep(timeToSleep);
      }
      break;
    }
    case 'openProductLink': {
      const productLink = request.params.productLink;
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, { todo: 'product', params: { productLink } });
      });
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.update(tabs[0].id, { url: productLink });
        tabId = tabs[0].id;
        chrome.tabs.onUpdated.addListener((tabId, info) => {
          if (info.status === 'complete') {
            chrome.tabs.executeScript(tabId, {
              code:
                'if(document.getElementById("add-to-cart-button")){document.getElementById("add-to-cart-button").click()};'
            });
          }
        });
      });
      break;
    }
    default:
      console.log('Input action not handled:', action);
      break;
  }
});
