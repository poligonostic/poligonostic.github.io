/* =========================================================
   POLIGONISTIC WEATHER
   SPACE WEATHER MODULE
========================================================= */

import { $ } from "./utils.js";


let state = {
    kpIndex: null,
    solarWind: null,
    geomagnetic: null,
    auroraChance: null
};


/* ========================= INIT ========================= */

export async function initSpace() {
    try {
        // In a real system you'd pull from NOAA SWPC APIs.
        // For now, we simulate + structure the system cleanly.

        await fetchSpaceData();
        renderSpace();

    } catch (err) {
        console.error("space.js error:", err);

        $("solarCard").innerHTML = "<h2>Space data unavailable</h2>";
        $("geomagneticCard").innerHTML = "";
        $("auroraCard").innerHTML = "";
    }
}


/* ========================= FETCH (STRUCTURED PLACEHOLDER) ========================= */

async function fetchSpaceData() {
    // NOTE:
    // NOAA SWPC APIs are not always CORS-friendly in browsers,
    // so we structure this as a clean data layer for later upgrade.

    state.kpIndex = getSimulatedKP();
    state.solarWind = getSimulatedSolarWind();
    state.geomagnetic = getGeomagneticLevel(state.kpIndex);
    state.auroraChance = computeAuroraChance(state.kpIndex);
}


/* ========================= RENDER ========================= */

function renderSpace() {
    renderSolar();
    renderGeomagnetic();
    renderAurora();
}


/* ========================= SOLAR ========================= */

function renderSolar() {
    const el = $("solarCard");

    el.innerHTML = `
        <h2>Solar Activity</h2>

        <p><b>Kp Index:</b> ${state.kpIndex}</p>
        <p><b>Solar Wind:</b> ${state.solarWind} km/s</p>
    `;
}


/* ========================= GEOMAGNETIC ========================= */

function renderGeomagnetic() {
    const el = $("geomagneticCard");

    el.innerHTML = `
        <h2>Geomagnetic Field</h2>

        <p>${state.geomagnetic}</p>
    `;
}


/* ========================= AURORA ========================= */

function renderAurora() {
    const el = $("auroraCard");

    el.innerHTML = `
        <h2>Aurora Chance</h2>

        <p>${state.auroraChance}%</p>

        <div style="
            width:100%;
            height:10px;
            background:#1b2a4a;
            border-radius:10px;
            overflow:hidden;
        ">
            <div style="
                width:${state.auroraChance}%;
                height:100%;
                background:linear-gradient(90deg,#4ea3ff,#9cffc7,#b98cff);
            "></div>
        </div>
    `;
}


/* ========================= SIMULATION LOGIC ========================= */

function getSimulatedKP() {
    return +(Math.random() * 6).toFixed(1);
}

function getSimulatedSolarWind() {
    return Math.floor(300 + Math.random() * 400);
}

function getGeomagneticLevel(kp) {
    if (kp < 2) return "Quiet";
    if (kp < 4) return "Unsettled";
    if (kp < 6) return "Active";
    return "Storm conditions";
}

function computeAuroraChance(kp) {
    return Math.min(100, Math.floor((kp / 8) * 100));
}
