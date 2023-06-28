//IMPORTS
const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const fs = require('fs/promises');
const { spawn, exec } = require('child_process');
const { error } = require("console");


//FRONTEND RUNNER
const frontendPath = path.join(__dirname, "frontend");
app.use(express.static(frontendPath));

// CONSTANTS, VARIABLES //
const projectID = "195e6896-14c6-11ee-be56-0242ac120002";
const projectName = "PE_23Jun";
const directoryPath = path.join('efs-mount-point/workspaces', projectID, projectName+'.tar');
const bashPath = 'C:/Program Files/Git/bin/bash.exe';
const unzipscriptPath = 'shell-scripts/tar-unzip.sh';
const tempFolderPath = 'tempFolder';
const deletescriptPath = path.join(__dirname, '/shell-scripts/delete-unzipped.sh');

//FUNCTIONS
async function getDirectoryDetails(directoryPath) {
  try {
    const stats = await fs.lstat(directoryPath);
    const info = {
      name: path.basename(directoryPath)
    };

    if (stats.isDirectory()) {
      info.type = "folder";
      if (info.name === projectName || info.name === 'src') {
        const files = await fs.readdir(directoryPath);
        const childPromises = files.map(async (child) => {
          const childPath = path.join(directoryPath, child);
          const childInfo = await getDirectoryDetails(childPath);
          return childInfo;
        });
        const childInfos = await Promise.all(childPromises);
        info.files = childInfos;
      }
    } else {
      info.type = "file";
    }

    return info;
  } catch (err) {
    throw new Error(`Error getting details for directory ${directoryPath}: ${err}`);
  }
}

// APIs //
app.get("/", (req, res) => {
  app.use(express.static(frontendPath));
  res.send("success");
});

app.get("/unzipTar", (req, res) => {
  const args = [directoryPath, tempFolderPath];
  const childProcess = spawn(bashPath, [unzipscriptPath, ...args]);

  const responseData = [];
  let errorData = '';

  childProcess.stdout.on('data', (data) => {
    const trimmedData = data.toString().trim();
    responseData.push(trimmedData);
  });

  childProcess.stderr.on('data', (data) => {
    errorData += data.toString();
  });

  childProcess.on('close', (code) => {
    if (code === 0) {
      const response = responseData.join('\n');
      res.send(response);
    } else {
      console.error(`child process exited with code ${code}`);
      console.error(`child process stderr:\n${errorData}`);
      res.status(500).send(`Internal server error: ${errorData}`);
    }
  });
});

app.get("/directoryDetails", async (req, res) => {
  try {
    const directoryPath = path.join("tempFolder", projectName);
    let directoryDetailsRes = await getDirectoryDetails(directoryPath);
    res.send(directoryDetailsRes);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Internal server error: ${error}`);
  }
});

app.get("/deleteUnzippedtar", async (req, res) => {
    const args = [tempFolderPath, projectName];
    const childProcess = spawn(bashPath, [deletescriptPath, ...args]);

    const responseData = [];
    let errorData = '';

    childProcess.stdout.on('data', (data) => {
      const trimmedData = data.toString().trim();
      responseData.push(trimmedData);
    });

    childProcess.stderr.on('data', (data) => {
      errorData += data.toString();
    });

    childProcess.on('close', (code) => {
      if (code === 0) {
        const response = responseData.join('\n');
        res.send(response);
      } else {
        console.error(`child process exited with code: ${code}`);
        console.error(`child process stderr:\n${errorData}`);
        res.status(500).send(`An error occurred: ${errorData}`);
      }
    });
})


app.listen(3000);
