# Impromptu.Community

A playful, responsive single-page community website. The main action takes visitors to the WhatsApp Community; event discovery links to RSVP.kim.

## Local preview

From this repository, run `python3 -m http.server 4173 --directory site/dist`, then open http://localhost:4173.

The site is buildless HTML, CSS, JavaScript, and original SVG artwork. Website source lives in `site/dist/`. No install or build step is required. Google Fonts are optional, with local system fallbacks.

## Community links

Links are taken from Sunny's original X article: https://x.com/sunnykgupta/status/1797231355023310950

- Primary WhatsApp invite: the second invite in the article; the first was marked full.
- WhatsApp announcement channel and Telegram: secondary links in the footer CTA.
- Instagram is omitted because the article does not provide an Instagram URL.

Invite destinations have not been joined or submitted to. Confirm that the primary invitation still points to the intended community before public launch.

The café and character artwork are illustrations, not photographs of actual gatherings.

## GitHub Pages

GitHub Actions publishes `site/dist/` on every push to `main`. Manual deployments are also supported, but the workflow only deploys `main`. No separate deployment branch or build step is needed. GitHub serves the most recent successful deployment while a new deployment runs.

- Repository: https://github.com/TeamShiksha/Impromptu.Community
- Workflow: `.github/workflows/pages.yml`
- Custom domain: `impromptu.community`
- Publishing source in repository Settings → Pages: **GitHub Actions**

The domain is configured in GitHub Pages settings (Actions deployments do not use a `CNAME` file). The GitHub Pages deployment environment should permit only `main`.

### Domain DNS

At the DNS provider serving `ns1.madhues.com` and `ns2.madhues.com`, replace the existing apex A record with all four records below. Point `www` directly to the organization's GitHub Pages hostname.

| Type | Name | Value |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | teamshiksha.github.io |

Use the provider's default TTL or 3600 seconds. Replace conflicting A, AAAA, or CNAME records for these two website names; retain unrelated records, including email MX/TXT records. IPv6 AAAA records are optional; if using them, use GitHub's documented values. Once DNS passes GitHub's check and its certificate is issued, enable **Enforce HTTPS** in Settings → Pages.

DNS reference: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site

## Mochi, the café cat

`site/dist/mochi.js` and `mochi.css` add a small SVG companion with wave, stretch, grooming, nap, and happy animations. The menu links to the community and RSVP.kim, offers treats and side quests, and supports sleeping or hiding the mascot. Hidden Mochi can be restored from the footer. Preferences stay in the visitor's browser; unavailable browser storage is handled gracefully.

Mochi reacts to the three existing side-quest cards, pauses idle behavior in background tabs, respects reduced-motion preferences, and moves above visible primary WhatsApp buttons. The menu supports keyboard navigation, Escape, and outside-click dismissal. No dependencies or external services are required.
