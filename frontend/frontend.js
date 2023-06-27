async function btnPressed(){
  let directoryData = await fetch("http://localhost:3000/directoryDetails");
  let directoryDataRes = await directoryData.json();
  console.log(JSON.stringify(directoryDataRes));
}

async function unzipTarLocally(){
  let unzipTar = await fetch("http://localhost:3000/unzipTar");
  let unzipTarRes = await unzipTar.text();
  console.log(unzipTarRes);
}