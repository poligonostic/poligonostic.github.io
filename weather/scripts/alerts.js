/* =========================================================
   POLIGONISTIC WEATHER
   ALERTS MODULE (NOAA)
========================================================= */

import { $, safeFetch } from "./utils.js";


let state = {
    alerts: []
};


/* ========================= INIT ========================= */

export async function initAlerts(lat, lon) {
    try {
        const url = `https://api.weather.gov/alerts/active?point=${lat},${lon}`;

        const data = await safeFetch(url);

        state.alerts = data?.features || [];

        renderAlerts();

        // auto refresh every 2 minutes
        setInterval(() => {
            refreshAlerts(lat, lon);
        }, 120000);

    } catch (err) {
        console.error("alerts.js error:", err);
        $("alerts").innerHTML = "";
    }
}


/* ========================= REFRESH ========================= */

async function refreshAlerts(lat, lon) {
    const url = `https://api.weather.gov/alerts/active?point=${lat},${lon}`;

    const data = await safeFetch(url);

    state.alerts = data?.features || [];

    renderAlerts();
}


/* ========================= RENDER ========================= */

function renderAlerts() {
    const container = $("alerts");

    if (!container) return;

    if (!state.alerts.length) {
        container.innerHTML = ""; // no alerts = clean UI
        return;
    }

    let html = `<h2 style="color:#ff5555;">Weather Alerts</h2>`;

    for (const alert of state.alerts) {
        const props = alert.properties;

        html += `
            <div style="
                border:2px solid #ff5555;
                padding:10px;
                margin-bottom:10px;
                border-radius:10px;
                background:rgba(255,0,0,0.05);
            ">
                <h3 style="margin:0;color:#ff8888;">
                    ${props.event || "Alert"}
                </h3>

                <p style="margin:5px 0;">
                    ${props.headline || ""}
                </p>

                <small>
                    Severity: ${props.severity || "Unknown"}<br>
                    Area: ${props.areaDesc || "Unknown"}
                </small>
            </div>
        `;
    }

    container.innerHTML = html;
}
