# Security review — Phase 1 (static)

Date: 2026-07-26 · Scope: whole repository · Method: static review plus safe
local probing against dev (`:3000`) and a production server (`next start`,
`:3200`). No destructive tests, no file modifications during the review.

## 1. Executive summary

The application is a **static bilingual content site**. It has no
authentication, no database, no API routes, no Route Handlers, no Server
Actions, no middleware, no file uploads, and no path by which user input
reaches the server. That removes most of the Next.js threat model — not
through mitigation, but because the features do not exist yet.

**No Critical or High confirmed vulnerabilities.**

| Severity      | Count |
| ------------- | ----- |
| Critical      | 0     |
| High          | 0     |
| Medium        | 1     |
| Low           | 3     |
| Informational | 3     |

Top three issues:

1. **SEC-001** — no security response headers at all (Medium).
2. **SEC-002** — `X-Powered-By: Next.js` discloses the framework (Low).
   **Fixed** — `poweredByHeader: false` is set in `next.config.ts`.
3. **SEC-004** — vulnerable transitive packages, build-time only (Low).

**Is it safe to deploy now?** For the current static scope, yes, once SEC-001
is fixed — a `next.config.ts` change.

**This verdict expires the moment a form, API route, or login is added.** The
audit must be re-run then; almost every control in sections 5–7 of the audit
prompt is currently "not applicable" rather than "implemented".

## 2. Project security profile

|                   |                                                         |
| ----------------- | ------------------------------------------------------- |
| Next.js           | 16.2.11 (App Router only, no Pages Router)              |
| React             | 19.2.4                                                  |
| Node              | `>=20.9.0` required; 24.18.0 local                      |
| TypeScript        | 5.9.3, `strict: true`                                   |
| Package manager   | pnpm 10.0.0 via corepack, lockfile committed            |
| Runtime           | Node.js runtime; no Edge runtime code                   |
| Authentication    | **None**                                                |
| Database          | **None**                                                |
| Storage / uploads | **None**                                                |
| Email / payments  | **None**                                                |
| Multi-tenant      | No                                                      |
| Deployment        | Not configured — no Dockerfile, no `vercel.json`, no CI |

Public routes: `/` (307 → `/ar`), `/ar`, `/en`, `/ar/design-system`,
`/en/design-system`. Protected routes: none exist.

## 3. Attack surface

| Entry point               | Method | File                                      | Public | Input              | Source         | Validated                                | Side effects                             |
| ------------------------- | ------ | ----------------------------------------- | ------ | ------------------ | -------------- | ---------------------------------------- | ---------------------------------------- |
| `/[locale]`               | GET    | `src/app/[locale]/page.tsx`               | yes    | `locale`           | URL param      | yes — `dynamicParams=false` + `isLocale` | none                                     |
| `/[locale]/design-system` | GET    | `src/app/[locale]/design-system/page.tsx` | yes    | `locale`           | URL param      | yes, same                                | none                                     |
| `/`                       | GET    | `next.config.ts` redirect                 | yes    | none               | —              | n/a                                      | none                                     |
| theme preference          | client | `src/components/theme-switcher.tsx`       | yes    | `"light"`/`"dark"` | `localStorage` | yes — allowlist compare                  | writes `localStorage`, sets `data-theme` |

**The only untrusted input in the entire application is the `locale` route
segment**, and it is constrained to a two-value allowlist by the router itself.

Verified absent: `middleware.ts`, `"use server"`, `route.ts`/`route.js`,
`getServerSideProps`, `api/`, `actions/`, `auth/`, webhooks, any form `action`.

## 4. Findings

### [SEC-001] No security response headers

**Severity:** Medium · **Confidence:** Confirmed
**Category:** OWASP A05 Security Misconfiguration · **CWE-693**
**Affected file:** `next.config.ts` (no `headers()` key)

`next.config.ts` defines only a redirect. A production server returns none of
the standard protective headers.

Observed on `next start` at `:3200` for `/ar` — present headers were `Vary`,
`x-nextjs-cache`, `x-nextjs-prerender`, `x-nextjs-stale-time`, `X-Powered-By`,
`Cache-Control`, `ETag`, `Content-Type`, `Content-Length`, `Date`,
`Connection`, `Keep-Alive`. Missing entirely:

- `Content-Security-Policy` — no `frame-ancestors`, so the site can be framed
  by any origin (clickjacking), and no defence-in-depth against injected script
- `Strict-Transport-Security` — no HTTPS downgrade protection
- `X-Content-Type-Options: nosniff` — MIME sniffing permitted
- `Referrer-Policy` — full URLs leak to third parties
- `Permissions-Policy` — camera/geolocation/microphone not denied by default
- `Cross-Origin-Opener-Policy` / `Resource-Policy`

**Impact today:** clickjacking and MIME-sniffing are reachable; the rest is
missing defence-in-depth. Impact rises sharply once forms or sessions exist.

**Exploit conditions:** none — unauthenticated, remote, no user interaction for
the framing case beyond visiting an attacker page.

**Fix note that matters:** a strict CSP will block the inline theme script in
`src/app/[locale]/layout.tsx:47`. It needs either a `'sha256-…'` hash of the
exact script text or a per-request nonce. A nonce forces the layout to become
dynamic, so **the hash is the better fit here** — the script is a module
constant and never changes at runtime.

### [SEC-002] Framework disclosed via `X-Powered-By`

**Severity:** Low · **Confidence:** Confirmed · **Status: FIXED**
**Category:** OWASP A05 · **CWE-200**
**Affected file:** `next.config.ts`

Production responses included `X-Powered-By: Next.js`. `poweredByHeader: false`
is now set. Note this hides the framework name, not the version —
Next.js remains fingerprintable from `/_next/` asset paths. Treat it as noise
reduction, not protection.

### [SEC-003] Same-origin SVG delivery

**Severity:** Low · **Confidence:** Confirmed (no current exploit)
**Category:** OWASP A03 · **CWE-79**
**Affected files:** `public/brand/logos/*.svg`, `public/brand/patterns/texture1.svg`, `public/brand/flags/syria-flag.svg`

SVGs are served from the app origin as `Content-Type: image/svg+xml`. An SVG
opened directly in a browser executes any script it contains, in this origin.

**Not currently exploitable:** every file is static, committed, and was scanned
for `<script>`, `onload`/`onerror`, `foreignObject`, and remote `href` — all
clean. `images.dangerouslyAllowSVG` is off, and the logos use `unoptimized`.

**Why it is recorded anyway:** this becomes stored XSS the day the media
library in `docs/information-architecture.md` accepts SVG uploads. The control
must be written down before that module is built, not after.

### [SEC-004] Vulnerable transitive dependencies (build-time only)

**Severity:** Low · **Confidence:** Confirmed
**Category:** OWASP A06 Vulnerable and Outdated Components

303 installed packages queried against the npm advisory database. Two
vulnerable versions are genuinely installed:

| Package           | Installed | Advisory                                                      | Reachability                                                                                                                                                                      |
| ----------------- | --------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `postcss`         | 8.4.31    | GHSA-qx2v-qp2m-jg93, GHSA-6g55-p6wh-862q, GHSA-r28c-9q8g-f849 | Pinned transitive of `next@16.2.11`. Build-time only. Advisories require parsing attacker-controlled CSS or a hostile `sourceMappingURL`; this project compiles only its own CSS. |
| `brace-expansion` | 1.1.16    | GHSA-mh99-v99m-4gvg (ReDoS/OOM)                               | Via `minimatch@3.1.5` ← ESLint config resolution. Never executes in the served application.                                                                                       |

Also installed and **not** vulnerable: `postcss@8.5.23` (above the `<=8.5.17`
ceiling) and `brace-expansion@5.0.8` (above `<=5.0.7`).

**False positive worth recording:** the scan flagged `sharp` (GHSA-f88m-g3jw-g9cj,
libvips CVEs) as HIGH. **`sharp` is not installed** — it is an optional
dependency of Next's image optimizer, and `node_modules/sharp` does not exist.
It was reported because the advisory query was fed every name in the lockfile.
This is exactly why a flagged package must be confirmed installed and reachable
before it is called a finding.

Neither real issue is fixable directly: both are pinned by parents. They clear
when `next` and `eslint` are upgraded.

### [SEC-005] Inline script blocks strict CSP

**Severity:** Informational · **Confidence:** Confirmed
**Affected file:** `src/app/[locale]/layout.tsx:47`

```tsx
<script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
```

`themeInitScript` is a module constant in `theme-switcher.tsx` with no
interpolation of any request, user, or environment value; the only dynamic part
is a `localStorage` read compared against `"light"`/`"dark"`. Verified as
served: the script text is byte-identical to the source.

Not a vulnerability. Recorded because it is a hard constraint on SEC-001, and
because it is the single permitted `dangerouslySetInnerHTML` in the codebase —
a reviewer needs to know it was deliberate.

### [SEC-006] No deployment, CI, or container configuration

**Severity:** Informational
**Affected:** repository root

No `Dockerfile`, `docker-compose.yml`, `vercel.json`, or `.github/workflows/`.
Sections 32–33 of the audit prompt cannot be assessed. `pnpm check` and
`pnpm check:all` exist locally but nothing enforces them on push, so the
quality gates are advisory rather than blocking.

### [SEC-007] All three font weights preloaded on every page

**Severity:** Informational (performance, not security)
**Affected file:** `src/styles/fonts.ts`

Responses preload `itfQomraArabic_Black`, `_Bold`, and `_Regular` — roughly
168 KB of uncompressed OTF on first paint, on a portal whose stated audience
includes slow mobile connections. WOFF2 conversion would roughly halve it, but
that is blocked on the font licence (`public/brand/README.md`).

## 5. Checks that passed

- **Secrets:** no `.env*` files exist; `.gitignore` covers `.env` and `.env.*`
  with an `!.env.example` exception. `git ls-files` matched nothing resembling
  a secret, key, or credential. No `NEXT_PUBLIC_*` variable exists at all.
- **Error handling in production:** `/ar/nope` returns a clean **404** with no
  stack trace, file path, or `node_modules` reference in the body. The dev
  server _does_ leak paths via its error overlay — dev-only, and correctly not
  reported as a finding.
- **Source maps:** zero `.map` files in `.next/static`.
- **Injection:** no `eval`, `new Function`, `child_process`, `exec`, `spawn`,
  raw queries, or ORM at all. No database to inject into.
- **XSS:** no `innerHTML`, `outerHTML`, or `document.write`. All rendered text
  comes from typed dictionaries in `src/i18n/`, never from a request.
- **CSRF:** no state-changing request exists. Nothing to forge.
- **SSRF:** no `fetch`, `axios`, or outbound request anywhere in `src/`.
- **Open redirect:** the one redirect is a hardcoded constant destination.
- **Path traversal:** no `fs` access, no `path.join` on user input.
- **CORS:** no CORS configuration and no API to expose.
- **Client/server boundary:** `process.env` appears once, comparing
  `NODE_ENV` — no secret crosses to a Client Component.
- **Caching:** static public pages only; nothing user-specific is cached, and
  no session or cookie influences any response.

## 6. Remediation roadmap

### Fix immediately

Nothing. No Critical or High findings.

### Before any public deployment

| Priority | Finding                   | Reason                                                   | Complexity | Tests                           |
| -------- | ------------------------- | -------------------------------------------------------- | ---------- | ------------------------------- |
| 1        | SEC-001 headers           | Only externally reachable weakness; clickjacking is live | Small      | Playwright assertion per header |
| —        | SEC-002 `poweredByHeader` | Done — `poweredByHeader: false`                          | —          | Assert header absent            |

### First security sprint

| Priority | Finding              | Reason                                              | Complexity | Tests                        |
| -------- | -------------------- | --------------------------------------------------- | ---------- | ---------------------------- |
| 3        | SEC-004 dependencies | Build-time only; clears via `next`/`eslint` upgrade | Medium     | `pnpm check` must stay green |
| 4        | SEC-006 CI           | Makes the gates blocking instead of advisory        | Medium     | The workflow is the test     |

### Later

SEC-003 (write the rule before the media module exists), SEC-007 (blocked on
the font licence).

## 7. Verification checklist

- [ ] `curl -sI` on production shows CSP, HSTS, `nosniff`, `Referrer-Policy`,
      `Permissions-Policy`
- [x] `X-Powered-By` absent — asserted in `e2e/foundation.spec.ts`
- [ ] The theme script still runs with CSP active, and there is still no
      first-paint theme flash
- [ ] `frame-ancestors` blocks framing from a foreign origin
- [ ] `pnpm check` and `pnpm check:all` green after the header change
- [ ] Advisory re-scan shows no _installed and reachable_ vulnerable package
- [ ] This document re-reviewed before the first form, API route, or login

## Appendix — how to re-run the dependency scan

`pnpm audit` fails in pnpm 10.0.0: the advisory endpoint returns gzip that
pnpm does not decode, producing `Unexpected token` on valid data. Bypass it by
sniffing the gzip magic bytes rather than trusting `Content-Encoding`:

```bash
node -e '
const fs=require("fs"), zlib=require("zlib");
const lock=fs.readFileSync("pnpm-lock.yaml","utf8"), pkgs={};
for(const m of lock.matchAll(/^  \/?((?:@[^/\s]+\/)?[^@\s/][^@\s]*)@([0-9][^:()\s]*)[:(]/gm))
  (pkgs[m[1]] ||= new Set()).add(m[2]);
const body={}; for(const[n,v]of Object.entries(pkgs)) body[n]=[...v];
fetch("https://registry.npmjs.org/-/npm/v1/security/advisories/bulk",{
  method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body)
}).then(async r=>{
  const b=Buffer.from(await r.arrayBuffer());
  const res=JSON.parse((b[0]===0x1f&&b[1]===0x8b)?zlib.gunzipSync(b).toString():b.toString());
  for(const n of Object.keys(res)) for(const a of res[n])
    console.log(a.severity.toUpperCase(), n, a.vulnerable_versions, a.title);
});'
```

Then, for every hit, confirm it is real before acting:

```bash
ls node_modules/<package>/package.json   # installed at all?
grep -n "^  <package>@" pnpm-lock.yaml   # which versions?
```
