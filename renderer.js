const {shell} = require('electron');
const path = require('path');
const {remote} = require('electron')
require('popper.js');
require('bootstrap');

function buildPage() {
  var ajaxRequest = new XMLHttpRequest();
  ajaxRequest.onreadystatechange = function() {
    if(ajaxRequest.readyState == 4) {
      if(ajaxRequest.status == 200) {
        let dataObject = JSON.parse(ajaxRequest.responseText);
        let count = 0;
        let listItem;

        dataObject.forEach(buildNewList);

        function buildNewList(item, index) {
          console.log(count);
          if (count === 0) {
            listItem = $('<tr><th>Artist Name</th><th>Song Title</th><th>Rating</th></tr><tr><td>' + item.artist + '</td><td><a href="#" class="opener" data-tab="' + item.filename + '">' + item.title + '</a></td><td>' + item.rating + '</td></tr>');
            count++;
          } else {
            listItem = $('<tr><td>' + item.artist + '</td><td><a href="#" class="opener" data-tab="' + item.filename + '">' + item.title + '</a></td><td>' + item.rating + '</td></tr>');}
          $('#songlist').append(listItem);
        }

        buildLinks();
      } else {
        console.log("Status error: " + ajaxRequest.status);
      }
    } else {
      //console.log("Ignored readyState: " + ajaxRequest.readyState);
    }
  }
  ajaxRequest.open('GET', './db.json');
  ajaxRequest.send();
}

function openTab(tab) {
  shell.openItem(remote.app.getAppPath() + '/tabs/' + tab);
}

function buildLinks() {
  $('.opener').each(function(i, obj) {
    $(this).on('click', function(e) {
      openTab($(this).attr('data-tab'));
      e.stopPropagation();
    });
  });
}

window.onload = buildPage;