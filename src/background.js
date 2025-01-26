const browser = require('webextension-polyfill');

browser.runtime.onMessage.addListener((msg) => {
    browser.tabs.create({
        url: msg.url,
        active: false
    });
});
