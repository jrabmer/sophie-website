# sophiemariarabmer.com

Website for Sophie Maria Rabmer, actor and amateur boxer. It's a plain static site
(HTML/CSS/JS) with no build step, so you can host it anywhere for free.

## Structure

```
index.html          The whole one-page site (all sections)
impressum.html      Impressum (legally required in Austria)
datenschutz.html    Privacy policy (placeholder, replace it!)
server/             Contact form script for your own server (not part of the website)
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

## Contact form (runs on your own server)

The website is hosted on GitHub Pages, which can't run server code. So the form sends
its data to `server/contact.php` on your own server, and that script emails it to Sophie.
It needs PHP 8 or newer and a working `mail()` (sendmail/postfix, standard on most hosts).

1. Make the script reachable over **HTTPS**, e.g. at `https://api.sophiemariarabmer.com/contact.php`:
   add a DNS `A` record for `api` pointing to your server, set up a vhost for it and get a
   certificate (e.g. `certbot`). Any other domain on your server works too.
2. Upload `server/contact.php` there, copy `server/config.example.php` next to it as
   `config.php` and fill in the recipient and sender addresses.
3. If you use a different URL than the one above, change `action="…"` of the form in `index.html`.
4. Test it: send a message through the live site.

What the script does: it only accepts requests from sophiemariarabmer.com, checks the input,
blocks header injection, has a hidden spam-trap field and a limit of 5 messages per IP address
per hour. Replies to the notification email go straight to the visitor. It also works without
JavaScript (the visitor is sent back to the site with a confirmation).

**If mails don't arrive / land in spam:** the sender address (`from` in `config.php`) must be
on a domain your server is allowed to send for. Add the server's IP to the domain's SPF record,
or use a sender address on the server's own domain.

`config.php` is in `.gitignore`, and `_config.yml` keeps the `server/` folder off GitHub Pages.

## Publishing (GitHub Pages + your own domain)

1. On GitHub, go to **Settings → Pages** and set Source to "Deploy from a branch",
   branch `main`, folder `/ (root)`.
2. At the domain registrar, add these DNS records for `sophiemariarabmer.com`:
   - `A` records → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` for `www` → `jrabmer.github.io`
3. Once the domain is verified, turn on "Enforce HTTPS" in the Pages settings.

## Before going live

- [ ] Real photos, texts and links (Instagram, videos, email address)
- [ ] Contact script set up on the server and tested
- [ ] Impressum: full address
- [ ] Datenschutz: a proper privacy policy
