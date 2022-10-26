
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

function setTime(html_id, time){
    let minutes = time.split(':')[1].padStart(2, '0')
    let hours = time.split(':')[0].padStart(2,0)

    let ele = document.querySelector(`#${html_id}`)
    if(ele){
        ele.innerHTML = `${hours}:${minutes}`
    }
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
        showOneTimer()
    }
}

function pauseTimer(){
    if(timer != null){
        clearInterval(timer)
        timer = null;
        showOneTimer();
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
    if(delay > 0){
        clearTimeout(wakeUpTimers[hour]);
        let newTimer = setTimeout(()=> {
            delete wakeUpTimers[hour];
            startTimer();
            showOneTimer();
        }, delay)
        wakeUpTimers[hour] = newTimer
    }
}

function showOneTimer(){
    let currentTimer = document.querySelector('#timer-group-div')
    let startTimer = document.querySelector('#timer-start-div')
    let pauseTimer = document.querySelector('#timer-pause-div')
    let end = document.querySelector('#end-div')
    currentTimer.classList.add('d-none')
    startTimer.classList.add('d-none')
    pauseTimer.classList.add('d-none')
    end.classList.add('d-none')
    if(timer != null){
        currentTimer.classList.remove('d-none');
    }
    else if(Object.keys(wakeUpTimers).length >= 2){
        startTimer.classList.remove('d-none');
    } else if(Object.keys(wakeUpTimers).length === 1){
        pauseTimer.classList.remove('d-none');
    } else {
        end.classList.remove('d-none');
    }

}

async function setup(){
    document.querySelector("#pause-btn").addEventListener("click", () => pauseTimer());
    document.querySelector("#start-btn").addEventListener("click", () => startTimer());

    let config = await server.getConfig();
    duration = config['time_between_group']
    currentTimer = duration;
    
    setTime("timer-start", config.start_time)
    setTime("timer-pause", config.end_pause_time)

    startTimerAt(config.start_time);
    startTimerAt(config.end_pause_time);

    showOneTimer();
}

setup();
