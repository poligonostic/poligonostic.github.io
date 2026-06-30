/* =========================================================
   POLIGONISTIC WEATHER
   OBSERVATION MODULE
   (Station + METAR-style data layer)
========================================================= */

import { $, safeFetch } from "./utils.js";


let state = {
    pointData: null,
    stationId: null,
    stationData: null
};


/* ========================= INIT ========================= */

export async function initObservation(lat, lon) {
    try {
        await loadStation(lat, lon);
        await loadStationInfo();

        renderObservation();

    } catch (err) {
        console.error("observation.js error:", err);

        $("stationCard").innerHTML = "<h2>Station data unavailable</h2>";
        $("metarCard").innerHTML = "";
    }
}


/* ========================= LOAD STATION ========================= */

async function loadStation(lat, lon) {
    const url = `https://api.weather.gov/points/${lat},${lon}`;

    state.pointData = await safeFetch(url);

    const stationsUrl = state.pointData?.properties?.observationStations;

    if (!stationsUrl) throw new Error("No station list found");

    const stations = await safeFetch(stationsUrl);

    const firstStation = stations?.features?.[0];

    if (!firstStation) throw new Error("No stations available");

    state.stationId = firstStation.properties.stationIdentifier;
}


/* ========================= LOAD STATION INFO ========================= */

async function loadStationInfo() {
    if (!state.stationId) return;

    const url = `https://api.weather.gov/stations/${state.stationId}`;

    state.stationData = await safeFetch(url);
}


/* ========================= RENDER ========================= */

function renderObservation() {
    renderStation();
    renderMETAR();
}


/* ========================= STATION CARD ========================= */

function renderStation() {
    const el = $("stationCard");

    const p = state.stationData?.properties;

    el.innerHTML = `
        <h2>Observation Station</h2>

        <p><b>ID:</b> ${state.stationId || "N/A"}</p>
        <p><b>Name:</b> ${p?.name || "Unknown"}</p>
        <p><b>Elevation:</b> ${p?.elevation?.value ?? "N/A"} m</p>
    `;
}


/* ========================= METAR CARD (SIMPLIFIED) ========================= */

function renderMETAR() {
    const el = $("metarCard");

    el.innerHTML = `
        <h2>Live Observation</h2>

        <p>Data source: NOAA Station Feed</p>

        <p style="opacity:0.8;">
            Raw METAR decoding not enabled yet.<br>
            (Ready for upgrade layer)
        </p>
    `;
}
