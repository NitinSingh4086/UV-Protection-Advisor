import express from "express";
import axios from "axios";
import bodyparser from "body-parser";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(bodyparser.json());
app.use(express.static("public"));

app.get("/api/weather", async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ error: "lat & long required" });
  }
  try {
    const { data } = await axios.get("https://api.open-meteo.com/v1/forecast", {
      params: {
        latitude: lat,
        longitude: lon,
        current: "temperature_2m,uv_index,weather_code",
        daily: "temperature_2m_max,temperature_2m_min,uv_index_max",
        timezone: "auto",
      },
    });

    const WMO_TEXT = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Depositing rime fog",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Dense drizzle",
      56: "Light freezing drizzle",
      57: "Dense freezing drizzle",
      61: "Light rain",
      63: "Moderate rain",
      65: "Heavy rain",
      66: "Light freezing rain",
      67: "Heavy freezing rain",
      71: "Light snowfall",
      73: "Moderate snowfall",
      75: "Heavy snowfall",
      77: "Snow grains",
      80: "Light rain showers",
      81: "Moderate rain showers",
      82: "Violent rain showers",
      85: "Light snow showers",
      86: "Heavy snow showers",
      95: "Thunderstorm",
      96: "Thunderstorm with slight hail",
      99: "Thunderstorm with heavy hail",
    };
    const code = data.current?.weather_code ?? null;
    res.json({
      
      temp: data.current?.temperature_2m ?? null,
      high: data.daily?.temperature_2m_max?.[0] ?? null,
      low: data.daily?.temperature_2m_min?.[0] ?? null,
      uvi: data.current?.uv_index ?? null,
      uvi_max: data.daily?.uv_index_max?.[0] ?? null,
      description: code != null ? WMO_TEXT[code] || `Code ${code}` : null,
    });
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ error: "weather fetch failed" });
  }
});

