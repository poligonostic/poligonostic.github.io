/* =========================================================
   POLIGONISTIC WEATHER
   ENVIRONMENT MODULE
========================================================= */

import { $, safeFetch } from "./utils.js";


let state = {
    pointData: null,
    hourly: null
};


/* ========================= INIT ========================= */

export async function initEnvironment(lat, lon) {
    try {
        const pointUrl = `https://api.weather.gov/points/${lat},${lon}`;
        state.pointData = await safeFetch(pointUrl);

        if (!state.pointData) throw new Error("No point data");

        const hourlyUrl = state.pointData.properties.forecastHourly;
        state.hourly = await safeFetch(hourlyUrl);

        renderEnvironment();

    } catch (err) {
        console.error("environment.js error:", err);
        $("humidityCard").innerHTML = "<h2>Environment unavailable</h2>";
    }
}


/* ========================= RENDER ========================= */

function renderEnvironment() {
    const periods = state.hourly?.properties?.periods;
    if (!periods || !periods.length) return;

    const p = periods[0];

    renderHumidity(p);
    renderDewPoint(p);
    renderPressure(p);
    renderVisibility(p);
    renderHeatIndex(p);
}


/* ========================= HUMIDITY ========================= */

function renderHumidity(p) {
    const el = $("humidityCard");

    el.innerHTML = `
        <h2>Humidity</h2>
        <p>${p.relativeHumidity?.value ?? "N/A"}%</p>
    `;
}


/* ========================= DEW POINT ========================= */

function renderDewPoint(p) {
    const el = $("dewPointCard");

    el.innerHTML = `
        <h2>Dew Point</h2>
        <p>${p.dewpoint?.value ?? "N/A"}°C</p>
    `;
}


/* ========================= PRESSURE ========================= */

function renderPressure(p) {
    const el = $("pressureCard");

    el.innerHTML = `
        <h2>Pressure</h2>
        <p>${p.barometricPressure?.value ?? "N/A"}</p>
    `;
}


/* ========================= VISIBILITY ========================= */

function renderVisibility(p) {
    const el = $("visibilityCard");

    el.innerHTML = `
        <h2>Visibility</h2>
        <p>${p.visibility?.value ?? "N/A"}</p>
    `;
}


/* ========================= HEAT INDEX ========================= */

function renderHeatIndex(p) {
    const el = $("heatIndexCard");

    const temp = p.temperature?.value;
    const humidity = p.relativeHumidity?.value;

    let heatIndex = "N/A";

    if (temp != null && humidity != null) {
        heatIndex = computeHeatIndex(temp, humidity);
    }

    el.innerHTML = `
        <h2>Heat Index</h2>
        <p>${heatIndex}</p>
    `;
}


/* ========================= HEAT INDEX FORMULA ========================= */

function computeHeatIndex(tC, rh) {
    // convert C -> F for formula
    const tF = (tC * 9/5) + 32;

    const hi =
        -42.379 +
        2.04901523 * tF +
        10.14333127 * rh +
        -0.22475541 * tF * rh +
        -0.00683783 * tF * tF +
        -0.05481717 * rh * rh +
        0.00122874 * tF * tF * rh +
        0.00085282 * tF * rh * rh +
        -0.00000199 * tF * tF * rh * rh;

    return `${Math.round((hi - 32) * 5/9)}°C`;
}
