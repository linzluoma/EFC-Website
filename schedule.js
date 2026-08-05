/*
========================================================
Electric Flower Co.
Full Schedule Renderer
Version 2.0
========================================================

Requires, in this order:
1. shows-data.js
2. show-utils.js
3. schedule.js
*/

window.EFC = window.EFC || {};

(function (EFC) {
    "use strict";

    const SETTINGS = {
        debug: true,
        hidePrivateShows: false,
        upcomingEmptyMessage: "No upcoming shows are currently listed.",
        pastEmptyMessage: "No past shows are currently listed.",
        ticketButtonText: "Tickets",
        websiteButtonText: "Venue Website"
    };

    function log(...messages) {
        if (SETTINGS.debug) {
            console.log("[EFC Schedule]", ...messages);
        }
    }

    function warn(...messages) {
        console.warn("[EFC Schedule]", ...messages);
    }

    function createElement(tagName, className, textContent) {
        const element = document.createElement(tagName);

        if (className) {
            element.className = className;
        }

        if (textContent !== undefined && textContent !== null) {
            element.textContent = textContent;
        }

        return element;
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

    function createDateBlock(show) {
        const date = EFC.parseDate(show.date);
        const block = createElement("div", "efc-date");

        block.dataset.fullDate = show.time
            ? `${EFC.formatLongDate(show.date)} (${show.time})`
            : EFC.formatLongDate(show.date);

        block.append(
            createElement("div", "efc-month", date.toLocaleDateString("en-US", { month: "short" }).toUpperCase()),
            createElement("div", "efc-day", String(date.getDate()).padStart(2, "0")),
            createElement("div", "efc-year", String(date.getFullYear()))
        );

        return block;
    }

    function createVenueBlock(show) {
        const main = createElement("div", "efc-main");
        const venue = createElement("div", "efc-venue");

        if (show.website) {
            const link = createElement("a");
            link.href = show.website;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.style.color = "inherit";
            link.style.textDecoration = "none";
            appendTextWithBreaks(link, show.venue);
            venue.appendChild(link);
        } else {
            appendTextWithBreaks(venue, show.venue);
        }

        main.appendChild(venue);
        return main;
    }

    function createLocationBlock(show) {
        const location = createElement("div", "efc-location");
        const locationText = EFC.formatLocation(show);

        if (locationText) {
            location.appendChild(createElement("div", "efc-city", locationText));
        }

        if (show.time) {
            location.appendChild(createElement("div", "efc-time", show.time));
        }

        return location;
    }

    function createActionBlock(show) {
        const action = createElement("div", "efc-action");
        const url = show.ticketLink || show.website || "";
        const label = show.ticketLink
            ? SETTINGS.ticketButtonText
            : (show.website ? SETTINGS.websiteButtonText : "");

        if (url) {
            const link = createElement("a", "", label);
            link.href = url;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            action.appendChild(link);
        }

        return action;
    }

    function createShowCard(show) {
        if (!EFC.isValidShow(show)) {
            warn("Skipping invalid show:", show);
            return null;
        }

        const article = createElement("article", "efc-show");

        if (show.id) {
            article.id = show.id;
        }

        article.dataset.showDate = show.date;
        article.dataset.category = show.category || "";
        article.dataset.public = String(show.public !== false);
        article.dataset.featured = String(show.featured === true);

        article.append(
            createDateBlock(show),
            createVenueBlock(show),
            createLocationBlock(show),
            createActionBlock(show)
        );

        return article;
    }

    function createEmptyMessage(message) {
        const paragraph = createElement("p", "efc-empty-message", message);
        paragraph.style.padding = "24px 0";
        paragraph.style.opacity = "0.65";
        return paragraph;
    }

    function renderShowList(container, shows, emptyMessage) {
        container.replaceChildren();

        if (!shows.length) {
            container.appendChild(createEmptyMessage(emptyMessage));
            return;
        }

        const fragment = document.createDocumentFragment();

        shows.forEach(show => {
            const card = createShowCard(show);
            if (card) {
                fragment.appendChild(card);
            }
        });

        container.appendChild(fragment);
    }

    function updateTabCount(selector, label, count) {
        const tab = document.querySelector(selector);

        if (tab) {
            tab.innerHTML = `${label} <span class="efc-count">(${count})</span>`;
        }
    }

    function renderSchedule() {
        const upcomingContainer = document.getElementById("upcomingShows");
        const pastContainer = document.getElementById("pastShows");

        if (!upcomingContainer || !pastContainer) {
            return false;
        }

        if (typeof EFC.getUpcomingShows !== "function") {
            throw new Error("show-utils.js was not loaded before schedule.js.");
        }

        const filtering = {
            publicOnly: SETTINGS.hidePrivateShows
        };

        const upcomingShows = EFC.getUpcomingShows(filtering);
        const pastShows = EFC.getPastShows(filtering);

        renderShowList(upcomingContainer, upcomingShows, SETTINGS.upcomingEmptyMessage);
        renderShowList(pastContainer, pastShows, SETTINGS.pastEmptyMessage);

        updateTabCount('[data-tab="upcomingPanel"]', "Upcoming Shows", upcomingShows.length);
        updateTabCount('[data-tab="pastPanel"]', "Past Shows", pastShows.length);

        log(`Loaded ${EFC.getAllShows().length} total shows.`);
        log(`Rendered ${upcomingShows.length} upcoming shows.`);
        log(`Rendered ${pastShows.length} past shows.`);

        return true;
    }

    function activateTab(selectedButton, buttons, panels) {
        const targetPanelId = selectedButton.dataset.tab;

        buttons.forEach(button => {
            const isActive = button === selectedButton;
            button.classList.toggle("active", isActive);
            button.setAttribute("aria-selected", String(isActive));
            button.tabIndex = isActive ? 0 : -1;
        });

        panels.forEach(panel => {
            panel.classList.toggle("active", panel.id === targetPanelId);
        });
    }

    function initializeTabs() {
        const buttons = Array.from(document.querySelectorAll(".efc-schedule-tab"));
        const panels = Array.from(document.querySelectorAll(".efc-panel"));

        if (!buttons.length || !panels.length) {
            return;
        }

        buttons.forEach((button, index) => {
            button.addEventListener("click", () => {
                activateTab(button, buttons, panels);
            });

            button.addEventListener("keydown", event => {
                if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
                    return;
                }

                event.preventDefault();
                const direction = event.key === "ArrowRight" ? 1 : -1;
                const nextIndex = (index + direction + buttons.length) % buttons.length;
                buttons[nextIndex].focus();
                activateTab(buttons[nextIndex], buttons, panels);
            });
        });

        const initialButton = buttons.find(button => button.classList.contains("active")) || buttons[0];
        activateTab(initialButton, buttons, panels);
    }

    function displayScheduleError() {
        const container = document.getElementById("upcomingShows");

        if (container) {
            container.replaceChildren(
                createEmptyMessage("The schedule could not be loaded. Please try again later.")
            );
        }
    }

    function initializeSchedule() {
        try {
            const rendered = renderSchedule();

            if (!rendered) {
                return;
            }

            initializeTabs();
            log("Schedule rendering complete.");
        } catch (error) {
            console.error("[EFC Schedule] Initialization failed:", error);
            displayScheduleError();
        }
    }

    EFC.renderFullSchedule = renderSchedule;

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeSchedule, { once: true });
    } else {
        initializeSchedule();
    }

})(window.EFC);
