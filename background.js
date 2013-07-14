chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (/cloud|appspot|google/.test(tab.url)) {
        chrome.pageAction.show(tabId);
    }
});

chrome.pageAction.onClicked.addListener(function(tab) {
    chrome.tabs.getSelected(null, function(tab) { // send to current selected tab
        chrome.tabs.sendMessage(tab.id, {}, function(response) {
            chrome.pageAction.setTitle({tabId: tab.id, title: 'hilighty ' + response.result});
            chrome.pageAction.setIcon({tabId: tab.id, path: 'icon_' + response.result + '.png'});
        });
    });
});

