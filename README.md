# Tiny Tiny RSS Background Tab

## Purpose

When Google Reader first announced it was shutting down, I moved to [Tiny Tiny RSS](http://tt-rss.org/). In Tiny Tiny RSS, the standard action for opening links in a new tab also raises the tab, interrupting your consumption of the feeds.

This browser extension lets you configure a shortcut key to open items in a background tab. In conjunction with the [googlereaderkeys plugin](https://github.com/markwaters/ttrss-plugin-googlereaderkeys) plugin you can have a pretty efficient process for reading feeds.

## Installation

I have tested this extension in Google Chrome and Mozilla Firefox. You can install the extension from each browser's add-on website.

* Chrome: https://chromewebstore.google.com/detail/tiny-tiny-rss-open-in-bac/ogckdilemlmpgijdkfophmckcddaeeaa
* Firefox: https://addons.mozilla.org/en-US/firefox/addon/tt-rss-open-in-background-tab/

Note that the extension uses the [`sync` storage area](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/sync) to store settings. You must enable synchronization of "Extensions" in Chrome or "Add-ons" in Firefox to configure and use this extension.

## Credits

This extension is based off of [a similar one for Feedly](https://github.com/aaronsaray/feedlybackgroundtab).

Icons provided by:
* [Oxygen](http://www.oxygen-icons.org/?page_id=4), used under the [Creative Common Attribution-ShareAlike 3.0 License](http://creativecommons.org/licenses/by-sa/3.0/)
* [fox](http://madoka.volgo-balt.ru/~fox/tt_icons/), used under the same license as Tiny Tiny RSS
