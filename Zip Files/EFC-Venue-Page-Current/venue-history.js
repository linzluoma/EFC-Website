/*
========================================================
Electric Flower Co.
Venue History Page
Version 2.2
========================================================

Requires:
1. shows-data.js
2. show-utils.js
3. venues-data.js
4. venue-utils.js
5. venue-widgets.js
6. venue-history.js

Version 2.2 integrates the interactive performance map
into the page and keeps it synchronized with the page's
search, scope, category, and region filters.
========================================================
*/

window.EFC = window.EFC || {};

(function (EFC) {
    "use strict";

    const DEFAULT_OPTIONS = {
        title: "Where We've Played",
        description:
            "Explore the venues, events, and private engagements that have shaped Electric Flower Co.'s performance history.",
        initialScope: "all",
        initialSort: "name:asc",
        emptyMessage:
            "No matching venues or engagements were found."
    };

    const state = {
        rootId: "",
        options: {},
        search: "",
        scope: "all",
        category: "",
        region: "",
        sortBy: "name",
        sortDirection: "asc",
        expandedVenueIds: new Set(),
        mapContainerId: ""
    };

    function createElement(
        tagName,
        className,
        textContent
    ) {
        const element =
            document.createElement(tagName);

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

    function getRoot() {
        return document.getElementById(
            state.rootId
        );
    }

    function formatDate(dateString) {
        if (!dateString) {
            return "";
        }

        if (
            typeof EFC.formatLongDate ===
            "function"
        ) {
            return EFC.formatLongDate(
                dateString
            );
        }

        const parts =
            String(dateString).split("-");

        if (parts.length !== 3) {
            return dateString;
        }

        const date = new Date(
            Number(parts[0]),
            Number(parts[1]) - 1,
            Number(parts[2])
        );

        return date.toLocaleDateString(
            "en-US",
            {
                month: "long",
                day: "numeric",
                year: "numeric"
            }
        );
    }

    function formatMonthYear(dateString) {
        if (!dateString) {
            return "";
        }

        const parts =
            String(dateString).split("-");

        if (parts.length !== 3) {
            return dateString;
        }

        const date = new Date(
            Number(parts[0]),
            Number(parts[1]) - 1,
            Number(parts[2])
        );

        return date.toLocaleDateString(
            "en-US",
            {
                month: "short",
                year: "numeric"
            }
        );
    }

    function getYear(dateString) {
        return String(dateString || "")
            .slice(0, 4);
    }

    function getYearsPerforming(venues) {
        const years = new Set();

        venues.forEach(venue => {
            if (
                !venue.stats ||
                !Array.isArray(
                    venue.stats.yearsPlayed
                )
            ) {
                return;
            }

            venue.stats.yearsPlayed
                .forEach(year => {
                    if (year) {
                        years.add(
                            Number(year)
                        );
                    }
                });
        });

        const values =
            Array.from(years)
                .filter(Number.isFinite)
                .sort((a, b) => a - b);

        if (!values.length) {
            return 0;
        }

        return (
            values[values.length - 1] -
            values[0] +
            1
        );
    }

    function parseSortValue(value) {
        const parts =
            String(value || "name:asc")
                .split(":");

        return {
            sortBy:
                parts[0] || "name",
            sortDirection:
                parts[1] || "asc"
        };
    }

    function buildFilterOptions() {
        const options = {
            search: state.search,
            category: state.category,
            region: state.region,
            sortBy: state.sortBy,
            sortDirection:
                state.sortDirection,
            limit: null
        };

        if (state.scope === "featured") {
            options.featured = true;
            options.privateEvent = false;
        } else if (state.scope === "public") {
            options.privateEvent = false;
        } else if (state.scope === "private") {
            options.privateEvent = true;
        }

        return options;
    }

    function createOption(
        value,
        label
    ) {
        const option =
            document.createElement("option");

        option.value = value;
        option.textContent = label;

        return option;
    }

    function createScopeButton(
        label,
        value
    ) {
        const button =
            createElement(
                "button",
                "efc-venue-history-scope-button",
                label
            );

        button.type = "button";
        button.dataset.efcVenueScope =
            value;
        button.setAttribute(
            "aria-pressed",
            String(
                state.scope === value
            )
        );

        if (state.scope === value) {
            button.classList.add(
                "is-active"
            );
        }

        button.addEventListener(
            "click",
            function () {
                state.scope = value;
                updateScopeButtons();
                renderResults();
            }
        );

        return button;
    }

    function updateScopeButtons() {
        const root = getRoot();

        if (!root) {
            return;
        }

        root.querySelectorAll(
            "[data-efc-venue-scope]"
        ).forEach(button => {
            const active =
                button.dataset
                    .efcVenueScope ===
                state.scope;

            button.classList.toggle(
                "is-active",
                active
            );

            button.setAttribute(
                "aria-pressed",
                String(active)
            );
        });
    }

    function createSearchControl() {
        const label =
            createElement(
                "label",
                "efc-venue-history-search-wrap"
            );

        label.htmlFor =
            "efc-venue-history-search";

        label.appendChild(
            createElement(
                "span",
                "efc-venue-history-control-label",
                "Search"
            )
        );

        const input =
            createElement(
                "input",
                "efc-venue-history-search"
            );

        input.id =
            "efc-venue-history-search";
        input.type = "search";
        input.placeholder =
            "Search venues, cities, event types...";
        input.autocomplete = "off";
        input.value = state.search;

        input.addEventListener(
            "input",
            function () {
                state.search =
                    input.value.trim();

                renderResults();
            }
        );

        label.appendChild(input);

        return label;
    }

    function createScopeControls() {
        const group =
            createElement(
                "div",
                "efc-venue-history-scope"
            );

        group.setAttribute(
            "role",
            "group"
        );

        group.setAttribute(
            "aria-label",
            "Venue type"
        );

        group.append(
            createScopeButton(
                "All",
                "all"
            ),
            createScopeButton(
                "Featured",
                "featured"
            ),
            createScopeButton(
                "Public",
                "public"
            ),
            createScopeButton(
                "Private",
                "private"
            )
        );

        return group;
    }

    function createSelectControl(
        labelText,
        id,
        options,
        selectedValue,
        changeHandler
    ) {
        const label =
            createElement("label");

        label.appendChild(
            createElement(
                "span",
                "efc-venue-history-control-label",
                labelText
            )
        );

        const select =
            createElement(
                "select",
                "efc-venue-history-select"
            );

        select.id = id;

        options.forEach(item => {
            select.appendChild(
                createOption(
                    item.value,
                    item.label
                )
            );
        });

        select.value =
            selectedValue || "";

        select.addEventListener(
            "change",
            function () {
                changeHandler(
                    select.value
                );
            }
        );

        label.appendChild(select);

        return label;
    }

    function createControls() {
        const wrapper =
            createElement(
                "section",
                "efc-venue-history-controls"
            );

        wrapper.setAttribute(
            "aria-label",
            "Filter performance history"
        );

        wrapper.appendChild(
            createSearchControl()
        );

        wrapper.appendChild(
            createScopeControls()
        );

        const selectGrid =
            createElement(
                "div",
                "efc-venue-history-select-grid"
            );

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

        selectGrid.append(
            createSelectControl(
                "Category",
                "efc-venue-history-category",
                [
                    {
                        value: "",
                        label:
                            "All Categories"
                    },
                    ...categories.map(
                        value => ({
                            value,
                            label: value
                        })
                    )
                ],
                state.category,
                function (value) {
                    state.category = value;
                    renderResults();
                }
            ),
            createSelectControl(
                "Region",
                "efc-venue-history-region",
                [
                    {
                        value: "",
                        label:
                            "All Regions"
                    },
                    ...regions.map(
                        value => ({
                            value,
                            label: value
                        })
                    )
                ],
                state.region,
                function (value) {
                    state.region = value;
                    renderResults();
                }
            ),
            createSelectControl(
                "Sort",
                "efc-venue-history-sort",
                [
                    {
                        value: "name:asc",
                        label: "Name"
                    },
                    {
                        value:
                            "performances:desc",
                        label:
                            "Most Performances"
                    },
                    {
                        value:
                            "lastPlayed:desc",
                        label:
                            "Most Recent"
                    },
                    {
                        value: "city:asc",
                        label: "City"
                    },
                    {
                        value:
                            "featuredOrder:asc",
                        label:
                            "Featured Order"
                    }
                ],
                `${state.sortBy}:${state.sortDirection}`,
                function (value) {
                    const parsed =
                        parseSortValue(value);

                    state.sortBy =
                        parsed.sortBy;

                    state.sortDirection =
                        parsed.sortDirection;

                    renderResults();
                }
            )
        );

        wrapper.appendChild(
            selectGrid
        );

        return wrapper;
    }

    function getDisplayShowTitle(
        show,
        venue
    ) {
        const eventTitle =
            Array.isArray(
                venue.eventSeries
            ) &&
            venue.eventSeries.length
                ? venue.eventSeries[0]
                : "";

        if (
            eventTitle &&
            show.venue &&
            show.venue !== venue.name
        ) {
            return eventTitle;
        }

        return (
            show.venue ||
            venue.displayName ||
            venue.name
        );
    }


    function buildMapOptions() {
        return {
            search: state.search,
            category: state.category,
            region: state.region,
            featuredOnly:
                state.scope === "featured",
            privateOnly:
                state.scope === "private",
            includePrivate:
                state.scope !== "public" &&
                state.scope !== "featured",
            showFilters: false
        };
    }

    function renderPerformanceMap() {
        if (!state.mapContainerId) {
            return;
        }

        const container =
            document.getElementById(
                state.mapContainerId
            );

        if (!container) {
            return;
        }

        if (
            typeof EFC.renderVenueMap !==
            "function"
        ) {
            container.innerHTML =
                "<p class='efc-venue-history-map-error'>Venue map library not loaded.</p>";

            return;
        }

        EFC.renderVenueMap(
            state.mapContainerId,
            buildMapOptions()
        );
    }

    function createMapSection() {
        const section =
            createElement(
                "section",
                "efc-venue-history-map-section"
            );

        section.appendChild(
            createElement(
                "h3",
                "efc-venue-history-map-title",
                "Performance Map"
            )
        );

        section.appendChild(
            createElement(
                "p",
                "efc-venue-history-map-description",
                "Explore where Electric Flower Co. has performed across Michigan and beyond. Click any location to view its venues and performance totals."
            )
        );

        const mapContainer =
            createElement(
                "div",
                "efc-venue-history-map"
            );

        state.mapContainerId =
            state.rootId +
            "-map";

        mapContainer.id =
            state.mapContainerId;

        mapContainer.innerHTML =
            "<p class='efc-venue-history-map-loading'>Loading performance map...</p>";

        section.appendChild(
            mapContainer
        );

        return section;
    }

    function createHistoryDetail(
        venue
    ) {
        const wrapper =
            createElement(
                "div",
                "efc-venue-history-detail"
            );

        const history =
            typeof EFC.getVenueHistory ===
            "function"
                ? EFC.getVenueHistory(
                    venue.id
                )
                : null;

        if (
            !history ||
            !history.shows.length
        ) {
            wrapper.appendChild(
                createElement(
                    "p",
                    "efc-venue-history-empty",
                    "No performance history is available."
                )
            );

            return wrapper;
        }

        const groups = new Map();

        history.shows
            .slice()
            .sort((a, b) =>
                String(b.date || "")
                    .localeCompare(
                        String(a.date || "")
                    )
            )
            .forEach(show => {
                const year =
                    getYear(show.date) ||
                    "Other";

                if (!groups.has(year)) {
                    groups.set(year, []);
                }

                groups.get(year)
                    .push(show);
            });

        groups.forEach(
            (shows, year) => {
                const yearGroup =
                    createElement(
                        "section",
                        "efc-venue-history-year"
                    );

                yearGroup.appendChild(
                    createElement(
                        "h4",
                        "efc-venue-history-year-title",
                        year
                    )
                );

                shows.forEach(show => {
                    const row =
                        createElement(
                            "div",
                            "efc-venue-history-show"
                        );

                    const date =
                        createElement(
                            "div",
                            "efc-venue-history-show-date",
                            formatDate(
                                show.date
                            )
                        );

                    const detail =
                        createElement(
                            "div",
                            "efc-venue-history-show-detail"
                        );

                    detail.appendChild(
                        createElement(
                            "div",
                            "efc-venue-history-show-title",
                            getDisplayShowTitle(
                                show,
                                venue
                            )
                        )
                    );

                    const meta = [
                        show.time,
                        show.category,
                        show.public === false
                            ? "Private"
                            : ""
                    ].filter(Boolean)
                        .join(" · ");

                    if (meta) {
                        detail.appendChild(
                            createElement(
                                "div",
                                "efc-venue-history-show-meta",
                                meta
                            )
                        );
                    }

                    row.append(
                        date,
                        detail
                    );

                    yearGroup.appendChild(
                        row
                    );
                });

                wrapper.appendChild(
                    yearGroup
                );
            }
        );

        return wrapper;
    }

    function createSummaryFact(
        label,
        value
    ) {
        const fact =
            createElement(
                "span",
                "efc-venue-history-fact"
            );

        fact.append(
            createElement(
                "span",
                "efc-venue-history-fact-label",
                label
            ),
            createElement(
                "span",
                "efc-venue-history-fact-value",
                value || "—"
            )
        );

        return fact;
    }

    function createVenueCard(venue) {
        const card =
            createElement(
                "article",
                "efc-venue-history-card"
            );

        card.dataset.venueId =
            venue.id;

        const expanded =
            state.expandedVenueIds
                .has(venue.id);

        if (expanded) {
            card.classList.add(
                "is-expanded"
            );
        }

        const summary =
            createElement(
                "button",
                "efc-venue-history-summary"
            );

        summary.type = "button";
        summary.setAttribute(
            "aria-expanded",
            String(expanded)
        );

        const text =
            createElement(
                "span",
                "efc-venue-history-summary-text"
            );

        const nameRow =
            createElement(
                "span",
                "efc-venue-history-name-row"
            );

        nameRow.appendChild(
            createElement(
                "span",
                "efc-venue-history-name",
                venue.displayName ||
                venue.name
            )
        );

        if (venue.featured) {
            nameRow.appendChild(
                createElement(
                    "span",
                    "efc-venue-history-featured",
                    "Featured"
                )
            );
        }

        text.appendChild(nameRow);

        const location = [
            venue.city,
            venue.state
        ].filter(Boolean).join(", ");

        if (location) {
            text.appendChild(
                createElement(
                    "span",
                    "efc-venue-history-location",
                    location
                )
            );
        }

        const meta =
            createElement(
                "span",
                "efc-venue-history-card-meta"
            );

        const count =
            venue.stats
                ? venue.stats.performances
                : 0;

        meta.appendChild(
            createElement(
                "span",
                "efc-venue-history-count",
                `${count} ${
                    count === 1
                        ? "Performance"
                        : "Performances"
                }`
            )
        );

        if (venue.category) {
            meta.appendChild(
                createElement(
                    "span",
                    "efc-venue-history-category",
                    venue.category
                )
            );
        }

        const factRow =
            createElement(
                "span",
                "efc-venue-history-facts"
            );

        const firstShow =
            venue.stats &&
            venue.stats.firstShow
                ? venue.stats.firstShow
                : null;

        const latestShow =
            venue.stats &&
            (
                venue.stats.mostRecentPastShow ||
                venue.stats.lastShow
            )
                ? (
                    venue.stats.mostRecentPastShow ||
                    venue.stats.lastShow
                )
                : null;

        factRow.append(
            createSummaryFact(
                "First Played",
                firstShow
                    ? formatMonthYear(
                        firstShow.date
                    )
                    : "—"
            ),
            createSummaryFact(
                "Most Recent",
                latestShow
                    ? formatMonthYear(
                        latestShow.date
                    )
                    : "—"
            )
        );

        const chevron =
            createElement(
                "span",
                "efc-venue-history-chevron",
                "⌄"
            );

        summary.append(
            text,
            meta,
            factRow,
            chevron
        );

        summary.addEventListener(
            "click",
            function () {
                if (
                    state.expandedVenueIds
                        .has(venue.id)
                ) {
                    state.expandedVenueIds
                        .delete(venue.id);
                } else {
                    state.expandedVenueIds
                        .add(venue.id);
                }

                renderResults();
            }
        );

        card.appendChild(summary);

        if (expanded) {
            card.appendChild(
                createHistoryDetail(
                    venue
                )
            );
        }

        return card;
    }

    function createStatistics(
        venues
    ) {
        const container =
            createElement(
                "div",
                "efc-venue-history-stats"
            );

        const totalPerformances =
            venues.reduce(
                (sum, venue) =>
                    sum +
                    (
                        venue.stats
                            ? venue.stats
                                .performances
                            : 0
                    ),
                0
            );

        const items = [
            [
                totalPerformances,
                "Live Performances"
            ],
            [
                venues.length,
                "Venues & Engagements"
            ],
            [
                getYearsPerforming(
                    venues
                ),
                "Years Performing"
            ]
        ];

        items.forEach(item => {
            const block =
                createElement(
                    "div",
                    "efc-venue-history-stat"
                );

            block.append(
                createElement(
                    "div",
                    "efc-venue-history-stat-value",
                    String(item[0])
                ),
                createElement(
                    "div",
                    "efc-venue-history-stat-label",
                    item[1]
                )
            );

            container.appendChild(
                block
            );
        });

        return container;
    }

    function renderResults() {
        const root = getRoot();

        if (!root) {
            return;
        }

        const results =
            root.querySelector(
                "[data-efc-venue-results]"
            );

        const stats =
            root.querySelector(
                "[data-efc-venue-stats]"
            );

        const count =
            root.querySelector(
                "[data-efc-venue-count]"
            );

        if (
            !results ||
            !stats ||
            !count
        ) {
            return;
        }

        const venues =
            EFC.getAllVenues(
                buildFilterOptions()
            );

        stats.replaceChildren(
            createStatistics(venues)
        );

        renderPerformanceMap();

        count.textContent =
            `${venues.length} ${
                venues.length === 1
                    ? "result"
                    : "results"
            }`;

        results.replaceChildren();

        if (!venues.length) {
            results.appendChild(
                createElement(
                    "p",
                    "efc-venue-history-no-results",
                    state.options
                        .emptyMessage
                )
            );

            return;
        }

        venues.forEach(venue => {
            results.appendChild(
                createVenueCard(venue)
            );
        });
    }

    function createPageShell() {
        const root = getRoot();

        if (!root) {
            return false;
        }

        root.replaceChildren();

        const shell =
            createElement(
                "div",
                "efc-venue-history-shell"
            );

        const intro =
            createElement(
                "div",
                "efc-venue-history-intro"
            );

        if (state.options.title) {
            intro.appendChild(
                createElement(
                    "h2",
                    "efc-venue-history-title",
                    state.options.title
                )
            );
        }

        if (state.options.description) {
            intro.appendChild(
                createElement(
                    "p",
                    "efc-venue-history-description",
                    state.options
                        .description
                )
            );
        }

        shell.appendChild(intro);

        const stats =
            createElement("div");

        stats.dataset.efcVenueStats =
            "";

        shell.appendChild(stats);
        shell.appendChild(
            createMapSection()
        );
        shell.appendChild(
            createControls()
        );

        const resultBar =
            createElement(
                "div",
                "efc-venue-history-result-bar"
            );

        const count =
            createElement(
                "span",
                "",
                "0 results"
            );

        count.dataset.efcVenueCount =
            "";

        resultBar.appendChild(count);
        shell.appendChild(resultBar);

        const results =
            createElement(
                "div",
                "efc-venue-history-results"
            );

        results.dataset.efcVenueResults =
            "";

        shell.appendChild(results);
        root.appendChild(shell);

        return true;
    }

    EFC.renderVenueHistoryPage =
        function (
            rootId,
            options
        ) {
            const root =
                document.getElementById(
                    rootId
                );

            if (!root) {
                return false;
            }

            if (
                typeof EFC.getAllVenues !==
                "function"
            ) {
                root.innerHTML =
                    "<p style='text-align:center;padding:24px;'>Venue utilities not loaded.</p>";

                return false;
            }

            const settings =
                Object.assign(
                    {},
                    DEFAULT_OPTIONS,
                    options || {}
                );

            const parsedSort =
                parseSortValue(
                    settings.initialSort
                );

            state.rootId = rootId;
            state.options = settings;
            state.search = "";
            state.scope =
                settings.initialScope ||
                "all";
            state.category = "";
            state.region = "";
            state.sortBy =
                parsedSort.sortBy;
            state.sortDirection =
                parsedSort.sortDirection;
            state.expandedVenueIds =
                new Set();
            state.mapContainerId = "";

            createPageShell();
            renderResults();

            return true;
        };

    console.log(
        "[EFC Venue History] venue-history.js v2.2 loaded."
    );

})(window.EFC);
