# Dailance legal pages

Static public legal and account-help pages for Dailance, designed for GitHub Pages at [legal.dailance.com](https://legal.dailance.com/).

The site uses plain HTML and one shared CSS file. It has no JavaScript runtime, external assets, web fonts, tracking scripts, or cookies. The legal text is a product draft for owner and professional legal review; it must not be treated as finalized legal advice.

## URL structure

| Page | Public URL |
| --- | --- |
| Language selector | `https://legal.dailance.com/` |
| English landing page | `https://legal.dailance.com/en/` |
| Terms of Use | `https://legal.dailance.com/en/terms/` |
| Privacy Policy | `https://legal.dailance.com/en/privacy/` |
| Delete Account | `https://legal.dailance.com/en/delete-account/` |

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

It checks the required pages, canonical URLs, internal links, shared stylesheet, custom-domain file, support email, lack of scripts/tracking, and absence of fake translation directories.

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

Every legal-content update should be reviewed by the product owner and qualified legal counsel before publication. Reviewers should:

1. compare the text with the currently released app and backend behavior;
2. confirm the operator identity, jurisdictions, service providers, processing locations, retention practices, and user-rights procedure;
3. confirm that no planned feature is presented as currently available;
4. review all language versions independently;
5. update each affected page’s “Last updated” date and confirm the effective date or notice process;
6. run the validator and preview the pages on mobile and desktop; and
7. keep evidence of approval outside the public site as required by the owner’s release process.

## Release blockers

The English drafts are ready for owner and legal review, but they are **not ready for public release** until the following placeholders or decisions are resolved:

- legal entity/operator name;
- Terms effective date;
- Privacy Policy effective date;
- governing law, courts, and dispute process;
- minimum user age and any parental-consent process;
- business/postal address, if required;
- privacy representative or data-protection contact, if required;
- applicable privacy rights, request-verification procedure, and regulator disclosures;
- international processing locations and transfer safeguards;
- production infrastructure and email service providers, plus required processor disclosures and agreements;
- formal retention schedules, including logs, provider records, and backups;
- any jurisdiction-specific consumer, privacy, or financial-disclaimer language; and
- the scope and any monetary cap for limitations of liability.

Search for `[` in the English legal pages before publication to locate visible bracketed placeholders. Resolve them through legal review; do not silently remove them without a decision.
