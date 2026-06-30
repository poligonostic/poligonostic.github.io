/* =========================================================
   POLIGONISTIC WEATHER
   FORECAST MODULE
========================================================= */

import { $, formatTemp, formatTime, getShortForecast, safeFetch } from "./utils.js";


let state = {
    forecast: null,
    hourly: null
};


/* ========================= INIT ========================= */

export async function initForecast(forecastUrl, hourlyUrl) {
    try {
        state.forecast = await safeFetch(forecastUrl);
        state.hourly = await safeFetch(hourlyUrl);

        renderHourly();
        renderDaily();

    } catch (err) {
        console.error("forecast.js error:", err);

        $("hourlyForecast").innerHTML = "<h2>Forecast failed to load</h2>";
        $("dailyForecast").innerHTML = "<h2>Forecast failed to load</h2>";
    }
}


/* ========================= HOURLY ========================= */

function renderHourly() {
    const card = $("hourlyForecast");

    const periods = state.hourly?.properties?.periods;
    if (!periods) return;

    let html = `<h2>Hourly Forecast</h2>`;

    for (let i = 0; i < 12 && i < periods.length; i++) {
        const p = periods[i];

        html += `
            <div style="
                padding:8px;
                border-bottom:1px solid #2b3c6f;
            ">
                <b>${formatTime(p.startTime)}</b><br>
                ${formatTemp(p.temperature, p.temperatureUnit)}<br>
                <small>${getShortForecast(p)}</small>
            </div>
        `;
    }

    card.innerHTML = html;
}


/* ========================= DAILY ========================= */

function renderDaily() {
    const card = $("dailyForecast");

    const periods = state.forecast?.properties?.periods;
    if (!periods) return;

    let html = `<h2>7-Day Forecast</h2>`;

    for (let i = 0; i < 7 && i < periods.length; i++) {
        const p = periods[i];

        html += `
            <div style="
                padding:8px;
                border-bottom:1px solid #2b3c6f;
            ">
                <b>${p.name}</b><br>
                ${p.shortForecast}<br>
                ${formatTemp(p.temperature, p.temperatureUnit)}
            </div>
        `;
    }

    card.innerHTML = html;
}
