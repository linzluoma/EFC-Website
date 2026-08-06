/*
========================================================
Electric Flower Co.
Venue Utilities
Version 1.3
========================================================

Requires:
1. shows-data.js
2. show-utils.js
3. venues-data.js
4. venue-utils.js

This file contains data helpers only.
It does not render HTML.
========================================================
*/

window.EFC = window.EFC || {};

(function (EFC) {
    "use strict";

    const DEFAULT_FILTERS = {
        search: "",
        category: "",
        region: "",
        featured: null,
        privateEvent: null,
        hasUpcoming: null,
        sortBy: "name",
        sortDirection: "asc",
        limit: null
    };

    function normalize(value) {
        return String(value || "")
            .toLowerCase()
            .replace(/\s+/g, " ")
            .trim();
    }

    function cloneArray(value) {
        return Array.isArray(value)
            ? value.slice()
            : [];
    }

    function parseDate(dateString) {
        if (
            EFC.parseDate &&
            typeof EFC.parseDate === "function"
        ) {
            return EFC.parseDate(dateString);
        }

        const parts =
            String(dateString || "").split("-");

        if (parts.length !== 3) {
            return null;
        }

        const date = new Date(
            Number(parts[0]),
            Number(parts[1]) - 1,
            Number(parts[2])
        );

        date.setHours(0, 0, 0, 0);

        return Number.isNaN(date.getTime())
            ? null
            : date;
    }

    function getToday() {
        if (
            EFC.getToday &&
            typeof EFC.getToday === "function"
        ) {
            return EFC.getToday();
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return today;
    }

    function getVenueSourceIds(venue) {
        return cloneArray(
            venue && venue.sourceShowIds
        ).filter(Boolean);
    }

    function getAllShows() {
        if (
            EFC.getAllShows &&
            typeof EFC.getAllShows === "function"
        ) {
            return EFC.getAllShows();
        }

        return Array.isArray(window.EFC_SHOWS)
            ? window.EFC_SHOWS.slice()
            : [];
    }

    function compareStrings(a, b) {
        return String(a || "")
            .localeCompare(
                String(b || ""),
                undefined,
                { sensitivity: "base" }
            );
    }

    function uniqueSorted(values) {
        return Array.from(
            new Set(
                values
                    .map(value =>
                        String(value || "").trim()
                    )
                    .filter(Boolean)
            )
        ).sort(compareStrings);
    }

    function isVenueValid(venue) {
        return Boolean(
            venue &&
            typeof venue === "object" &&
            venue.id &&
            venue.name
        );
    }

    function getBaseVenues() {
        if (!Array.isArray(window.EFC_VENUES)) {
            return [];
        }

        return window.EFC_VENUES.filter(
            isVenueValid
        );
    }

    function getShowsForVenue(venueOrId) {
        const venue =
            typeof venueOrId === "string"
                ? EFC.getVenueById(venueOrId)
                : venueOrId;

        if (!venue) {
            return [];
        }

        const ids =
            new Set(
                getVenueSourceIds(venue)
            );

        if (!ids.size) {
            return [];
        }

        return getAllShows()
            .filter(show =>
                ids.has(show.id)
            )
            .sort((a, b) =>
                String(a.date || "")
                    .localeCompare(
                        String(b.date || "")
                    )
            );
    }

    function getPastAndUpcoming(shows) {
        const today = getToday();

        const past = [];
        const upcoming = [];

        shows.forEach(show => {
            const date = parseDate(show.date);

            if (!date) {
                return;
            }

            if (date >= today) {
                upcoming.push(show);
            } else {
                past.push(show);
            }
        });

        past.sort((a, b) =>
            String(b.date || "")
                .localeCompare(
                    String(a.date || "")
                )
        );

        upcoming.sort((a, b) =>
            String(a.date || "")
                .localeCompare(
                    String(b.date || "")
                )
        );

        return { past, upcoming };
    }

    function getVenueStatsInternal(venue) {
        const shows =
            getShowsForVenue(venue);

        const split =
            getPastAndUpcoming(shows);

        const chronological =
            shows.slice().sort((a, b) =>
                String(a.date || "")
                    .localeCompare(
                        String(b.date || "")
                    )
            );

        return {
            venueId: venue.id,
            performances: shows.length,
            publicShows:
                shows.filter(show =>
                    show.public !== false
                ).length,
            privateShows:
                shows.filter(show =>
                    show.public === false
                ).length,
            firstShow:
                chronological[0] || null,
            lastShow:
                chronological[
                    chronological.length - 1
                ] || null,
            mostRecentPastShow:
                split.past[0] || null,
            nextShow:
                split.upcoming[0] || null,
            pastShows: split.past,
            upcomingShows: split.upcoming,
            yearsPlayed:
                uniqueSorted(
                    shows.map(show =>
                        String(show.date || "")
                            .slice(0, 4)
                    )
                )
        };
    }

    function enrichVenue(venue) {
        const stats =
            getVenueStatsInternal(venue);

        return Object.assign(
            {},
            venue,
            {
                displayName:
                    venue.displayName ||
                    venue.name,
                featuredOrder:
                    venue.featuredOrder === null ||
                    venue.featuredOrder === undefined ||
                    venue.featuredOrder === ""
                        ? null
                        : Number(venue.featuredOrder),
                logoFile:
                    venue.logoFile ||
                    venue.logo ||
                    "",
                url:
                    "/venues/" +
                    encodeURIComponent(venue.id),
                stats
            }
        );
    }

    function venueMatchesSearch(
        venue,
        search
    ) {
        const query =
            normalize(search);

        if (!query) {
            return true;
        }

        const text = normalize([
            venue.name,
            venue.displayName,
            venue.city,
            venue.state,
            venue.category,
            venue.region,
            cloneArray(
                venue.alternateNames
            ).join(" "),
            cloneArray(
                venue.eventSeries
            ).join(" ")
        ].join(" "));

        return text.includes(query);
    }

    function sortVenues(
        venues,
        sortBy,
        direction
    ) {
        const multiplier =
            direction === "desc"
                ? -1
                : 1;

        const sorted =
            venues.slice();

        sorted.sort((a, b) => {
            const aStats =
                a.stats ||
                getVenueStatsInternal(a);

            const bStats =
                b.stats ||
                getVenueStatsInternal(b);

            if (sortBy === "featuredOrder") {
                const aOrder =
                    a.featuredOrder === null ||
                    a.featuredOrder === undefined ||
                    a.featuredOrder === ""
                        ? Number.MAX_SAFE_INTEGER
                        : Number(a.featuredOrder);

                const bOrder =
                    b.featuredOrder === null ||
                    b.featuredOrder === undefined ||
                    b.featuredOrder === ""
                        ? Number.MAX_SAFE_INTEGER
                        : Number(b.featuredOrder);

                if (aOrder !== bOrder) {
                    return (
                        aOrder -
                        bOrder
                    ) * multiplier;
                }

                return compareStrings(
                    a.displayName ||
                    a.name,
                    b.displayName ||
                    b.name
                );
            }

            if (sortBy === "performances") {
                return (
                    aStats.performances -
                    bStats.performances
                ) * multiplier;
            }

            if (sortBy === "lastPlayed") {
                return compareStrings(
                    aStats.lastShow &&
                    aStats.lastShow.date,
                    bStats.lastShow &&
                    bStats.lastShow.date
                ) * multiplier;
            }

            if (sortBy === "upcoming") {
                const aDate =
                    aStats.nextShow
                        ? aStats.nextShow.date
                        : "9999-12-31";

                const bDate =
                    bStats.nextShow
                        ? bStats.nextShow.date
                        : "9999-12-31";

                return compareStrings(
                    aDate,
                    bDate
                ) * multiplier;
            }

            if (sortBy === "city") {
                const cityCompare =
                    compareStrings(
                        a.city,
                        b.city
                    );

                return cityCompare
                    ? cityCompare * multiplier
                    : compareStrings(
                        a.displayName ||
                        a.name,
                        b.displayName ||
                        b.name
                    ) * multiplier;
            }

            return compareStrings(
                a.displayName ||
                a.name,
                b.displayName ||
                b.name
            ) * multiplier;
        });

        return sorted;
    }

    EFC.isValidVenue =
        isVenueValid;

    EFC.getAllVenues =
        function (options) {
            const settings =
                Object.assign(
                    {},
                    DEFAULT_FILTERS,
                    options || {}
                );

            let venues =
                getBaseVenues()
                    .map(enrichVenue);

            if (settings.search) {
                venues =
                    venues.filter(venue =>
                        venueMatchesSearch(
                            venue,
                            settings.search
                        )
                    );
            }

            if (settings.category) {
                venues =
                    venues.filter(venue =>
                        venue.category ===
                        settings.category
                    );
            }

            if (settings.region) {
                venues =
                    venues.filter(venue =>
                        venue.region ===
                        settings.region
                    );
            }

            if (
                typeof settings.featured ===
                "boolean"
            ) {
                venues =
                    venues.filter(venue =>
                        venue.featured ===
                        settings.featured
                    );
            }

            if (
                typeof settings.privateEvent ===
                "boolean"
            ) {
                venues =
                    venues.filter(venue =>
                        venue.privateEvent ===
                        settings.privateEvent
                    );
            }

            if (
                typeof settings.hasUpcoming ===
                "boolean"
            ) {
                venues =
                    venues.filter(venue =>
                        Boolean(
                            venue.stats
                                .upcomingShows
                                .length
                        ) ===
                        settings.hasUpcoming
                    );
            }

            venues =
                sortVenues(
                    venues,
                    settings.sortBy,
                    settings.sortDirection
                );

            if (
                Number.isInteger(
                    settings.limit
                ) &&
                settings.limit >= 0
            ) {
                venues =
                    venues.slice(
                        0,
                        settings.limit
                    );
            }

            return venues;
        };

    EFC.getVenueById =
        function (id) {
            const venue =
                getBaseVenues().find(
                    item =>
                        item.id === id
                );

            return venue
                ? enrichVenue(venue)
                : null;
        };

    EFC.getVenue =
        EFC.getVenueById;

    EFC.getVenueByName =
        function (name) {
            const query =
                normalize(name);

            if (!query) {
                return null;
            }

            const venue =
                getBaseVenues().find(item => {
                    if (
                        normalize(item.name) ===
                        query
                    ) {
                        return true;
                    }

                    if (
                        normalize(
                            item.displayName
                        ) === query
                    ) {
                        return true;
                    }

                    return cloneArray(
                        item.alternateNames
                    ).some(
                        alias =>
                            normalize(alias) ===
                            query
                    );
                });

            return venue
                ? enrichVenue(venue)
                : null;
        };

    EFC.getVenueHistory =
        function (venueId) {
            const venue =
                EFC.getVenueById(
                    venueId
                );

            if (!venue) {
                return null;
            }

            return {
                venue,
                shows:
                    getShowsForVenue(
                        venue
                    ),
                stats:
                    venue.stats
            };
        };

    EFC.getVenueStats =
        function (venueId) {
            const venue =
                EFC.getVenueById(
                    venueId
                );

            return venue
                ? venue.stats
                : null;
        };

    EFC.getVenuePerformanceCount =
        function (venueId) {
            const stats =
                EFC.getVenueStats(
                    venueId
                );

            return stats
                ? stats.performances
                : 0;
        };

    EFC.getUpcomingVenueShows =
        function (venueId) {
            const stats =
                EFC.getVenueStats(
                    venueId
                );

            return stats
                ? stats.upcomingShows.slice()
                : [];
        };

    EFC.getPastVenueShows =
        function (venueId) {
            const stats =
                EFC.getVenueStats(
                    venueId
                );

            return stats
                ? stats.pastShows.slice()
                : [];
        };

    EFC.getFeaturedVenues =
        function (options) {
            const settings =
                Object.assign(
                    {
                        limit: null,
                        includePrivate: false,
                        sortBy:
                            "featuredOrder",
                        sortDirection:
                            "asc"
                    },
                    options || {}
                );

            return EFC.getAllVenues({
                featured: true,
                privateEvent:
                    settings.includePrivate
                        ? null
                        : false,
                sortBy:
                    settings.sortBy,
                sortDirection:
                    settings.sortDirection,
                limit:
                    settings.limit
            });
        };

    EFC.searchVenues =
        function (search, options) {
            return EFC.getAllVenues(
                Object.assign(
                    {},
                    options || {},
                    { search }
                )
            );
        };

    EFC.filterVenues =
        function (options) {
            return EFC.getAllVenues(
                options || {}
            );
        };

    EFC.getVenueCategories =
        function (options) {
            const venues =
                EFC.getAllVenues(
                    Object.assign(
                        {
                            sortBy: "name",
                            limit: null
                        },
                        options || {}
                    )
                );

            return uniqueSorted(
                venues.map(
                    venue =>
                        venue.category
                )
            );
        };

    EFC.getVenueRegions =
        function (options) {
            const venues =
                EFC.getAllVenues(
                    Object.assign(
                        {
                            sortBy: "name",
                            limit: null
                        },
                        options || {}
                    )
                );

            return uniqueSorted(
                venues.map(
                    venue =>
                        venue.region
                )
            );
        };

    EFC.groupVenuesByCategory =
        function (options) {
            const groups =
                new Map();

            EFC.getAllVenues(
                options || {}
            ).forEach(venue => {
                const key =
                    venue.category ||
                    "Uncategorized";

                if (!groups.has(key)) {
                    groups.set(
                        key,
                        []
                    );
                }

                groups.get(key)
                    .push(venue);
            });

            return groups;
        };

    EFC.groupVenuesByRegion =
        function (options) {
            const groups =
                new Map();

            EFC.getAllVenues(
                options || {}
            ).forEach(venue => {
                const key =
                    venue.region ||
                    "Uncategorized";

                if (!groups.has(key)) {
                    groups.set(
                        key,
                        []
                    );
                }

                groups.get(key)
                    .push(venue);
            });

            return groups;
        };

    EFC.getVenueOverviewStats =
        function (options) {
            const venues =
                EFC.getAllVenues(
                    Object.assign(
                        {
                            sortBy: "name",
                            limit: null
                        },
                        options || {}
                    )
                );

            return {
                venues:
                    venues.length,
                publicVenues:
                    venues.filter(
                        venue =>
                            !venue.privateEvent
                    ).length,
                privateEngagements:
                    venues.filter(
                        venue =>
                            venue.privateEvent
                    ).length,
                featuredVenues:
                    venues.filter(
                        venue =>
                            venue.featured
                    ).length,
                performances:
                    venues.reduce(
                        (total, venue) =>
                            total +
                            venue.stats
                                .performances,
                        0
                    ),
                categories:
                    uniqueSorted(
                        venues.map(
                            venue =>
                                venue.category
                        )
                    ).length,
                regions:
                    uniqueSorted(
                        venues.map(
                            venue =>
                                venue.region
                        )
                    ).length
            };
        };

    console.log(
        "[EFC Venue Utils] venue-utils.js v1.3 loaded."
    );

})(window.EFC);
