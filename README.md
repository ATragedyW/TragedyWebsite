# Tragedy Chaos website

## Files
- `index.html`: homepage (hero, beatmaker, merch preview, About).
- `style.css`: shared colors and components.
- `brand.css`: homepage/Shop layout, responsive rules, and logo sizing.
- `script.js`: Spotify, League, Twitch, and account navigation.
- `brand.js`: validates beatmaker messages and resizes its homepage frame.
- `beatmaker/`: standalone instrument and embedded view.
- `shop/index.html`: collection placeholder; checkout is not enabled.
- `images/Header.png`: approved brand logo.
- `assets/merch-banner.png`: merchandise concept image.

`style-red.css` is an unused earlier copy. Keep it outside the active site as a backup, or remove it after verifying the update. The site loads `style.css` and `brand.css`.

## Local preview
Run `vercel dev --listen 3000` from the Website folder, then open http://127.0.0.1:3000. Stop with Ctrl+C. This runs the pages and `/api/spotify` and `/api/league`; opening HTML directly or using a static server does not run the API functions.

## Configuration
Keep private settings in `.env.local` and your deployment provider's environment settings. Never commit credentials. Preserve your existing Spotify and Supabase configuration.

League uses `RIOT_API_KEY`, `RIOT_GAME_NAME=TragedyADC`, `RIOT_TAG_LINE=ttv`, and `RIOT_PLATFORM=na1`. Set the private key server-side. The backend displays the account, ranked queues, and champion mastery; it caches successful results for five minutes. See the existing `api/` files for implementation.

## Before publishing
Check desktop/mobile layout, the logo, Shop and account links, beatmaker play/stop/save/load, Spotify states, League, and Twitch. Use the existing deployment setup when ready. Link to Shopify only once its checkout and products are ready.
