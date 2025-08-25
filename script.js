// ELEMENTOS
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("scoreDisplay");
const levelDisplay = document.getElementById("levelDisplay");

// VARIÁVEIS
let snakeColor = "#00ff00";
let snakeAccessory = "none";
let playerName = "Jogador";
let level = 1;
let gameMode = "solo";

const tileSize = 20;
let snake = [], snake2 = [];
let food = {};
let direction = "RIGHT", direction2 = "LEFT";
let score = 0, interval, isGameOver = false;

// RANKING
function saveScore(name, score){
    let rank = JSON.parse(localStorage.getItem("snakeRank"))||[];
    rank.push({name,score});
    rank.sort((a,b)=>b.score-a.score);
    localStorage.setItem("snakeRank", JSON.stringify(rank.slice(0,10)));
}

function showRanking(){
    document.getElementById("menu").classList.add("hidden");
    document.getElementById("ranking").classList.remove("hidden");
    const list = document.getElementById("rankList");
    list.innerHTML="";
    let rank = JSON.parse(localStorage.getItem("snakeRank"))||[];
    rank.forEach(r=>{
        let li = document.createElement("li");
        li.textContent=`${r.name}: ${r.score}`;
        list.appendChild(li);
    });
}

function showMenu(){
    document.getElementById("menu").classList.remove("hidden");
    document.getElementById("ranking").classList.add("hidden");
    document.getElementById("instructionsMenu").classList.add("hidden");
    document.getElementById("gameContainer").classList.add("hidden");
}

// INICIALIZAÇÃO
function startGame(mode){
    gameMode = mode;
    playerName = document.getElementById("playerName").value || "Jogador";
    snakeColor = document.getElementById("snakeColor").value;
    snakeAccessory = document.getElementById("snakeAccessory").value;
    level = parseInt(document.getElementById("levelSelect").value);

    snake=[{x:10,y:10}]; snake2=[{x:30,y:10}]; direction="RIGHT"; direction2="LEFT"; score=0; isGameOver=false;
    spawnFood();

    document.getElementById("menu").classList.add("hidden");
    document.getElementById("gameContainer").classList.remove("hidden");
    interval = setInterval(gameLoop, 150);
}

function spawnFood(){
    food={ x:Math.floor(Math.random()*canvas.width/tileSize), y:Math.floor(Math.random()*canvas.height/tileSize) };
}

function gameLoop(){
    if(isGameOver){ clearInterval(interval); return; }
    ctx.clearRect(0,0,canvas.width,canvas.height);

    moveSnake(snake,direction);
    drawSnake(snake,snakeColor);

    if(gameMode==="multi"){ moveSnake(snake2,direction2); drawSnake(snake2,"#ff0000"); }

    drawFood();
    drawScore();
    checkCollision();
}

function moveSnake(s, dir){
    let head={...s[s.length-1]};
    switch(dir){ case "UP": head.y--; break; case "DOWN": head.y++; break; case "LEFT": head.x--; break; case "RIGHT": head.x++; break; }
    s.push(head);
    if(head.x===food.x && head.y===food.y){ score+=10; spawnFood(); }
    else{ s.shift(); }
}

function drawSnake(s,color){
    ctx.fillStyle=color;
    s.forEach(segment=>ctx.fillRect(segment.x*tileSize,segment.y*tileSize,tileSize-2,tileSize-2));
}

function drawFood(){
    ctx.fillStyle="#ffff00";
    ctx.fillRect(food.x*tileSize,food.y*tileSize,tileSize-2,tileSize-2);
}

function drawScore(){ scoreDisplay.textContent=`Pontuação: ${score}`; levelDisplay.textContent=`Fase: ${level}`; }

function checkCollision(){
    let head=snake[snake.length-1];
    if(head.x<0||head.x>=canvas.width/tileSize||head.y<0||head.y>=canvas.height/tileSize||snake.slice(0,-1).some(s=>s.x===head.x&&s.y===head.y)){ gameOver(); }
    if(gameMode==="multi"){
        let head2=snake2[snake2.length-1];
        if(head2.x<0||head2.x>=canvas.width/tileSize||head2.y<0||head2.y>=canvas.height/tileSize||snake2.slice(0,-1).some(s=>s.x===head2.x&&s.y===head2.y)||snake.some(s=>s.x===head2.x&&s.y===head2.y)){ gameOver(); }
    }
}

function gameOver(){ isGameOver=true; clearInterval(interval); alert(`Fim de jogo! ${playerName} marcou ${score} pontos.`); saveScore(playerName,score); showMenu(); }

// CONTROLES
document.addEventListener("keydown", e=>{
    switch(e.key){
        case "ArrowUp": if(direction!=="DOWN") direction="UP"; break;
        case "ArrowDown": if(direction!=="UP") direction="DOWN"; break;
        case "ArrowLeft": if(direction!=="RIGHT") direction="LEFT"; break;
        case "ArrowRight": if(direction!=="LEFT") direction="RIGHT"; break;
        case "w": if(direction2!=="DOWN") direction2="UP"; break;
        case "s": if(direction2!=="UP") direction2="DOWN"; break;
        case "a": if(direction2!=="RIGHT") direction2="LEFT"; break;
        case "d": if(direction2!=="LEFT") direction2="RIGHT"; break;
    }
});

// BOTÕES
document.getElementById("startSolo").addEventListener("click",()=>startGame("solo"));
document.getElementById("startMulti").addEventListener("click",()=>startGame("multi"));
document.getElementById("viewRank").addEventListener("click",showRanking);
document.getElementById("instructions").addEventListener("click",()=>{ document.getElementById("menu").classList.add("hidden"); document.getElementById("instructionsMenu").classList.remove("hidden"); });
