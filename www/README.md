# Noote landing page

The marketing landing page for [Noote](https://github.com/bysajaad/noote), served at <https://bysajaad.github.io/noote/>.

Built with Jekyll. Minimal 80s synthwave, bold hero. Deployed by the
[`pages.yml`](../.github/workflows/pages.yml) workflow on every push to `main`
that touches `www/`.

## Local development

```bash
cd www
bundle install
bundle exec jekyll serve
# → http://localhost:4000/noote/
```

## Structure

- `_config.yml` — site metadata + all external links (Marketplace, GitHub, Buy Me a Coffee)
- `_layouts/default.html` — HTML shell (fonts, meta, favicon)
- `index.html` — the landing page content
- `assets/css/main.css` — all styling
- `assets/img/` — icon + intro gif, copied from `../assets`

Using a custom domain later? Set it in Settings → Pages, then change `baseurl`
to `""` and `url` to the domain in `_config.yml`.
