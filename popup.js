'use strict';

document.addEventListener('DOMContentLoaded', function () {
  var bg = chrome.extension.getBackgroundPage();
  bg.toggleIcon();
  document.getElementById("content").innerHTML = bg.current_url;

  axios.post('http://localhost:3210/links', {url: bg.current_url, user_id: bg.g_user_id})
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .then(function () {
    // always executed
  });

});