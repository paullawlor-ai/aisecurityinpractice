# Contributing to AI Security in Practice

This site exists to fill the practitioner gap in AI security. The best way to fill that gap is to draw on the experience of people who are actually doing the work.

If you are a security engineer, red teamer, platform architect, researcher, or anyone who has built, broken, or governed AI systems in production -- your perspective belongs here. Contributions from the community are not just welcome; they are the point.

## How to Get Involved

There are several ways to contribute, from lightweight to substantial:

| Contribution | Effort | How |
|---|---|---|
| Fix a typo or broken link | Minutes | Open a PR directly |
| Suggest an improvement to an existing article | Low | Open a GitHub Issue describing the change |
| Propose a new article | Medium | Open a GitHub Issue with a brief outline |
| Write and submit a new article | Substantial | Fork, write, open a PR |
| Review someone else's PR | Variable | Comment on open pull requests |

Every contribution is reviewed. Good ideas that don't fit the current structure will be discussed, not ignored.

## Scope of Contributions

We accept contributions to **content** only: articles, guides, diagrams, and documentation in `src/content/docs/`. We do not accept pull requests that change site infrastructure, build configuration (`astro.config.mjs`, `vercel.json`, etc.), third-party scripts, analytics, or other non-content code. The maintainer manages the site stack directly.

## Proposing a New Article

1. Open a GitHub Issue with the proposed title
2. Include a brief outline: goal, audience, pillar it fits under, and key sections
3. Wait for feedback before writing -- this avoids duplicated effort or scope mismatch

If you're unsure whether a topic fits, open the issue anyway. The worst outcome is a useful conversation.

## Submitting Content

1. Fork the repository
2. Create a branch for your contribution
3. Write your content in Markdown under the appropriate pillar folder in `src/content/docs/`:
   - `foundations/` -- on-ramp content, tool selection, getting started
   - `attack-and-red-team/` -- offensive techniques, red teaming tools, CTFs
   - `defend-and-harden/` -- guardrails, secure pipelines, hardening guides
   - `architecture-and-platform/` -- cloud AI, MLOps, infrastructure, API patterns
   - `governance-risk-compliance/` -- frameworks, compliance, risk, incident response
   - `emerging-threats-and-research/` -- forward-looking analysis, new attack classes
4. Use this frontmatter format:
   ```yaml
   ---
   title: "Your Article Title"
   description: "A concise summary of the article."
   sidebar:
     order: 99
   ---
   ```
5. Open a pull request with a summary of what the article covers and why it matters

## Running Locally

```bash
npm install
npm run dev
```

The site runs at `http://localhost:4321`. Verify your article renders correctly before submitting.

## What We Publish

Content must be:

- **Threat-model driven** -- every article must define what it is defending against
- **Technically accurate** -- claims must be verifiable and reproducible
- **Architecture-aware** -- context matters; assumptions must be explicit
- **Vendor-neutral where possible** -- reference implementations over product placement
- **Clear about scope** -- what this covers, what it does not, and why

Content must not be:

- Vendor marketing or product promotion
- Opinion without implementation
- Shallow summaries of existing documentation
- Hype, speculation, or fear-mongering

## Style Guide

- Write in plain, direct English
- Avoid marketing language and superlatives
- Use code blocks with language identifiers
- Use diagrams to illustrate architecture -- Mermaid is preferred
- Break long paragraphs into smaller ones; engineers scan before they read
- Cite sources properly using footnotes
- Do not use stock images or decorative graphics

## Review Process

All contributions are reviewed before merging. Reviews check for:

- Technical accuracy
- Structural completeness
- Clarity and readability
- Proper references and citations
- Reproducibility of any implementation steps

Reviews are constructive. The goal is to publish the best version of your contribution, not to gatekeep.

## Licensing

By contributing, you agree that:

- **Code** contributions (site infrastructure, tooling) are licensed under [MIT](LICENSE-CODE)
- **Content** contributions (articles, diagrams, documentation) are licensed under [CC BY-NC 4.0](LICENSE-CONTENT)

This means your content will be freely available for non-commercial use with attribution. Commercial use (books, paid courses, resale) requires separate permission from the copyright holder.

## Attribution

Contributors are credited. Your name appears on the articles you write, and significant contributions to existing articles are acknowledged.

## Questions?

Open a GitHub Issue or start a Discussion. There is no gatekeeping on questions.
