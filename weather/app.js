/* =========================================================
   POLIGONISTIC WEATHER
   APP.JS (FIXED SINGLE-ENTRY VERSION)
========================================================= */

let lat, lon, name;

/* ========================= INIT ========================= */

document.addEventListener("DOMContentLoaded", async () => {
    readURL();

    if (!lat || !lon) {
        showError("Missing coordinates in URL");
        return;
    }

    await loadWeather();
});


/* ========================= READ URL ========================= */

function readURL() {
    const params = new URLSearchParams(window.location.search);

    lat = parseFloat(params.get("lat"));
    lon = parseFloat(params.get("lon"));
    name = params.get("name") || "Unknown";

    document.getElementById("location").textContent = name;
}


/* ========================= FETCH WEATHER ========================= */

async function loadWeather() {
    try {
        const pointURL = `https://api.weather.gov/points/${lat},${lon}`;

        const pointRes = await fetch(pointURL);
        const pointData = await pointRes.json();

        const forecastURL = pointData.properties.forecast;
        const hourlyURL = pointData.properties.forecastHourly;

        const [forecastRes, hourlyRes] = await Promise.all([
            fetch(forecastURL),
            fetch(hourlyURL)
        ]);

        const forecastData = await forecastRes.json();
        const hourlyData = await hourlyRes.json();

        renderCurrent(hourlyData);
        renderHourly(hourlyData);
        renderDaily(forecastData);

        hideLoading();

    } catch (err) {
        console.error(err);
        showError("Weather failed to load");
    }
}


/* ========================= CURRENT ========================= */

function renderCurrent(hourlyData) {
    const card = document.getElementById("currentCard");
    const p = hourlyData.properties.periods[0];

    card.innerHTML = `
        <h2>Current Conditions</h2>
        <img src="${p.icon}" width="60">
        <h1>${p.temperature}°${p.temperatureUnit}</h1>
        <p>${p.shortForecast}</p>
    `;
}


/* ========================= HOURLY ========================= */

function renderHourly(hourlyData) {
    const card = document.getElementById("hourlyForecast");
    const periods = hourlyData.properties.periods;

    let html = `<h2>Hourly Forecast</h2>`;

    for (let i = 0; i < 8; i++) {
        const p = periods[i];

        html += `
            <div style="padding:8px;border-bottom:1px solid #2b3c6f;">
                <b>${p.startTime.slice(11,16)}</b><br>
                ${p.temperature}°${p.temperatureUnit} - ${p.shortForecast}
            </div>
        `;
    }

    card.innerHTML = html;
}


/* ========================= DAILY ========================= */

function renderDaily(forecastData) {
    const card = document.getElementById("dailyForecast");
    const periods = forecastData.properties.periods;

    let html = `<h2>7-Day Forecast</h2>`;

    for (let i = 0; i < 7; i++) {
        const p = periods[i];

        html += `
            <div style="padding:8px;border-bottom:1px solid #2b3c6f;">
                <b>${p.name}</b><br>
                ${p.shortForecast}<br>
                ${p.temperature}°${p.temperatureUnit}
            </div>
        `;
    }

    card.innerHTML = html;
}


/* ========================= UI HELPERS ========================= */

function hideLoading() {
    const el = document.getElementById("loadingScreen");
    if (el) el.style.display = "none";
}

function showError(msg) {
    document.body.innerHTML = `
        <div style="color:white;padding:20px;">
            <h1>Error</h1>
            <p>${msg}</p>
        </div>
    `;
}
