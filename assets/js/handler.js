(function() {
    var Handler = function() {
        var options = {
            urlPatterns: [],
            shortcutKey: null,
            linkSelector: null
        };

        var window;
        var enabled = false;

        this.init = function(obj) {
            window = obj;

            var keys = Object.keys(options);

            chrome.storage.sync.get(keys, function(saved) {
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    if (saved[key]) {
                        options[key] = saved[key];
                    }
                }

                optionsLoaded();
            });
        };


        this.enabled = function() {
            return enabled;
        }

        var optionsLoaded = function() {
            if (options.urlPatterns.length > 0) {
                var r = new RegExp("^(" + options.urlPatterns.join("|") + ")", "i");
                if (r.test(window.location.href)) {
                    enabled = true;
                }
            }

            if (enabled) {
                window.addEventListener("keypress", handleKeypress, false);
            }
        };

        var handleKeypress = function(e) {
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
        handler.init(window);
    }
})();
