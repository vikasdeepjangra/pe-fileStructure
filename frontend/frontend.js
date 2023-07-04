const projectID = "195e6896-14c6-11ee-be56-0242ac120002";
const projectName = "PE_23Jun";
const projectInfo = { 
  projectID: projectID , 
  projectName: projectName 
};

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