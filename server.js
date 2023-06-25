//IMPORTS
const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const fs = require("fs");

// CONSTANTS, VARIABLES //
const directoryPath = "PE_23Jun";
const frontendPath = path.join(__dirname, "frontend");
app.use(express.static(frontendPath));

//FUNCTIONS
function dirTree(directoryPath) {
  var stats = fs.lstatSync(directoryPath),
      info = {
          name: path.basename(directoryPath)
      };

  if (stats.isDirectory() ) {
      info.type = "folder";
      if((path.basename(directoryPath) == directoryPath || path.basename(directoryPath) == 'src')){
        info.files = fs.readdirSync(directoryPath).map(function(child) {
            return dirTree(directoryPath + '/' + child);
        });
      }
  } else {
      info.type = "file";
  }

  return info;
}

// APIs //
app.get("/", (req, res) => {
  app.use(express.static(frontendPath));
  res.send("success");
});

app.get("/ListOfFiles", (req, res) => {
  try {
    var x = dirTree(directoryPath);
    res.send(x)
  } catch (error) {
    console.error(error);
    res.send(`Internal server error: ${error}`);
  }
});

app.listen(3000);
