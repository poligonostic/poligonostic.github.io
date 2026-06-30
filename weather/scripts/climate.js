/* =========================================================
   POLIGONISTIC WEATHER
   CLIMATE MODULE
========================================================= */

import { $ } from "./utils.js";


let state = {
    normals: null,
    records: null,
    comparison: null
};


/* ========================= INIT ========================= */

export async function initClimate(lat, lon) {
    try {
        await loadClimateData(lat, lon);
        renderClimate();

    } catch (err) {
        console.error("climate.js error:", err);

        $("normalsCard").innerHTML = "<h2>Climate data unavailable</h2>";
        $("recordsCard").innerHTML = "";
        $("historyCard").innerHTML = "";
    }
}


/* ========================= LOAD DATA ========================= */

async function loadClimateData(lat, lon) {
    // NOTE:
    // NOAA climate normals require station-level datasets.
    // This is structured so you can plug real datasets later.

    state.normals = getSimulatedNormals();
    state.records = getSimulatedRecords();
    state.comparison = computeComparison();
}


/* ========================= RENDER ========================= */

function renderClimate() {
    renderNormals();
    renderRecords();
    renderHistory();
}


/* ========================= NORMALS ========================= */

function renderNormals() {
    const el = $("normalsCard");

    el.innerHTML = `
        <h2>Climate Normals</h2>

        <p><b>Avg High:</b> ${state.normals.avgHigh}°C</p>
        <p><b>Avg Low:</b> ${state.normals.avgLow}°C</p>
        <p><b>Avg Rain:</b> ${state.normals.avgRain} mm</p>
    `;
}


/* ========================= RECORDS ========================= */

function renderRecords() {
    const el = $("recordsCard");

    el.innerHTML = `
        <h2>Records</h2>

        <p><b>Record High:</b> ${state.records.high}°C</p>
        <p><b>Record Low:</b> ${state.records.low}°C</p>
        <p><b>Record Rain:</b> ${state.records.rain} mm</p>
    `;
}


/* ========================= HISTORY ========================= */

function renderHistory() {
    const el = $("historyCard");

    el.innerHTML = `
        <h2>Climate Context</h2>

        <p>${state.comparison}</p>
    `;
}


/* ========================= SIMULATED DATA ========================= */

function getSimulatedNormals() {
    return {
        avgHigh: 22 + Math.floor(Math.random() * 10),
        avgLow: 10 + Math.floor(Math.random() * 8),
        avgRain: 80 + Math.floor(Math.random() * 60)
    };
}

function getSimulatedRecords() {
    return {
        high: 40 + Math.floor(Math.random() * 5),
        low: -10 - Math.floor(Math.random() * 10),
        rain: 200 + Math.floor(Math.random() * 100)
    };
}

function computeComparison() {
    const phrases = [
        "Temperatures are near seasonal average.",
        "Slightly warmer than typical conditions.",
        "Cooler than expected for this time of year.",
        "Conditions are unusually stable.",
        "Weather variability is above normal."
    ];

    return phrases[Math.floor(Math.random() * phrases.length)];
}
