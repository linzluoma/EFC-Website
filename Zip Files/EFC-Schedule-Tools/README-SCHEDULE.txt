Electric Flower Co. Full Schedule Fix v2.1
================================================

CONTENTS
--------
1. schedule.js
   Replace the current schedule.js asset in Weebly with this file.

2. shows-page-embed.html
   Keep the existing CSS at the top of your Shows page Embed Code block.
   Delete everything from the old <div id="schedule-data"> through the end
   of the old inline <script>, then paste the contents of this file there.

WHAT THIS VERSION FIXES
-----------------------
- Exposes EFC.renderFullSchedule()
- Also exposes EFC.renderSchedule() as a compatibility alias
- Shows both public and private events
- Restores Upcoming/Past tab counters
- Restores tab switching and keyboard controls
- Avoids duplicate tab event listeners
- Does not auto-run before the page containers are available

REQUIRED SCRIPT ORDER
---------------------
Make sure the header template used by the Shows page contains:

<script src="/files/theme/shows-data.js"></script>
<script src="/files/theme/show-utils.js"></script>
<script src="/files/theme/show-widgets.js"></script>
<script src="/files/theme/schedule.js"></script>

The Shows page may use a different Weebly header type than the homepage.
Add these lines to the specific header template used by the Shows page.

AFTER UPDATING
--------------
1. Save the files in Weebly's HTML/CSS editor.
2. Publish the site.
3. Hard-refresh the Shows page with Ctrl+Shift+R.
4. This console check should return "function":

   typeof EFC.renderFullSchedule
