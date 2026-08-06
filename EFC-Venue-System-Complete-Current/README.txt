Electric Flower Co. Venue System v3.0
First-Pass Portfolio Cleanup
======================================

WHAT CHANGED
------------
1. Performance history is now based only on completed shows.
   When a date passes in shows-data.js, it automatically becomes part of
   the venue history, statistics, cards, and map.

2. Private engagements are grouped on the Venue History page into:
   - Weddings
   - Corporate Events
   - Fundraisers
   - Holiday Parties
   - Private Celebrations
   - Private Events (temporary catch-all)

3. The raw private records remain in venues-data.js, preserving their
   sourceShowIds, locations, and dates. Only the public presentation is grouped.

4. First-pass cleanup includes:
   - Merged duplicate Blessing of the Boats records
   - Cleaned The Vault
   - Cleaned The Lotus Room
   - Cleaned Trapper Joe's
   - Renamed Grand Rapids Symphony Orchestra entry to Millennium Park
   - Reclassified the FFA Alumni Hootenany as a Fundraiser

5. Performance Highlights now includes private featured engagements.

6. logoFile may contain only a filename. Venue Widgets automatically uses:
   https://linzluoma.github.io/EFC-Website/venue-logos/

INSTALLATION ORDER
------------------
shows-data.js
show-utils.js
venues-data.js
venue-utils.js
venue-widgets.js
venue-map.js
venue-history.js

UPLOAD
------
Replace the five matching files in Weebly Theme Assets, publish, and perform
an Empty Cache and Hard Reload.

FIRST-PASS NOTE
---------------
This release is intentionally conservative. The Private Events catch-all
will remain until individual events are manually reclassified.
