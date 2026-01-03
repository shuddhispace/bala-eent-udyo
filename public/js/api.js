const API = "http://localhost:5000/api";

async function getData(url){
  const res = await fetch(API + url);
  return res.json();
}
