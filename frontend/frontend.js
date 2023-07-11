const projectId = "195e6896-14c6-11ee-be56-0242ac120002"; //195e6896-14c6-11ee-be56-0242ac120002
const projectName = "PE_23Jun";

const projectInfo = { 
  projectId: projectId, 
  projectName: projectName 
};

const directoryToAddWithPath = {
  projectId: projectId, 
  projectName: projectName, 
  type: "directory",
  addPath: "level/lev"
}

const fileToAddWithPath = {
  projectId: projectId, 
  projectName: projectName,
  type: "file",
  addPath: "src/test.cpp"
}

const directoryToDeleteWithPath = {
  projectId: projectId, 
  projectName: projectName, 
  type: "directory",
  deletePath: "level/lev"
}

const fileToDeleteWithPath = {
  projectId: projectId, 
  projectName: projectName,
  type: "file",
  deletePath: "src/test.cpp"
}

async function getDirectoryDetailsAll(){
  let getDirectoryDetails = await fetch(`http://localhost:3000/directory-details?projectId=${projectId}&projectName=${projectName}`, { 
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
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
    body: JSON.stringify(fileToAddWithPath)
  }).catch(err =>{
    console.log(err);
  })

  let addDirectoryFileRes = await addDirectoryFile.json();
  console.log(JSON.stringify(addDirectoryFileRes));
}

async function deleteDirectoryOrFile(){
  let deleteDirectoryFile = await fetch("http://localhost:3000/deleteDirectoryOrFile", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(fileToDeleteWithPath)
  }).catch(err =>{
    console.log(err);
  })

  let deleteDirectoryFileRes = await deleteDirectoryFile.json();
  console.log(JSON.stringify(deleteDirectoryFileRes));
}

async function deleteDirectoryOrFile(){
  let deleteDirectoryFile = await fetch("http://localhost:3000/writeToFile", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(fileToEditWithPath)
  }).catch(err =>{
    console.log(err);
  })

  let deleteDirectoryFileRes = await deleteDirectoryFile.json();
  console.log(JSON.stringify(deleteDirectoryFileRes));
}