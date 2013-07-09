var TTBgOptions = function() {
    var defaults = {
        urlPatterns: [],
        shortcutKey: "V".charCodeAt(0),
        linkSelector: ".Selected .hlTitle .hlContent a, .Selected .cdmHeader a.title"
    };

    this.restore = function() {
        chrome.storage.sync.get(Object.keys(defaults), function(saved) {
            var urlPatterns = saved["urlPatterns"] || defaults["urlPatterns"];
            if (urlPatterns instanceof Array) {
                for (var i = 0; i < urlPatterns.length; i++) {
                    addUrlPatternOption(urlPatterns[i]);
                }
            }

            var shortcutKey = saved["shortcutKey"] || defaults["shortcutKey"];
            if (shortcutKey) {
                document.querySelector("#shortcutKey").value = String.fromCharCode(shortcutKey);
            }

            var linkSelector = saved["linkSelector"] || defaults["linkSelector"];
            if (linkSelector) {
                document.querySelector("#linkSelector").value = linkSelector;
            }
        });
    };

    this.save = function() {
        var options = {
            urlPatterns: getUrlPatterns(),
            shortcutKey: getShortcutKey(),
            linkSelector: getLinkSelector()
        };

        chrome.storage.sync.set(options, function() {
            showMessage("Settings saved!");
        });
    };

    this.removeUrlPattern = function() {
        var urlPatterns = document.querySelector("#urlPatterns");

        while (urlPatterns.selectedIndex >= 0) {
            urlPatterns.remove(urlPatterns.selectedIndex);
        }
    };

    this.addUrlPattern = function() {
        var urlPattern = document.querySelector("#urlPattern").value;
        addUrlPatternOption(urlPattern);
    };

    var addUrlPatternOption = function(urlPattern) {
        var opt = document.createElement("option");
        opt.value = urlPattern;
        opt.text = urlPattern;

        document.querySelector("#urlPatterns").add(opt);
    };

    var getUrlPatterns = function() {
        var urlPatternOptions = document.querySelector("#urlPatterns").options;

        var urlPatterns = [];
        for (var i = 0; i < urlPatternOptions.length; i++) {
            urlPatterns.push(urlPatternOptions[i].value);
        }

        return urlPatterns;
    };

    var getShortcutKey = function() {
        var shortcutKeyChar = document.querySelector("#shortcutKey").value;

        var shortcutKey;
        if (shortcutKeyChar) {
            shortcutKey = shortcutKeyChar.charCodeAt(0);
        }

        return shortcutKey;
    };

    var getLinkSelector = function() {
        var linkSelector = document.querySelector("#linkSelector").value;

        return linkSelector;
    };

    var showMessage = function(text) {
        var status = document.querySelector("#status");
        status.style.display = "block";

        while (status.firstChild) {
            status.removeChild(status.firstChild);
        }

        var p = document.createElement("p");
        p.appendChild(document.createTextNode(text));
        status.appendChild(p);

        setTimeout(hideMessage, 5000);
    };

    var hideMessage = function() {
        var status = document.querySelector("#status");
        status.style.display = "none";
    };
};

var ttBgOptions = new TTBgOptions();
document.addEventListener("DOMContentLoaded", ttBgOptions.restore);

document.querySelector("#urlPatterns-remove").addEventListener("click", ttBgOptions.removeUrlPattern);
document.querySelector("#urlPatterns-add").addEventListener("click", ttBgOptions.addUrlPattern);

document.querySelector("#save").addEventListener("click", ttBgOptions.save);
