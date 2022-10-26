
async function checkFolder(){
  let group = await server.sendGroup();
  /*
  for(let i = 0; i < group.length; i++){
    let p = document.querySelector(`#group-${i}`)
    console.log(p)
    p.innerHTML = group[i]
  }
  */
}

function updateTimer(timer){
    let seconds = (timer % 60).toString().padStart(2, '0');
    let minutes = ((timer - seconds) / 60).toString().padStart(2, '0');
    let text = `${minutes}:${seconds}`
    document.querySelector('#timer-group').innerText = text;
}

let timer = null;
let wakeUpTimers = {};
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
        }, 1000)
    }
}

function pauseTimer(){
    if(timer != null){
        clearInterval(timer)
        timer = null;
    }
}

function parseTime(time){
    let now = new Date();
    let hour = time.split(':')[0]
    let minute = time.split(':')[1]
    let parsedTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hour,
        minute    
    )
    return parsedTime;
}

function startTimerAt(hour){
    let time = parseTime(hour);
    let delay = (time.getTime() - (new Date()).getTime());
    console.log(hour, delay)
    if(delay > 0){
        clearTimeout(wakeUpTimers[hour]);
        wakeUpTimers[hour] = setTimeout(startTimer, delay)
    }
}

async function setup(){
    document.querySelector("#pause-btn").addEventListener("click", () => pauseTimer());
    document.querySelector("#start-btn").addEventListener("click", () => startTimer());

    let config = await server.getConfig();
    duration = config['time_between_group']
    currentTimer = duration;
    
    startTimerAt(config.start_time);
    startTimerAt(config.end_pause_time);
}

setup();
