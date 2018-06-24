var hovered;
var selection;

var targetTabId;
  
function init() {
  hovered = null;
  selection = null;
}

function onClickHovered(info, tab) {
  if (hovered) {
		openFlutterDocs(hovered, tab);
  }
}

function onClickSelected(info, tab) {
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

  if (targetTabId) {
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
}

init();

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  hovered = message.hovered;
  selection = message.selection;
});

chrome.contextMenus.create({"title": "Search in docs.flutter.io", "onclick": onClickHovered});
chrome.contextMenus.create({"title": "Search in docs.flutter.io", "contexts":["selection"], "onclick": onClickSelected});
chrome.contextMenus.create({"title": "Search in docs.flutter.io", "contexts":["link"], "onclick": onClickHovered});