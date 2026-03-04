---
title: "The Cursor Privacy Paradox: When Zero Data Retention Isn't Zero Risk"
description: "Verify AI tool privacy claims through traffic analysis and DPIAs. Zero retention at the model layer does not mean zero risk."
sidebar:
  order: 5
---

**Series:** AI Security in Practice<br/>
**Pillar:** 5: Governance, Risk and Compliance<br/>
**Difficulty:** Intermediate<br/>
**Author:** Paul Lawlor<br/>
**Date:** 2 March 2026<br/>
**Reading time:** 11 minutes

> Verify AI tool "privacy mode" claims through traffic analysis, firewall rules, and DPIAs rather than trusting marketing. Zero retention at the model layer does not mean zero risk.

---

## Table of Contents

1. [Opening Scenario](#1-opening-scenario)
2. [Background](#2-background)
3. [The Don'ts](#3-the-donts)
4. [The Do's](#4-the-dos)
5. [The Organisational Challenge](#5-the-organisational-challenge)
6. [Path Forward](#6-path-forward)
7. [Notes](#notes)

---

## 1. Opening Scenario

A fintech enables Cursor's Privacy Mode for its engineering team. The security team reviews the vendor documentation, notes the "zero data retention" guarantee, and approves adoption. Six months later, during a vendor reassessment, a compliance officer reads the subprocessor list and discovers that Exa receives search requests potentially derived from code when developers use `@web`. Those queries can contain fragments of proprietary logic: variable names, API endpoints, and error messages extracted from the codebase. The team had assumed Privacy Mode meant their code stayed private. It did not.

Privacy Mode guarantees that model providers (OpenAI, Anthropic, Fireworks, and others) do not persist or train on code data. [1] It does not guarantee that code-derived data never leaves Cursor's ecosystem. When a developer uses `@web` in chat, a separate language model examines the message, conversation history, and current file to determine what to search for. The resulting search query, potentially derived from proprietary code, is sent to Exa (or SerpApi). [2] The vendor documents this. Most organisations never verify it.

This scenario illustrates a broader pattern. AI coding tools advertise "privacy mode," "zero retention," and "enterprise-ready" compliance. These claims are often accurate at the model layer. They are rarely complete. Code transits through Cursor's AWS infrastructure before reaching any model. [3] Codebase indexing uploads embeddings and obfuscated metadata to Turbopuffer. [4] Background tasks may route to providers you did not explicitly select. [5] Trusting marketing over verification leaves residual risk. This essay shows how to verify AI tool privacy claims rather than assuming they hold.

---

## 2. Background

"Zero data retention" in the context of AI coding tools typically refers to the model inference layer. Cursor, for example, maintains zero data retention agreements with OpenAI, Anthropic, Fireworks, Baseten, Together, xAI, and Google Cloud Vertex for users in Privacy Mode. [6] Code data is not stored by these providers and is not used for model training. That is a meaningful guarantee. It is not the whole picture.

**In transit, not at rest.** All AI requests from the Cursor client flow through Cursor's infrastructure on AWS before reaching any model provider. [7] The requests include context such as recently viewed files, conversation history, and code selected by the language server. This data is in transit when it passes through Cloudflare (reverse proxy), AWS (primary servers), and the chosen inference provider. "Zero retention" concerns what happens after the request. It does not address who sees the payload during transit, whether copies exist in intermediate caches, or whether auxiliary services (search, indexing, background tasks) receive derived data.

**The subprocessor chain.** Cursor lists subprocessors that "see" or "store" code data. [8] AWS, Cloudflare, Azure, and GCP see code data. Turbopuffer stores embeddings and obfuscated file paths. Exa sees search requests potentially derived from code. For Privacy Mode users, Cursor states that no plaintext code is stored on its servers or in Turbopuffer, and that model providers do not persist data. [9] The distinction matters: "not stored" is different from "not transmitted." Data must cross trust boundaries to reach the model. Each hop is a potential exposure point.

**Model hosting architecture.** Cursor does not yet support direct routing from the app to an enterprise deployment of OpenAI, Azure, or Anthropic. [10] Prompt construction happens on Cursor's servers. Custom models on Fireworks are used for core features. Even with your own API key, requests hit Cursor's backend first. Organisations that require data never to leave their own infrastructure cannot meet that requirement with Cursor in its current form. The NCSC Cloud Security Principles emphasise analysing what evidence a provider has given you and how they have evidenced it. [11] For AI tools, that means understanding the full data path, not only the model provider's retention policy.

---

## 3. The Don'ts

Four mistakes leave organisations exposed when adopting AI tools with "privacy mode" or "zero retention" claims.

**Don't 1: Trust marketing without technical verification.** Vendors publish privacy pages, compliance certifications, and data processing agreements. These are necessary, not sufficient. A "zero data retention" statement may refer only to model providers. It may not cover search providers, embedding services, or background task queues. Example: Cursor documents that Exa receives search requests potentially derived from code when using `@web`. [12] Teams that rely on the Privacy Mode guarantee without reading the subprocessor list may miss this. Consequence: proprietary information reaches third parties the organisation did not assess.

**Don't 2: Skip network traffic analysis.** If you have not inspected what the client sends over the wire, you do not know what leaves your network. AI coding tools use multiple domains: `api2.cursor.sh`, `api5.cursor.sh`, `api3.cursor.sh`, `repo42.cursor.sh`, and others. [13] Telemetry, indexing sync, and search requests may use different endpoints. Tools like **Wireshark** or **mitmproxy** can capture and inspect traffic. Without this, you rely on documentation that may be incomplete or out of date. Consequence: residual data leakage goes undetected until an incident or audit.

**Don't 3: Ignore model hosting and routing architecture.** "We use our own OpenAI API key" does not mean traffic bypasses the vendor. Cursor states that requests always hit its infrastructure on AWS even when an API key is configured. [14] The vendor builds the prompt on its servers and forwards the request. Organisations that assume direct-to-provider routing may misjudge their data exposure. Consequence: compliance assumptions (e.g. data residency, no third-party processing) are violated. Check vendor architecture documentation before adoption.

**Don't 4: Assume codebase indexing is risk-free when enabled.** Cursor indexes code by default. Embeddings and obfuscated file paths are stored with Turbopuffer. [15] The vendor notes that embedding reversal is possible in some cases: an adversary with access to the vector database could learn things about indexed codebases. [16] Obfuscation reduces but does not eliminate risk. If indexing is enabled for convenience, understand what is uploaded and where. Consequence: sensitive code structure or naming may be reconstructible from compromised infrastructure. Disable indexing, or use `.cursorignore` for sensitive paths, when risk outweighs benefit.

---

## 4. The Do's

Six strategies help verify and enforce privacy for AI coding tools.

**Do 1: Perform network traffic analysis before and after adoption.** Capture outbound traffic from a test machine running the AI tool. Use **Wireshark** with appropriate filters (e.g. by domain) or **mitmproxy** for HTTP/HTTPS inspection. Document which domains receive traffic, under what user actions (chat, indexing, search, background tasks), and what types of data appear in requests. Compare findings to vendor documentation. Re-run periodically: vendors add features and subprocessors. Consequence: you have evidence of what leaves your network, not just vendor claims.

**Do 2: Implement endpoint and firewall whitelisting.** Restrict outbound access to the domains the tool requires. Cursor publishes a list: `api2.cursor.sh`, `api5.cursor.sh`, `api3.cursor.sh`, `repo42.cursor.sh`, `api4.cursor.sh`, `us-asia.gcpp.cursor.sh`, `us-eu.gcpp.cursor.sh`, `us-only.gcpp.cursor.sh`, `adminportal42.cursor.sh`, `marketplace.cursorapi.com`, `cursor-cdn.com`, `downloads.cursor.com`, and others. [17] Note that third-party subprocessors such as Exa are called by the vendor's backend, not directly by the client. Firewall rules cannot prevent Cursor's servers from forwarding data to Exa. For `@web` search, the control is policy: restrict or prohibit `@web` usage when working with proprietary code, or accept the risk. Document the allowlist and rationale. The NCSC recommends considering what evidence the provider has given you. [18] Your allowlist is part of that evidence chain.

**Do 3: Understand and test certificate pinning.** Some clients pin certificates to prevent interception. If the tool does not pin, a corporate proxy or **mitmproxy** can inspect TLS traffic for verification. If it does pin, you may need to test on a network segment without interception or use vendor-provided debugging options. Knowing whether traffic is inspectable affects your verification strategy. Document the result.

**Do 4: Evaluate VPC and private endpoint options where available.** Not all AI coding tools support private connectivity. Cursor does not yet offer direct routing to enterprise model deployments or a self-hosted option. [19] For tools that do (e.g. some Copilot or AWS-based offerings), configure VPC endpoints or PrivateLink so that traffic stays within your cloud tenant. When unavailable, factor the lack of private routing into your risk acceptance and Data Protection Impact Assessment (DPIA).

**Do 5: Consider local or air-gapped alternatives for highest-sensitivity work.** For code that must never leave your environment, use local LLMs (Ollama, vLLM, or similar) with an IDE or tool that supports them. These options do not send code to external providers. Trade-offs include model quality, latency, and feature set. Reserve them for repositories or workflows where the sensitivity justifies the limitation. Document which repositories or roles use local-only tools.

**Do 6: Conduct a Data Protection Impact Assessment (DPIA) for AI tool adoption.** Under GDPR and similar regimes, processing that poses high risk to individuals requires a DPIA. [20] AI tools that process code (which may contain personal data, credentials, or business secrets) can qualify. The DPIA should document: what data is processed, which subprocessors handle it, retention and deletion practices, and mitigations (allowlisting, indexing disabled, `.cursorignore`). Update the DPIA when the vendor adds features or subprocessors. Use it to inform procurement and risk acceptance decisions.

---

## 5. The Organisational Challenge

Verifying vendor privacy claims is not a one-time exercise. It requires ongoing effort and organisational commitment.

**Culture.** Developers want tools that make them productive. AI coding assistants deliver that. Security and compliance teams want assurance that code and secrets stay protected. The tension manifests when verification slows adoption or imposes constraints (e.g. disabling search, restricting indexing). Leadership must align incentives: celebrate thorough verification, fund the time for traffic analysis and DPIA updates, and avoid pressuring teams to "just approve it" when gaps remain. Make it safe to say "we need to verify this before we enable it for that repo."

**Policy.** Formalise expectations. A policy or standard should state that AI tool adoption requires: (a) review of vendor privacy and subprocessor documentation, (b) network traffic verification where feasible, (c) firewall or endpoint controls aligned with risk assessment, and (d) DPIA when processing high-sensitivity data. Reference it in procurement, onboarding, and audit readiness. Without a written policy, "we verified it" remains informal and inconsistently applied.

**Training.** Developers and IT staff need to understand what "zero retention" does and does not cover. Include AI tool privacy in security awareness training: what data transits where, how to use `.cursorignore`, when to disable indexing or search for sensitive work. Empower developers to make safe choices without requiring security review for every decision.

**Incident response.** Define what constitutes an AI-related privacy incident. Is it discovery of unexpected data flow to a subprocessor? A misconfiguration that sent sensitive code to a provider that does retain data? Embed these scenarios in your incident response plan. Test the plan before you need it. Ensure the team knows how to contain, investigate, and report such incidents.

---

## 6. Path Forward

**Three actions this week.**

**1. Run a traffic capture.** On a test machine, install the AI tool, enable Privacy Mode (or equivalent), and perform representative actions: open a non-sensitive repo, use chat, trigger indexing, use search if available. Capture outbound traffic with Wireshark or mitmproxy. Document which domains receive traffic and under what conditions. Compare to the vendor's published domain list. Note any destinations not mentioned in documentation. Share findings with your security and procurement teams.

**2. Audit your current deployment.** If the tool is already in use, review: Is Privacy Mode (or equivalent) enabled? Is codebase indexing disabled or scoped for sensitive repos? Is `.cursorignore` or equivalent configured for secrets and proprietary paths? Are firewall or proxy rules in place to restrict or monitor traffic? Produce a one-page gap analysis: what the vendor claims, what you have verified, and what remains unverified.

**3. Draft or update your AI tool privacy verification checklist.** A checklist should cover: vendor subprocessor review, traffic analysis, firewall/allowlist configuration, indexing and search scope, DPIA status, and policy alignment. Use it for the next AI tool evaluation. Publish it internally so procurement and engineering can self-serve where appropriate.

**Looking ahead.** AI coding tools will evolve. New features may introduce new subprocessors or data flows. Vendors may add direct-to-enterprise routing or self-hosted options. Treat verification as a recurring process: re-run traffic analysis after major upgrades, review subprocessor lists quarterly, and update your DPIA when the processing changes. The goal is not to block adoption. It is to adopt with eyes open, evidence in hand, and controls in place.

---

## Notes

1. Cursor, Privacy mode guarantee, https://www.cursor.com/security#privacy-mode-guarantee
2. Cursor, Infrastructure security (Exa subprocessor), https://www.cursor.com/security
3. Cursor, AI requests, https://www.cursor.com/security#ai
4. Cursor, Codebase indexing, https://www.cursor.com/security#codebase-indexing
5. Cursor, Infrastructure security (background tasks to OpenAI/Anthropic/Vertex), https://www.cursor.com/security
6. Cursor, Infrastructure security (zero data retention agreements), https://www.cursor.com/security
7. Cursor, AI requests, https://www.cursor.com/security#ai
8. Cursor, Infrastructure security (subprocessors), https://www.cursor.com/security
9. Cursor, Codebase indexing (privacy mode, no plaintext stored), https://www.cursor.com/security#codebase-indexing
10. Cursor, AI requests (no direct routing), https://www.cursor.com/security#ai
11. NCSC, The cloud security principles, https://www.ncsc.gov.uk/collection/cloud/the-cloud-security-principles
12. Cursor, Infrastructure security (Exa), https://www.cursor.com/security
13. Cursor, Client security (domains), https://www.cursor.com/security#client-security
14. Cursor, AI requests, https://www.cursor.com/security#ai
15. Cursor, Codebase indexing (Turbopuffer), https://www.cursor.com/security#codebase-indexing
16. Cursor, Codebase indexing (embedding reversal), https://www.cursor.com/security#codebase-indexing
17. Cursor, Client security (domain whitelist), https://www.cursor.com/security#client-security
18. NCSC, The cloud security principles, https://www.ncsc.gov.uk/collection/cloud/the-cloud-security-principles
19. Cursor, AI requests (no self-hosted option), https://www.cursor.com/security#ai
20. ICO, When do we need to do a DPIA?, https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/accountability-and-governance/data-protection-impact-assessments-dpias/when-do-we-need-to-do-a-dpia
