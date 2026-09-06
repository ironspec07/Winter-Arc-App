# Winter Arc — ironspec.online/winterarc

## Winter Arc repo (separate Vercel project)
Deploy all files in this folder to the Winter Arc GitHub repo. Do not add `ironspec.online` as a domain to the Winter Arc Vercel project.

## Main IronSpec repo
Copy `MAIN_PROJECT_vercel.json` into the root of the GitHub repo that already powers `https://ironspec.online` and rename it to `vercel.json`.
Replace `YOUR-WINTER-ARC-PROJECT.vercel.app` with the Winter Arc project's actual production `.vercel.app` hostname.
Commit and push; the main Vercel project will redeploy.

## Result
`https://ironspec.online/winterarc/` routes to the separate Winter Arc Vercel project while keeping the public URL on ironspec.online.

## PWA
The Winter Arc app is configured for the `/winterarc/` base path, including the manifest start URL/scope and service worker scope.


## Android / Chrome installability
The app now includes required 192x192 and 512x512 PNG icons and is scoped to /winterarc/. After deploying, open https://ironspec.online/winterarc/ in Chrome. Use Chrome's **Install app** option when offered. **Create shortcut** creates a bookmark/shortcut and is not the same as a PWA installation. If Chrome still shows only Create shortcut after a new deployment, clear site data for ironspec.online, reload the page, and check that /winterarc/manifest.webmanifest, /winterarc/sw.js, and both icon files return HTTP 200.
