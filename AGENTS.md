# shared-utils

> Demo code written for the VulnFleet / Cursor exercise. Northwind Commerce is
> fictional. The lodash pin (4.17.20, historical CVE-2021-23337) is deliberate.

## What this is

The Northwind Commerce internal TypeScript library that every customer-facing
receipt and notification is rendered with: `renderTemplate()` (merchant-branded
templates) and `formatCents()` (money formatting for checkout and invoices). It
is consumed directly from git by `checkout-api`, so a change here ships to the
Tier 0 checkout path the next time checkout-api installs.

## CMDB

| Field | Value |
|---|---|
| Type | library (no tier of its own) |
| Consumers | `checkout-api` |
| Data class | inherits its consumers' (checkout-api: PCI) |

## Install, build, test

```bash
npm ci          # install exactly what package-lock.json records
npm test        # node --import tsx --test "test/**/*.test.ts"
npx tsc --noEmit  # typecheck (no build step: TypeScript runs through tsx)
```

## Conventions

- Public API is `src/index.ts`. Keep `renderTemplate(tpl, data, options?)` and
  `formatCents(cents, currency?)` backward compatible: checkout-api calls both.
- Tests live in `test/*.test.ts` (node:test + `node:assert/strict`).
- ESM only (`"type": "module"`); import local files with a `.js` suffix.
- Remediation conventions: `.cursor/rules/northwind-remediation.mdc`.
  Fix procedure: the `northwind-safe-fix` skill.

## Cursor Cloud specific instructions

Verify command:

```bash
npm ci && npm test
```

Before editing, run the verify command. If it fails, stop and report the failing command and output.

- The environment's install step (`.cursor/environment.json`) already runs `npm ci`.
- There is no server to start; the test suite is the whole check.
- A fix PR must say that checkout-api picks up the change from
  `git+https://github.com/<owner>/shared-utils.git#main` only after merge.
