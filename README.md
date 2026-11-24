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

## Google Maps
- With no key (default) the app shows the Google Maps embed with the route. It needs an internet connection.
- For the full interactive map (road route in RideLink colours, moving car while tracking),
  put a key in config.js. In Google Cloud console enable "Maps JavaScript API" and "Routes API"
  and restrict the key to your website address. New Google Cloud projects can no longer enable the
  old Directions API, so the code uses the newer Routes library.
- Where a page is not allowed to load Google (for example the shared preview link), the app falls
  back to a drawn map automatically.
- "Use my location" (target icon in the From box) needs the page to run on http://localhost
  (Live Server) or https. It picks the nearest city.

## Screens
On a real phone or foldable the device frame and switcher hide and the app fills the screen.
Wider screens (unfolded Fold, tablets) use one centred column with the map on top.
