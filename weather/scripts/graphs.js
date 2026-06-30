/* =========================================================
   POLIGONISTIC WEATHER
   GRAPHS MODULE
   (Canvas-based weather visualization)
========================================================= */

import { $, safeFetch } from "./utils.js";


let state = {
    canvas: null,
    ctx: null,
    data: null
};


/* ========================= INIT ========================= */

export async function initGraphs(hourlyUrl) {
    try {
        state.canvas = $("graphCanvas");
        if (!state.canvas) return;

        state.ctx = state.canvas.getContext("2d");

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        const data = await safeFetch(hourlyUrl);
        state.data = data?.properties?.periods || [];

        drawTempGraph();

    } catch (err) {
        console.error("graphs.js error:", err);
    }
}


/* ========================= RESIZE ========================= */

function resizeCanvas() {
    if (!state.canvas) return;

    state.canvas.width = window.innerWidth;
    state.canvas.height = 300; // fixed graph height
}


/* ========================= MAIN GRAPH ========================= */

function drawTempGraph() {
    const ctx = state.ctx;
    const data = state.data;

    if (!ctx || !data.length) return;

    ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);

    // background
    ctx.fillStyle = "#0f1a33";
    ctx.fillRect(0, 0, state.canvas.width, state.canvas.height);

    // extract temps
    const temps = data.slice(0, 24).map(p => p.temperature);

    const max = Math.max(...temps);
    const min = Math.min(...temps);

    const stepX = state.canvas.width / (temps.length - 1);
    const scaleY = state.canvas.height / (max - min || 1);

    // draw line
    ctx.beginPath();
    ctx.strokeStyle = "#4ea3ff";
    ctx.lineWidth = 2;

    temps.forEach((t, i) => {
        const x = i * stepX;
        const y = state.canvas.height - (t - min) * scaleY;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });

    ctx.stroke();

    // dots
    ctx.fillStyle = "#ffffff";

    temps.forEach((t, i) => {
        const x = i * stepX;
        const y = state.canvas.height - (t - min) * scaleY;

        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
    });

    drawLabels(min, max);
}


/* ========================= LABELS ========================= */

function drawLabels(min, max) {
    const ctx = state.ctx;

    ctx.fillStyle = "#9ccaff";
    ctx.font = "12px Inter";

    ctx.fillText(`Min: ${Math.round(min)}°`, 10, 20);
    ctx.fillText(`Max: ${Math.round(max)}°`, 10, 40);
}
