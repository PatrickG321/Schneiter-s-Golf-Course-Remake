# Schneiter's Golf — website

Static website for Schneiter's Golf, a family-owned Utah golf business with two public courses:

- **Schneiter's Bluff** — West Point, UT (open, links-style)
- **Schneiter's Riverside** — Riverdale, UT (mature, tree-lined)

## Stack

Plain HTML + CSS + a little vanilla JavaScript — no framework, no build step. Just open `index.html` in a browser, or serve the folder with any static file server.

## Structure

- `*.html` — one file per page (home, the two courses, rates, outings, contact, holes, leagues, lessons, junior golf, gallery, about, policies, privacy, tee times, search, tournaments)
- `css/` — design system and page styles (`base.css`, `components.css`, `home.css`, `pages.css`)
- `js/site.js` — shared header menu, footer, and search-icon behavior injected on every page
- `img/` — course photos and logos
- `style-guide.html` — internal design reference (not linked from the public nav)

## Running locally

Any static server works. For example, with Python:

```bash
python -m http.server 8080
```

Then open http://localhost:8080/index.html
