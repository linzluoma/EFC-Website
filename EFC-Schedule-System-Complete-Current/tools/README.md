# Electric Flower Co. Schedule System v2.0

This ZIP contains a coordinated replacement set for the schedule system.

## Files

- `shows-data.js`: unchanged master show database
- `show-utils.js`: shared dates, locations, filtering, sorting, and lookups
- `show-widgets.js`: homepage and EPK renderers
- `schedule.js`: full Upcoming/Past schedule renderer

## Required loading order

Add these to every Weebly header template that uses schedule content:

```html
<script type="text/javascript" src="/files/theme/shows-data.js"></script>
<script type="text/javascript" src="/files/theme/show-utils.js"></script>
<script type="text/javascript" src="/files/theme/show-widgets.js"></script>
```

Load `schedule.js` only on the full schedule page, or globally if preferred. It safely does nothing on pages without the full schedule containers.

```html
<script type="text/javascript" src="/files/theme/schedule.js"></script>
```

## Homepage embed code

Keep your existing CSS and use this small script:

```html
<div id="home-shows">
  <p style="text-align:center;padding:18px;">Loading upcoming shows...</p>
</div>

<script>
window.addEventListener("load", function () {
    EFC.renderHomeShows("home-shows", {
        limit: 4,
        publicOnly: true
    });
});
</script>
```

## Press-kit embed code

Keep your existing CSS and use:

```html
<div id="schedule-preview">
  <p style="text-align:center;padding:18px;">Loading schedule...</p>
</div>

<script>
window.addEventListener("load", function () {
    EFC.renderEPKShows("schedule-preview", {
        limit: 6,
        publicOnly: false
    });
});
</script>
```

Change `publicOnly` to `true` whenever you decide the EPK should list only publicly attendable performances.

## Full schedule HTML requirements

The full schedule page must contain:

```html
<div id="upcomingShows"></div>
<div id="pastShows"></div>
```

Its tab buttons must use:

```html
data-tab="upcomingPanel"
data-tab="pastPanel"
```

## Important

Back up the current Weebly asset files before replacing them. Replace all three code files together so their APIs remain synchronized.
