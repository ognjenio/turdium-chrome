chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // listen for messages sent from background.js
    if (request.message === 'navigated' && document.title.indexOf(window.location.hostname) == -1) {
      title = document.title + " - " + window.location.hostname
      document.title = title
    }
});