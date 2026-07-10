# Noote landing page

The marketing landing page for [Noote](https://github.com/bysajaad/noote), served at <https://noote.dpdns.org/>.

Built with Jekyll. Minimal 80s synthwave, bold hero. Deployed by the
[`pages.yml`](../.github/workflows/pages.yml) workflow on every push to `main`
that touches `www/`.

## Local development

```bash
cd www
bundle install
bundle exec jekyll serve
# → http://localhost:4000/
```

## Structure

- `_config.yml` — site metadata + all external links (Marketplace, GitHub, Buy Me a Coffee)
- `_layouts/default.html` — HTML shell (fonts, meta, favicon)
- `index.html` — the landing page content
- `assets/css/main.css` — all styling
- `assets/img/` — icon + intro gif, copied from `../assets`

The custom domain (`noote.dpdns.org`) is set in Settings → Pages; DNS points
the subdomain at GitHub Pages. Since the site deploys via a custom workflow,
no `CNAME` file is needed in the repo.
