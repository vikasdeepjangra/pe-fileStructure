//IMPORTS
const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const fs = require("fs");
const { spawn, exec } = require('child_process');
const { error } = require("console");

//FRONTEND RUNNER
const frontendPath = path.join(__dirname, "frontend");
app.use(express.static(frontendPath));

// CONSTANTS, VARIABLES //
const projectID = "195e6896-14c6-11ee-be56-0242ac120002";
const projectName = "PE_23Jun";
const directoryPath = path.join(__dirname, '/efs-mount-point/workspaces', projectID, projectName+'.tar');
const bashPath = 'C:/Program Files/Git/bin/bash.exe';
const unzipscriptPath = path.join(__dirname, '/shell-scripts/tar-unzip.sh');
const tempFolderPath = path.join(__dirname, '/tempFolder')
const deletescriptPath = path.join(__dirname, '/shell-scripts/delete-unzipped.sh');

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
        //Only do recursive call if folder name is ProjectName or SRC;
        if (info.name === projectName || info.name === 'src') {
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

app.get("/unzipTar", (req, res) => {
  const args = [directoryPath, tempFolderPath]
  const childProcess = spawn('sh', [unzipscriptPath, ...args]);

  childProcess.stdout.on('data', (data) => {
    console.log(`child process stdout:\n${data}`);
  });

  childProcess.stderr.on('data', (data) => {
    console.error(`child process stderr:\n${data}`);
  });

  childProcess.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
})

app.get("/directoryDetails", async (req, res) => {
  try {
    const directoryPath = path.join(__dirname, "/tempFolder", projectName);
    let directoryDetailsRes = await getDirectoryDetails(directoryPath);
    res.send(directoryDetailsRes);
  } catch (error) {
    console.error(error);
    res.send(`Internal server error: ${error}`);
  }
});

app.get("/deleteUnzippedtar", async (req, res) => {
    const args = [tempFolderPath, projectName];
    const childProcess = spawn('sh', [deletescriptPath, ...args]);

    childProcess.stdout.on('data', (data) => {
      console.log(`child process stdout:\n${data}`);
    });
  
    childProcess.stderr.on('data', (data) => {
      console.error(`child process stderr:\n${data}`);
    });
  
    childProcess.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    });
})


app.listen(3000);
