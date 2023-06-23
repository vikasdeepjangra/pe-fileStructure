//IMPORTS
const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const fs = require('fs');

// CONSTANTS, VARIABLES //
const directoryPath = 'Src';
const frontendPath = (path.join(__dirname, "frontend"));
app.use(express.static(frontendPath));
var directoryData = [];

//FUNCTION
async function fillDirectoryData(directoryData){
    return new Promise((resolve, reject) => {
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                reject(`Error reading directory: ${err}`);
            }
    
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
                        ...(isFolder && { files: [] })
                    })
                });
            });
        });

        resolve("Success");
    })
}


// APIs //
app.get('/', (req, res) => {
    app.use(express.static(frontendPath));
})

app.get('/ListOfFiles', async (req, res) => {
    try{
        var res = await fillDirectoryData(directoryData);
        console.log(directoryData);
    }catch (error) {
        console.error(error);
        res.status(500).send(`Internal server error: ${error}`);
    }
});

app.listen(3000);