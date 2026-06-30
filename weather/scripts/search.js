/* =========================================================
   POLIGONISTIC WEATHER
   SEARCH MODULE
   (City → Lat/Lon resolver)
========================================================= */

import { $ } from "./utils.js";


let state = {
    lastResults: []
};


/* ========================= INIT ========================= */

export function initSearch() {
    const input = $("searchInput");

    if (!input) return;

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            searchCity(input.value);
        }
    });
}


/* ========================= SEARCH CITY ========================= */

export async function searchCity(query) {
    if (!query) return;

    try {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5`;

        const res = await fetch(url);
        const data = await res.json();

        state.lastResults = data.results || [];

        if (!state.lastResults.length) {
            alert("No locations found");
            return;
        }

        // take first result
        const place = state.lastResults[0];

        redirectToLocation(place);

    } catch (err) {
        console.error("search.js error:", err);
        alert("Search failed");
    }
}


/* ========================= REDIRECT ========================= */

function redirectToLocation(place) {
    const lat = place.latitude;
    const lon = place.longitude;
    const name = place.name;

    // simplest system: reload page with query params
    const url = new URL(window.location.href);

    url.searchParams.set("lat", lat);
    url.searchParams.set("lon", lon);
    url.searchParams.set("name", name);

    window.location.href = url.toString();
}
