# Dailance legal pages

Static public legal and account-help pages for Dailance, designed for GitHub Pages at [legal.dailance.com](https://legal.dailance.com/).

The site uses plain HTML and one shared CSS file. It has no JavaScript runtime, external assets, web fonts, tracking scripts, or cookies. The legal text is a product draft for owner and professional legal review; it must not be treated as finalized legal advice.

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
custom-domain file, support email, legal disclosure guardrails, consistent
revision status, sitemap/robots metadata, lack of scripts/tracking, and absence
of fake translation directories. The GitHub Actions workflow runs the same
dependency-free check for every pull request and push to `main`.

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

Every legal-content update should be reviewed by the product owner and qualified legal counsel before publication. A proposed revision must retain its visible publication-approval notice and unset effective date until that review is complete. Reviewers should:

1. compare the text with the currently released app and backend behavior;
2. confirm the operator identity, jurisdictions, service providers, processing locations, retention practices, and user-rights procedure;
3. confirm that no planned feature is presented as currently available;
4. review all language versions independently;
5. replace the proposed-revision notice with the approved “Last updated” and effective dates immediately before merge to the publishing branch;
6. run the validator and preview the pages on mobile and desktop; and
7. keep evidence of approval outside the public site as required by the owner’s release process.

## Release readiness and blockers

The English drafts reflect the current MVP and are ready for owner and professional legal review. They are **not ready for public release** until every item below that applies to the release has been closed.

### RESOLVED

- **Operating form:** Dailance is a product and service name, not a legal entity. It is currently provided by a natural person acting in an individual capacity. No legal entity, LLC, or registered sole proprietorship has been established for Dailance.
- **No inferred registration facts:** the drafts do not claim a company, business registration, tax identifier, business address, or licence.
- **Minimum age:** the current MVP is 18+ and is not intended for children or minors under 18.
- **Initial launch market:** the first public release is Armenia only. App Store Connect and Google Play production availability must select Armenia and no other country or region. This storefront decision does not claim a backend geographical restriction.
- **Initial monetization model:** Dailance will be completely free at launch. There will be no paid subscriptions, in-app purchases, paid features, advertising, or other monetization. This does not promise that Dailance will remain free forever; any future monetization requires clear notice, applicable legal/platform review, and updates to the legal documents and store declarations before it is introduced.
- **Home-law baseline:** the Terms use the laws of the Republic of Armenia while preserving mandatory consumer rights and legally available forums. Exclusive Armenian or Yerevan jurisdiction is not claimed.
- **Support and privacy channel:** `support@dailance.com` is the contact for support, access, correction, deletion, and other privacy requests. The owner confirms that incoming delivery works and is privately forwarded. Replying with `support@dailance.com` as the visible sender and the operational request-handling procedure remain separate checks.
- **Confirmed email processor:** Resend is identified for transactional verification, recovery, and account-deletion completion email.
- **Current product scope:** the drafts cover email/password accounts, verification and recovery, optional profile data, manually entered plans and expenses, categories, calculated budgets/carry-over, basic internal analytics, and operational/security metadata. They do not claim bank connections, receipt images, location collection, advertising, or behavioral analytics.
- **Deletion behavior:** the drafts describe the implemented in-app request, password confirmation, sign-out, asynchronous active-system deletion, completion confirmation email, limited cryptographic security markers, and possible backup/log/provider retention without promising an unsupported deadline.
- **Public legal-site infrastructure:** GitHub Pages is identified separately from processors of Dailance account and financial data.

### OWNER DECISION REQUIRED

- **Verified operator legal name:** provide and approve the exact legal name that will identify the natural-person operator in all three pages and applicable store records. The prior draft's name was not treated as verified by the current owner decision and has been removed. Every page now contains a blocking review field.
- **Publication date:** approve this revision and set the final matching “Last updated” and effective dates on all three pages immediately before publication.
- **Storefront configuration:** verify manually that production availability contains Armenia only immediately before submission. Private TestFlight and Play internal testing are separate distribution mechanisms and do not prove this setting.
- **Approved public contacts:** verify response monitoring, the ability to reply with `support@dailance.com` as the visible sender, and the support/privacy/deletion request procedure. Decide what public phone number, postal address, or other contact is legally or contractually required for Armenia and the selected stores. Do not publish a residential address or private contact detail without explicit owner approval.
- **Production and provider facts:** close the hosting, backup, logs, email, Apple, Expo, APNs/FCM, and international-transfer confirmations listed below before approving the Privacy Policy.

### LEGAL REVIEW RECOMMENDED

- **Operator and contact disclosures:** confirm that a natural person in the present, unregistered operating structure may offer the service in each launch market and determine the exact legal-name, address, privacy-representative, regulator, and trader disclosures required there.
- **Armenian registration and tax status:** obtain Armenian legal and tax advice on whether the operator's actual activities require individual-entrepreneur registration, tax-authority record-registration, a taxpayer identifier, tax filings, VAT or other indirect-tax treatment, invoicing, social payments, or a licence. The repository does not decide or claim any of these statuses. Review the current Armenian Civil Code and Law on Individual Entrepreneur rather than assuming that “individual capacity” answers the registration question.
- **Governing law and disputes:** confirm the operator's factual connection to Armenia and review whether an individual may use the proposed Armenian governing-law clause for every intended market, its preservation of mandatory local consumer rights, and the decision not to impose an exclusive court. The clause does not make Dailance an Armenian company or registered business.
- **Future operator transition:** if a legal entity or different person later becomes the operator, obtain advice and a transition plan for contract assignment/novation, privacy notices and data transfer, store-account migration, effective dates, and user consent where required. No transition has occurred.
- **Age policy:** review the confirmed 18+ policy for the intended markets and make the onboarding, marketing, and Apple/Google audience declarations match it. No parental-consent flow is part of the current MVP.
- **Privacy rights and lawful processing:** confirm applicable legal bases, request-response requirements, identity-verification wording, regulator disclosures, and any country-specific rights.
- **International transfers:** after providers and regions are known, determine whether Armenian authorization, an adequacy basis, contractual safeguards, or other measures are required. Do not claim SCCs or another mechanism unless it is actually used.
- **Consumer and liability language:** review the financial-information disclaimer, warranty language, limitation of indirect/consequential loss, and preservation of non-excludable rights. No monetary liability cap is asserted.
- **Retention obligations:** identify any mandatory record-retention periods and approve the treatment of security markers, logs, transactional-email records, and backups.

### TECHNICAL VERIFICATION REQUIRED

- **Current and production host:** confirm the DigitalOcean account entity, current staging region, data categories handled, provider retention, and applicable processing terms. Separately record the selected production provider and region before claiming that production is provisioned.
- **Backup provider and region:** record the selected S3-compatible provider, storage region, encryption/key ownership, rotation schedule, deletion behavior, and data-processing terms. The repository currently proves encryption and candidate rotation points, not a final vendor or legally approved schedule.
- **Email processing details:** confirm the production Resend account/entity, processing locations, contractual terms, provider retention controls, and the exact metadata visible in production.
- **Logs and network metadata:** verify production IP handling, log destinations, access controls, and retention. Confirm that passwords, verification/recovery codes, tokens, email addresses, and user financial data are not written to application logs.
- **Deletion and backups:** run the end-to-end deletion verification, including stale-message fencing, participant completion, sign-in/recovery denial, and a restore test proving that tombstones prevent deleted data from returning.
- **Store artifacts and declarations:** inspect each final signed iOS/Android binary and its third-party code, then make Apple App Privacy and Google Data safety answers match the shipped behavior. Confirm the in-app deletion path and provide `https://legal.dailance.com/en/delete-account/` as the Google web deletion resource.
- **Public-site readiness:** verify DNS, TLS, GitHub Pages custom-domain status, every canonical URL, and the actual effective date immediately before publication. Deployment and DNS changes are intentionally outside this task.

Official starting points for professional review (not legal or tax conclusions):

- [Civil Code of the Republic of Armenia](https://www.arlis.am/en/acts/205622/latest), including its treatment of entrepreneurial activity by natural persons;
- [Law of the Republic of Armenia on Individual Entrepreneur](https://www.arlis.am/en/acts/173483), including the definition, obligations, and tax-payment rule for a registered individual entrepreneur;
- [State Revenue Committee guidance for tax registration of a natural person who is not an individual entrepreneur](https://src.am/storage/File_Link_Uploade/3RegRAcitizen_67977f4a884f2.pdf);
- [Apple's EU Digital Services Act trader-information requirements](https://developer.apple.com/help/app-store-connect/manage-compliance-information/manage-european-union-digital-services-act-trader-requirements); and
- [Google Play's developer-account identity and disclosure requirements](https://support.google.com/googleplay/android-developer/answer/13628312).

Before publication, resolve every item in the Dailance monorepo's
`docs/legal/owner-confirmations.md`, record the reviewed Dailance commit, remove
the visible proposal notices only after approval, run `node scripts/check-site.mjs`,
and preview all pages at narrow and wide viewport sizes. Do not deploy from a
feature branch or merge a proposed revision merely to preview it.
