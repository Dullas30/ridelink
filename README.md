# RideLink prototype v2

Plain HTML, CSS and JavaScript. No build step.

1. Open this folder in VS Code (File > Open Folder).
2. Install the "Live Server" extension, right-click index.html, choose "Open with Live Server".
   Or double-click index.html to open it in a browser.

Files
- index.html  markup and the device-preview frame
- style.css   styles (container queries handle folded, phone and unfolded widths)
- app.js      state, screens, mock negotiation, onboarding, stylised map

Fake data lives at the top of app.js (S.trips, S.offers, S.bookings, S.incoming).
The map is a stylised SVG (mapSVG). For real maps, replace mapSVG with Leaflet + OpenStreetMap or Google Maps.
On a real phone or foldable the device frame and switcher hide and the app fills the screen.
