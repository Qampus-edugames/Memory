let pairs = [];

let cards, first, second, lock, attempts, matchedPairs;

/* 🔗 hoofdstuk via URL (?h=h1.csv) */
function getChapterFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("h");
}

/* 📊 CSV laden */
async function loadData() {

  let file = document.getElementById("hoofdstukSelect").value;

  const urlChapter = getChapterFromURL();
  if (urlChapter) {
    file = "data/" + urlChapter;
    document.getElementById("hoofdstukSelect").value = file;
  }

  const response = await fetch(file);
  const text = await response.text();

  pairs = text.split("\n").slice(1).map(line => {
    const [begrip, uitleg] = line.split(";");
    return [begrip?.trim(), uitleg?.trim()];
  }).filter(p => p[0] && p[1]);
}

/* ▶️ START SPEL */
async function startGame(){

  await loadData();

  cards = [];

  pairs.forEach((pair,i)=>{
    cards.push({text:pair[0], id:i, exp:pair[1]});
    cards.push({text:pair[1], id:i, exp:pair[1]});
  });

  cards.sort(()=>Math.random()-0.5);

  [first,second,lock]=[null,null,false];
  attempts=0;
  matchedPairs=0;

  document.getElementById("game").innerHTML="";
  document.getElementById("explanation").innerText="";

  cards.forEach(card=>{
    let div=document.createElement("div");
    div.className="card";
    div.dataset.id=card.id;
    div.dataset.text=card.text;
    div.dataset.exp=card.exp;
    div.innerText="?";

    div.onclick=()=>flip(div);

    document.getElementById("game").appendChild(div);
  });

  updateInfo();
}

/* 🔄 kaart omdraaien */
function flip(card){

  if(lock || card.classList.contains("open") || card.classList.contains("matched")) return;

  card.classList.add("open");
  card.innerText=card.dataset.text;

  if(!first){
    first=card;
  }else{
    second=card;
    checkMatch();
  }
}

/* ✅ match check */
function checkMatch(){

  attempts++;
  updateInfo();

  if(first.dataset.id===second.dataset.id){

    first.classList.add("matched");
    second.classList.add("matched");
    matchedPairs++;

    document.getElementById("explanation").innerText =
    "✅ " + first.dataset.exp;

    reset();

  } else {

    lock=true;
    setTimeout(()=>{
      first.classList.remove("open");
      second.classList.remove("open");
      first.innerText="?";
      second.innerText="?";

      document.getElementById("explanation").innerText="";

      reset();
    },800);
  }
}

/* 🔁 reset selectie */
function reset(){
  [first,second,lock]=[null,null,false];
}

/* 📊 info */
function updateInfo(){
  document.getElementById("info").innerText =
  "Pogingen: " + attempts + " | Gevonden: " + matchedPairs;
}

/* 🚀 auto start */
startGame();
