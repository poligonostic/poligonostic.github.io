/* =========================================================
   POLIGONISTIC WEATHER
   UTILS MODULE
   (Shared helper functions for all scripts)
========================================================= */


/* ========================= DOM HELPERS ========================= */

export function $(id) {
    return document.getElementById(id);
}

export function create(tag, className = "") {
    const el = document.createElement(tag);
    if (className) el.className = className;
    return el;
}


/* ========================= WEATHER HELPERS ========================= */

export function cToF(c) {
    return (c * 9/5) + 32;
}

export function fToC(f) {
    return (f - 32) * 5/9;
}

export function formatTemp(value, unit = "F") {
    return `${Math.round(value)}°${unit}`;
}


/* ========================= TIME HELPERS ========================= */

export function formatTime(dateString) {
    const d = new Date(dateString);
    return d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
}

export function formatDate(dateString) {
    const d = new Date(dateString);
    return d.toLocaleDateString([], {
        weekday: "short",
        month: "short",
        day: "numeric"
    });
}


/* ========================= SAFE FETCH ========================= */

export async function safeFetch(url) {
    try {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Fetch failed: ${res.status}`);
        }

        return await res.json();

    } catch (err) {
        console.error("safeFetch error:", err);
        return null;
    }
}


/* ========================= FORECAST HELPERS ========================= */

export function getShortForecast(period) {
    if (!period) return "No data";
    return period.shortForecast || "Unknown";
}


/* ========================= DEBUG HELPERS ========================= */

export function logGroup(title, data) {
    console.group(`🌤️ ${title}`);
    console.log(data);
    console.groupEnd();
}
