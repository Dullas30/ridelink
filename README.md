# RideLink prototype

Plain HTML, CSS and JavaScript. No build step.

1. Open this folder in VS Code (File > Open Folder).
2. Install the "Live Server" extension, right-click index.html, choose "Open with Live Server".
   Or double-click index.html to open it in a browser.

## Files
- index.html  markup and the device-preview frame
- config.js   settings (Google Maps key)
- assets/     logo files (transparent PNG; white versions for green backgrounds)
- sw.js       service worker (offline + install)
- manifest.webmanifest  app details for installing
- style.css   styles (container queries handle folded, phone and unfolded widths)
- app.js      state, screens, mock negotiation, sign-up and driver checks, maps

Fake data lives at the top of app.js (S.trips, S.offers, S.bookings, S.incoming, S.earn).

## Maps and location
- Maps use the free Google Maps embed (no key, no card). It knows Abuja streets and draws real road routes.
- Live trip tracking uses an OpenStreetMap map so the car and your position can move on it.
- "Open route in Google Maps", "Navigate with Google Maps" and "Directions to pickup" open the Google Maps app (free).
- "Choose on map" lets people put a pin on their exact gate and add a landmark.
- From is filled with your current location when the phone's location is precise.
- Location only works on https (Vercel) or http://localhost (Live Server), not when you double-click index.html.
- Optional: put a Google key in config.js to switch everything (search, live map) to the Google Maps JavaScript API.
  Enable Maps JavaScript API, Routes API, Places API (New) and Geocoding API. Google needs a billing account for this.
- Where a page may not load maps (for example the shared preview link), the app falls back to a drawn map.

## Installable app (PWA)
- manifest.webmanifest: name, colours, icons, home-screen shortcuts (Find a ride, Post a trip, My trips) and install screenshots.
- sw.js: the service worker. Saves the app on the phone so it opens fast and works offline. Pages and code are
  fetched fresh when online (so updates arrive) and the saved copy is used when offline. Maps and search are always live.
- offline.html: shown if the app was never opened before and there is no connection.
- In the app: an "Install RideLink" banner on Find and in Profile (Android/Chrome shows the install prompt;
  iPhone shows Add to Home Screen steps), a "New version ready · Refresh" bar after updates, and an offline notice.
- When you change what is saved for offline use, bump VERSION in sw.js.

## Screens
On a real phone or foldable the device frame and switcher hide and the app fills the screen.
Wider screens (unfolded Fold, tablets) use the same phone layout in one centred column: header, content and
tab bar line up, and the map is always on top.
