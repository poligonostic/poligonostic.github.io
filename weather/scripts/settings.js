/* =========================================================
   POLIGONISTIC WEATHER
   SETTINGS MODULE
========================================================= */

import { $ } from "./utils.js";


let state = {
    unit: "F", // default
};


/* ========================= INIT ========================= */

export function initSettings() {
    loadSettings();
    applySettings();
}


/* ========================= LOAD ========================= */

function loadSettings() {
    const saved = localStorage.getItem("poligonostic_settings");

    if (saved) {
        try {
            state = { ...state, ...JSON.parse(saved) };
        } catch (e) {
            console.warn("Settings parse failed");
        }
    }
}


/* ========================= SAVE ========================= */

function saveSettings() {
    localStorage.setItem("poligonostic_settings", JSON.stringify(state));
}


/* ========================= APPLY ========================= */

function applySettings() {
    document.documentElement.dataset.unit = state.unit;
}


/* ========================= TOGGLE UNITS ========================= */

export function toggleUnits() {
    state.unit = state.unit === "F" ? "C" : "F";

    saveSettings();
    applySettings();

    console.log("Unit changed to:", state.unit);
}


/* ========================= GETTERS ========================= */

export function getUnit() {
    return state.unit;
}


/* ========================= SETTERS ========================= */

export function setUnit(unit) {
    if (unit !== "F" && unit !== "C") return;

    state.unit = unit;

    saveSettings();
    applySettings();
}
