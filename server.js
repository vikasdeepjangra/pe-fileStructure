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
async function getDirectoryDetails(directoryPath) {
  return new Promise((resolve, reject) => {
    fs.lstat(directoryPath, (err, stats) => {

      if (err) {
        reject(`Error getting stats for file ${directoryPath}: ${err}`);
        return;
      }

      const info = {
        name: path.basename(directoryPath)
      };

      if (stats.isDirectory()) {
        info.type = "folder";
        if ((path.basename(directoryPath) == directoryPath || path.basename(directoryPath) == 'src')) {

          fs.readdir(directoryPath, async (err, files) => {
            if (err) {
              reject(`Error reading directory ${directoryPath}: ${err}`);
              return;
            }

            const promises = files.map(async (child) => {
              const childPath = path.join(directoryPath, child);
              const childInfo = await getDirectoryDetails(childPath);
              return childInfo;
            });

            Promise.all(promises).then((childInfos) => {
              info.files = childInfos;
              resolve(info);
            }, reject);
          });
        } else {
          resolve(info);
        }
      } else {
        info.type = "file";
        resolve(info);
      }
    });
  });
}

// APIs //
app.get("/", (req, res) => {
  app.use(express.static(frontendPath));
  res.send("success");
});

app.get("/directoryDetails", async (req, res) => {
  try {
    let directoryDetailsRes = await getDirectoryDetails(directoryPath);
    res.send(directoryDetailsRes);
  } catch (error) {
    console.error(error);
    res.send(`Internal server error: ${error}`);
  }
});

app.listen(3000);
