async function getDirectoryDetailsAll(){
  let getDirectoryDetails = await fetch("http://localhost:3000/getDirectoryDetailsAll");
  let directoryDetailsData = await getDirectoryDetails.json();
  console.log(JSON.stringify(directoryDetailsData));
}