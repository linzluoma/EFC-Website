/*
========================================================
Electric Flower Co.
Show Widgets
Version 2.0
========================================================

Reusable homepage and press-kit schedule widgets.
Requires shows-data.js and show-utils.js first.
*/

window.EFC = window.EFC || {};

(function (EFC) {
    "use strict";

    function getContainer(containerOrId) {
        if (typeof containerOrId === "string") {
            return document.getElementById(containerOrId);
        }

        return containerOrId || null;
    }

    function clearContainer(container) {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }

    function appendTextWithBreaks(element, value) {
        const text = String(value || "")
            .replace(/<br\s*\/?>/gi, "\n")
            .replace(/\s*\|\s*/g, "\n");

        text.split(/\n+/).forEach((line, index) => {
            if (index > 0) {
                element.appendChild(document.createElement("br"));
            }

            element.appendChild(document.createTextNode(line.trim()));
        });
    }

    function createMessage(className, text) {
        const message = document.createElement("p");
        message.className = className || "";
        message.style.textAlign = "center";
        message.textContent = text;
        return message;
    }

    function appendScheduleLink(container, className, url, text) {
        if (!url) {
            return;
        }

        const wrapper = document.createElement("div");
        wrapper.className = className;

        const link = document.createElement("a");
        link.href = url;
        link.textContent = text;

        wrapper.appendChild(link);
        container.appendChild(wrapper);
    }

    EFC.renderHomeShows = function (containerOrId, options) {
        const settings = Object.assign({
            limit: 4,
            publicOnly: true,
            featuredOnly: false,
            scheduleUrl: "/shows.html",
            scheduleLinkText: "View Complete Schedule →",
            emptyMessage: "No upcoming shows."
        }, options || {});

        const container = getContainer(containerOrId);

        if (!container) {
            console.warn("[EFC Widgets] Homepage show container not found.");
            return;
        }

        if (typeof EFC.getUpcomingShows !== "function") {
            clearContainer(container);
            container.appendChild(createMessage("", "Unable to load schedule."));
            return;
        }

        const shows = EFC.getUpcomingShows({
            publicOnly: settings.publicOnly,
            featuredOnly: settings.featuredOnly,
            limit: settings.limit
        });

        clearContainer(container);

        if (!shows.length) {
            container.appendChild(createMessage("", settings.emptyMessage));
            return;
        }

        shows.forEach(show => {
            const row = document.createElement("div");
            row.className = "home-show";

            const date = document.createElement("div");
            date.className = "home-date";
            date.textContent = EFC.formatShortDate(show.date);

            const venue = document.createElement("div");
            venue.className = "home-venue";
            appendTextWithBreaks(venue, show.venue);

            const city = document.createElement("div");
            city.className = "home-city";
            city.textContent = EFC.formatLocation(show);

            row.append(date, venue, city);
            container.appendChild(row);
        });

        appendScheduleLink(
            container,
            "home-link",
            settings.scheduleUrl,
            settings.scheduleLinkText
        );
    };

    EFC.renderEPKShows = function (containerOrId, options) {
        const settings = Object.assign({
            limit: 6,
            publicOnly: false,
            featuredOnly: false,
            scheduleUrl: "/shows.html",
            scheduleLinkText: "View Complete Schedule →",
            emptyMessage: "No upcoming shows."
        }, options || {});

        const container = getContainer(containerOrId);

        if (!container) {
            console.warn("[EFC Widgets] EPK show container not found.");
            return;
        }

        if (typeof EFC.getUpcomingShows !== "function") {
            clearContainer(container);
            container.appendChild(createMessage("", "Unable to load schedule."));
            return;
        }

        const shows = EFC.getUpcomingShows({
            publicOnly: settings.publicOnly,
            featuredOnly: settings.featuredOnly,
            limit: settings.limit
        });

        clearContainer(container);

        if (!shows.length) {
            container.appendChild(createMessage("", settings.emptyMessage));
            return;
        }

        const list = document.createElement("div");
        list.className = "epk-show-list";

        shows.forEach(show => {
            const card = document.createElement("div");
            card.className = "epk-show";

            const venue = document.createElement("span");
            venue.className = "epk-venue";
            appendTextWithBreaks(venue, show.venue);

            const details = document.createElement("span");
            details.className = "epk-details";
            details.appendChild(document.createTextNode(EFC.formatShortDate(show.date)));
            details.appendChild(document.createElement("br"));
            details.appendChild(document.createTextNode(EFC.formatLocation(show)));

            card.append(venue, details);
            list.appendChild(card);
        });

        container.appendChild(list);

        appendScheduleLink(
            container,
            "efc-link",
            settings.scheduleUrl,
            settings.scheduleLinkText
        );
    };

    console.log("[EFC Widgets] show-widgets.js v2.0 loaded.");

})(window.EFC);
