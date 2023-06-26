async function btnPressed(){
  var directoryData = await fetch("http://localhost:3000/directoryDetails");
  var directoryDataRes = await directoryData.json();
  console.log(JSON.stringify(directoryDataRes));
}