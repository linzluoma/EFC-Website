/*
========================================================
Electric Flower Co.
Venue Widgets
Version 3.1
========================================================

Requires:
1. shows-data.js
2. show-utils.js
3. venues-data.js
4. venue-utils.js
5. venue-widgets.js

New in Version 1.1:
- Reusable venue card component.
- logoFile image support.
- Graceful logo placeholders.
- featuredOrder support through venue-utils.js.
========================================================
*/

window.EFC = window.EFC || {};

(function (EFC) {
    "use strict";

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

    function formatDate(dateString) {
        if (!dateString) {
            return "";
        }

        if (
            typeof EFC.formatLongDate === "function"
        ) {
            return EFC.formatLongDate(dateString);
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

    function formatLocation(venue) {
        return [
            venue.city,
            venue.state
        ].filter(Boolean).join(", ");
    }

    function createLogoArea(
        venue,
        settings
    ) {
        const logoArea =
            createElement(
                "div",
                settings.logoAreaClass
            );

        const logoFile =
            venue.logoFile ||
            venue.logo ||
            "";

        if (logoFile) {
            const image =
                createElement(
                    "img",
                    settings.logoClass
                );

            const logoBase =
                settings.logoBase ||
                "https://www.weebly.com/editor/uploads/1/4/1/5/141509793/custom_themes/844756911689450114/files/venue-logos/";

            image.src =
                logoFile.startsWith("http://") ||
                logoFile.startsWith("https://") ||
                logoFile.startsWith("/")
                    ? logoFile
                    : logoBase + logoFile;
            image.alt =
                `${venue.displayName || venue.name} logo`;

            image.loading = "lazy";
            image.decoding = "async";

            image.addEventListener(
                "error",
                function () {
                    logoArea.replaceChildren(
                        createElement(
                            "span",
                            settings.placeholderClass,
                            settings.placeholderText
                        )
                    );
                }
            );

            logoArea.appendChild(image);
        } else {
            logoArea.appendChild(
                createElement(
                    "span",
                    settings.placeholderClass,
                    settings.placeholderText
                )
            );
        }

        return logoArea;
    }

    function createVenueCard(
        venue,
        options
    ) {
        const settings =
            Object.assign(
                {
                    cardClass:
                        "efc-venue-card",
                    logoAreaClass:
                        "efc-venue-card-logo-area",
                    logoClass:
                        "efc-venue-card-logo",
                    placeholderClass:
                        "efc-venue-card-placeholder",
                    placeholderText:
                        "Venue Logo",
                    contentClass:
                        "efc-venue-card-content",
                    nameClass:
                        "efc-venue-card-name",
                    locationClass:
                        "efc-venue-card-location",
                    categoryClass:
                        "efc-venue-card-category",
                    statsClass:
                        "efc-venue-card-stats",
                    metaClass:
                        "efc-venue-card-meta",
                    buttonClass:
                        "efc-venue-card-button",
                    showLogo: true,
                    showCategory: false,
                    showStats: false,
                    showLastPlayed: false,
                    showNextShow: false,
                    showHistoryButton: false,
                    buttonText:
                        "View History",
                    logoBase:
                        "https://www.weebly.com/editor/uploads/1/4/1/5/141509793/custom_themes/844756911689450114/files/venue-logos/"
                },
                options || {}
            );

        const card =
            createElement(
                "article",
                settings.cardClass
            );

        card.dataset.venueId = venue.id;
        card.dataset.category =
            venue.category || "";
        card.dataset.region =
            venue.region || "";
        card.dataset.private =
            String(
                venue.privateEvent === true
            );

        if (settings.showLogo) {
            card.appendChild(
                createLogoArea(
                    venue,
                    settings
                )
            );
        }

        const content =
            createElement(
                "div",
                settings.contentClass
            );

        content.appendChild(
            createElement(
                "div",
                settings.nameClass,
                venue.displayName ||
                venue.name
            )
        );

        const location =
            formatLocation(venue);

        if (location) {
            content.appendChild(
                createElement(
                    "div",
                    settings.locationClass,
                    location
                )
            );
        }

        if (
            settings.showCategory &&
            venue.category
        ) {
            content.appendChild(
                createElement(
                    "div",
                    settings.categoryClass,
                    venue.category
                )
            );
        }

        if (
            settings.showStats &&
            venue.stats
        ) {
            const count =
                venue.stats.performances;

            content.appendChild(
                createElement(
                    "div",
                    settings.statsClass,
                    `${count} ${
                        count === 1
                            ? "performance"
                            : "performances"
                    }`
                )
            );
        }

        if (
            settings.showLastPlayed &&
            venue.stats &&
            venue.stats.mostRecentPastShow
        ) {
            content.appendChild(
                createElement(
                    "div",
                    settings.metaClass,
                    "Last: " +
                    formatDate(
                        venue.stats
                            .mostRecentPastShow
                            .date
                    )
                )
            );
        }

        if (
            settings.showNextShow &&
            venue.stats &&
            venue.stats.nextShow
        ) {
            content.appendChild(
                createElement(
                    "div",
                    settings.metaClass,
                    "Next: " +
                    formatDate(
                        venue.stats
                            .nextShow
                            .date
                    )
                )
            );
        }

        if (settings.showHistoryButton) {
            const button =
                createElement(
                    "button",
                    settings.buttonClass,
                    settings.buttonText
                );

            button.type = "button";
            button.dataset.venueId =
                venue.id;

            content.appendChild(button);
        }

        card.appendChild(content);

        return card;
    }

    function renderVenueCards(
        container,
        venues,
        settings
    ) {
        container.replaceChildren();

        if (!venues.length) {
            container.appendChild(
                createElement(
                    "p",
                    settings.emptyClass,
                    settings.emptyMessage
                )
            );

            return true;
        }

        const list =
            createElement(
                "div",
                settings.listClass
            );

        venues.forEach(venue => {
            list.appendChild(
                createVenueCard(
                    venue,
                    settings
                )
            );
        });

        container.appendChild(list);

        if (
            settings.showFooterLink &&
            settings.footerHref
        ) {
            const footer =
                createElement(
                    "div",
                    settings.footerClass
                );

            const link =
                createElement(
                    "a",
                    "",
                    settings.footerText
                );

            link.href =
                settings.footerHref;

            footer.appendChild(link);
            container.appendChild(footer);
        }

        return true;
    }

    EFC.createVenueCard =
        createVenueCard;

    EFC.renderFeaturedVenues =
        function (
            containerId,
            options
        ) {
            const settings =
                Object.assign(
                    {
                        limit: 8,
                        includePrivate: true,
                        sortBy:
                            "featuredOrder",
                        sortDirection:
                            "asc",

                        showLogo: true,
                        showCategory: false,
                        showStats: false,
                        showLastPlayed: false,
                        showNextShow: false,
                        showHistoryButton: false,

                        placeholderText:
                            "Venue Logo",

                        listClass:
                            "efc-performance-highlight-grid",
                        cardClass:
                            "efc-performance-highlight-card",
                        logoAreaClass:
                            "efc-performance-highlight-logo-area",
                        logoClass:
                            "efc-performance-highlight-logo",
                        placeholderClass:
                            "efc-performance-highlight-placeholder",
                        contentClass:
                            "efc-performance-highlight-content",
                        nameClass:
                            "efc-performance-highlight-name",
                        locationClass:
                            "efc-performance-highlight-location",
                        categoryClass:
                            "efc-performance-highlight-category",
                        statsClass:
                            "efc-performance-highlight-stats",
                        metaClass:
                            "efc-performance-highlight-meta",
                        buttonClass:
                            "efc-performance-highlight-button",

                        emptyClass:
                            "efc-performance-highlight-empty",
                        emptyMessage:
                            "No performance highlights are currently listed.",

                        showFooterLink: true,
                        footerClass:
                            "efc-performance-highlight-link",
                        footerText:
                            "View Complete Performance History →",
                        footerHref:
                            "/performance-history.html"
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

            if (
                typeof EFC.getFeaturedVenues !==
                "function"
            ) {
                container.textContent =
                    "Venue utilities not loaded.";
                return false;
            }

            const venues =
                EFC.getFeaturedVenues({
                    limit:
                        settings.limit,
                    includePrivate:
                        settings.includePrivate,
                    sortBy:
                        settings.sortBy,
                    sortDirection:
                        settings.sortDirection
                });

            return renderVenueCards(
                container,
                venues,
                settings
            );
        };

    EFC.renderVenueGrid =
        function (
            containerId,
            options
        ) {
            const settings =
                Object.assign(
                    {
                        search: "",
                        category: "",
                        region: "",
                        featured: null,
                        privateEvent: null,
                        hasUpcoming: null,
                        sortBy: "name",
                        sortDirection: "asc",
                        limit: null,

                        showLogo: true,
                        showCategory: true,
                        showStats: true,
                        showLastPlayed: true,
                        showNextShow: true,
                        showHistoryButton: true,
                        buttonText:
                            "Show History",

                        listClass:
                            "efc-venue-grid",
                        cardClass:
                            "efc-venue-card",
                        logoAreaClass:
                            "efc-venue-card-logo-area",
                        logoClass:
                            "efc-venue-card-logo",
                        placeholderClass:
                            "efc-venue-card-placeholder",
                        contentClass:
                            "efc-venue-card-content",
                        nameClass:
                            "efc-venue-card-name",
                        locationClass:
                            "efc-venue-card-location",
                        categoryClass:
                            "efc-venue-card-category",
                        statsClass:
                            "efc-venue-card-stats",
                        metaClass:
                            "efc-venue-card-meta",
                        buttonClass:
                            "efc-venue-card-button",

                        emptyClass:
                            "efc-venue-empty",
                        emptyMessage:
                            "No matching venues found.",

                        showFooterLink: false,
                        footerClass:
                            "efc-venue-grid-link",
                        footerText: "",
                        footerHref: ""
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

            if (
                typeof EFC.getAllVenues !==
                "function"
            ) {
                container.textContent =
                    "Venue utilities not loaded.";
                return false;
            }

            const venues =
                EFC.getAllVenues({
                    search:
                        settings.search,
                    category:
                        settings.category,
                    region:
                        settings.region,
                    featured:
                        settings.featured,
                    privateEvent:
                        settings.privateEvent,
                    hasUpcoming:
                        settings.hasUpcoming,
                    sortBy:
                        settings.sortBy,
                    sortDirection:
                        settings.sortDirection,
                    limit:
                        settings.limit
                });

            return renderVenueCards(
                container,
                venues,
                settings
            );
        };

    EFC.renderVenueStatistics =
        function (
            containerId,
            options
        ) {
            const settings =
                Object.assign(
                    {
                        includePrivate: true,
                        wrapperClass:
                            "efc-venue-stats",
                        itemClass:
                            "efc-venue-stat",
                        valueClass:
                            "efc-venue-stat-value",
                        labelClass:
                            "efc-venue-stat-label"
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

            if (
                typeof EFC.getVenueOverviewStats !==
                "function"
            ) {
                container.textContent =
                    "Venue utilities not loaded.";
                return false;
            }

            const stats =
                EFC.getVenueOverviewStats({
                    privateEvent:
                        settings.includePrivate
                            ? null
                            : false
                });

            const items = [
                [
                    stats.venues,
                    "Venues & Engagements"
                ],
                [
                    stats.performances,
                    "Performances"
                ],
                [
                    stats.categories,
                    "Categories"
                ],
                [
                    stats.regions,
                    "Regions"
                ]
            ];

            container.replaceChildren();

            const wrapper =
                createElement(
                    "div",
                    settings.wrapperClass
                );

            items.forEach(item => {
                const block =
                    createElement(
                        "div",
                        settings.itemClass
                    );

                block.append(
                    createElement(
                        "div",
                        settings.valueClass,
                        String(item[0])
                    ),
                    createElement(
                        "div",
                        settings.labelClass,
                        item[1]
                    )
                );

                wrapper.appendChild(block);
            });

            container.appendChild(wrapper);

            return true;
        };

    EFC.renderVenueHistoryPreview =
        function (
            containerId,
            venueId,
            options
        ) {
            const settings =
                Object.assign(
                    {
                        limit: 5,
                        includeUpcoming: true,
                        listClass:
                            "efc-venue-history-list",
                        rowClass:
                            "efc-venue-history-row",
                        dateClass:
                            "efc-venue-history-date",
                        titleClass:
                            "efc-venue-history-title",
                        emptyClass:
                            "efc-venue-history-empty",
                        emptyMessage:
                            "No performance history is available."
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

            if (
                typeof EFC.getVenueHistory !==
                "function"
            ) {
                container.textContent =
                    "Venue utilities not loaded.";
                return false;
            }

            const history =
                EFC.getVenueHistory(
                    venueId
                );

            container.replaceChildren();

            if (!history) {
                container.appendChild(
                    createElement(
                        "p",
                        settings.emptyClass,
                        settings.emptyMessage
                    )
                );

                return false;
            }

            let shows =
                history.shows.slice();

            if (!settings.includeUpcoming) {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                shows =
                    shows.filter(show => {
                        const parts =
                            String(
                                show.date || ""
                            ).split("-");

                        if (parts.length !== 3) {
                            return false;
                        }

                        const date =
                            new Date(
                                Number(parts[0]),
                                Number(parts[1]) - 1,
                                Number(parts[2])
                            );

                        return date < today;
                    });
            }

            shows.sort((a, b) =>
                String(b.date || "")
                    .localeCompare(
                        String(a.date || "")
                    )
            );

            shows =
                shows.slice(
                    0,
                    settings.limit
                );

            if (!shows.length) {
                container.appendChild(
                    createElement(
                        "p",
                        settings.emptyClass,
                        settings.emptyMessage
                    )
                );

                return true;
            }

            const list =
                createElement(
                    "div",
                    settings.listClass
                );

            shows.forEach(show => {
                const row =
                    createElement(
                        "div",
                        settings.rowClass
                    );

                row.append(
                    createElement(
                        "div",
                        settings.dateClass,
                        formatDate(show.date)
                    ),
                    createElement(
                        "div",
                        settings.titleClass,
                        show.venue ||
                        history.venue
                            .displayName ||
                        history.venue.name
                    )
                );

                list.appendChild(row);
            });

            container.appendChild(list);

            return true;
        };

    console.log(
        "[EFC Venue Widgets] venue-widgets.js v3.1 loaded."
    );

})(window.EFC);
