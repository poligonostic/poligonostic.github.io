/* =========================================================
   POLIGONISTIC WEATHER
   WEATHER API LAYER
   (Fetch + normalize weather.gov data)
========================================================= */

const API = {
    base: "https://api.weather.gov"
};


/* ========================= CORE FETCH HELPERS ========================= */

async function getJSON(url) {
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
    }

    return await res.json();
}


/* ========================= GET POINT DATA ========================= */

export async function getPoint(lat, lon) {
    return await getJSON(`${API.base}/points/${lat},${lon}`);
}


/* ========================= GET FORECAST ========================= */

export async function getForecast(forecastUrl) {
    const data = await getJSON(forecastUrl);
    return data.properties.periods;
}


/* ========================= GET HOURLY ========================= */

export async function getHourly(hourlyUrl) {
    const data = await getJSON(hourlyUrl);
    return data.properties.periods;
}


/* ========================= GET ALERTS ========================= */

export async function getAlerts(lat, lon) {
    const url = `${API.base}/alerts/active?point=${lat},${lon}`;
    const data = await getJSON(url);
    return data.features || [];
}


/* ========================= NORMALIZER ========================= */

export function normalizePoint(pointData) {
    return {
        city: pointData.properties.relativeLocation?.properties?.city || "Unknown",
        state: pointData.properties.relativeLocation?.properties?.state || "",
        forecastUrl: pointData.properties.forecast,
        hourlyUrl: pointData.properties.forecastHourly,
        gridId: pointData.properties.gridId,
        gridX: pointData.properties.gridX,
        gridY: pointData.properties.gridY
    };
}
