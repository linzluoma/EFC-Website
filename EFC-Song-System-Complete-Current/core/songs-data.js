/*
========================================================
Electric Flower Co.
Master Song Data
Version 2.0
========================================================

This file is the single source of truth for every song
list and featured-song widget on electricflower.co.

Required script order:
1. songs-data.js
2. song-utils.js
3. song-widgets.js
4. songlist.js (full Song List page only)

Add, remove, or edit songs only in this file.
========================================================
*/

window.EFC_SONGS = [
    {
        "title": "3AM",
        "artist": "Matchbox 20",
        "decade": "1990’s",
        "genres": [
            "Modern Rock & Alternative",
            "90s & Y2K",
            "Sing-Along Favorites"
        ],
        "featured": false
    },
    {
        "title": "867-5309 (Jenny)",
        "artist": "Tommy Tutone",
        "decade": "1980’s",
        "genres": [
            "Classic Rock",
            "Sing-Along Favorites"
        ],
        "featured": false
    },
    {
        "title": "All Star",
        "artist": "Smash Mouth",
        "decade": "1990’s",
        "genres": [
            "Modern Rock & Alternative",
            "90s & Y2K",
            "Dance & Party",
            "Sing-Along Favorites"
        ],
        "featured": false
    },
    {
        "title": "All The Small Things",
        "artist": "Blink 182",
        "decade": "2000’s",
        "genres": [
            "Modern Rock & Alternative",
            "90s & Y2K",
            "Dance & Party"
        ],
        "featured": true
    },
    {
        "title": "American Girl",
        "artist": "Tom Petty",
        "decade": "1970’s",
        "genres": [
            "Classic Rock",
            "Sing-Along Favorites"
        ],
        "featured": false
    },
    {
        "title": "Any Way You Want It",
        "artist": "Journey",
        "decade": "1980’s",
        "genres": [
            "Classic Rock",
            "Dance & Party",
            "Sing-Along Favorites"
        ],
        "featured": false
    },
    {
        "title": "...Baby One More Time",
        "artist": "Britney Spears",
        "decade": "1990’s",
        "genres": [
            "Pop Favorites",
            "90s & Y2K",
            "Dance & Party",
            "Sing-Along Favorites"
        ],
        "featured": false
    },
    {
        "title": "Billie Jean",
        "artist": "Michael Jackson",
        "decade": "1980’s",
        "genres": [
            "Pop Favorites",
            "Dance & Party"
        ],
        "featured": false
    },
    {
        "title": "Birthday",
        "artist": "The Beatles",
        "decade": "Pre-1970’s",
        "genres": [
            "Classic Rock",
            "Sing-Along Favorites"
        ],
        "featured": false
    },
    {
        "title": "Black Horse & Cherry Tree",
        "artist": "KT Tunstall",
        "decade": "2000’s",
        "genres": [
            "Pop Favorites",
            "Easy Listening / Cocktail Hour"
        ],
        "featured": false
    },
    {
        "title": "Boys of Summer",
        "artist": "Don Henley",
        "decade": "1980’s",
        "genres": [
            "Classic Rock",
            "Easy Listening / Cocktail Hour"
        ],
        "featured": false
    },
    {
        "title": "Brown Eyed Girl",
        "artist": "Van Morrison",
        "decade": "Pre-1970’s",
        "genres": [
            "Classic Rock",
            "Sing-Along Favorites",
            "Easy Listening / Cocktail Hour"
        ],
        "featured": false
    },
    {
        "title": "Cake by the Ocean",
        "artist": "DNCE",
        "decade": "2010’s & Beyond",
        "genres": [
            "Pop Favorites",
            "Dance & Party"
        ],
        "featured": false
    },
    {
        "title": "Can't Stop the Feeling",
        "artist": "Justin Timberlake",
        "decade": "2010’s & Beyond",
        "genres": [
            "Pop Favorites",
            "Dance & Party"
        ],
        "featured": true
    },
    {
        "title": "Closing Time",
        "artist": "Semisonic",
        "decade": "1990’s",
        "genres": [
            "Modern Rock & Alternative",
            "90s & Y2K",
            "Sing-Along Favorites"
        ],
        "featured": false
    },
    {
        "title": "Country Girl",
        "artist": "Luke Bryan",
        "decade": "2010’s & Beyond",
        "genres": [
            "Country",
            "Dance & Party"
        ],
        "featured": false
    },
    {
        "title": "Dancing Queen",
        "artist": "ABBA",
        "decade": "1970’s",
        "genres": [
            "Pop Favorites",
            "Dance & Party",
            "Sing-Along Favorites"
        ],
        "featured": true
    },
    {
        "title": "Dreams",
        "artist": "Fleetwood Mac",
        "decade": "1970’s",
        "genres": [
            "Classic Rock",
            "Easy Listening / Cocktail Hour"
        ],
        "featured": false
    },
    {
        "title": "Drift Away",
        "artist": "Uncle Kracker (orig. Dobie Gray)",
        "decade": "2000’s",
        "genres": [
            "Classic Rock",
            "Easy Listening / Cocktail Hour",
            "Sing-Along Favorites"
        ],
        "featured": false
    },
    {
        "title": "Don’t Stop",
        "artist": "Fleetwood Mac",
        "decade": "1970’s",
        "genres": [
            "Classic Rock",
            "Dance & Party",
            "Sing-Along Favorites"
        ],
        "featured": false
    },
    {
        "title": "Don’t Stop Believin’",
        "artist": "Journey",
        "decade": "1980’s",
        "genres": [
            "Classic Rock",
            "Dance & Party",
            "Sing-Along Favorites"
        ],
        "featured": true
    },
    {
        "title": "Everybody",
        "artist": "Backstreet Boys",
        "decade": "1990’s",
        "genres": [
            "Pop Favorites",
            "90s & Y2K",
            "Dance & Party",
            "Sing-Along Favorites"
        ],
        "featured": true
    },
    {
        "title": "Ex’s & Oh’s",
        "artist": "Elle King",
        "decade": "2010’s & Beyond",
        "genres": [
            "Pop Favorites",
            "Modern Rock & Alternative",
            "Dance & Party"
        ],
        "featured": false
    },
    {
        "title": "Faith",
        "artist": "George Michael",
        "decade": "1980’s",
        "genres": [
            "Pop Favorites",
            "Dance & Party",
            "Sing-Along Favorites"
        ],
        "featured": false
    },
    {
        "title": "Feel It Still",
        "artist": "Portugal The Man",
        "decade": "2010’s & Beyond",
        "genres": [
            "Pop Favorites",
            "Modern Rock & Alternative",
            "Dance & Party"
        ],
        "featured": false
    },
    {
        "title": "Fight For Your Right",
        "artist": "Beastie Boys",
        "decade": "1980’s",
        "genres": [
            "Modern Rock & Alternative",
            "Dance & Party",
            "Sing-Along Favorites"
        ],
        "featured": false
    },
    {
        "title": "Flagpole Sitta",
        "artist": "Harvey Danger",
        "decade": "1990’s",
        "genres": [
            "Modern Rock & Alternative",
            "90s & Y2K"
        ],
        "featured": false
    },
    {
        "title": "Flowers",
        "artist": "Miley Cyrus",
        "decade": "2010’s & Beyond",
        "genres": [
            "Pop Favorites",
            "Dance & Party"
        ],
        "featured": false
    },
    {
        "title": "Folsom Prison Blues",
        "artist": "Johnny Cash",
        "decade": "Pre-1970’s",
        "genres": [
            "Country",
            "Classic Rock",
            "Easy Listening / Cocktail Hour"
        ],
        "featured": false
    },
    {
        "title": "Free Fallin'",
        "artist": "Tom Petty",
        "decade": "1980’s",
        "genres": [
            "Classic Rock",
            "Easy Listening / Cocktail Hour",
            "Sing-Along Favorites"
        ],
        "featured": false
    },
    {
        "title": "Girl's Just Wanna Have Fun",
        "artist": "Cyndi Lauper",
        "decade": "1980’s",
        "genres": [
            "Pop Favorites",
            "Dance & Party",
            "Sing-Along Favorites"
        ],
        "featured": false
    },
    {
        "title": "Here For The Party",
        "artist": "Gretchen Wilson",
        "decade": "2000’s",
        "genres": [
            "Country",
            "Dance & Party"
        ],
        "featured": false
    },
    {
        "title": "Hit Me With Your Best Shot",
        "artist": "Pat Benatar",
        "decade": "1980’s",
        "genres": [
            "Classic Rock",
            "Dance & Party",
            "Sing-Along Favorites"
        ],
        "featured": false
    },
    {
        "title": "Hurts So Good",
        "artist": "John Mellencamp",
        "decade": "1980’s",
        "genres": [
            "Classic Rock",
            "Dance & Party",
            "Sing-Along Favorites"
        ],
        "featured": false
    },
    {
        "title": "I Love Rock & Roll",
        "artist": "Joan Jett",
        "decade": "1980’s",
        "genres": [
            "Classic Rock",
            "Dance & Party",
            "Sing-Along Favorites"
        ],
        "featured": false
    },
    {
        "title": "I Wanna Be Sedated",
        "artist": "The Ramones",
        "decade": "1970’s",
        "genres": [
            "Classic Rock",
            "Modern Rock & Alternative",
            "Dance & Party"
        ],
        "featured": false
    },
    {
        "title": "I Want You To Want Me",
        "artist": "Cheap Trick",
        "decade": "1970’s",
        "genres": [
            "Classic Rock",
            "Dance & Party",
            "Sing-Along Favorites"
        ],
        "featured": false
    },
    {
        "title": "I Will Survive",
        "artist": "Gloria Gaynor",
        "decade": "1970’s",
        "genres": [
            "Pop Favorites",
            "Dance & Party",
            "Sing-Along Favorites"
        ],
        "featured": true
    },
    {
        "title": "I'm Too Sexy",
        "artist": "Right Said Fred",
        "decade": "1990’s",
        "genres": [
            "Pop Favorites",
            "90s & Y2K",
            "Dance & Party"
        ],
        "featured": false
    },
    {
        "title": "If It Makes You Happy",
        "artist": "Sheryl Crow",
        "decade": "1990’s",
        "genres": [
            "Modern Rock & Alternative",
            "90s & Y2K",
            "Sing-Along Favorites"
        ],
        "featured": false
    },
    {
        "title": "Ironic",
        "artist": "Alanis Morissette",
        "decade": "1990’s",
        "genres": [
            "Modern Rock & Alternative",
            "90s & Y2K",
            "Sing-Along Favorites"
        ],
        "featured": false
    },
    {
        "title": "Jessie's Girl",
        "artist": "Rick Springfield",
        "decade": "1980’s",
        "genres": [
            "Classic Rock",
            "Dance & Party",
            "Sing-Along Favorites"
        ],
        "featured": false
    },
    {
        "title": "Kiss",
        "artist": "Prince",
        "decade": "1980’s",
        "genres": [
            "Pop Favorites",
            "Dance & Party",
            "Motown / Funk / Soul"
        ],
        "featured": false
    },
    {
        "title": "Let's Dance",
        "artist": "David Bowie",
        "decade": "1980’s",
        "genres": [
            "Classic Rock",
            "Pop Favorites",
            "Dance & Party"
        ],
        "featured": false
    },
    {
        "title": "Lights",
        "artist": "Journey",
        "decade": "1970’s",
        "genres": [
            "Classic Rock",
            "Easy Listening / Cocktail Hour"
        ],
        "featured": false
    },
    {
        "title": "Listen to the Music",
        "artist": "The Doobie Brothers",
        "decade": "1970’s",
        "genres": [
            "Classic Rock",
            "Easy Listening / Cocktail Hour",
            "Sing-Along Favorites"
        ],
        "featured": false
    },
    {
        "title": "Livin' La Vida Loca",
        "artist": "Ricky Martin",
        "decade": "1990’s",
        "genres": [
            "Pop Favorites",
            "90s & Y2K",
            "Dance & Party"
        ],
        "featured": false
    },
    {
        "title": "Livin' On A Prayer",
        "artist": "Bon Jovi",
        "decade": "1980’s",
        "genres": [
            "Classic Rock",
            "Dance & Party",
            "Sing-Along Favorites"
        ],
        "featured": false
    },
    {
        "title": "Love Shack",
        "artist": "B-52s",
        "decade": "1980’s",
        "genres": [
            "Pop Favorites",
            "Dance & Party",
            "Sing-Along Favorites"
        ],
        "featured": false
    },
    {
        "title": "Man! I Feel Like A Woman",
        "artist": "Shania Twain",
        "decade": "1990’s",
        "genres": [
            "Country",
            "Pop Favorites",
            "Dance & Party",
            "Sing-Along Favorites"
        ],
        "featured": true
    },
    {
        "title": "Mary Jane’s Last Dance",
        "artist": "Tom Petty",
        "decade": "1990’s",
        "genres": [
            "Classic Rock",
            "Easy Listening / Cocktail Hour"
        ],
        "featured": false
    },
    {
        "title": "Mr. Brightside",
        "artist": "The Killers",
        "decade": "2000’s",
        "genres": [
            "Modern Rock & Alternative",
            "90s & Y2K",
            "Dance & Party",
            "Sing-Along Favorites"
        ],
        "featured": true
    },
    {
        "title": "My Own Worst Enemy",
        "artist": "Lit",
        "decade": "1990’s",
        "genres": [
            "Modern Rock & Alternative",
            "90s & Y2K",
            "Dance & Party"
        ],
        "featured": true
    },
    {
        "title": "Pink Pony Club",
        "artist": "Chappell Roan",
        "decade": "2010’s & Beyond",
        "genres": [
            "Pop Favorites",
            "Dance & Party",
            "Sing-Along Favorites"
        ],
        "featured": true
    },
    {
        "title": "Play That Funky Music",
        "artist": "Wild Cherry",
        "decade": "1970’s",
        "genres": [
            "Classic Rock",
            "Dance & Party",
            "Motown / Funk / Soul"
        ],
        "featured": false
    },
    {
        "title": "Pour Some Sugar On Me",
        "artist": "Def Leppard",
        "decade": "1980’s",
        "genres": [
            "Classic Rock",
            "Dance & Party",
            "Sing-Along Favorites"
        ],
        "featured": false
    },
    {
        "title": "Pride & Joy",
        "artist": "Stevie Ray Vaughan",
        "decade": "1980’s",
        "genres": [
            "Classic Rock",
            "Easy Listening / Cocktail Hour"
        ],
        "featured": false
    },
    {
        "title": "Purple Rain",
        "artist": "Prince",
        "decade": "1980’s",
        "genres": [
            "Classic Rock",
            "Pop Favorites",
            "Easy Listening / Cocktail Hour",
            "Sing-Along Favorites"
        ],
        "featured": false
    },
    {
        "title": "Santeria",
        "artist": "Sublime",
        "decade": "1990’s",
        "genres": [
            "Modern Rock & Alternative",
            "90s & Y2K",
            "Easy Listening / Cocktail Hour"
        ],
        "featured": false
    },
    {
        "title": "Say You Love Me",
        "artist": "Fleetwood Mac",
        "decade": "1970’s",
        "genres": [
            "Classic Rock",
            "Easy Listening / Cocktail Hour"
        ],
        "featured": false
    },
    {
        "title": "Shut Up and Dance",
        "artist": "Walk the Moon",
        "decade": "2010’s & Beyond",
        "genres": [
            "Modern Rock & Alternative",
            "Pop Favorites",
            "Dance & Party"
        ],
        "featured": true
    },
    {
        "title": "Soak Up the Sun",
        "artist": "Sheryl Crow",
        "decade": "2000’s",
        "genres": [
            "Pop Favorites",
            "Easy Listening / Cocktail Hour"
        ],
        "featured": false
    },
    {
        "title": "Song #2",
        "artist": "Blur",
        "decade": "1990’s",
        "genres": [
            "Modern Rock & Alternative",
            "90s & Y2K",
            "Dance & Party"
        ],
        "featured": false
    },
    {
        "title": "Soul Man",
        "artist": "Sam & Dave",
        "decade": "Pre-1970’s",
        "genres": [
            "Motown / Funk / Soul",
            "Dance & Party",
            "Classic Rock"
        ],
        "featured": false
    },
    {
        "title": "Stacy's Mom",
        "artist": "Fountains of Wayne",
        "decade": "2000’s",
        "genres": [
            "Modern Rock & Alternative",
            "90s & Y2K",
            "Dance & Party"
        ],
        "featured": false
    },
    {
        "title": "Summer of 69",
        "artist": "Bryan Adams",
        "decade": "1980’s",
        "genres": [
            "Classic Rock",
            "Dance & Party",
            "Sing-Along Favorites"
        ],
        "featured": false
    },
    {
        "title": "Superstition",
        "artist": "Stevie Wonder",
        "decade": "1970’s",
        "genres": [
            "Motown / Funk / Soul",
            "Dance & Party",
            "Sing-Along Favorites"
        ],
        "featured": false
    },
    {
        "title": "Sweet Caroline",
        "artist": "Neil Diamond",
        "decade": "Pre-1970’s",
        "genres": [
            "Classic Rock",
            "Sing-Along Favorites"
        ],
        "featured": true
    },
    {
        "title": "Sweet Child O’ Mine",
        "artist": "Guns & Roses",
        "decade": "1980’s",
        "genres": [
            "Classic Rock",
            "Dance & Party",
            "Sing-Along Favorites"
        ],
        "featured": true
    },
    {
        "title": "Talk Dirty To Me",
        "artist": "Poison",
        "decade": "1980’s",
        "genres": [
            "Classic Rock",
            "Dance & Party"
        ],
        "featured": false
    },
    {
        "title": "Tennessee Whiskey",
        "artist": "Chris Stapleton",
        "decade": "2010’s & Beyond",
        "genres": [
            "Country",
            "Easy Listening / Cocktail Hour"
        ],
        "featured": false
    },
    {
        "title": "The Middle",
        "artist": "Jimmy Eat World",
        "decade": "2000’s",
        "genres": [
            "Modern Rock & Alternative",
            "90s & Y2K",
            "Dance & Party"
        ],
        "featured": false
    },
    {
        "title": "The One I Love",
        "artist": "R.E.M.",
        "decade": "1980’s",
        "genres": [
            "Classic Rock",
            "Modern Rock & Alternative"
        ],
        "featured": false
    },
    {
        "title": "This Love",
        "artist": "Maroon 5",
        "decade": "2000’s",
        "genres": [
            "Pop Favorites",
            "90s & Y2K",
            "Easy Listening / Cocktail Hour"
        ],
        "featured": false
    },
    {
        "title": "Tubthumping",
        "artist": "Chumbawamba",
        "decade": "2000’s",
        "genres": [
            "Modern Rock & Alternative",
            "90s & Y2K",
            "Dance & Party",
            "Sing-Along Favorites"
        ],
        "featured": false
    },
    {
        "title": "Uptown Funk",
        "artist": "Mark Ronson ft. Bruno Mars",
        "decade": "2010’s & Beyond",
        "genres": [
            "Pop Favorites",
            "Dance & Party",
            "Motown / Funk / Soul"
        ],
        "featured": true
    },
    {
        "title": "Wagon Wheel",
        "artist": "Darius Rucker",
        "decade": "2010’s & Beyond",
        "genres": [
            "Country",
            "Sing-Along Favorites",
            "Easy Listening / Cocktail Hour"
        ],
        "featured": false
    },
    {
        "title": "Walk Like an Egyptian",
        "artist": "The Bangles",
        "decade": "1980’s",
        "genres": [
            "Pop Favorites",
            "Dance & Party",
            "Sing-Along Favorites"
        ],
        "featured": false
    },
    {
        "title": "Walking on Sunshine",
        "artist": "Katrina And The Waves",
        "decade": "1980’s",
        "genres": [
            "Pop Favorites",
            "Dance & Party",
            "Sing-Along Favorites"
        ],
        "featured": false
    },
    {
        "title": "Wannabe",
        "artist": "Spice Girls",
        "decade": "1990’s",
        "genres": [
            "Pop Favorites",
            "90s & Y2K",
            "Dance & Party",
            "Sing-Along Favorites"
        ],
        "featured": false
    },
    {
        "title": "What I Got",
        "artist": "Sublime",
        "decade": "1990’s",
        "genres": [
            "Modern Rock & Alternative",
            "90s & Y2K",
            "Easy Listening / Cocktail Hour"
        ],
        "featured": false
    },
    {
        "title": "What I Like About You",
        "artist": "The Romantics",
        "decade": "1980’s",
        "genres": [
            "Classic Rock",
            "Dance & Party",
            "Sing-Along Favorites"
        ],
        "featured": false
    },
    {
        "title": "What’s Up",
        "artist": "4 Non Blondes",
        "decade": "1990’s",
        "genres": [
            "Modern Rock & Alternative",
            "90s & Y2K",
            "Sing-Along Favorites"
        ],
        "featured": false
    },
    {
        "title": "Working For The Weekend",
        "artist": "Loverboy",
        "decade": "1980’s",
        "genres": [
            "Classic Rock",
            "Dance & Party",
            "Sing-Along Favorites"
        ],
        "featured": false
    },
    {
        "title": "You Belong with Me",
        "artist": "Taylor Swift",
        "decade": "2000’s",
        "genres": [
            "Pop Favorites",
            "Country",
            "Dance & Party",
            "Sing-Along Favorites"
        ],
        "featured": true
    },
    {
        "title": "You Gotta Be",
        "artist": "Des'ree",
        "decade": "1990’s",
        "genres": [
            "Pop Favorites",
            "90s & Y2K",
            "Easy Listening / Cocktail Hour"
        ],
        "featured": false
    },
    {
        "title": "You Might Think",
        "artist": "The Cars",
        "decade": "1980’s",
        "genres": [
            "Classic Rock",
            "Pop Favorites",
            "Dance & Party"
        ],
        "featured": false
    },
    {
        "title": "You Shook Me All Night",
        "artist": "AC/DC",
        "decade": "1980’s",
        "genres": [
            "Classic Rock",
            "Dance & Party",
            "Sing-Along Favorites"
        ],
        "featured": false
    },
    {
        "title": "Your Love",
        "artist": "The Outfield",
        "decade": "1980’s",
        "genres": [
            "Classic Rock",
            "Dance & Party",
            "Sing-Along Favorites"
        ],
        "featured": false
    },
    {
        "title": "Zombie",
        "artist": "The Cranberries",
        "decade": "1990’s",
        "genres": [
            "Modern Rock & Alternative",
            "90s & Y2K",
            "Sing-Along Favorites"
        ],
        "featured": false
    }
];
