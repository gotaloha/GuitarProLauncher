const {shell} = require('electron');
const path = require('path');
const {remote} = require('electron')
require('popper.js');
require('bootstrap');

//var artists = ["Pink Floyd", "Joe Satriani", "Ludwig von Beethoven"];

var artists = [];

function getArtists() {
  let ajaxRequest = new XMLHttpRequest();
  ajaxRequest.onreadystatechange = function() {
    if(ajaxRequest.readyState == 4) {
      if(ajaxRequest.status == 200) {
        let dataObject = JSON.parse(ajaxRequest.responseText);
        let filteredRes = getObjects(dataObject,'artist', '');
        
        filteredRes.forEach(buildArtistList);

        function buildArtistList(item, index) {
          artists.push(item.artist);
          console.log(artists);
        }
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

// Autocomplete
function autocomplete(inp, arr) {
  var currentFocus;

  inp.addEventListener('input', function(e) {
    var a, b, i, val = this.value;
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    if (!val) { return false; }
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement('DIV');
    a.setAttribute('id', this.id + 'autocomplete-list');
    a.setAttribute('class', 'autocomplete-items');
    /*append the DIV element as a child of the autocomplete container:*/
    this.parentNode.appendChild(a);
    /*for each item in the array...*/
    for (i = 0; i < arr.length; i++) {
      /*check if the item starts with the same letters as the text field value:*/
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        /*create a DIV element for each matching element:*/
        b = document.createElement('DIV');
        /*make the matching letters bold:*/
        b.innerHTML = '<strong>' + arr[i].substr(0, val.length) + '</strong>';
        b.innerHTML += arr[i].substr(val.length);
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML += '<input type="hidden" value="' + arr[i] + '">';
        /*execute a function when someone clicks on the item value (DIV element):*/
            b.addEventListener('click', function(e) {
            /*insert the value for the autocomplete text field:*/
            inp.value = this.getElementsByTagName('input')[0].value;
            /*close the list of autocompleted values,
            (or any other open lists of autocompleted values:*/
            closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener('keydown', function(e) {
      var x = document.getElementById(this.id + 'autocomplete-list');
      if (x) x = x.getElementsByTagName('div');
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add('autocomplete-active');
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove('autocomplete-active');
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName('autocomplete-items');
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}

  // Close the dropdown when clicked anywhere outside
  document.addEventListener('click', function (e) {
    closeAllLists(e.target);
  });
}

autocomplete(document.getElementById('searchInput'), artists);

function init() {
  getArtists();
  buildPage();
}

window.onload = init();