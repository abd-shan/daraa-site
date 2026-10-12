# Information architecture

Planning document for the domains the portal is expected to carry. **Nothing
below is implemented** beyond the shell — this exists so the foundation does
not have to be rewritten when the modules arrive.

Every row is an assumption drawn from the project requirements document. None
of it has been confirmed against real governorate processes. **Do not invent a
government workflow from this file** — confirm with the governorate before
building any transactional flow.

## Content classes

The class drives caching, review, and failure behaviour more than the subject
does:

| Class           | Meaning                      | Implications                                                     |
| --------------- | ---------------------------- | ---------------------------------------------------------------- |
| `informational` | Published reference content  | Static generation, long revalidation                             |
| `archival`      | Dated records, grows forever | Pagination, search, stable permalinks, never delete              |
| `transactional` | Citizen submits something    | Server validation, rate limiting, no PII in logs, audit trail    |
| `emergency`     | Time-critical public safety  | Fastest path, must work with JS disabled, cannot be cached stale |

## Domains

| Domain                     | Route (proposed)            | Class                         | Content type    | Notes                                                                                                         |
| -------------------------- | --------------------------- | ----------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------- |
| Urgent alerts              | `/[locale]/alerts`          | emergency                     | Alert           | Must render server-side, no client gate. Never mock these — a fake alert is indistinguishable from a real one |
| Governorate map            | `/[locale]/map`             | informational                 | GeoJSON regions | Needs a non-map fallback: a list of districts. Map libraries are heavy; defer the choice                      |
| About the governorate      | `/[locale]/about`           | informational                 | Page            | Vision, mission, history, governor's message, statistics                                                      |
| Administrative divisions   | `/[locale]/about/divisions` | informational                 | Division        | Districts, sub-districts. Shared with map and directorates                                                    |
| Decisions and decrees      | `/[locale]/decisions`       | archival                      | Decision        | Number, date, issuing body, PDF. Needs filter by year and type                                                |
| Directorates               | `/[locale]/directorates`    | informational                 | Directorate     | Contact details, hours, responsible officials. High churn                                                     |
| Citizen services           | `/[locale]/services`        | informational → transactional | ServiceGuide    | Starts as guides (what to bring, where to go). Real transactions are a separate, much later decision          |
| Tenders                    | `/[locale]/tenders`         | archival                      | Tender          | Deadline-sensitive; must show clearly when closed                                                             |
| Investment opportunities   | `/[locale]/investment`      | informational                 | Opportunity     | English matters here as much as Arabic                                                                        |
| Tourism and heritage       | `/[locale]/tourism`         | informational                 | Destination     | Archaeological, religious, natural. Image-heavy — the one domain where an image budget really bites           |
| News                       | `/[locale]/news`            | archival                      | Article         | Highest publishing volume. First real CMS pressure                                                            |
| Events                     | `/[locale]/events`          | archival                      | Event           | Needs locale-aware dates and a past/upcoming split                                                            |
| Weekly summary             | `/[locale]/weekly`          | archival                      | Digest          | Likely a view over news, not its own type                                                                     |
| Complaints and suggestions | `/[locale]/complaints`      | transactional                 | Submission      | Highest-risk module. Personal data, spam, abuse, retention policy. Needs legal sign-off, not just code        |
| Media centre / library     | `/[locale]/media`           | archival                      | MediaItem       | Photos, video, documents. Storage decision, not a frontend one                                                |
| Youth and sports           | `/[locale]/youth`           | informational                 | Page            | May fold into news + events instead of standing alone                                                         |
| Health directory           | `/[locale]/health`          | informational                 | Facility        | Hospitals, centres, emergency numbers. Treat emergency numbers as safety-critical: accuracy over layout       |
| Contact                    | `/[locale]/contact`         | informational                 | Page            |                                                                                                               |

## Shared components these imply

A dated-record list with filters (decisions, tenders, news, events), a
directory-entry card (directorates, health facilities), a document link with
file type and size, and a locale-aware date. Four patterns cover most of the
table — build them when the second consumer appears, not the first.

## Cross-cutting expectations

**Search.** Not yet. It becomes real when news and decisions have volume.
Whatever is chosen must handle Arabic — stemming, diacritic-insensitivity, and
alef/hamza normalisation. Do not assume a Latin-language search engine works.

**Localisation.** Every domain is bilingual. Some content (decisions, official
documents) will exist only in Arabic. The design must show "not available in
English" rather than silently falling back or showing an empty page.

**Dates.** Government content mixes Hijri and Gregorian. Decide the display
policy once, centrally, before the first dated module.

**Accessibility.** Emergency and transactional domains are the ones that must
work on an old phone, with a screen reader, with no JavaScript.

**CMS.** News, events, decisions, and tenders all point the same direction, but
the decision is deferred. The content types above are shaped so a headless CMS
can be dropped behind them without touching route structure.

## Open questions

- Who publishes, and who approves before publication?
- What is the retention and privacy policy for complaint submissions?
- Are decisions published as PDFs only, or is structured text available?
- Which content is authoritative in English versus Arabic-only?
- Is there an existing government identity or SSO the portal must integrate?
