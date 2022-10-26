
async function checkFolder(){
  let group = await server.sendGroup();
  for(let i = 0; i < group.length; i++){
    let p = document.querySelector(`#group-${i}`)
    console.log(p)
    p.innerHTML = group[i]
  }
}

function updateTimer(timer){
    let seconds = (timer % 60).toString().padStart(2, '0');
    let minutes = ((timer - seconds) / 60).toString().padStart(2, '0');
    let text = `${minutes}:${seconds}`
    document.querySelector('#timer').innerText = text;
}

let timer = null;
let duration = 300;
let currentTimer = duration;
function startTimer(){
    if(timer == null){
        timer = setInterval(() => {
            currentTimer -= 1;
            updateTimer(currentTimer)
            if(currentTimer <= 0){
                currentTimer = duration
                checkFolder();
            }
        }, 10)
    }
}

function pauseTimer(){
    if(timer != null){
        clearInterval(timer)
        timer = null;
    }
}

async function setup(){
    document.querySelector("#pause-btn").addEventListener("click", () => pauseTimer());
    document.querySelector("#start-btn").addEventListener("click", () => startTimer());

    let config = await server.getConfig();
    duration = config['time_between_group']
    currentTimer = duration;
    startTimer()
}

setup();
