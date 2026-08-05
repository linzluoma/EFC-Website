/*
Electric Flower Co. Schedule Engine
Version 1.0

This script:

1. Reads show data from window.EFC_SHOWS
2. Automatically separates upcoming and past shows
3. Sorts upcoming shows from soonest to latest
4. Sorts past shows from newest to oldest
5. Creates the same HTML structure used by the original schedule
6. Controls the Upcoming Shows and Past Shows tabs

The following files must load in this order:

1. shows-data.js
2. schedule.js
*/

(function () {
    "use strict";

    /*
    ================================================================
    SETTINGS
    ================================================================
    */

    const SETTINGS = {
        debug: true,

        // Leave this false to show private events on the main schedule.
        hidePrivateShows: false,

        upcomingEmptyMessage:
            "No upcoming shows are currently listed.",

        pastEmptyMessage:
            "No past shows are currently listed.",

        ticketButtonText: "Tickets",

        websiteButtonText: "Venue Website"
    };


    /*
    ================================================================
    GENERAL HELPERS
    ================================================================
    */

    function debugLog(...messages) {
        if (SETTINGS.debug) {
            console.log("[EFC Schedule]", ...messages);
        }
    }


    function debugWarning(...messages) {
        console.warn("[EFC Schedule]", ...messages);
    }


    function createElement(tagName, className, textContent) {
        const element = document.createElement(tagName);

        if (className) {
            element.className = className;
        }

        if (
            textContent !== undefined &&
            textContent !== null
        ) {
            element.textContent = textContent;
        }

        return element;
    }


    function getShowData() {
        if (!Array.isArray(window.EFC_SHOWS)) {
            throw new Error(
                "The show database could not be found. " +
                "Make sure shows-data.js loads before schedule.js."
            );
        }

        return window.EFC_SHOWS;
    }


    /*
    ================================================================
    DATE HELPERS
    ================================================================
    */

    function parseShowDate(dateString) {
        /*
        The show dates use this format:

        2026-08-07

        We split the date manually so JavaScript does not accidentally
        shift it backward or forward because of time-zone handling.
        */

        const parts = String(dateString).split("-");

        if (parts.length !== 3) {
            return null;
        }

        const year = Number(parts[0]);
        const month = Number(parts[1]);
        const day = Number(parts[2]);

        if (
            !Number.isInteger(year) ||
            !Number.isInteger(month) ||
            !Number.isInteger(day)
        ) {
            return null;
        }

        const date = new Date(
            year,
            month - 1,
            day
        );

        date.setHours(0, 0, 0, 0);

        if (Number.isNaN(date.getTime())) {
            return null;
        }

        return date;
    }


    function getToday() {
        const today = new Date();

        today.setHours(0, 0, 0, 0);

        return today;
    }


    function getMonthLabel(date) {
        return date
            .toLocaleDateString(
                "en-US",
                { month: "short" }
            )
            .toUpperCase();
    }


    function getDayLabel(date) {
        return String(
            date.getDate()
        ).padStart(2, "0");
    }


    function getYearLabel(date) {
        return String(
            date.getFullYear()
        );
    }


    function getFullDateLabel(show, date) {
        const formattedDate =
            date.toLocaleDateString(
                "en-US",
                {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                }
            );

        if (show.time) {
            return `${formattedDate} (${show.time})`;
        }

        return formattedDate;
    }


    /*
    ================================================================
    DATA HELPERS
    ================================================================
    */

    function isValidShow(show) {
        return Boolean(
            show &&
            typeof show === "object" &&
            typeof show.date === "string" &&
            typeof show.venue === "string"
        );
    }


    function shouldDisplayShow(show) {
        if (!isValidShow(show)) {
            return false;
        }

        if (
            SETTINGS.hidePrivateShows &&
            show.public === false
        ) {
            return false;
        }

        return true;
    }


    function formatLocation(show) {
        const city =
            String(show.city || "").trim();

        const state =
            String(show.state || "").trim();

        if (city && state) {
            return `${city}, ${state}`;
        }

        return city || state;
    }


    function appendTextWithLineBreaks(
        container,
        text
    ) {
        /*
        Some older show names still contain <br> tags or vertical bars
        from the original HTML schedule.

        This safely converts those into visible line breaks.
        */

        const normalizedText =
            String(text || "")
                .replace(
                    /<br\s*\/?>/gi,
                    "\n"
                )
                .replace(
                    /\s*\|\s*/g,
                    "\n"
                );

        const lines =
            normalizedText.split(/\n+/);

        lines.forEach(
            (line, index) => {
                if (index > 0) {
                    container.appendChild(
                        document.createElement("br")
                    );
                }

                container.appendChild(
                    document.createTextNode(
                        line.trim()
                    )
                );
            }
        );
    }


    /*
    ================================================================
    SHOW CARD BUILDERS
    ================================================================
    */

    function createDateBlock(show, date) {
        const dateBlock =
            createElement(
                "div",
                "efc-date"
            );

        dateBlock.dataset.fullDate =
            getFullDateLabel(show, date);

        const month =
            createElement(
                "div",
                "efc-month",
                getMonthLabel(date)
            );

        const day =
            createElement(
                "div",
                "efc-day",
                getDayLabel(date)
            );

        const year =
            createElement(
                "div",
                "efc-year",
                getYearLabel(date)
            );

        dateBlock.append(
            month,
            day,
            year
        );

        return dateBlock;
    }


    function createVenueBlock(show) {
        const mainBlock =
            createElement(
                "div",
                "efc-main"
            );

        const venueBlock =
            createElement(
                "div",
                "efc-venue"
            );

        if (show.website) {
            const venueLink =
                createElement("a");

            venueLink.href =
                show.website;

            venueLink.target =
                "_blank";

            venueLink.rel =
                "noopener noreferrer";

            venueLink.style.color =
                "inherit";

            venueLink.style.textDecoration =
                "none";

            appendTextWithLineBreaks(
                venueLink,
                show.venue
            );

            venueBlock.appendChild(
                venueLink
            );
        } else {
            appendTextWithLineBreaks(
                venueBlock,
                show.venue
            );
        }

        mainBlock.appendChild(
            venueBlock
        );

        return mainBlock;
    }


    function createLocationBlock(show) {
        const locationBlock =
            createElement(
                "div",
                "efc-location"
            );

        const locationText =
            formatLocation(show);

        if (locationText) {
            const cityBlock =
                createElement(
                    "div",
                    "efc-city",
                    locationText
                );

            locationBlock.appendChild(
                cityBlock
            );
        }

        if (show.time) {
            const timeBlock =
                createElement(
                    "div",
                    "efc-time",
                    show.time
                );

            locationBlock.appendChild(
                timeBlock
            );
        }

        return locationBlock;
    }


    function createActionBlock(show) {
        const actionBlock =
            createElement(
                "div",
                "efc-action"
            );

        let linkURL = "";
        let linkText = "";

        if (show.ticketLink) {
            linkURL =
                show.ticketLink;

            linkText =
                SETTINGS.ticketButtonText;
        } else if (show.website) {
            linkURL =
                show.website;

            linkText =
                SETTINGS.websiteButtonText;
        }

        if (linkURL) {
            const actionLink =
                createElement(
                    "a",
                    "",
                    linkText
                );

            actionLink.href =
                linkURL;

            actionLink.target =
                "_blank";

            actionLink.rel =
                "noopener noreferrer";

            actionBlock.appendChild(
                actionLink
            );
        }

        return actionBlock;
    }


    function createShowCard(show) {
        const date =
            parseShowDate(show.date);

        if (!date) {
            debugWarning(
                "Skipping show with an invalid date:",
                show
            );

            return null;
        }

        const article =
            createElement(
                "article",
                "efc-show"
            );

        if (show.id) {
            article.id =
                show.id;
        }

        /*
        These data attributes will make future filtering easier.
        */

        article.dataset.showDate =
            show.date;

        article.dataset.category =
            show.category || "";

        article.dataset.public =
            String(show.public !== false);

        article.dataset.featured =
            String(show.featured === true);

        article.append(
            createDateBlock(show, date),
            createVenueBlock(show),
            createLocationBlock(show),
            createActionBlock(show)
        );

        return article;
    }


    /*
    ================================================================
    SORTING AND GROUPING
    ================================================================
    */

    function splitShows(shows) {
        const today =
            getToday();

        const upcomingShows = [];
        const pastShows = [];
        const skippedShows = [];

        shows.forEach(
            (show) => {
                if (!shouldDisplayShow(show)) {
                    skippedShows.push(show);
                    return;
                }

                const showDate =
                    parseShowDate(show.date);

                if (!showDate) {
                    skippedShows.push(show);
                    return;
                }

                /*
                A show occurring today remains in Upcoming Shows
                until the following calendar day.
                */

                if (showDate >= today) {
                    upcomingShows.push(show);
                } else {
                    pastShows.push(show);
                }
            }
        );

        /*
        Upcoming shows:
        Closest date first.
        */

        upcomingShows.sort(
            (showA, showB) =>
                showA.date.localeCompare(
                    showB.date
                )
        );

        /*
        Past shows:
        Most recent date first.
        */

        pastShows.sort(
            (showA, showB) =>
                showB.date.localeCompare(
                    showA.date
                )
        );

        return {
            upcomingShows,
            pastShows,
            skippedShows
        };
    }


    /*
    ================================================================
    RENDERING
    ================================================================
    */

    function createEmptyMessage(message) {
        const paragraph =
            createElement(
                "p",
                "efc-empty-message",
                message
            );

        paragraph.style.padding =
            "24px 0";

        paragraph.style.opacity =
            "0.65";

        return paragraph;
    }


    function renderShowList(
        container,
        shows,
        emptyMessage
    ) {
        container.replaceChildren();

        if (shows.length === 0) {
            container.appendChild(
                createEmptyMessage(
                    emptyMessage
                )
            );

            return;
        }

        const fragment =
            document.createDocumentFragment();

        shows.forEach(
            (show) => {
                const showCard =
                    createShowCard(show);

                if (showCard) {
                    fragment.appendChild(
                        showCard
                    );
                }
            }
        );

        container.appendChild(
            fragment
        );
    }


    function renderSchedule() {
        const upcomingContainer =
            document.getElementById(
                "upcomingShows"
            );

        const pastContainer =
            document.getElementById(
                "pastShows"
            );

        if (
            !upcomingContainer ||
            !pastContainer
        ) {
            throw new Error(
                "The HTML must contain elements with the IDs " +
                "upcomingShows and pastShows."
            );
        }

        const allShows =
            getShowData();

        const {
            upcomingShows,
            pastShows,
            skippedShows
        } = splitShows(allShows);

        renderShowList(
            upcomingContainer,
            upcomingShows,
            SETTINGS.upcomingEmptyMessage
        );

        renderShowList(
            pastContainer,
            pastShows,
            SETTINGS.pastEmptyMessage
        );

        // Update the tab counts
const upcomingTab = document.querySelector(
    '[data-tab="upcomingPanel"]'
);

const pastTab = document.querySelector(
    '[data-tab="pastPanel"]'
);

if (upcomingTab) {
    upcomingTab.innerHTML =
        `Upcoming Shows <span class="efc-count">(${upcomingShows.length})</span>`;
}

if (pastTab) {
    pastTab.innerHTML =
        `Past Shows <span class="efc-count">(${pastShows.length})</span>`;
}

        debugLog(
            `Loaded ${allShows.length} total shows.`
        );

        debugLog(
            `Rendered ${upcomingShows.length} upcoming shows.`
        );

        debugLog(
            `Rendered ${pastShows.length} past shows.`
        );

        if (skippedShows.length > 0) {
            debugWarning(
                `Skipped ${skippedShows.length} invalid or hidden shows.`,
                skippedShows
            );
        }
    }


    /*
    ================================================================
    TAB CONTROLS
    ================================================================
    */

    function activateTab(
        selectedButton,
        buttons,
        panels
    ) {
        const targetPanelID =
            selectedButton.dataset.tab;

        buttons.forEach(
            (button) => {
                const isActive =
                    button === selectedButton;

                button.classList.toggle(
                    "active",
                    isActive
                );

                button.setAttribute(
                    "aria-selected",
                    String(isActive)
                );

                button.tabIndex =
                    isActive ? 0 : -1;
            }
        );

        panels.forEach(
            (panel) => {
                const isTargetPanel =
                    panel.id === targetPanelID;

                panel.classList.toggle(
                    "active",
                    isTargetPanel
                );
            }
        );
    }


    function initializeTabs() {
        const tabButtons =
            Array.from(
                document.querySelectorAll(
                    ".efc-schedule-tab"
                )
            );

        const tabPanels =
            Array.from(
                document.querySelectorAll(
                    ".efc-panel"
                )
            );

        if (
            tabButtons.length === 0 ||
            tabPanels.length === 0
        ) {
            debugWarning(
                "Schedule tabs or panels were not found."
            );

            return;
        }

        tabButtons.forEach(
            (button, index) => {
                button.addEventListener(
                    "click",
                    () => {
                        activateTab(
                            button,
                            tabButtons,
                            tabPanels
                        );
                    }
                );

                /*
                Allow keyboard users to switch tabs
                with the left and right arrow keys.
                */

                button.addEventListener(
                    "keydown",
                    (event) => {
                        if (
                            event.key !== "ArrowLeft" &&
                            event.key !== "ArrowRight"
                        ) {
                            return;
                        }

                        event.preventDefault();

                        const direction =
                            event.key === "ArrowRight"
                                ? 1
                                : -1;

                        const nextIndex =
                            (
                                index +
                                direction +
                                tabButtons.length
                            ) % tabButtons.length;

                        const nextButton =
                            tabButtons[nextIndex];

                        nextButton.focus();

                        activateTab(
                            nextButton,
                            tabButtons,
                            tabPanels
                        );
                    }
                );
            }
        );

        const initiallyActiveButton =
            tabButtons.find(
                (button) =>
                    button.classList.contains(
                        "active"
                    )
            ) || tabButtons[0];

        activateTab(
            initiallyActiveButton,
            tabButtons,
            tabPanels
        );
    }


    /*
    ================================================================
    ERROR DISPLAY
    ================================================================
    */

    function displayScheduleError() {
        const upcomingContainer =
            document.getElementById(
                "upcomingShows"
            );

        if (!upcomingContainer) {
            return;
        }

        upcomingContainer.replaceChildren(
            createEmptyMessage(
                "The schedule could not be loaded. " +
                "Please try again later."
            )
        );
    }


    /*
    ================================================================
    INITIALIZATION
    ================================================================
    */

    function initializeSchedule() {
        try {
            debugLog(
                "Schedule engine starting..."
            );

            renderSchedule();

            initializeTabs();

            debugLog(
                "Schedule rendering complete."
            );
        } catch (error) {
            console.error(
                "[EFC Schedule] Initialization failed:",
                error
            );

            displayScheduleError();
        }
    }


    /*
    Wait until the HTML is ready before rendering.
    */

    if (
        document.readyState === "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            initializeSchedule,
            { once: true }
        );
    } else {
        initializeSchedule();
    }
})();