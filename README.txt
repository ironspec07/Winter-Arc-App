WINTER ARC 2026 APP — v3

FEATURES
- 122-day September 1–December 31, 2026 Winter Arc.
- September 1–14: 7,000 steps, 20 pages, 3h study.
- September 15–30: 10,000 steps, 30 pages, 4h study.
- October–December: 10,000 steps, 40 pages, 4h study.
- Water 3L, sleep 5–7h, job applications 5/day.
- Gym is tracked as a weekly 4-day target.
- “No masturbation” is scored correctly: No = completed.

DEVICE STORAGE
Entries are saved in browser localStorage under the app's own key. A normal refresh does not erase them.
On Android, use Chrome -> menu -> Add to Home screen / Install app when available. The installed PWA uses the same browser storage on that phone. Clearing site data, removing browser storage, or resetting the phone can remove it, so Google Sheets sync is recommended as a backup.

GOOGLE SHEETS BACKUP / RESTORE
A simple Apps Script backend is included as Code.gs. It stores one row per date in a tab named “Winter Arc Data”.

Setup:
1. Create a blank Google Sheet.
2. Open Extensions -> Apps Script.
3. Paste the contents of Code.gs.
4. Change SECRET in Code.gs to a long private value.
5. Click Deploy -> New deployment -> Web app.
6. Execute as: Me.
7. Who has access: Anyone.
8. Copy the Web App URL.
9. Open the app, paste the URL and the same secret into Google Sheets backup & sync, then tap Save sync settings.
10. Tap Sync Sheets to send the device's recorded dates to the Sheet.
11. On another device, paste the same URL/secret and tap Pull from Sheets.

SYNC BEHAVIOR
- “Sync Sheets” upserts the device's recorded daily entries into the Sheet.
- “Pull from Sheets” merges the Sheet's stored entries into the device.
- The sync endpoint is protected by the secret token.
- Do not share the secret.
- For a stronger production-grade setup, replace the simple token endpoint with Google sign-in/OAuth or another authenticated backend.

CSV
Export CSV remains available for a manual backup and can be opened in Google Sheets or Excel.

OFFLINE / PWA
sw.js caches the main app shell after first load. Service workers/PWA installation generally require HTTPS (localhost is allowed for development). Opening index.html directly from a file manager may work for the core tracker, but installing the PWA requires hosting it from a secure web origin.
