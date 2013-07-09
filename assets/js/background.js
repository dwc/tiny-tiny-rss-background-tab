chrome.extension.onMessage.addListener(
    function(msg) {
        chrome.tabs.create({
            url: msg.url,
            active: false
        });
    }
);
