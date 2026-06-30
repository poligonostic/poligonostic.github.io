/* =========================================================
   POLIGONISTIC WEATHER
   CENTRAL WEATHER API LAYER
========================================================= */

import { safeFetch } from "./utils.js";


let cache = {
    point: null,
    forecast: null,
    hourly: null,
    stations: null,
    alerts: null
};


/* ========================= CORE POINT DATA ========================= */

export async function getPoint(lat, lon) {
    if (cache.point && cache.pointKey === `${lat},${lon}`) {
        return cache.point;
    }

    const url = `https://api.weather.gov/points/${lat},${lon}`;
    const data = await safeFetch(url);

    cache.point = data;
    cache.pointKey = `${lat},${lon}`;

    return data;
}


/* ========================= FORECAST ========================= */

export async function getForecast(lat, lon) {
    const point = await getPoint(lat, lon);

    const url = point?.properties?.forecast;
    if (!url) return null;

    if (cache.forecast) return cache.forecast;

    const data = await safeFetch(url);
    cache.forecast = data;

    return data;
}


/* ========================= HOURLY ========================= */

export async function getHourly(lat, lon) {
    const point = await getPoint(lat, lon);

    const url = point?.properties?.forecastHourly;
    if (!url) return null;

    if (cache.hourly) return cache.hourly;

    const data = await safeFetch(url);
    cache.hourly = data;

    return data;
}


/* ========================= ALERTS ========================= */

export async function getAlerts(lat, lon) {
    const url = `https://api.weather.gov/alerts/active?point=${lat},${lon}`;

    if (cache.alerts) return cache.alerts;

    const data = await safeFetch(url);
    cache.alerts = data;

    return data;
}


/* ========================= STATIONS ========================= */

export async function getStations(lat, lon) {
    const point = await getPoint(lat, lon);

    const url = point?.properties?.observationStations;
    if (!url) return null;

    if (cache.stations) return cache.stations;

    const data = await safeFetch(url);
    cache.stations = data;

    return data;
}


/* ========================= CLEAR CACHE ========================= */

export function clearWeatherCache() {
    cache = {
        point: null,
        forecast: null,
        hourly: null,
        stations: null,
        alerts: null
    };
}
