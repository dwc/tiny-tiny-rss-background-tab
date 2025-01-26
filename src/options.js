const browser = require('webextension-polyfill');

const defaults = {
    urlPatterns: [],
    shortcutKey: "V".charCodeAt(0),
    linkSelector: ".Selected .hlTitle .hlContent a, .Selected .cdmHeader a.title, #headlines-frame .active a.title"
}

async function restoreOptions() {
    let saved = await browser.storage.sync.get(Object.keys(defaults));

    let urlPatterns = saved["urlPatterns"] || defaults["urlPatterns"];
    if (urlPatterns instanceof Array) {
        for (let i = 0; i < urlPatterns.length; i++) {
            addUrlPatternOption(urlPatterns[i]);
        }
    }

    let shortcutKey = saved["shortcutKey"] || defaults["shortcutKey"];
    if (shortcutKey) {
        document.querySelector("#shortcutKey").value = String.fromCharCode(shortcutKey);
    }

    let linkSelector = saved["linkSelector"] || defaults["linkSelector"];
    if (linkSelector) {
        document.querySelector("#linkSelector").value = linkSelector;
    }
}

function saveOptions() {
    const options = {
        urlPatterns: getUrlPatterns(),
        shortcutKey: getShortcutKey(),
        linkSelector: getLinkSelector()
    };

    browser.storage.sync.set(options).then(() => {
        showMessage("Settings saved!");
    });
}

function removeUrlPattern() {
    const urlPatterns = document.querySelector("#urlPatterns");

    while (urlPatterns.selectedIndex >= 0) {
        urlPatterns.remove(urlPatterns.selectedIndex);
    }
};

function addUrlPattern() {
    const urlPattern = document.querySelector("#urlPattern").value;
    addUrlPatternOption(urlPattern);
}

function addUrlPatternOption(urlPattern) {
    const opt = document.createElement("option");
    opt.value = urlPattern;
    opt.text = urlPattern;

    document.querySelector("#urlPatterns").add(opt);
}

function getUrlPatterns() {
    const urlPatternOptions = document.querySelector("#urlPatterns").options;

    const urlPatterns = [];
    for (let i = 0; i < urlPatternOptions.length; i++) {
        urlPatterns.push(urlPatternOptions[i].value);
    }

    return urlPatterns;
}

function getShortcutKey() {
    const shortcutKeyChar = document.querySelector("#shortcutKey").value;

    let shortcutKey;
    if (shortcutKeyChar) {
        shortcutKey = shortcutKeyChar.charCodeAt(0);
    }

    return shortcutKey;
}

function getLinkSelector() {
    const linkSelector = document.querySelector("#linkSelector").value;

    return linkSelector;
}

function showMessage(text) {
    const status = document.querySelector("#status");
    status.style.display = "block";

    while (status.firstChild) {
        status.removeChild(status.firstChild);
    }

    const p = document.createElement("p");
    p.appendChild(document.createTextNode(text));
    status.appendChild(p);

    setTimeout(hideMessage, 5000);
}

function hideMessage() {
    const status = document.querySelector("#status");
    status.style.display = "none";
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("#urlPatterns-remove").addEventListener("click", removeUrlPattern);
document.querySelector("#urlPatterns-add").addEventListener("click", addUrlPattern);
document.querySelector("#save").addEventListener("click", saveOptions);
