const browser = require('webextension-polyfill');

const options = {
    urlPatterns: [],
    shortcutKey: null,
    linkSelector: null
};

let enabled = false;

function init() {
    const keys = Object.keys(options);

    browser.storage.sync.get(keys).then((saved) => {
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (saved[key]) {
                options[key] = saved[key];
            }
        }

        optionsLoaded();
    });
}

function optionsLoaded() {
    if (options.urlPatterns.length > 0) {
        const r = new RegExp("^(" + options.urlPatterns.join("|") + ")", "i");

        if (r.test(window.location.href)) {
            enabled = true;
        }
    }

    if (enabled) {
        window.addEventListener("keypress", handleKeypress, false);
    }
}

function handleKeypress(e) {
    const tag = e.target.tagName.toLowerCase();

    if (tag === 'input' || tag === 'textarea') {
        return;
    }

    if (e.altKey || e.ctrlKey) {
        return;
    }

    if (e.keyCode === options.shortcutKey) {
        const anchor = document.querySelector(options.linkSelector);

        if (anchor) {
            browser.runtime.sendMessage({ url: anchor.href });
        }
    }
}

init();