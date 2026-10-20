# sophiemariarabmer.com

Website for Sophie Maria Rabmer, actor and amateur boxer. It's a plain static site
(HTML/CSS/JS) with no build step, so you can host it anywhere for free.

## Structure

```
index.html          The whole one-page site (all sections)
impressum.html      Impressum (legally required in Austria)
datenschutz.html    Privacy policy (placeholder, replace it!)
assets/css/style.css
assets/js/main.js   Menu, scroll effects, lightbox, contact form
assets/img/         Images (currently placeholders)
assets/fonts/       Fonts, self-hosted so no data goes to Google
CNAME               Domain for GitHub Pages
```

## Preview locally

```
python3 -m http.server
```
Then open http://localhost:8000.

## Editing content

All text is in `index.html`. Each section is marked with a comment
(`<!-- ============ PORTRAITS ============ -->` and so on).

- **Images:** replace the files in `assets/img/` with real photos of the **same name**
  (or change the file name in `index.html`). JPGs about 1600–2000 px wide are enough;
  compress them first (e.g. https://squoosh.app).
- **Image bands:** the two full-width black-and-white strips between sections are
  `assets/img/band-1.jpg` and `band-2.jpg` (landscape, ~2400 px wide). All photos are shown
  in black and white automatically, so colour photos are fine.
- **Add a portrait:** copy one `<a class="gallery__item">…</a>` line and change the file name.
- **Add a film still:** copy one `<article class="still">…</article>` block. If there is no
  video, delete the "Video ansehen" line.
- **News:** copy one `<article class="news-item">` block and add it at the top.
- **Vita PDF:** save it as `assets/vita.pdf`, or delete the link in the "Über mich" section.

## Setting up the contact form

The form uses [Formspree](https://formspree.io) (free for up to 50 messages a month):

1. Create an account and a new form, using Sophie's email address as the recipient.
2. Put the form ID in `index.html` in place of `YOUR_FORM_ID`
   (`action="https://formspree.io/f/abcdwxyz"`).

Until then, the form shows a note asking people to send an email instead.

## Publishing (GitHub Pages + your own domain)

1. On GitHub, go to **Settings → Pages** and set Source to "Deploy from a branch",
   branch `main`, folder `/ (root)`.
2. At the domain registrar, add these DNS records for `sophiemariarabmer.com`:
   - `A` records → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` for `www` → `jrabmer.github.io`
3. Once the domain is verified, turn on "Enforce HTTPS" in the Pages settings.

## Before going live

- [ ] Real photos, texts and links (Instagram, videos, email address)
- [ ] Formspree form ID
- [ ] Impressum: full address
- [ ] Datenschutz: a proper privacy policy
