---
title: Manifesto
description: What this site is, what it is not, and the standard it holds.
editUrl: false
sidebar:
  order: 0
---

AI systems are no longer experiments.

They are infrastructure.

They make decisions, summarise data, call tools, retrieve knowledge, influence users, and increasingly operate inside production environments.

Infrastructure changes behaviour.
Infrastructure shapes incentives.
Infrastructure amplifies mistakes.

And like all infrastructure, it must be engineered carefully.

## The Gap

In AI security, there are two dominant voices.

On one side:

- Vendor marketing.
- "Secure by design" claims.
- Product positioning.
- High-level assurances.

On the other:

- Academic research.
- Government frameworks.
- Policy documents.
- Formal threat models few practitioners have time to operationalise.

Between these two layers, something is missing.

**The practitioner layer.**

The place where engineers:

- Design the gateway.
- Model the attack surface.
- Build isolation boundaries.
- Validate assumptions.
- Instrument systems.
- Test failure modes.
- And prove that controls actually work.

This site exists to document that layer.

## A Systems View

AI security is not about eliminating risk.

It is about understanding systems.

Every AI system:

- Has inputs.
- Has outputs.
- Has memory.
- Has authority.
- Has incentives.
- Has an attack surface.

Security begins by asking:

- What are we trusting?
- What are we exposing?
- What are we assuming?
- What happens when those assumptions fail?

Trust must be observable.
Boundaries must be explicit.
Refusal must be possible.
Failure must be survivable.

Security is not an add-on.
It is an architectural property.

## What You Will Find Here

The site is organised around six pillars:

1. **Foundations.** The on-ramp. How LLMs work, the OWASP Top 10 explained, your first security lab, and the frameworks for choosing and benchmarking tools.
2. **Attack and Red Team.** Offensive techniques. Prompt injection taxonomies, jailbreaking walkthroughs, PyRIT and Garak tutorials, adversarial ML, and CTF design.
3. **Defend and Harden.** Defensive engineering. Guardrails, secure RAG pipelines, secrets scanning, output validation, MCP security, and agent hardening.
4. **Architecture and Platform.** Infrastructure. Cloud AI security architectures for AWS, Azure, and GCP. MLOps pipelines, API gateway patterns, observability, and Zero Trust.
5. **Governance, Risk and Compliance.** Frameworks operationalised. NIST AI RMF, ISO 42001, EU AI Act, risk registers, incident response playbooks, and UK Government guidance.
6. **Emerging Threats and Research.** Forward-looking analysis. AI worms, sleeper agents, multi-agent system attacks, deepfakes, shadow AI, and supply chain threats.

Every article includes explicit assumptions, practical implementation, validation methodology, and references to standards and research.

No hype.
No vendor sponsorship.
No abstract theory without implementation.

If something cannot be built, tested, or reproduced, it does not belong here.

## Principles

1. Security is designed, not retrofitted.
2. Trust requires instrumentation.
3. Every AI system has an attack surface.
4. Refusal is a feature.
5. Threat models precede deployment.
6. Reproducibility matters more than opinion.
7. Governance without implementation is theatre.
8. Scale amplifies insecurity.

## Who This Is For

This site is written for practitioners:

- **Newcomers** who need an on-ramp into AI security, not a wall of acronyms.
- **Red teamers** who break AI systems and need structured attack methodologies.
- **Builders and defenders** who ship AI features and need hardening patterns that work in production.
- **Platform engineers and architects** who design the infrastructure AI runs on.
- **CISOs, risk managers, and GRC teams** who must govern AI adoption with more than a policy document.
- **Researchers** tracking what comes next.

If you are responsible for deploying AI systems — not just discussing them — this site is for you.

## Contributing

This site is built on collaboration. If you have practical experience securing AI systems, fixing a typo, or proposing a new article, contributions are welcome. See [Contributing](https://github.com/paullawlor-ai/aisecurityinpractice/blob/main/CONTRIBUTING.md) on GitHub for how to get involved.

---

*This site is maintained with the belief that secure AI systems are built deliberately, not assumed into existence.*
