// Electric Flower Co. Schedule Engine
// Version 0.1

console.clear();

console.log("Schedule engine starting...");

if (window.EFC_SHOWS) {
    console.log(`Loaded ${window.EFC_SHOWS.length} shows.`);
    console.log(window.EFC_SHOWS);
} else {
    console.error("Could not find window.EFC_SHOWS");
}
