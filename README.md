# Siqi Du — Academic Homepage

Personal academic homepage of **Siqi Du (杜思齐)**, Research Assistant at Peking University.

**Live site:** https://fourier7754.github.io/siqi_du

## Tech Stack

Pure static HTML / CSS / JS. No framework, no build step — push to `master` and GitHub Pages serves the files directly (`.nojekyll` disables the Jekyll pipeline).

- Style system: two border radii (6px / 4px), four font sizes (28 / 16 / 14 / 12px), black-white-grey palette, Space Grotesk + Inter
- Responsive: desktop / tablet (≤1100px) / mobile (≤768px)
- SEO: per-page title & description, canonical, Open Graph, JSON-LD structured data, `robots.txt` + `sitemap.xml`

## Structure

```
├── index.html            Home: research interests, selected publications, news
├── about.html            Bio
├── publications.html     Full publication list with abstracts
├── education.html        Education, research & teaching experience
├── awards.html           Scholarships, awards, conference talks
├── blog/
│   ├── index.html        Post list
│   └── hello-world.html  First post
├── assets/
│   ├── css/main.css      All styles (design tokens + components)
│   └── js/main.js        Page fade-out transition
├── images/               Avatar, favicons, paper figures
├── google_scholar_crawler/  Citation stats crawler (GitHub Action, daily)
└── .github/workflows/    Crawler workflow → writes gs_data.json to google-scholar-stats branch
```

## Local Preview

No build needed. Open `index.html` in a browser, or serve locally:

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## Adding a Blog Post

1. Copy `blog/hello-world.html` to `blog/<slug>.html` and edit title, date, and content inside `.post-body`.
2. Add a corresponding `<li>` entry in `blog/index.html`.
3. Optionally add a News entry on the home page and update `sitemap.xml`.

## Deploy

```bash
git add -A && git commit -m "Update homepage" && git push origin master
```

GitHub Pages (source: `master` branch, root) publishes automatically in about a minute.
