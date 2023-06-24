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
var directoryData = [];

//FUNCTION
async function fillDirectoryData() {
  return new Promise((resolve, reject) => {
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        reject(`Error reading directory: ${err}`);
      }
      let counter = files.length;
      files.forEach((file) => {
        const filePath = path.join(directoryPath, file);

        fs.stat(filePath, (err, stats) => {
          if (err) {
            reject(`Error getting stats for file ${filePath}: ${err}`);
          }

          const isFolder = !stats.isFile();
          directoryData.push({
            name: file,
            type: isFolder ? "true" : "false",
            ...(isFolder && { files: [] }),
          });

          counter--;
          if (counter === 0) {
            resolve("Success");
          }

        });
      });
    });
  });
}

// APIs //
app.get("/", (req, res) => {
  app.use(express.static(frontendPath));
  res.send("success");
});

app.get("/ListOfFiles", async (req, res) => {
  try {
    directoryData = [];
    var result = await fillDirectoryData();
    console.log(directoryData)
    res.send(directoryData)
  } catch (error) {
    console.error(error);
    res.send(`Internal server error: ${error}`);
  }
});

app.listen(3000);
