// send message to background.js to allow extension usage
chrome.runtime.sendMessage({ todo: 'showPageAction' });

/**
 * listen to messages sent from popup.js and background.js
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const action = request.todo; // could be from pop-up or background
  switch (action) {
    case 'startNotificationTimer': {
      console.log('startTimer action params', request.params.selectedTime);
      chrome.runtime.sendMessage({ todo: 'startBackGroundNotificationTimer', params: request.params });
      break;
    }
    case 'timerSet': {
      console.log('Sale timer set for =>', request.params.sleepTime / 60000, ' minutes');
      break;
    }
    case 'alertDayMismatch': {
      console.log('Alert: Sale is not today...');
      window.alert('Sale is not today!');
      break;
    }
    case 'alertSaleMissed': {
      console.log('Alert: Sale has been missed...');
      window.alert('Sale has been missed!');
      break;
    }
    case 'openProductPage': {
      console.log('Request to open product page');
      chrome.runtime.sendMessage({ todo: 'openProductLink', params: request.params });
      break;
    }
    case 'product': {
      console.log('Product fetched is', request.params.productLink);
      break;
    }
    default:
      console.log('Input action not handled:', action);
      break;
  }
});
