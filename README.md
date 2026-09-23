# UV Protection Advisor

A location-based weather dashboard that brings temperature, UV readings, and UV-category guidance into one interface.

**[Open the live app](https://uv-protection-advisor-1.onrender.com/)** · [Backend](server.js) · [Browser logic](public/script.js)

The Render deployment may display a service wake-up screen before loading. The dashboard requests browser location permission to retrieve local conditions.

## Features

- Uses browser geolocation to request weather for the visitor's coordinates.
- Displays temperature, daily high and low, weather description, and available UV readings.
- Maps UV values to five categories with selectable guidance panels.
- Looks up a locality name through BigDataCloud reverse geocoding.
- Displays a live clock and date.

## Stack and data flow

**JavaScript, jQuery, HTML/CSS, Node.js, Express, Axios**

```text
Browser geolocation
    |-- GET /api/weather?lat=...&lon=...
    |       +-- Express --> Open-Meteo --> normalized weather JSON
    |
    +-- BigDataCloud reverse geocoding --> locality label
```

Express serves the files in `public/` and exposes the weather endpoint from [server.js](server.js). The browser updates the dashboard in [public/script.js](public/script.js).

## Run locally

```bash
git clone https://github.com/NitinSingh4086/UV-Protection-Advisor.git
cd UV-Protection-Advisor
npm ci
npm start
```

Open `http://localhost:3000`. Use a Node.js release compatible with Express 5 (Node.js 18 or newer). Internet access is needed for the weather provider, reverse geocoding, and externally hosted browser assets.

For development with automatic server restarts:

```bash
npm run dev
```

The server uses `PORT` when set, otherwise port `3000`. No API key is referenced by the current weather request. Browser geolocation requires a supported secure context, such as HTTPS or localhost, and user permission.

## API

### `GET /api/weather`

Required query parameters: `lat` and `lon`.

Example using Edmonton city coordinates:

```text
http://localhost:3000/api/weather?lat=53.5461&lon=-113.4938
```

| Response field | Meaning |
| --- | --- |
| `temp` | Current temperature from the provider |
| `high`, `low` | First day's maximum and minimum temperature |
| `uvi` | Current UV value, or null when absent |
| `uvi_max` | First day's maximum UV value |
| `description` | Human-readable weather-code description |

Missing coordinates return HTTP 400. A failed upstream weather request returns HTTP 500. The current handler checks that coordinates are present but does not validate numeric ranges.

## Repository guide

| File | Responsibility |
| --- | --- |
| `server.js` | Express server, weather-provider request, response mapping |
| `public/index.html` | Dashboard markup |
| `public/script.js` | Geolocation, API requests, clock, UV-category interaction |
| `public/style.css` | Dashboard styling |
| `package-lock.json` | Dependency lockfile |

## Manual checks

- Start the server and confirm the dashboard loads.
- Request `/api/weather` without coordinates and confirm HTTP 400.
- Request weather using the example coordinates and inspect the returned fields.
- In the browser, allow location access and check temperature, location, and UV panels.
- Try denying location access and inspect the browser console.
- Select each UV category after data loads and confirm that its guidance panel changes.

## Current limitations

- Location access is required by the current interface; there is no manual city search.
- Geolocation or network errors are logged to the console without a dedicated error screen.
- Missing UV data needs better handling in the category labels; a missing reading should not be interpreted as a measured low value.
- There is no automated test suite. The existing `npm test` command is a placeholder that exits with an error.
- Weather-provider responses and availability must be checked separately from whether the page loads.

## Data sources

- [Open-Meteo](https://open-meteo.com/) for weather and UV data.
- [BigDataCloud](https://www.bigdatacloud.com/) for the locality lookup.

Coordinates are sent to the app's weather endpoint (and onward to Open-Meteo) and directly to BigDataCloud when location permission is granted.
