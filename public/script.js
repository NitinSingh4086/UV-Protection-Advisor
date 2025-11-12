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
const place = $(".countryLocation");

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  const hoursIn12HoursFormat = hour >= 13 ? hour % 12 : hour;
  const minutes = time.getMinutes();
  const minutesWithZero = minutes < 10 ? "0" + minutes : minutes;
  const ampm = hour >= 12 ? "PM" : "AM";

  time_web.html(
    hoursIn12HoursFormat +
      ":" +
      minutesWithZero +
      " " +
      `<span class="am-pm"> ${ampm}</span>`
  );

  day_web.html(days[day] + ", " + months[month] + " " + date);
}, 1000);

document.addEventListener("DOMContentLoaded", async () => {
  if (!("geolocation" in navigator)) {
    console.error("Geolocation not supported");
    return;
  }
  try {
    const pos = await new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      })
    );
    const { latitude, longitude } = pos.coords;
    console.log("got coords", latitude, longitude);

    const response = await fetch(
      `/api/weather?lat=${latitude}&lon=${longitude}`
    );
    const weatherData = await response.json();

    const locRes = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    const loc = await locRes.json();

    temperature.text(Math.round(weatherData.temp) + "°");
    weather.text(weatherData.description || "-");
    high_Temp.text("H:" + String(Math.round(weatherData.high)).padStart(2, "0") + "°");
low_Temp.text("L:" + String(Math.round(weatherData.low)).padStart(2, "0") + "°");
    current_UV.text(weatherData.uvi?.toFixed(1) || "-");
    dialyMaxUV.text(weatherData.uvi_max?.toFixed(1) || "-");

    const label = (u) => {
      
      return u < 3
        ? "Low"
        : u < 6
        ? "Moderate"
        : u < 8
        ? "High"
        : u < 11
        ? "Very High"
        : "Extreme";
    };

    const city = loc.city || loc.locality || loc.principalSubdivision || "";
    const country = loc.countryCode || loc.countryName || "";
    place.text(`${city}${city && country ? ", " : ""}${country} UV Index`);

    currentUvText.text(label(weatherData.uvi));
    dailyMaxtext.text(label(weatherData.uvi_max));
    weather.text(weatherData.description || "-");


    const UV_TEXTS = {
      Low: `Low: 0–2\n\nMinimal sun protection required for normal activity. Wear sunglasses on bright days. If outside >1 hour, cover up and use sunscreen. Snow reflection can nearly double UV; wear sunglasses & apply sunscreen on your face.`,
      Moderate: `Moderate: 3–5\n\nCover up, wear sunglasses, and use sunscreen. Stay in shade near midday.`,
      High: `High: 6–7\n\nReduce time in sun 10am–4pm. Seek shade, wear hat, sunglasses, and use SPF 30+.`,
      "Very High": `Very High: 8–10\n\nExtra protection needed. Minimize exposure 10am–4pm. Reapply sunscreen often.`,
      Extreme: `Extreme: 11+\n\nAvoid the sun if possible. Stay in shade, wear full protection, reapply sunscreen frequently.`,
    };

    const uvButtons = $(".legend .quality_description button");

    function setUVLevel(level) {
      paragraph.text(UV_TEXTS[level] || "");

      uvButtons.removeClass("is-selected").attr("aria-pressed", "false");
      const cls = level === "Very High" ? "Very_High" : level;
      $(`.legend .quality_description .${cls}`)
        .addClass("is-selected")
        .attr("aria-pressed", "true");

      const colors = {
        Low: "#f1fbdc",
        Moderate: "#fff6cc",
        High: "#ffe8d6",
        "Very High": "#ffe0e0",
        Extreme: "#f3e5f5",
      };
      $(".description_Paragraph").css({
        background: colors[level] || "white",
        color: "black", 
      });
    }

    uvButtons.on("click", function () {
      const chosen = $(this).text().trim();
      setUVLevel(chosen);
    });

    const nowLabel = label(weatherData.uvi);
    setUVLevel(nowLabel);

  } catch (err) {
    console.error("Location failed:", err.message);
  }
});
