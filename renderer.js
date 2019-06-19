const {shell} = require('electron');
const path = require('path');
const {remote} = require('electron')
require('popper.js');
require('bootstrap');

function buildPage(search) {
  let ajaxRequest = new XMLHttpRequest();
  ajaxRequest.onreadystatechange = function() {
    if(ajaxRequest.readyState == 4) {
      if(ajaxRequest.status == 200) {
        let dataObject = JSON.parse(ajaxRequest.responseText);
        let count = 0;
        let listItem;
        $('#songlist tr').remove();
        if(search) {
          let filteredRes = getObjects(dataObject,'artist',search);
          filteredRes.forEach(buildNewList);
        } else {
          dataObject.forEach(buildNewList);
        }

        function buildNewList(item, index) {
          if (count === 0) {
            listItem = $('<tr><th>Artist Name</th><th>Song Title</th><th>Rating</th></tr><tr><td><a href="#" class="artist">' + item.artist + '</a></td><td><a href="#" class="opener" data-tab="' + item.filename + '">' + item.title + '</a></td><td>' + item.rating + '</td></tr>');
            count++;
          } else {
            listItem = $('<tr><td><a href="#" class="artist">' + item.artist + '</a></td><td><a href="#" class="opener" data-tab="' + item.filename + '">' + item.title + '</a></td><td>' + item.rating + '</td></tr>');
          }
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
  $('.artist').each(function(i, obj) {
    $(this).on('click', function(e) {
      buildPage($(this).text());
      e.stopPropagation();
    });
  });
  $('.opener').each(function(i, obj) {
    $(this).on('click', function(e) {
      openTab($(this).attr('data-tab'));
      e.stopPropagation();
    });
  });
}

function search() {
  let search = $('#searchInput').val();
  buildPage(search);
}

$(function() {
  $('#searchBtn').on('click', function(e) {
    search();
  });
  $('#searchInput').on('keyup', function(e) {
    console.log(e);
    if (e.keyCode == 13) {
      search();
    } 
  });
});

// Returns an array of objects according to key, value, or key and value matching
function getObjects(obj, key, val) {
  let objects = [];
  for (let i in obj) {
    if (!obj.hasOwnProperty(i)) continue;
    if (typeof obj[i] == 'object') {
      objects = objects.concat(getObjects(obj[i], key, val));    
    } else 
    // If key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
    if (i == key && obj[i] == val || i == key && val == '') { //
      objects.push(obj);
    } else if (obj[i] == val && key == ''){
      // Only add if the object is not already in the array
      if (objects.lastIndexOf(obj) == -1){
        objects.push(obj);
      }
    }
  }
  return objects;
}

// Returns an array of values that match on a certain key
function getValues(obj, key) {
  let objects = [];
  for (let i in obj) {
    if (!obj.hasOwnProperty(i)) continue;
    if (typeof obj[i] == 'object') {
      objects = objects.concat(getValues(obj[i], key));
    } else if (i == key) {
      objects.push(obj[i]);
    }
  }
  return objects;
}

// Returns an array of keys that match on a certain value
function getKeys(obj, val) {
  let objects = [];
  for (let i in obj) {
    if (!obj.hasOwnProperty(i)) continue;
    if (typeof obj[i] == 'object') {
      objects = objects.concat(getKeys(obj[i], val));
    } else if (obj[i] == val) {
      objects.push(i);
    }
  }
  return objects;
}


window.onload = buildPage();