document.addEventListener('mouseup', function(event)
{
  var selection = window.getSelection().toString();

  if (selection.length) {
    selection = selection.trim();
  } else
	  selection = null;

  var hovered = getWordAtPoint(event.clientX, event.clientY);

  chrome.runtime.sendMessage({'hovered': hovered, 'selection': selection}, function(response){});
})

function getWordAtPoint(x, y) {
  var range = document.caretRangeFromPoint(x, y);

  if (range.startContainer.nodeType === Node.TEXT_NODE) {
	  // This is deprecated but works pretty well in chrome for the moment
    range.expand('word');
    return range.toString().trim();
  }
  return null;
}