# Dailance legal pages

Static public legal and account-help pages for Dailance, designed for GitHub Pages at [legal.dailance.com](https://legal.dailance.com/).

The site uses plain HTML and one shared CSS file. It has no JavaScript runtime, external assets, web fonts, tracking scripts, or cookies. Published legal text should be reviewed whenever the product, operator, or data practices change; this repository is not legal advice.

## Source of truth

This repository is the single canonical source for publishable Dailance legal
text and the public URL structure. The Dailance application monorepo owns the
implementation evidence, data inventory, mobile URL configuration, approval
checklist, and a contract check for these URLs; it does not generate or carry a
second copy of the legal text.

This separation is deliberate. A legal-site pull request must cite the Dailance
implementation revision it was checked against. A corresponding application
release records the approved legal-site commit and URLs. Neither repository
fetches or writes the other during a build, so a missing token or remote outage
cannot silently change legal content. Synchronization is a reviewed release
step enforced by validators in both repositories.

## URL structure

| Page | Public URL |
| --- | --- |
| Language selector | `https://legal.dailance.com/` |
| English landing page | `https://legal.dailance.com/en/` |
| Terms of Use | `https://legal.dailance.com/en/terms/` |
| Privacy Policy | `https://legal.dailance.com/en/privacy/` |
| Delete Account | `https://legal.dailance.com/en/delete-account/` |
| Support | `https://legal.dailance.com/en/support/` |

Directory-based URLs use an `index.html` in each directory, which keeps links stable and avoids filename extensions in public URLs.

## Local preview and validation

From this repository’s root, start any static HTTP server. For example:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000/`. Serving over HTTP is important because the site uses root-relative links such as `/en/` and `/assets/styles.css`.

Run the dependency-free validator with:

```sh
node scripts/check-site.mjs
```

It checks the required pages, canonical URLs, internal links, shared stylesheet,
custom-domain file, support email, legal disclosure guardrails, complete and
consistent publication dates, sitemap/robots metadata, lack of scripts/tracking,
and absence of draft notices, operator placeholders, and fake translation
directories. The GitHub Actions workflow runs the same dependency-free check
for every pull request and push to `main`.

## Deploy with GitHub Pages

1. Create or select the GitHub repository that will contain these files. Keep `index.html`, `CNAME`, and `.nojekyll` at the publishing root.
2. Push the reviewed site to the publishing branch, normally `main`.
3. Verify `dailance.com` in the GitHub account or organization’s **Settings → Pages** using the TXT record GitHub provides. GitHub recommends verification before attaching a custom domain to a repository.
4. In the repository, open **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select the publishing branch and the `/ (root)` folder, then save.
7. In **Custom domain**, enter `legal.dailance.com` and save. GitHub Pages should retain the repository’s `CNAME` file with exactly that hostname.
8. Add the DNS CNAME described below, wait for DNS and certificate checks to pass, then enable **Enforce HTTPS**.

If an organization policy uses a dedicated `gh-pages` branch instead, select that branch explicitly and publish these files at its root. Do not select a folder that places `index.html` below another path.

## Configure the custom domain and DNS

At the DNS provider for `dailance.com`, add a `CNAME` record:

| DNS field | Value |
| --- | --- |
| Type | `CNAME` |
| Name / host | `legal` |
| Target / value | `<GitHub account or organization>.github.io` |

Replace the angle-bracketed target with the GitHub Pages hostname shown by GitHub for the repository owner. Do not include `https://` or a path. DNS field names vary by provider, and changes may take time to propagate.

GitHub recommends verifying the domain to prevent another GitHub account from claiming it. In the GitHub account or organization settings, open **Pages**, add `dailance.com`, and create the TXT record GitHub supplies. Verifying the apex domain also protects its immediate subdomains, including `legal.dailance.com`. Leave the TXT record in DNS after verification. Domain verification and the repository’s Pages custom-domain setting are separate steps. Avoid wildcard DNS records for the domain.

After DNS resolves:

1. Confirm GitHub Pages reports the DNS check as successful.
2. Visit each public URL over `https://`.
3. Confirm the certificate is valid for `legal.dailance.com`.
4. Enable **Enforce HTTPS** in the Pages settings.
5. Re-run `node scripts/check-site.mjs` before each publication.

Do not create `A` or `AAAA` records for `legal.dailance.com` unless GitHub’s current documentation specifically requires them for the chosen setup. A subdomain normally uses the CNAME above.

## Adding a new language

Use a BCP 47 language tag or its standard short form where suitable, such as `en`, `ru`, `hy`, or `vi`. Each language must have independent, human-reviewed pages. Do not add copied English pages as fake translations and do not use runtime machine translation.

For example, to add Russian:

1. Create the independent page structure:

   ```text
   ru/
   ├── index.html
   ├── terms/
   │   └── index.html
   ├── privacy/
   │   └── index.html
   └── delete-account/
       └── index.html
   ```

2. Translate the English content manually or professionally and have it reviewed for the relevant audience and jurisdiction.
3. Preserve the meaning of the reviewed English source; do not add product behavior that does not exist.
4. Set each document’s `<html lang>`, page title, description, canonical URL, and visible language indicator correctly.
5. Add the language to the root selector and to language navigation on relevant pages if language navigation is introduced.
6. Update `scripts/check-site.mjs` so the new pages are expected and validated.
7. Track “Last updated” independently for that language.

Do not automatically overwrite translated pages when English changes. Record the English change, determine which translations it affects, update them deliberately, and obtain language-appropriate review.

## Reviewing legal content changes

Every legal-content update should be reviewed by the product owner and qualified legal counsel before publication. Track review status in the pull request or private release records, never in public HTML. Reviewers should:

1. compare the text with the currently released app and backend behavior;
2. confirm the operator identity, jurisdictions, service providers, processing locations, retention practices, and user-rights procedure;
3. confirm that no planned feature is presented as currently available;
4. review all language versions independently;
5. set the final “Last updated” date and matching sitemap dates before merge to the publishing branch;
6. run the validator and preview the pages on mobile and desktop; and
7. keep evidence of approval outside the public site as required by the owner’s release process.

## Published release facts

- Dailance is operated by Oleg Pyrchenkov, an individual based in Armenia. The pages do not claim a company, registration number, licence, postal address, or telephone number.
- The service is for adults aged 18 or older, is distributed through the Armenia storefronts, and is currently free without paid features or advertising.
- `support@dailance.com` is the public channel for support, privacy requests, and deletion assistance.
- The Privacy Policy identifies the current product data, service providers, hosting location, backup model, and international processing without claiming unverified certifications or fixed provider-retention periods.
- The deletion disclosures cover in-app confirmation, immediate sign-out, the residual 15-minute access-token window, background retries without a fixed completion deadline, active-system deletion, cryptographic anti-resurrection markers, and historical encrypted backups.
- Backup retention is count-based: 14 represented UTC dates, 8 represented ISO weeks, and the latest valid restore point. It is not described as a fixed maximum age.

## Release maintenance

Before publishing a legal-content change:

1. compare the text with the released app and backend behavior;
2. confirm operator, provider, processing-location, retention, and user-rights facts;
3. review each language independently;
4. update the visible “Last updated” date and every sitemap `<lastmod>` value;
5. run `node scripts/check-site.mjs`; and
6. preview every page at narrow and wide viewport sizes.

Keep review status and operational checklists outside public HTML. The validator
rejects draft notices, operator placeholders, incomplete dates, and internal
publication instructions on every public page.
