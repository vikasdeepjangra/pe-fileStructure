async function btnPressed(){
  const response = await fetch("http://localhost:3000/ListOfFiles");
  const data = await response.json();
  console.log(data.message);
}