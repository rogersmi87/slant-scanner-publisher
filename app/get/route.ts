// Smart download link for posting anywhere: www.slantscanner.com/get.
// Phones go straight to their store; desktops and link-preview crawlers get a
// small page with both store buttons and Open Graph tags so the post previews
// with the app's icon and name. Reading request headers keeps this dynamic.

const APP_STORE = 'https://apps.apple.com/app/id6761586292';
const APP_STORE_ID = '6761586292';
const PLAY_STORE = 'https://play.google.com/store/apps/details?id=com.rogers.slantscanner';
const NAME = 'Media Checker';
const TAGLINE = "See what's in a book, movie, show, game, or curriculum before your kids do.";
const ORIGIN = 'https://www.slantscanner.com';
const ICON = `${ORIGIN}/media-checker-icon.png`;

// Link-preview fetchers must see the page (and its OG tags), not a redirect.
// iMessage previews identify as facebookexternalhit/Twitterbot.
const PREVIEW_BOT = /bot|crawl|spider|facebookexternalhit|facebot|slack|discord|whatsapp|telegram|linkedin|pinterest|embedly|preview|skypeuri|vkshare|redditbot|google-pagerenderer/i;

// The answer depends on the device, so no shared cache may store it.
const NO_SHARED_CACHE = { 'Cache-Control': 'private, no-store', Vary: 'User-Agent' };

export async function GET(request: Request) {
  const ua = request.headers.get('user-agent') ?? '';
  if (!PREVIEW_BOT.test(ua)) {
    if (/iPhone|iPad|iPod/i.test(ua)) return redirect(APP_STORE);
    if (/Android/i.test(ua)) return redirect(PLAY_STORE);
  }
  return new Response(PAGE, { headers: { 'Content-Type': 'text/html; charset=utf-8', ...NO_SHARED_CACHE } });
}

function redirect(location: string) {
  return new Response(null, { status: 302, headers: { Location: location, ...NO_SHARED_CACHE } });
}

const PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Get ${NAME}</title>
  <meta name="description" content="${TAGLINE}" />
  <meta name="apple-itunes-app" content="app-id=${APP_STORE_ID}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${NAME}" />
  <meta property="og:description" content="${TAGLINE}" />
  <meta property="og:image" content="${ICON}" />
  <meta property="og:url" content="${ORIGIN}/get" />
  <meta name="twitter:card" content="summary" />
  <link rel="icon" href="${ICON}" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #F8F4E8; color: #233048;
           min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 32px 16px; text-align: center; }
    main { max-width: 420px; width: 100%; }
    img.icon { width: 112px; height: 112px; border-radius: 24px; box-shadow: 0 6px 20px rgba(35,48,72,0.18); margin-bottom: 20px; }
    h1 { font-size: 1.8rem; margin-bottom: 8px; }
    p.tag { color: #56617A; margin-bottom: 28px; line-height: 1.5; }
    a.btn { display: block; padding: 15px 18px; border-radius: 12px; font-weight: 700; text-decoration: none; margin-bottom: 12px; font-size: 1rem; }
    a.ios { background: #233048; color: #F8F4E8; }
    a.android { background: #BE623D; color: #FFFFFF; }
  </style>
</head>
<body>
  <main>
    <img class="icon" src="${ICON}" alt="${NAME} app icon" />
    <h1>${NAME}</h1>
    <p class="tag">${TAGLINE}</p>
    <a class="btn ios" href="${APP_STORE}">Download on the App Store</a>
    <a class="btn android" href="${PLAY_STORE}">Get it on Google Play</a>
  </main>
  <script>
    // iPadOS Safari reports itself as a Mac, so the server can't tell.
    if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) location.replace(${JSON.stringify(APP_STORE)});
  </script>
</body>
</html>`;
