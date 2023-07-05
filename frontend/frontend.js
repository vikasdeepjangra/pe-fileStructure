const projectID = "195e6896-14c6-11ee-be56-0242ac120002"; //195e6896-14c6-11ee-be56-0242ac120002
const projectName = "PE_23Jun";

const projectInfo = { 
  projectID: projectID , 
  projectName: projectName 
};

const directoryToAddWithPath = {
  projectID: projectID , 
  projectName: projectName, 
  addType: "directory",
  addHerePath: "exampleFolder"
}

const fileToAddWithPath = {
  projectID: projectID , 
  projectName: projectName,
  addType: "file",
  addHerePath: "test.js"
}

async function getDirectoryDetailsAll(){
  let getDirectoryDetails = await fetch("http://localhost:3000/getDirectoryDetailsAll", { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(projectInfo),
  });
  let directoryDetailsData = await getDirectoryDetails.json();
  console.log(JSON.stringify(directoryDetailsData));
}


async function addDirectoryOrFile(){
  let addDirectoryFile = await fetch("http://localhost:3000/addDirectoryOrFile", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(directoryToAddWithPath)
  })
}