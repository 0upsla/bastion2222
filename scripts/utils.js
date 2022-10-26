
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