/*
========================================================
Electric Flower Co.
Song Utilities
Version 2.0
========================================================

Requires:
1. songs-data.js
2. song-utils.js
========================================================
*/

window.EFC = window.EFC || {};

(function (EFC) {
    "use strict";

    EFC.SONG_GENRE_ORDER = [
        "Classic Rock",
        "Modern Rock & Alternative",
        "Pop Favorites",
        "Country",
        "Dance & Party",
        "Motown / Funk / Soul",
        "90s & Y2K",
        "Sing-Along Favorites",
        "Easy Listening / Cocktail Hour"
    ];

    EFC.SONG_DECADE_ORDER = [
        "Pre-1970’s",
        "1970’s",
        "1980’s",
        "1990’s",
        "2000’s",
        "2010’s & Beyond",
        "Uncategorized"
    ];

    EFC.getAllSongs = function () {
        if (!Array.isArray(window.EFC_SONGS)) {
            return [];
        }

        return window.EFC_SONGS.slice();
    };

    EFC.isValidSong = function (song) {
        return Boolean(
            song &&
            typeof song === "object" &&
            typeof song.title === "string" &&
            typeof song.artist === "string" &&
            typeof song.decade === "string" &&
            Array.isArray(song.genres)
        );
    };

    EFC.normalizeSongSearchText = function (value) {
        return String(value || "")
            .toLocaleLowerCase("en-US")
            .replace(/[’‘]/g, "'")
            .replace(/\s+/g, " ")
            .trim();
    };

    EFC.songMatchesQuery = function (song, query) {
        const normalizedQuery =
            EFC.normalizeSongSearchText(query);

        if (!normalizedQuery) {
            return true;
        }

        const searchableText =
            [
                song.title,
                song.artist,
                song.decade,
                ...(Array.isArray(song.genres) ? song.genres : [])
            ].join(" ");

        return EFC
            .normalizeSongSearchText(searchableText)
            .includes(normalizedQuery);
    };

    EFC.compareSongsByTitle = function (songA, songB) {
        return songA.title.localeCompare(
            songB.title,
            "en-US",
            { sensitivity: "base" }
        );
    };

    EFC.compareSongsByArtist = function (songA, songB) {
        const artistComparison =
            songA.artist.localeCompare(
                songB.artist,
                "en-US",
                { sensitivity: "base" }
            );

        return artistComparison ||
            EFC.compareSongsByTitle(songA, songB);
    };

    EFC.filterSongs = function (options) {
        const settings = Object.assign(
            {
                query: "",
                genre: "",
                decade: "",
                featuredOnly: false,
                sortBy: "title",
                limit: null
            },
            options || {}
        );

        let songs = EFC
            .getAllSongs()
            .filter(EFC.isValidSong);

        if (settings.query) {
            songs = songs.filter(song =>
                EFC.songMatchesQuery(
                    song,
                    settings.query
                )
            );
        }

        if (settings.genre) {
            songs = songs.filter(song =>
                song.genres.includes(settings.genre)
            );
        }

        if (settings.decade) {
            songs = songs.filter(song =>
                song.decade === settings.decade
            );
        }

        if (settings.featuredOnly) {
            songs = songs.filter(song =>
                song.featured === true
            );
        }

        if (settings.sortBy === "artist") {
            songs.sort(EFC.compareSongsByArtist);
        } else if (settings.sortBy === "none") {
            // Preserve the order in songs-data.js.
        } else {
            songs.sort(EFC.compareSongsByTitle);
        }

        if (
            Number.isInteger(settings.limit) &&
            settings.limit >= 0
        ) {
            songs = songs.slice(0, settings.limit);
        }

        return songs;
    };

    EFC.getFeaturedSongs = function (options) {
        return EFC.filterSongs(
            Object.assign(
                {},
                options || {},
                { featuredOnly: true }
            )
        );
    };

    EFC.getSongGenreCount = function (genre, options) {
        return EFC.filterSongs(
            Object.assign(
                {},
                options || {},
                {
                    genre: genre || "",
                    sortBy: "none"
                }
            )
        ).length;
    };

    EFC.groupSongsByDecade = function (songs) {
        const groups = new Map();

        EFC.SONG_DECADE_ORDER.forEach(decade => {
            groups.set(decade, []);
        });

        (songs || []).forEach(song => {
            const decade =
                groups.has(song.decade)
                    ? song.decade
                    : "Uncategorized";

            groups.get(decade).push(song);
        });

        groups.forEach(group => {
            group.sort(EFC.compareSongsByTitle);
        });

        return groups;
    };

})(window.EFC);
