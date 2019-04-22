
function getRandomToken() {
  // E.g. 8 * 32 = 256 bits token
  var randomPool = new Uint8Array(32);
  crypto.getRandomValues(randomPool);
  var hex = '';
  for (var i = 0; i < randomPool.length; ++i) {
      hex += randomPool[i].toString(16);
  }
  // E.g. db18458e2782b2b77e36769c569e263a53885a9944dd0a861e5064eac16f1a
  return hex;
}

var HOST = "turdium.ognjen.io";

var g_user_id = null;
var current_state = "";
var current_url = "";

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.get("user_id", function(items) {
    var userid = items.userid;
    if (!userid) {
        userid = getRandomToken();
        chrome.storage.sync.set({userid: userid}, function() {
          g_user_id = userid;
        });
    } else {g_user_id = userid;}
  });
});


function getStatus() {
  var current_url = "";
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    current_url = tabs[0].url;
    chrome.browserAction.setBadgeText({text: ""});
    axios.post('http://' + HOST + '/links', {link: {url: current_url, user_id: g_user_id}})
    .then(function (response) {
      chrome.browserAction.setBadgeText({text: response.data.count.toString()});
      if (response.data.current_user){
        current_state = "active";
        chrome.browserAction.setIcon({path: 'icon-active.svg'});
      } else {
        current_state = "inactive";
        chrome.browserAction.setIcon({path: 'icon-inactive.svg'});
      }
    })
  });
};

getStatus();
chrome.tabs.onActivated.addListener(getStatus);
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status == "complete"){
    getStatus();
  }
});

function callToggle(){
  var current_url = "";
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    current_url = tabs[0].url;
    axios.post('http://' + HOST + '/links/toggle', {url: current_url, user_id: g_user_id})
    .then(function (response) {
      chrome.browserAction.setBadgeText({text: response.data.count.toString()});
      if (response.data.current_user){
        current_state = "active";
        chrome.browserAction.setIcon({path: 'icon-active.svg'});
      } else {
        current_state = "inactive";
        chrome.browserAction.setIcon({path: 'icon-inactive.svg'});
      }
    })
  });
}

chrome.browserAction.onClicked.addListener(callToggle);