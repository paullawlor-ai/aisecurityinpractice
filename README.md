# AI Security in Practice

Deep technical implementation guides for securing AI systems in production.

**Live site:** [aisecurityinpractice.com](https://aisecurityinpractice.com)

## What This Is

Vendor whitepapers tell you everything is secure. Academic papers tell you nothing is. Neither helps you ship. AI Security in Practice is the missing practitioner layer -- deep, reproducible, threat-model-driven content for engineers who build, secure, and govern AI systems.

## Content Structure

The site is organised around six pillars:

| Pillar | What's inside |
|---|---|
| **[Foundations](https://aisecurityinpractice.com/foundations/how-llms-work/)** | How LLMs work, OWASP Top 10, tool selection, your first security lab |
| **[Attack and Red Team](https://aisecurityinpractice.com/attack-and-red-team/pyrit-zero-to-red-team/)** | Prompt injection, jailbreaking, PyRIT, Garak, adversarial ML, CTFs |
| **[Defend and Harden](https://aisecurityinpractice.com/defend-and-harden/guardrails-engineering/)** | Guardrails, secure RAG, output validation, MCP security, agent hardening |
| **[Architecture and Platform](https://aisecurityinpractice.com/architecture-and-platform/zero-trust-for-ai/)** | Cloud AI security, MLOps, API gateway patterns, Zero Trust |
| **[Governance, Risk and Compliance](https://aisecurityinpractice.com/governance-risk-compliance/the-nist-ai-rmf-implementation-guide/)** | NIST AI RMF, ISO 42001, EU AI Act, risk registers, UK Government guidance |
| **[Emerging Threats and Research](https://aisecurityinpractice.com/emerging-threats-and-research/)** | AI worms, sleeper agents, supply chain attacks, multi-agent security |

## Who This Is For

- **Newcomers** looking for an on-ramp into AI security
- **Red teamers** who need structured attack methodologies
- **Builders and defenders** who need hardening patterns for production
- **Platform engineers and architects** designing AI infrastructure
- **CISOs, risk managers, and GRC teams** governing AI adoption
- **Researchers** tracking emerging threats

## Contributing

This is an open project. Contributions from practitioners, researchers, and engineers working in AI security are actively encouraged.

You can:

- **Fix** typos, broken links, or inaccuracies -- open a PR directly
- **Improve** existing articles -- open an Issue or PR with your suggestion
- **Propose** new articles -- open an Issue with an outline
- **Write** new articles -- fork, write, submit a PR for review
- **Review** open PRs -- constructive feedback is always valuable

See **[CONTRIBUTING.md](CONTRIBUTING.md)** for the full guide: style rules, article structure, frontmatter format, and the review process.

Contributors are credited on the articles they write.

## Running Locally

```bash
npm install
npm run dev
```

The site runs at `http://localhost:4321`.

## Licensing

- **Code** (site infrastructure): [MIT](LICENSE-CODE)
- **Content** (articles, guides, diagrams): [CC BY-NC 4.0](LICENSE-CONTENT) -- free to share and adapt with attribution; commercial use requires separate permission

## Tech Stack

- [Astro](https://astro.build/) + [Starlight](https://starlight.astro.build/)
- Deployed to [Vercel](https://vercel.com/)
- Content authored in Markdown
