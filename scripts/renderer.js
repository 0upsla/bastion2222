
function padded(anything){
    return anything.toString().padStart(2, '0')
}

async function callNextGroup(){
  document.querySelector('#last-group-number').innerHTML = nextGroupNumber;
  let currentCall = new Date();
  let hour = padded(currentCall.getHours())
  let minute = padded(currentCall.getMinutes())
  document.querySelector('#last-group-time').innerHTML = `${hour}:${minute}`
  let group = await server.sendGroup();
  nextGroupNumber = await server.nextGroupNumber();
  document.querySelector('#next-group-number').innerHTML = nextGroupNumber;
}

function updateTimer(timer){
    let seconds = padded(timer % 60);
    let minutes = padded((timer - seconds) / 60);
    let text = `${minutes}:${seconds}`
    document.querySelector('#timer-group').innerText = text;
}

function setTime(html_id, time){
    let minutes = padded(time.split(':')[1])
    let hours = padded(time.split(':')[0])
    let ele = document.querySelector(`#${html_id}`)
    if(ele){
        ele.innerHTML = `${hours}:${minutes}`
    }
}

let timer = null;
let wakeUpTimers = {};
let duration = 300;
let currentTimer = duration;
let nextGroupNumber = 0;

function startTimer(){
    if(timer == null){
        timer = setInterval(() => {
            currentTimer -= 1;
            updateTimer(currentTimer)
            if(currentTimer <= 0){
                currentTimer = duration
                callNextGroup();
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
    document.querySelector('#next-group-number').innerHTML = nextGroupNumber;
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
    nextGroupNumber = await server.nextGroupNumber();
    duration = config['time_between_group']
    currentTimer = duration;
    
    setTime("timer-start", config.start_time)
    setTime("timer-pause", config.end_pause_time)

    startTimerAt(config.start_time);
    startTimerAt(config.end_pause_time);

    showOneTimer();
}

setup();
