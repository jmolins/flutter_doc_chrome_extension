var hovered;
var selection;
var isLink;

var targetTabId;
  
function init() {
  hovered = null;
	selection = null;
	isLink = false;
}

function onClickHovered(info, tab) {
  if (hovered) {
		openFlutterDocs(hovered, tab);
  }
}

function onClickSelected(info, tab) {
	// If it is a link we force using the hovered word
	if (isLink && hovered) {
		openFlutterDocs(hovered, tab);
	}
  if (selection) {
	  if (/\s/.test(selection)) {
	    alert("The search works just for single words. No spaces allowed.");
	    return;
		}
		openFlutterDocs(selection, tab);
  }
}

function openFlutterDocs(search_string, tab) {

	chrome.storage.local.set({'search_string': search_string}, function (result) {});

	var url = "https://docs.flutter.io/?search=" + search_string;
	
  // reset string for next search
	init();

	chrome.storage.local.get(['openInSameTab'], function(items) {
		
		// By default true (when 'openInSameTab' is no in the storage)
		var openInSameTab = items.openInSameTab == 'no' ? false : true;

		if (openInSameTab && targetTabId) {
			chrome.tabs.get(targetTabId, function (existingTab) {
				if (existingTab) {
					chrome.tabs.update(targetTabId, {url: url, active: true});
				} else {
					chrome.tabs.create({ url: url, index: targetTabId} );
				}
			});
		}
		else {
			chrome.tabs.create({ url: url, index: tab.index + 1}, function (newTab) {targetTabId = newTab.id;});
		}
  });
}

init();

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  hovered = message.hovered;
	selection = message.selection;
	isLink = message.isLink;
});

chrome.contextMenus.create({"title": "Search in docs.flutter.io", "onclick": onClickHovered});
chrome.contextMenus.create({"title": "Search in docs.flutter.io", "contexts":["selection"], "onclick": onClickSelected});
// Disable link context in Mac. When right clicking on a link, the link is automatically selected so we end up
// with two menu items. The selection one can not be removed so we remove this one.
if (navigator.appVersion.indexOf('Mac') == -1) {
  chrome.contextMenus.create({"title": "Search in docs.flutter.io", "contexts":["link"], "onclick": onClickHovered});
}