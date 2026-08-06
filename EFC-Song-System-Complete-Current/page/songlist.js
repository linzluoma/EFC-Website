/*
========================================================
Electric Flower Co.
Full Song List Renderer
Version 2.0
========================================================

Requires:
1. songs-data.js
2. song-utils.js
3. song-widgets.js
4. songlist.js
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

    function createSongRow(
        song,
        artistFirst
    ) {
        const row =
            createElement(
                "div",
                "efc-song-row"
            );

        row.append(
            createElement(
                "div",
                "efc-song-title",
                artistFirst
                    ? song.artist
                    : song.title
            ),
            createElement(
                "div",
                "efc-song-artist",
                artistFirst
                    ? song.title
                    : song.artist
            )
        );

        return row;
    }

    function appendSongRows(
        container,
        songs,
        artistFirst
    ) {
        songs.forEach(song => {
            container.appendChild(
                createSongRow(
                    song,
                    artistFirst
                )
            );
        });
    }

    EFC.renderSongList = function (
        rootId,
        options
    ) {
        const settings = Object.assign(
            {
                initialView: "genre",
                emptyMessage:
                    "No matching songs found."
            },
            options || {}
        );

        const root =
            document.getElementById(rootId);

        if (!root) {
            return false;
        }

        if (
            typeof EFC.filterSongs !==
            "function"
        ) {
            root.textContent =
                "Song utilities not loaded.";
            return false;
        }

        const searchInput =
            root.querySelector(
                "#efc-song-search"
            );

        const countElement =
            root.querySelector(
                "#efc-song-count"
            );

        const tabButtons =
            Array.from(
                root.querySelectorAll(
                    ".efc-song-tab"
                )
            );

        const panels =
            Array.from(
                root.querySelectorAll(
                    ".efc-song-panel"
                )
            );

        if (
            !searchInput ||
            !countElement ||
            !tabButtons.length ||
            !panels.length
        ) {
            throw new Error(
                "The Song List embed is missing required elements."
            );
        }

        const validViews =
            ["genre", "title", "artist", "decade"];

        let currentView =
            validViews.includes(
                settings.initialView
            )
                ? settings.initialView
                : "genre";

        let selectedGenre = "";

        function getPanel(view) {
            return panels.find(panel =>
                panel.dataset.panel === view
            );
        }

        function setActiveView(view) {
            currentView = view;

            tabButtons.forEach(button => {
                const isActive =
                    button.dataset.view === view;

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
            });

            panels.forEach(panel => {
                panel.classList.toggle(
                    "active",
                    panel.dataset.panel === view
                );
            });
        }

        function getFilteredSongs() {
            return EFC.filterSongs({
                query: searchInput.value,
                genre: selectedGenre,
                sortBy:
                    currentView === "artist"
                        ? "artist"
                        : "title"
            });
        }

        function renderEmpty(panel) {
            panel.appendChild(
                createElement(
                    "div",
                    "efc-empty",
                    settings.emptyMessage
                )
            );
        }

        function renderTitleView(
            panel,
            songs
        ) {
            appendSongRows(
                panel,
                songs,
                false
            );
        }

        function renderArtistView(
            panel,
            songs
        ) {
            appendSongRows(
                panel,
                songs,
                true
            );
        }

        function renderDecadeView(
            panel,
            songs
        ) {
            const groups =
                EFC.groupSongsByDecade(
                    songs
                );

            EFC.SONG_DECADE_ORDER
                .forEach(decade => {
                    const groupSongs =
                        groups.get(decade);

                    if (!groupSongs.length) {
                        return;
                    }

                    const group =
                        createElement(
                            "section",
                            "efc-group"
                        );

                    group.appendChild(
                        createElement(
                            "h3",
                            "efc-group-heading",
                            decade
                        )
                    );

                    appendSongRows(
                        group,
                        groupSongs,
                        false
                    );

                    panel.appendChild(group);
                });
        }

        function renderGenreView(
            panel,
            songs
        ) {
            const tools =
                createElement(
                    "div",
                    "efc-genre-tools"
                );

            const allSongsButton =
                createElement(
                    "button",
                    "efc-genre-chip",
                    `All Songs (${EFC.getAllSongs().length})`
                );

            allSongsButton.type = "button";
            allSongsButton.dataset.genre = "";
            allSongsButton.classList.toggle(
                "active",
                selectedGenre === ""
            );

            tools.appendChild(
                allSongsButton
            );

            EFC.SONG_GENRE_ORDER
                .forEach(genre => {
                    const button =
                        createElement(
                            "button",
                            "efc-genre-chip",
                            `${genre} (${EFC.getSongGenreCount(genre)})`
                        );

                    button.type = "button";
                    button.dataset.genre =
                        genre;

                    button.classList.toggle(
                        "active",
                        selectedGenre === genre
                    );

                    tools.appendChild(button);
                });

            tools.addEventListener(
                "click",
                event => {
                    const button =
                        event.target.closest(
                            ".efc-genre-chip"
                        );

                    if (!button) {
                        return;
                    }

                    selectedGenre =
                        button.dataset.genre || "";

                    render();
                }
            );

            panel.appendChild(tools);

            appendSongRows(
                panel,
                songs,
                false
            );
        }

        function render() {
            const songs =
                getFilteredSongs();

            const panel =
                getPanel(currentView);

            if (!panel) {
                return;
            }

            panel.replaceChildren();

            countElement.textContent =
                `${songs.length} ${
                    songs.length === 1
                        ? "song"
                        : "songs"
                }`;

            if (!songs.length) {
                renderEmpty(panel);
                return;
            }

            if (currentView === "genre") {
                renderGenreView(
                    panel,
                    songs
                );
            } else if (
                currentView === "artist"
            ) {
                renderArtistView(
                    panel,
                    songs
                );
            } else if (
                currentView === "decade"
            ) {
                renderDecadeView(
                    panel,
                    songs
                );
            } else {
                renderTitleView(
                    panel,
                    songs
                );
            }
        }

        tabButtons.forEach(
            (button, index) => {
                button.addEventListener(
                    "click",
                    () => {
                        selectedGenre = "";
                        setActiveView(
                            button.dataset.view
                        );
                        render();
                    }
                );

                button.addEventListener(
                    "keydown",
                    event => {
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

                        tabButtons[
                            nextIndex
                        ].focus();

                        tabButtons[
                            nextIndex
                        ].click();
                    }
                );
            }
        );

        searchInput.addEventListener(
            "input",
            () => {
                selectedGenre = "";
                render();
            }
        );

        searchInput.addEventListener(
            "search",
            () => {
                selectedGenre = "";
                render();
            }
        );

        setActiveView(currentView);
        render();

        return true;
    };

})(window.EFC);
