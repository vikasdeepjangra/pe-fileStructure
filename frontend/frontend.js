async function getDirectoryDetails(){
  let directoryData = await fetch("http://localhost:3000/directoryDetails");
  let directoryDataRes = await directoryData.json();
  console.log(JSON.stringify(directoryDataRes));
}

async function unzipTar(){
  let unzipTar = await fetch("http://localhost:3000/unzipTar");
  let unzipTarRes = await unzipTar.text();
  console.log(unzipTarRes);
}

async function deleteUnzipped(){
  let delUnzippedTar = await fetch("http://localhost:3000/deleteUnzippedtar");
  let delUnzippedTarRes = await delUnzippedTar.text();
  console.log(delUnzippedTarRes);
}