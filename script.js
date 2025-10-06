const day_web = $(".date");
const time_web = $(".time");
const temperature = $(".temperature");
const weather = $(".weather_description");
const high_Temp = $(".high");
const low_Temp = $(".low");
const current_UV = $("#CurrentUV");
const currentUvText = $("#uv_text");
const dialyMaxUV = $("#dailyMaxUV");
const dailyMaxtext = $("#dailyMaxText");
const paragraph = $(".paragraph");

const days = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday',
    'Thursday', 'Friday', 'Saturday']

const months = ['January', 'February', 'March', 'April', 'May', 
    'June', 'July', 'August', 'September', 'October', 'November', 'December']

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HoursFormat = hour >= 13 ? hour % 12 : hour
    const minutes = time.getMinutes();
    const minutesWithZero = minutes < 10 ? "0" + minutes : minutes
    const ampm = hour >= 12? "PM" : "AM"

    time_web.html(hoursIn12HoursFormat + ":" + minutesWithZero + " " + 
    `<span class="am-pm"> ${ampm}</span>`)

    day_web.html(days[day] + ", " + months[month] + " " + date )
    
}, 1000);