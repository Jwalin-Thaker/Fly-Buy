function loadPage(tabs, link) {
    chrome.tabs.update(tabs[0].id, { url: link });
    tabId = tabs[0].id;
    chrome.tabs.onUpdated.addListener(function(tabId, info) {
        if (info.status === 'complete') {
            chrome.tabs.query({ status: "complete" }, function(tabs) {
                try {
                    chrome.tabs.executeScript(
                        tabs[0].id, { code: 'if(document.getElementById("add-to-cart-button")){document.getElementById("add-to-cart-button").click()};' });
                    flag = 1;
                } catch (err) {}

            });
        }
    });
}

var flag = 0;

document.addEventListener('DOMContentLoaded', function() {
    var saveButton = document.getElementById('go');
    saveButton.addEventListener('click', function() {
        var choiceElement = document.getElementById('choice');
        var selectedValue = choiceElement.options[choiceElement.selectedIndex].value;
        if (selectedValue == '1') {
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                loadPage(tabs, "https://www.amazon.in/Everycom-Silver-Lightweight-Tripod-Phone/dp/B077KYPP5Q/ref=sr_1_2_sspa?s=electronics&ie=UTF8&qid=1526034701&sr=1-2-spons&keywords=phone+tripod&psc=1");
            });
        } else if (selectedValue == '2') {
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                loadPage(tabs, "https://www.amazon.in/Everycom-Silver-Lightweight-Tripod-Phone/dp/B077KYPP5Q/ref=sr_1_2_sspa?s=electronics&ie=UTF8&qid=1526034701&sr=1-2-spons&keywords=phone+tripod&psc=1");
            });
        } else if (selectedValue == '3') {
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                loadPage(tabs, "https://www.amazon.in/Everycom-Silver-Lightweight-Tripod-Phone/dp/B077KYPP5Q/ref=sr_1_2_sspa?s=electronics&ie=UTF8&qid=1526034701&sr=1-2-spons&keywords=phone+tripod&psc=1");
            });
        }
    }, false);
}, false);