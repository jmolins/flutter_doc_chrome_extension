document.addEventListener('contextmenu', function(event)
{
  // Get the selected text
  var selection = window.getSelection().toString();
  if (selection.length) {
    selection = selection.trim();
  } else
    selection = null;

  // Get the word under the mouse (in case there is no selected text)
  var hovered = getWordAtPoint(event.clientX, event.clientY);

  // Basic check. Have we clicked a link? This culd be more convoluted
  elem = clickOrigin(event);
  var isLink = false;
  if (elem.tagType == 'a') {
    isLink = true;
  }

  chrome.runtime.sendMessage({'hovered': hovered, 'selection': selection, 'isLink': isLink}, function(response){});
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

function clickOrigin(event) {
  var target = event.target;
  var tag = [];
  tag.tagType = target.tagName.toLowerCase();
  tag.tagClass = target.className.split(' ');
  tag.id = target.id;
  tag.parent = target.parentNode;
  return tag;
}