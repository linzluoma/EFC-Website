/*
========================================================
Electric Flower Co.
Venue Map
Version 1.1
========================================================

Requires:
1. shows-data.js
2. show-utils.js
3. venues-data.js
4. venue-utils.js
5. Leaflet 1.9.4
6. venue-map.js

The map groups records that share a city-level coordinate.

Version 1.1 adds search and private-only filtering so the
map can stay synchronized with Venue History page controls.
========================================================
*/

window.EFC = window.EFC || {};

(function (EFC) {
    "use strict";

    const instances = new Map();

    function escapeHtml(value) {
        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function validCoordinate(value) {
        return Number.isFinite(Number(value));
    }

    function getMappableVenues(options) {
        const settings = Object.assign(
            {
                includePrivate: true,
                privateOnly: false,
                featuredOnly: false,
                search: "",
                category: "",
                region: ""
            },
            options || {}
        );

        if (typeof EFC.getAllVenues !== "function") {
            return [];
        }

        return EFC.getAllVenues({
            search: settings.search,
            featured:
                settings.featuredOnly
                    ? true
                    : null,
            privateEvent:
                settings.privateOnly
                    ? true
                    : (
                        settings.includePrivate
                            ? null
                            : false
                    ),
            category: settings.category,
            region: settings.region,
            sortBy: "name",
            sortDirection: "asc",
            limit: null
        }).filter(venue =>
            validCoordinate(venue.latitude) &&
            validCoordinate(venue.longitude)
        );
    }

    function groupVenuesByCoordinate(venues) {
        const groups = new Map();

        venues.forEach(venue => {
            const latitude = Number(venue.latitude);
            const longitude = Number(venue.longitude);
            const key =
                latitude.toFixed(5) +
                "," +
                longitude.toFixed(5);

            if (!groups.has(key)) {
                groups.set(key, {
                    latitude,
                    longitude,
                    city: venue.city || "",
                    state: venue.state || "",
                    venues: [],
                    performances: 0
                });
            }

            const group = groups.get(key);
            group.venues.push(venue);
            group.performances +=
                venue.stats
                    ? venue.stats.performances
                    : 0;
        });

        return Array.from(groups.values());
    }

    function createPopupHtml(group) {
        const venueItems = group.venues
            .slice()
            .sort((a, b) =>
                String(a.displayName || a.name)
                    .localeCompare(
                        String(b.displayName || b.name),
                        undefined,
                        { sensitivity: "base" }
                    )
            )
            .map(venue => {
                const performanceCount =
                    venue.stats
                        ? venue.stats.performances
                        : 0;

                return (
                    '<li class="efc-map-popup-venue">' +
                        '<strong>' +
                            escapeHtml(
                                venue.displayName ||
                                venue.name
                            ) +
                        '</strong>' +
                        '<span>' +
                            performanceCount +
                            " " +
                            (
                                performanceCount === 1
                                    ? "performance"
                                    : "performances"
                            ) +
                        '</span>' +
                    '</li>'
                );
            })
            .join("");

        const location = [
            group.city,
            group.state
        ].filter(Boolean).join(", ");

        return (
            '<div class="efc-map-popup">' +
                '<div class="efc-map-popup-location">' +
                    escapeHtml(location) +
                '</div>' +
                '<div class="efc-map-popup-summary">' +
                    group.venues.length +
                    " " +
                    (
                        group.venues.length === 1
                            ? "venue or engagement"
                            : "venues and engagements"
                    ) +
                    " · " +
                    group.performances +
                    " " +
                    (
                        group.performances === 1
                            ? "performance"
                            : "performances"
                    ) +
                '</div>' +
                '<ul class="efc-map-popup-list">' +
                    venueItems +
                '</ul>' +
            '</div>'
        );
    }

    function markerRadius(group) {
        return Math.max(
            7,
            Math.min(
                18,
                6 + Math.sqrt(
                    Math.max(
                        group.performances,
                        group.venues.length
                    )
                ) * 2
            )
        );
    }

    function updateSummary(container, venues, groups) {
        const summary =
            container.querySelector(
                "[data-efc-map-summary]"
            );

        if (!summary) {
            return;
        }

        const performances =
            venues.reduce(
                (total, venue) =>
                    total +
                    (
                        venue.stats
                            ? venue.stats.performances
                            : 0
                    ),
                0
            );

        summary.textContent =
            `${venues.length} ${
                venues.length === 1
                    ? "venue or engagement"
                    : "venues and engagements"
            } across ${groups.length} ${
                groups.length === 1
                    ? "location"
                    : "locations"
            } · ${performances} ${
                performances === 1
                    ? "performance"
                    : "performances"
            }`;
    }

    function buildMap(container, settings) {
        const mapElement =
            container.querySelector(
                "[data-efc-map-canvas]"
            );

        if (!mapElement) {
            return false;
        }

        const oldInstance =
            instances.get(container.id);

        if (oldInstance) {
            oldInstance.remove();
            instances.delete(container.id);
        }

        const venues =
            getMappableVenues(settings);

        const groups =
            groupVenuesByCoordinate(venues);

        updateSummary(
            container,
            venues,
            groups
        );

        if (!groups.length) {
            mapElement.innerHTML =
                "<p class='efc-map-empty'>No mapped venues match these filters.</p>";

            return true;
        }

        const map = L.map(mapElement, {
            scrollWheelZoom: false,
            zoomControl: true
        });

        instances.set(
            container.id,
            map
        );

        L.tileLayer(
            "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                maxZoom: 19,
                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }
        ).addTo(map);

        const bounds = [];

        groups.forEach(group => {
            const marker =
                L.circleMarker(
                    [
                        group.latitude,
                        group.longitude
                    ],
                    {
                        radius:
                            markerRadius(group),
                        weight: 2,
                        opacity: 0.9,
                        fillOpacity: 0.65
                    }
                );

            marker.bindPopup(
                createPopupHtml(group),
                {
                    maxWidth: 320
                }
            );

            marker.addTo(map);

            bounds.push([
                group.latitude,
                group.longitude
            ]);
        });

        if (bounds.length === 1) {
            map.setView(
                bounds[0],
                settings.singleMarkerZoom
            );
        } else {
            map.fitBounds(bounds, {
                padding: [28, 28],
                maxZoom:
                    settings.maxFitZoom
            });
        }

        setTimeout(
            function () {
                map.invalidateSize();
            },
            0
        );

        return true;
    }

    function createSelect(
        labelText,
        values,
        allText,
        changeHandler
    ) {
        const label =
            document.createElement("label");

        label.className =
            "efc-map-filter";

        const title =
            document.createElement("span");

        title.className =
            "efc-map-filter-label";
        title.textContent =
            labelText;

        const select =
            document.createElement("select");

        select.className =
            "efc-map-filter-select";

        const allOption =
            document.createElement("option");

        allOption.value = "";
        allOption.textContent =
            allText;

        select.appendChild(allOption);

        values.forEach(value => {
            const option =
                document.createElement("option");

            option.value = value;
            option.textContent = value;
            select.appendChild(option);
        });

        select.addEventListener(
            "change",
            function () {
                changeHandler(
                    select.value
                );
            }
        );

        label.append(
            title,
            select
        );

        return label;
    }

    EFC.renderVenueMap = function (
        containerId,
        options
    ) {
        const settings =
            Object.assign(
                {
                    includePrivate: true,
                    privateOnly: false,
                    featuredOnly: false,
                    search: "",
                    category: "",
                    region: "",
                    showFilters: true,
                    maxFitZoom: 9,
                    singleMarkerZoom: 10
                },
                options || {}
            );

        const container =
            document.getElementById(
                containerId
            );

        if (!container) {
            return false;
        }

        if (typeof L === "undefined") {
            container.innerHTML =
                "<p class='efc-map-error'>Leaflet map library not loaded.</p>";

            return false;
        }

        if (
            typeof EFC.getAllVenues !==
            "function"
        ) {
            container.innerHTML =
                "<p class='efc-map-error'>Venue utilities not loaded.</p>";

            return false;
        }

        container.replaceChildren();

        const shell =
            document.createElement("div");

        shell.className =
            "efc-venue-map-shell";

        if (settings.showFilters) {
            const controls =
                document.createElement("div");

            controls.className =
                "efc-map-controls";

            const categories =
                typeof EFC.getVenueCategories ===
                "function"
                    ? EFC.getVenueCategories()
                    : [];

            const regions =
                typeof EFC.getVenueRegions ===
                "function"
                    ? EFC.getVenueRegions()
                    : [];

            controls.append(
                createSelect(
                    "Category",
                    categories,
                    "All Categories",
                    function (value) {
                        settings.category =
                            value;

                        buildMap(
                            container,
                            settings
                        );
                    }
                ),
                createSelect(
                    "Region",
                    regions,
                    "All Regions",
                    function (value) {
                        settings.region =
                            value;

                        buildMap(
                            container,
                            settings
                        );
                    }
                )
            );

            const privateLabel =
                document.createElement("label");

            privateLabel.className =
                "efc-map-checkbox";

            const privateInput =
                document.createElement("input");

            privateInput.type =
                "checkbox";
            privateInput.checked =
                settings.includePrivate;

            const privateText =
                document.createElement("span");

            privateText.textContent =
                "Include private events";

            privateInput.addEventListener(
                "change",
                function () {
                    settings.includePrivate =
                        privateInput.checked;

                    buildMap(
                        container,
                        settings
                    );
                }
            );

            privateLabel.append(
                privateInput,
                privateText
            );

            controls.appendChild(
                privateLabel
            );

            shell.appendChild(
                controls
            );
        }

        const summary =
            document.createElement("div");

        summary.className =
            "efc-map-summary";
        summary.dataset.efcMapSummary =
            "";

        shell.appendChild(summary);

        const mapCanvas =
            document.createElement("div");

        mapCanvas.className =
            "efc-venue-map-canvas";
        mapCanvas.dataset.efcMapCanvas =
            "";

        shell.appendChild(mapCanvas);
        container.appendChild(shell);

        return buildMap(
            container,
            settings
        );
    };

    console.log(
        "[EFC Venue Map] venue-map.js v1.1 loaded."
    );

})(window.EFC);
