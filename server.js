//IMPORTS
const express = require("express");
const app = express();
const path = require("path");
const fs = require('fs/promises');
const { spawn } = require('child_process');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// CONSTANTS //
const bashPath = 'C:/Program Files/Git/bin/bash.exe';
const unzipscriptPath = 'shell-scripts/tar-unzip.sh';
const tempFolderPath = 'tempFolder';
const deletescriptPath = 'shell-scripts/delete-unzipped.sh';

//FUNCTIONS
async function unzipTarFunction(...args){
  return new Promise((resolve, reject) => {
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
        resolve(response);
      } else {
        console.error(`child process exited with code ${code}`);
        console.error(`child process stderr:\n${errorData}`);
        reject(`Internal server error: ${errorData}`);
      }
    });
  });
}

async function getDirectoryDetails(directoryPath, projectName) {
  try {
    const stats = await fs.stat(directoryPath);
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

async function unzipTarFunction(...args){
  return new Promise((resolve, reject) => {
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
        resolve(response);
      } else {
        console.error(`child process exited with code ${code}`);
        console.error(`child process stderr:\n${errorData}`);
        reject(`Internal server error: ${errorData}`);
      }
    });
  });
}

async function deleteUnzipped(...deleteArgs){
  return new Promise((resolve, reject) => {
    const childProcess = spawn(bashPath, [deletescriptPath, ...deleteArgs]);
    const responseData = [];
      let errorData = '';

      childProcess.stdout.on('data', (data) => {
        const trimmedData = data.toString().trim() + '\n';
        responseData.push(trimmedData);
      });

      childProcess.stderr.on('data', (data) => {
        errorData += data.toString();
      });

      childProcess.on('close', (code) => {
        if (code === 0) {
          const response = responseData.join('\n');
          resolve(response);
        } else {
          console.error(`child process exited with code: ${code}`);
          console.error(`child process stderr:\n${errorData}`);
          reject(`An error occurred: ${errorData}`);
        }
      });
  })
}

async function problemIDExists(directoryPath) {
  try {
    await fs.access(directoryPath, fs.constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
}

//APIs
app.post("/getDirectoryDetailsAll", async (req, res) => {
  try {
    const { projectID, projectName } = req.body;
    let directoryPath = path.join('efs-mount-point/workspaces', projectID);
    const problemIDExistsRes = await problemIDExists(directoryPath);

    if(!problemIDExistsRes){
      res.status(404).json({ message: "Problem ID Directory Doesn't Exist." });
    } else{
      directoryPath = path.join(directoryPath, projectName+'.tar');
      // Await unzip process completion
      const args = [directoryPath, tempFolderPath];
      const unzipRes = await unzipTarFunction(...args);
      console.log(JSON.stringify(unzipRes.toString()) + '\n');
      
      // Get directory details
      const directoryPathToGetDetails = path.join("tempFolder", projectName);
      const directoryDetails = await getDirectoryDetails(directoryPathToGetDetails, projectName);

      // Delete Temp Folder
      const deleteArgs = [tempFolderPath, projectName];
      const deleteUnzippedRes = await deleteUnzipped(...deleteArgs);
      console.log(JSON.stringify(deleteUnzippedRes.toString()));

      res.send(directoryDetails);
    }
  } catch (error) {
    console.error(error)
    res.status(500).send(`Internal server error: ${error}`);
  }
});

//FRONTEND RUNNER
const frontendPath = path.join(__dirname, "frontend");
app.use(express.static(frontendPath));

app.get("/", (req, res) => {
  app.use(express.static(frontendPath));
  res.send("success");
});

app.listen(3000);

/* 
problemID and projectName form Frontend.
  Done - 1. Frontend should be sending problem and project id/name in req body. (get req - req body won't work - only query or path).
    
  Pending - 2. handle error 
    maybe problem id is not there.
    maybe Project name .js .cpp doesn't exist.
*/