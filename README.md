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

## Release readiness and blockers

The English drafts reflect the current MVP and are ready for owner and professional legal review. They are **not ready for public release** until every item below that applies to the release has been closed.

### RESOLVED

- **Operating form:** Dailance is operated by an individual developer, not a company. The drafts no longer imply that an incorporated entity exists.
- **Operator identity:** the individual operator is Oleg Pyrchenkov. No company, registration, tax, or address details are inferred.
- **Minimum age:** the current MVP is 18+ and is not intended for children or minors under 18.
- **Home-law baseline:** the Terms use the laws of the Republic of Armenia while preserving mandatory consumer rights and legally available forums. Exclusive Armenian or Yerevan jurisdiction is not claimed.
- **Support and privacy channel:** `support@dailance.com` is the contact for support, access, correction, deletion, and other privacy requests.
- **Confirmed email processor:** Resend is identified for transactional verification, recovery, and account-deletion completion email.
- **Current product scope:** the drafts cover email/password accounts, verification and recovery, optional profile data, manually entered plans and expenses, categories, calculated budgets/carry-over, basic internal analytics, and operational/security metadata. They do not claim bank connections, receipt images, location collection, advertising, or behavioral analytics.
- **Deletion behavior:** the drafts describe the implemented in-app request, password confirmation, sign-out, asynchronous active-system deletion, completion confirmation email, limited cryptographic security markers, and possible backup/log/provider retention without promising an unsupported deadline.
- **Public legal-site infrastructure:** GitHub Pages is identified separately from processors of Dailance account and financial data.

### OWNER DECISION REQUIRED

- **First-publication date:** set to **4 October 2026** in both the Terms of Use and Privacy Policy.
- **Release and monetization model:** confirm the initial countries of availability and whether the app will be free, paid, or use in-app purchases. These facts affect store identity/address disclosures and the set of local consumer rules to review.
- **Public address, if required:** after legal review, provide the postal or business address that should appear in the policy. No address should be inferred or invented.

### LEGAL REVIEW RECOMMENDED

- **Operator and contact disclosures:** confirm that the legal-name wording is sufficient for an individual using Armenia as the home-law baseline and decide whether an address, privacy representative, or regulator contact must be published in the initial distribution countries.
- **Governing law and disputes:** review the Armenian governing-law clause, its preservation of mandatory local consumer rights, and the decision not to impose an exclusive court.
- **Age policy:** review the confirmed 18+ policy for the intended markets and make the onboarding, marketing, and Apple/Google audience declarations match it. No parental-consent flow is part of the current MVP.
- **Privacy rights and lawful processing:** confirm applicable legal bases, request-response requirements, identity-verification wording, regulator disclosures, and any country-specific rights.
- **International transfers:** after providers and regions are known, determine whether Armenian authorization, an adequacy basis, contractual safeguards, or other measures are required. Do not claim SCCs or another mechanism unless it is actually used.
- **Consumer and liability language:** review the financial-information disclaimer, warranty language, limitation of indirect/consequential loss, and preservation of non-excludable rights. No monetary liability cap is asserted.
- **Retention obligations:** identify any mandatory record-retention periods and approve the treatment of security markers, logs, transactional-email records, and backups.

### TECHNICAL VERIFICATION REQUIRED

- **Production host and region:** record the selected hosting provider, legal contracting entity, country/region, data categories handled, and applicable data-processing terms before naming it in the Privacy Policy.
- **Backup provider and region:** record the selected S3-compatible provider, storage region, encryption/key ownership, rotation schedule, deletion behavior, and data-processing terms. The repository currently proves encryption and candidate rotation points, not a final vendor or legally approved schedule.
- **Email processing details:** confirm the production Resend account/entity, processing locations, contractual terms, provider retention controls, and the exact metadata visible in production.
- **Logs and network metadata:** verify production IP handling, log destinations, access controls, and retention. Confirm that passwords, verification/recovery codes, tokens, email addresses, and user financial data are not written to application logs.
- **Deletion and backups:** run the end-to-end deletion verification, including stale-message fencing, participant completion, sign-in/recovery denial, and a restore test proving that tombstones prevent deleted data from returning.
- **Store artifacts and declarations:** inspect each final signed iOS/Android binary and its third-party code, then make Apple App Privacy and Google Data safety answers match the shipped behavior. Confirm the in-app deletion path and provide `https://legal.dailance.com/en/delete-account/` as the Google web deletion resource.
- **Public-site readiness:** verify DNS, TLS, GitHub Pages custom-domain status, every canonical URL, and the actual effective date immediately before publication. Deployment and DNS changes are intentionally outside this task.

Search for `[` in the English legal pages before publication to locate visible bracketed placeholders. Resolve them with the specified owner input or review; do not silently remove them.
