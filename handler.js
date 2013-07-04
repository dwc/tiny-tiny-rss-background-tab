(function() {
    var Handler = function() {
        var options = {
            urlPatterns: [ "http://feeds.danieltwc.com" ],
            shortcutKey: "V".charCodeAt(0),
            linkSelector: ".Selected .hlTitle .hlContent a"
        };

        this.init = function() {
            var keys = Object.keys(options);

            chrome.storage.sync.get(keys, function(saved) {
                for (var key in keys) {
                    if (saved[key]) {
                        options[key] = saved[key];
                    }
                }
            });

            console.log("options", options);
        };

        this.enabled = function() {
            var enabled = false;

            if (options.urlPatterns.length > 0) {
                var r = new RegExp("^(" + options.urlPatterns.join("|") + ")", "i");
                if (r.test(window.location.href)) {
                    enabled = true;
                }
            }

            return enabled;
        }

        this.handleKeypress = function(e) {
            var tag = e.target.tagName.toLowerCase();

            if (tag === 'input' || tag === 'textarea') {
                return;
            }

            if (e.altKey || e.ctrlKey) {
                return;
            }

            if (e.keyCode === options.shortcutKey) {
                var a = document.querySelector(options.linkSelector);

                if (a) {
                    chrome.extension.sendMessage({ url: a.href });
                }
            }
        };
    }

    if (window === top) {
        var handler = new Handler();
        handler.init();

        if (handler.enabled()) {
            window.addEventListener("keypress", handler.handleKeypress, false);
        }
    }
})();
