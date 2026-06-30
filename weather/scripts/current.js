/* =========================================================
   POLIGONISTIC WEATHER
   CURRENT CONDITIONS MODULE
========================================================= */

import { $, formatTemp, formatTime, getShortForecast, safeFetch } from "./utils.js";


let state = {
    pointData: null,
    hourly: null
};


/* ========================= INIT ========================= */

export async function initCurrent(lat, lon) {
    try {
        const pointUrl = `https://api.weather.gov/points/${lat},${lon}`;

        state.pointData = await safeFetch(pointUrl);

        if (!state.pointData) {
            throw new Error("Point data missing");
        }

        const hourlyUrl = state.pointData.properties.forecastHourly;
        state.hourly = await safeFetch(hourlyUrl);

        renderCurrent();
        renderSummary();
        renderWind();

    } catch (err) {
        console.error("current.js error:", err);
        $("currentCard").innerHTML = "<h2>Failed to load current weather</h2>";
    }
}


/* ========================= CURRENT CARD ========================= */

function renderCurrent() {
    const card = $("currentCard");

    const p = state.hourly?.properties?.periods?.[0];
    if (!p) return;

    card.innerHTML = `
        <h2>Current Conditions</h2>

        <img src="${p.icon}" style="width:60px;height:60px;">

        <h1>${formatTemp(p.temperature, p.temperatureUnit)}</h1>

        <p>${getShortForecast(p)}</p>

        <small>Updated: ${formatTime(p.startTime)}</small>
    `;
}


/* ========================= SUMMARY CARD ========================= */

function renderSummary() {
    const card = $("summaryCard");

    const now = state.hourly?.properties?.periods?.[0];
    const next = state.hourly?.properties?.periods?.[1];

    if (!now) return;

    const trend = next
        ? next.temperature - now.temperature
        : 0;

    card.innerHTML = `
        <h2>Summary</h2>

        <p>Feels like: ${formatTemp(now.temperature, now.temperatureUnit)}</p>

        <p>
            Trend: ${
                trend > 0 ? "⬆ Warming" :
                trend < 0 ? "⬇ Cooling" :
                "➡ Stable"
            }
        </p>

        <p>${now.shortForecast}</p>
    `;
}


/* ========================= WIND CARD ========================= */

function renderWind() {
    const card = $("windCard");

    const p = state.hourly?.properties?.periods?.[0];
    if (!p) return;

    card.innerHTML = `
        <h2>Wind</h2>

        <p>Speed: ${p.windSpeed || "N/A"}</p>
        <p>Direction: ${p.windDirection || "N/A"}</p>
    `;
}
