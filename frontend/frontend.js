async function btnPressed(){
  let directoryData = await fetch("http://localhost:3000/directoryDetails");
  let directoryDataRes = await directoryData.json();
  console.log(JSON.stringify(directoryDataRes));
}