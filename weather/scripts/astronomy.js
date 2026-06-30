/* =========================================================
   POLIGONISTIC WEATHER
   ASTRONOMY MODULE
========================================================= */

import { $, formatTime } from "./utils.js";


let state = {
    data: null,
    lat: null,
    lon: null
};


/* ========================= INIT ========================= */

export async function initAstronomy(lat, lon) {
    state.lat = lat;
    state.lon = lon;

    try {
        const url = `https://api.weather.gov/points/${lat},${lon}`;
        const point = await fetch(url);
        const pointData = await point.json();

        const forecastUrl = pointData.properties.forecast;
        const forecast = await fetch(forecastUrl);
        const forecastData = await forecast.json();

        state.data = forecastData.properties;

        renderSun();
        renderMoon();
        renderTwilight();

    } catch (err) {
        console.error("astronomy.js error:", err);

        $("sunCard").innerHTML = "<h2>Sun data unavailable</h2>";
        $("moonCard").innerHTML = "<h2>Moon data unavailable</h2>";
        $("twilightCard").innerHTML = "<h2>Twilight data unavailable</h2>";
    }
}


/* ========================= SUN ========================= */

function renderSun() {
    const card = $("sunCard");

    const periods = state.data?.periods;
    if (!periods || !periods.length) return;

    const today = periods[0];

    card.innerHTML = `
        <h2>Sun</h2>

        <p><b>Day period:</b> ${today.name}</p>
        <p>${today.detailedForecast || "No detail available"}</p>
    `;
}


/* ========================= MOON (APPROX) ========================= */

function renderMoon() {
    const card = $("moonCard");

    const phase = getMoonPhase(new Date());

    card.innerHTML = `
        <h2>Moon</h2>

        <p><b>Phase:</b> ${phase.name}</p>

        <div style="
            width:80px;
            height:80px;
            border-radius:50%;
            background:${phase.color};
            box-shadow:0 0 20px rgba(255,255,255,0.3);
        "></div>
    `;
}


/* ========================= TWILIGHT ========================= */

function renderTwilight() {
    const card = $("twilightCard");

    const now = new Date().getHours();

    let stateText = "Daytime";

    if (now < 6) stateText = "Night";
    else if (now < 8) stateText = "Dawn";
    else if (now > 18) stateText = "Dusk";

    card.innerHTML = `
        <h2>Twilight</h2>

        <p>${stateText}</p>
        <p>Local hour: ${now}:00</p>
    `;
}


/* ========================= MOON PHASE CALC ========================= */

function getMoonPhase(date) {
    const synodicMonth = 29.53;

    const knownNewMoon = new Date("2000-01-06T18:14:00Z");

    const days = (date - knownNewMoon) / 86400000;
    const phase = (days % synodicMonth) / synodicMonth;

    if (phase < 0.03 || phase > 0.97) {
        return { name: "New Moon", color: "#111" };
    } else if (phase < 0.25) {
        return { name: "Waxing Crescent", color: "#333" };
    } else if (phase < 0.50) {
        return { name: "First Quarter", color: "#888" };
    } else if (phase < 0.75) {
        return { name: "Waxing Gibbous", color: "#ccc" };
    } else {
        return { name: "Full Moon", color: "#fff" };
    }
}
