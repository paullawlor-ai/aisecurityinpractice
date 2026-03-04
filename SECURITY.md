# Security

## Reporting vulnerabilities

If you discover a security vulnerability in this project, please report it responsibly:

1. **Do not** open a public GitHub issue for security vulnerabilities.
2. Email the maintainer directly (see profile for contact details), or use [GitHub Security Advisories](https://github.com/paullawlor-ai/aisecurityinpractice/security/advisories).
3. Include a clear description, steps to reproduce, and potential impact.
4. Allow reasonable time for a fix before public disclosure.

## Security posture

This is a **static documentation site** built with Astro and Starlight. The attack surface is deliberately minimal:

- **No server-side processing** – no API routes, database, or user authentication.
- **No user input** – content is author-authored Markdown, not user-generated.
- **Static output** – pages are pre-rendered; no dynamic server logic at runtime.

### OWASP considerations for static sites

| OWASP risk            | Relevance                                                                 |
|-----------------------|---------------------------------------------------------------------------|
| Injection (A03)       | **Low** – no server-side parsing of user input. Astro escapes output by default. |
| XSS (A07)             | **Low** – content is authored, not user-supplied. CSP restricts script sources. |
| Security misconfiguration (A05) | **Addressed** – security headers configured in `vercel.json`.          |
| Vulnerable dependencies (A06)   | **Addressed** – Dependabot + `npm audit` in CI.                      |

### What we do

- **Security headers** – `vercel.json` sets OWASP-recommended headers: CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.
- **Dependency updates** – Dependabot opens PRs for npm updates weekly.
- **Audit in CI** – `npm audit --audit-level=high` runs on every push/PR; high/critical vulnerabilities fail the build.
- **Secrets hygiene** – `.gitignore` excludes `.env`, `*.key`, `*.pem`, and similar. Never commit secrets.

## For contributors

Before opening a pull request, please ensure:

- **No secrets** – Do not commit API keys, tokens, passwords, or `.env` contents. Run `git diff` to verify.
- **Sensitive paths ignored** – Ensure `dist/`, `node_modules/`, `.astro/`, and `.env*` are not staged. These are in `.gitignore`; do not force-add them.
- **Dependencies** – Run `npm audit` locally. PRs that introduce high or critical vulnerabilities will fail CI.

**Scope of contributions:** This repository accepts contributions to **content** (articles, guides, documentation in `src/content/docs/`). Changes to site infrastructure, build configuration, third-party scripts, or analytics are not accepted via pull request.

## Deploying a fork

Security headers in `vercel.json` are configured for **Vercel**. If you fork this repository and deploy elsewhere (Netlify, Cloudflare Pages, etc.), replicate the headers in that platform’s configuration so the same protections apply.
