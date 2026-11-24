# RideLink prototype

Plain HTML, CSS and JavaScript. No build step.

1. Open this folder in VS Code (File > Open Folder).
2. Install the "Live Server" extension, right-click index.html, choose "Open with Live Server".
   Or double-click index.html to open it in a browser.

## Files
- index.html  markup and the device-preview frame
- config.js   settings (Google Maps key)
- assets/     logo files (transparent PNG; white versions for green backgrounds)
- style.css   styles (container queries handle folded, phone and unfolded widths)
- app.js      state, screens, mock negotiation, sign-up and driver checks, maps

Fake data lives at the top of app.js (S.trips, S.offers, S.bookings, S.incoming, S.earn).

## Maps and location
- The map is live: the blue dot is your real position from the phone's GPS and it moves as you move.
  The target button on the map re-centres on you and keeps following.
- From is filled with your current location automatically (the browser asks for permission once).
- From, To, Pickup spot and Drop-off spot suggest places as you type. "Current location" is always first.
- With no key (default) the app uses free OpenStreetMap streets (CARTO tiles), OSRM road routes and
  Photon place search, styled to match RideLink. These free services are fine for demos; for launch use
  paid plans or Google.
- With a Google key in config.js the same features run on Google Maps, styled to match RideLink.
  Enable "Maps JavaScript API", "Routes API", "Places API (New)" and "Geocoding API", and restrict the key
  to your website address.
- Location only works on http://localhost (Live Server) or https, not when you double-click index.html.
- Where a page may not load map tiles (for example the shared preview link), the app falls back to a drawn map.
- assets/vendor holds Leaflet 1.9.4 (BSD-2 licence) so the free map works offline from a CDN.

## Screens
On a real phone or foldable the device frame and switcher hide and the app fills the screen.
Wider screens (unfolded Fold, tablets) use the same phone layout in one centred column: header, content and
tab bar line up, and the map is always on top.
