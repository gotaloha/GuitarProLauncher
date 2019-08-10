/********************************************************************************
 * Guitar Pro File Importer Utility
 ********************************************************************************
 * This utility will parse through all files in a directory and will construct
 * a json file containing all of the files broken into Artist Name, Song Title,
 * and File Name for each song.
 * This allows the user to import their own files to include in the program.
 * 
 * To Use:
 * 1. Open a Terminal or console window
 * 2. Type: node add.js
 * 3. Start the Guitar Pro Launcher app
 * 4. Profit!
 ********************************************************************************/

const path = require('path');
const fs = require('fs');
 
const directoryPath = path.join(__dirname, 'tabs');

function splitSong(file) {
  var splitFile;

  if (file) {
    splitFile = file.split(".");
    splitFile = splitFile[0].replace(/_/g, " ");
  }

  return splitFile;
}

fs.readdir(directoryPath, function(err, files) {
  if (err) {
    console.error('Error getting directory information.');
  } else {
    var data = [];
    var colorWhite = "\033[0m";
    var colorGreen = "\033[32m";
    var checkmark = " \u2714  ";
    var block = "\u2593 ";
    var line = "\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593";
 
    console.log("");
    console.log(line);
    console.log(block);
    console.log(block + " Importing new Guitar Pro songs");
    console.log(block);
    console.log(line);
    console.log(block);
 
    files.forEach(function(file) {
      var fileArray = file.split("-", 2);
      //var song = fileArray[1];
      var artist = fileArray[0].replace(/_/g, " ");

      // var test = song.replace(/_/g, "");

      var song = splitSong(fileArray[1]);
 
      var obj = {
        artist: artist,
        title: song,
        filename: file
      };

      // Check for invalid file name - ignore if in array
      // Add additional names if needed, comma separated
      var invalidArray = [".DS Store", "ADD HERE"];
      var invalidFiles = invalidArray.includes(artist);

      if (!invalidFiles) {
        data.push(obj);
        console.log(block + colorGreen + checkmark + colorWhite + song + colorGreen + ' from ' + colorWhite + artist);
      }
    });
 
    fs.writeFile("./db.json", JSON.stringify(data, null, 4), (err) => {
      if (err) {
          console.error(err);
          return;
      };
 
      console.log(block);
      console.log(line);
      console.log(block);
      console.log(block + colorGreen + 'songs.json ' + colorWhite + 'file has been created!');
      console.log(block);
      console.log(line);
      console.log("");
    });
  }
});
