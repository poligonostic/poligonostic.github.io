/* =========================================================
   POLIGONISTIC WEATHER
   RADAR MODULE (BASIC WORKING VERSION)
========================================================= */

import { $ } from "./utils.js";


let state = {
    lat: null,
    lon: null,
    canvas: null,
    ctx: null,
    img: new Image(),
    frame: 0
};


/* ========================= INIT ========================= */

export function initRadar(lat, lon) {
    state.lat = lat;
    state.lon = lon;

    state.canvas = $("radarCanvas");

    if (!state.canvas) {
        console.warn("Radar canvas not found");
        return;
    }

    state.ctx = state.canvas.getContext("2d");

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    loadRadarLoop();
}


/* ========================= RESIZE ========================= */

function resizeCanvas() {
    state.canvas.width = window.innerWidth;
    state.canvas.height = window.innerHeight;
}


/* ========================= RADAR LOOP ========================= */

function loadRadarLoop() {
    updateRadarFrame();

    setInterval(() => {
        updateRadarFrame();
    }, 6000); // refresh every 6 seconds
}


/* ========================= FETCH RADAR IMAGE ========================= */

function updateRadarFrame() {
    if (!state.lat || !state.lon) return;

    state.frame++;

    // NOAA radar base reflectivity overlay (simple tile)
    const url =
        `https://radar.weather.gov/ridge/standard/${getRadarRegion(state.lat, state.lon)}_loop.gif?f=${state.frame}`;

    state.img.crossOrigin = "anonymous";
    state.img.src = url;

    state.img.onload = () => {
        drawRadar();
    };
}


/* ========================= DRAW ========================= */

function drawRadar() {
    const ctx = state.ctx;

    if (!ctx) return;

    ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);

    // subtle fade background
    ctx.fillStyle = "rgba(10, 15, 30, 0.4)";
    ctx.fillRect(0, 0, state.canvas.width, state.canvas.height);

    ctx.drawImage(
        state.img,
        0,
        0,
        state.canvas.width,
        state.canvas.height
    );
}


/* ========================= REGION PICKER ========================= */

function getRadarRegion(lat, lon) {
    // very simplified US radar region mapping

    if (lat > 40 && lon < -100) return "conus"; // central/north
    if (lat > 35) return "se"; // southeast-ish
    if (lat <= 35 && lon < -95) return "sw"; // southwest
    if (lon > -90) return "er"; // east
    return "conus";
}
