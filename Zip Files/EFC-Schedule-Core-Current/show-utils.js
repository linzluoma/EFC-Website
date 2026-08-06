/*
========================================================
Electric Flower Co.
Show Utilities
Version 2.0
========================================================

Shared data, date, sorting, and filtering helpers.
This file does not render HTML.
*/

window.EFC = window.EFC || {};

(function (EFC) {
    "use strict";

    const SHORT_MONTHS = [
        "Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.",
        "Jul.", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."
    ];

    EFC.getAllShows = function () {
        if (!Array.isArray(window.EFC_SHOWS)) {
            return [];
        }

        return window.EFC_SHOWS.slice();
    };

    EFC.getToday = function () {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
    };

    EFC.parseDate = function (dateString) {
        const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(dateString || ""));

        if (!match) {
            return null;
        }

        const year = Number(match[1]);
        const month = Number(match[2]);
        const day = Number(match[3]);
        const date = new Date(year, month - 1, day);
        date.setHours(0, 0, 0, 0);

        if (
            date.getFullYear() !== year ||
            date.getMonth() !== month - 1 ||
            date.getDate() !== day
        ) {
            return null;
        }

        return date;
    };

    EFC.isValidShow = function (show) {
        return Boolean(
            show &&
            typeof show === "object" &&
            typeof show.date === "string" &&
            typeof show.venue === "string" &&
            EFC.parseDate(show.date)
        );
    };

    EFC.formatShortDate = function (dateString) {
        const date = EFC.parseDate(dateString);
        return date ? `${SHORT_MONTHS[date.getMonth()]} ${date.getDate()}` : "";
    };

    EFC.formatLongDate = function (dateString) {
        const date = EFC.parseDate(dateString);

        if (!date) {
            return "";
        }

        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    };

    EFC.formatLocation = function (show) {
        if (!show) {
            return "";
        }

        const city = String(show.city || "").trim();
        const state = String(show.state || "").trim();

        if (city && state) {
            return `${city}, ${state}`;
        }

        return city || state;
    };

    EFC.filterShows = function (options) {
        const settings = Object.assign({
            timeframe: "all",
            publicOnly: false,
            privateOnly: false,
            featuredOnly: false,
            category: "",
            categories: [],
            tags: [],
            sort: "asc",
            limit: null
        }, options || {});

        const today = EFC.getToday();
        let shows = EFC.getAllShows().filter(EFC.isValidShow);

        if (settings.timeframe === "upcoming") {
            shows = shows.filter(show => EFC.parseDate(show.date) >= today);
        } else if (settings.timeframe === "past") {
            shows = shows.filter(show => EFC.parseDate(show.date) < today);
        }

        if (settings.publicOnly) {
            shows = shows.filter(show => show.public !== false);
        }

        if (settings.privateOnly) {
            shows = shows.filter(show => show.public === false);
        }

        if (settings.featuredOnly) {
            shows = shows.filter(show => show.featured === true);
        }

        if (settings.category) {
            shows = shows.filter(show => show.category === settings.category);
        }

        if (Array.isArray(settings.categories) && settings.categories.length) {
            shows = shows.filter(show => settings.categories.includes(show.category));
        }

        if (Array.isArray(settings.tags) && settings.tags.length) {
            shows = shows.filter(show => {
                const showTags = Array.isArray(show.tags) ? show.tags : [];
                return settings.tags.every(tag => showTags.includes(tag));
            });
        }

        shows.sort((a, b) => a.date.localeCompare(b.date));

        if (settings.sort === "desc") {
            shows.reverse();
        }

        if (Number.isInteger(settings.limit) && settings.limit >= 0) {
            shows = shows.slice(0, settings.limit);
        }

        return shows;
    };

    EFC.getUpcomingShows = function (options) {
        return EFC.filterShows(Object.assign({}, options || {}, {
            timeframe: "upcoming",
            sort: "asc"
        }));
    };

    EFC.getPastShows = function (options) {
        return EFC.filterShows(Object.assign({}, options || {}, {
            timeframe: "past",
            sort: "desc"
        }));
    };

    EFC.getPublicShows = function (options) {
        return EFC.filterShows(Object.assign({}, options || {}, {
            publicOnly: true
        }));
    };

    EFC.getPrivateShows = function (options) {
        return EFC.filterShows(Object.assign({}, options || {}, {
            privateOnly: true
        }));
    };

    EFC.getFeaturedShows = function (options) {
        return EFC.filterShows(Object.assign({}, options || {}, {
            featuredOnly: true
        }));
    };

    EFC.getNextShow = function (options) {
        const shows = EFC.getUpcomingShows(Object.assign({}, options || {}, {
            limit: 1
        }));

        return shows.length ? shows[0] : null;
    };

})(window.EFC);
