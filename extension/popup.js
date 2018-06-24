function initForm() {
  chrome.storage.local.get(['openInSameTab'], function(items) {
    var checkbox = document.getElementById('openInSameTab');
    if ('openInSameTab' in items) {
      checkbox.checked = items.openInSameTab == 'yes' ? true : false;
    } else {
      checkbox.checked = true;
    }
  });
}

initForm();

document.getElementById('saveOptions').onclick = function() {
  var checkbox = document.getElementById('openInSameTab');
  chrome.storage.local.set({'openInSameTab': checkbox.checked ? 'yes' : 'no'}, function (result) {});
  window.close();
}
