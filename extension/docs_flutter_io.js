window.onload = function () {
  chrome.storage.local.get(['search_string'], function(items) {
    var search_string = items.search_string;
    if (search_string) {
	  chrome.storage.local.set({'search_string': null}, function (result) {});
	  var search_box = document.getElementById('search-box');
      if (search_box) {
		search_box.focus();
		search_box.dispatchEvent(new MouseEvent('click'));
	    search_box.setAttribute("value", search_string);
	  }
    }
  });
}

