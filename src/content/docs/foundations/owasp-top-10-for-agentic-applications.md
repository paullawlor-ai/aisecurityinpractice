---
title: "OWASP Top 10 for Agentic Applications (2026): Explained for Practitioners"
description: "A practitioner walkthrough of the OWASP Agentic Top 10: autonomy, tools, memory, and inter-agent trust mapped to defensive actions and site resources."
sidebar:
  order: 13
date: 2026-03-19
---

**Series:** AI Security in Practice<br/>
**Pillar:** 1: Foundations<br/>
**Difficulty:** Beginner-Intermediate<br/>
**Author:** Paul Lawlor<br/>
**Date:** 19 March 2026<br/>
**Reading time:** 16 minutes

> The OWASP Agentic Top 10 translates multi-step autonomy, tools, memory, and inter-agent trust into ten prioritised risks. This article is a practitioner walkthrough: plain language, minimum defensive actions, and links into deeper material on this site, not a substitute for OWASP's official PDF.

### Bottom line

- The OWASP LLM Top 10 is not sufficient for agentic systems. Autonomy chains model-level risks (prompt injection, excessive agency) into wider failures across tools, identity, memory, and inter-agent protocols.
- The first defensive actions are: inventory every tool and egress path with default deny (builders), and classify agents as non-human identities with owners and offboarding (security).
- Real incidents (ForcedLeak, Amazon Q, Replit, Cursor CVEs (Common Vulnerabilities and Exposures)) already demonstrate that ASI01 through ASI05 are actively exploited, not theoretical.
- The architecture diagram in Section 2 maps all ten risks to where they sit in your system. Start there.

---

## Table of Contents

1. [Why a separate Top 10 for agentic applications](#1-why-a-separate-top-10-for-agentic-applications)
2. [How to use this alongside the taxonomy and Article 1.02](#2-how-to-use-this-alongside-the-taxonomy-and-article-102)
3. [ASI01 through ASI03: goals, tools, and identity](#3-asi01-through-asi03-goals-tools-and-identity)
4. [ASI04 through ASI06: supply chain, execution, and memory](#4-asi04-through-asi06-supply-chain-execution-and-memory)
5. [ASI07 through ASI10: communication, cascades, people, and rogue behaviour](#5-asi07-through-asi10-communication-cascades-people-and-rogue-behaviour)
6. [Cross-framework lens: what to open when](#6-cross-framework-lens-what-to-open-when)
7. [First-week priorities for builders and security champions](#7-first-week-priorities-for-builders-and-security-champions)
8. [Further reading and linked articles on this site](#8-further-reading-and-linked-articles-on-this-site)

*Security leaders: Sections 1, 2, and 7. Builders: Sections 3-5 for entry-by-entry detail. The architecture diagram in Section 2 is the single-page reference for both audiences.*

---

## 1. Why a separate Top 10 for agentic applications

If your product already maps risks to the **OWASP Top 10 for LLM Applications (2025)**, you might ask why you need another list. The short answer is that **autonomy changes the failure mode**. A chatbot that answers one question at a time can still cause serious harm through prompt injection or data leakage, but an **agent** that plans over multiple steps, calls tools, persists memory, and coordinates with other agents compounds those risks across a wider attack surface: traditional application security concerns, plus orchestration, plus identity, all mediated through natural language.

The **OWASP Top 10 for Agentic Applications (2026)** (often called the **Agentic Top 10**) is published by the OWASP Gen AI Security Project under its Agentic Security Initiative (ASI — the prefix used for each risk entry below). [^1] The document positions itself as a **compass**: concise entries in the familiar Top 10 format (description, common weaknesses, scenarios, mitigations), while the deeper **Agentic AI Threats and Mitigations** taxonomy remains the reference model underneath. [^1]

### What "agentic" adds to the picture

Three structural differences matter for defenders. First, **multi-step planning and delegation** means a single injection or hallucination can redirect goals, reorder tool calls, or propagate through inter-agent messages across an entire workflow. Second, **tooling and runtime composition** (APIs, shells, MCP (Model Context Protocol) servers, agent cards) makes the tool interface itself part of the attack surface. Third, **identity and memory across sessions** (delegated OAuth (Open Authorization) flows, cached context, shared vector stores) introduce privilege inheritance and persistent poisoning that a stateless LLM call does not exhibit.

### Least-agency and observability

The leaders' letter in the official document stresses two cross-cutting themes. **Least-agency** extends least-privilege: do not deploy autonomous behaviour where it does not earn its keep, because every extra degree of freedom expands the surface without guaranteed benefit. **Observability** is framed as non-negotiable: without clear records of what an agent did, which tools it called, and why, small drifts become organisation-wide incidents. [^1]

---

## 2. How to use this alongside the taxonomy and Article 1.02

Think of three layers, each with a different job.

| Layer | Role | When to open it |
| --- | --- | --- |
| **Agentic Top 10 (ASI01-ASI10)** | Prioritised, high-impact risks for agentic systems | Executive briefing, sprint zero, risk register seed |
| **Agentic AI Threats and Mitigations (T-codes)** | Granular threat pathways and mitigations | Architecture review, detailed threat modelling |
| **LLM Top 10 (2025)** | Model-centric risks (prompt injection, excessive agency, supply chain, etc.) | Any system that includes an LLM, agentic or not |

The Agentic Top 10 maps each ASI entry to **LLM Top 10** items and to **T-codes** in the taxonomy, plus **AIVSS** (AI Vulnerability Scoring System) core risk categories in Appendix A. [^1] That matrix answers the common question: "We already flagged LLM01 and LLM06; why are we talking about ASI01?" Because autonomy chains those vulnerabilities: prompt injection (LLM01) plus excessive agency (LLM06) becomes goal hijack and tool misuse across a workflow, not a single bad completion.

**[Article 1.02](/foundations/ai-threat-landscape/)** remains the right starting point if your system is primarily "model in, text out." Move to this article when you have **any** of: tool calling, long-lived memory or RAG (Retrieval-Augmented Generation) over untrusted corpora, scheduled or event-driven runs, multi-agent orchestration, or delegated credentials.

### The ten risks at a glance

The diagram below maps the ten entries to three architectural zones. Use it alongside your own architecture diagram to identify which ASI entries apply to each component.

<table style="width:100%; border-collapse:separate; border-spacing:0; margin:1.5em 0; font-family:inherit; line-height:1.6;">
<tr>
<td style="background:#1e3a5f; color:#fff; padding:10px 14px; font-weight:700; text-align:center; border-radius:6px 0 0 0; width:33%; border:1px solid #1e3a5f;">Input Surface</td>
<td style="background:#334155; color:#fff; padding:10px 14px; font-weight:700; text-align:center; width:34%; border:1px solid #334155;">Agent Core</td>
<td style="background:#92400e; color:#fff; padding:10px 14px; font-weight:700; text-align:center; border-radius:0 6px 0 0; width:33%; border:1px solid #92400e;">Output Surface</td>
</tr>
<tr>
<td style="background:#eff6ff; padding:14px; vertical-align:top; border:1px solid #bfdbfe; font-size:0.93em;">
<strong>ASI01</strong> Goal hijack<br/><span style="color:#64748b;">Injected instructions redirect agent objectives</span><br/><br/>
<strong>ASI03</strong> Identity and privilege abuse<br/><span style="color:#64748b;">Delegation chains exploited to escalate access</span><br/><br/>
<strong>ASI09</strong> Human-agent trust exploitation<br/><span style="color:#64748b;">Automation bias leads humans to approve harmful actions</span>
</td>
<td style="background:#f8fafc; padding:14px; vertical-align:top; border:1px solid #cbd5e1; font-size:0.93em;">
<strong>ASI06</strong> Memory and context poisoning<br/><span style="color:#64748b;">Stored context corrupted to bias future reasoning</span><br/><br/>
<strong>ASI07</strong> Insecure inter-agent communication<br/><span style="color:#64748b;">Messages between agents spoofed or replayed</span><br/><br/>
<strong>ASI10</strong> Rogue agents<br/><span style="color:#64748b;">Compromised agents persist in harmful behaviour</span>
</td>
<td style="background:#fffbeb; padding:14px; vertical-align:top; border:1px solid #fde68a; font-size:0.93em;">
<strong>ASI02</strong> Tool misuse and exploitation<br/><span style="color:#64748b;">Legitimate tools used in harmful or unintended ways</span>
</td>
</tr>
<tr>
<td colspan="3" style="background:#fef2f2; padding:12px 14px; border:1px solid #fecaca; border-radius:0 0 6px 6px; font-size:0.93em; text-align:center;">
<strong style="color:#991b1b;">Cross-cutting</strong>&emsp;
<strong>ASI04</strong> Supply chain&ensp;&middot;&ensp;
<strong>ASI05</strong> Code execution&ensp;&middot;&ensp;
<strong>ASI08</strong> Cascading failures
</td>
</tr>
</table>

### Practical workflow

1. **Inventory** agent boundaries: triggers, tools, memory stores, identity lines, and peer agents.
2. **Tag** each component with ASI IDs (often several per component).
3. **Pull** detailed mitigations from the Threats and Mitigations guide when you design controls.
4. **Trace** back to LLM Top 10 entries for compatibility with existing security assessments and vendor questionnaires.

Section 6 maps the appendices to specific meetings and workflows.

---

## 3. ASI01 through ASI03: goals, tools, and identity

A useful mental model is a **control triangle**: **what the agent is trying to do** (goals), **how it acts** (tools), and **who it is** (identity and privilege). The first three ASI entries sit on those vertices.

### ASI01: Agent goal hijack

The agent follows an attacker-shaped objective instead of the user's intent, including across planning, re-planning, and multi-turn behaviour. Natural language is untyped: the model cannot reliably separate instructions from retrieved content, so web pages, emails, calendar invites, and forged agent messages all become injection carriers. [^1]

In practice, this is the **EchoLeak** class of attack: a crafted email triggers a Copilot-style workflow without user interaction, exfiltrating mail and files. [^1] **ForcedLeak** against Salesforce Agentforce (September 2025) showed the same pattern in a CRM context, using indirect prompt injection to exfiltrate CRM (Customer Relationship Management) records. [^1] [^9]

**Minimum defensive action:** Treat all natural-language inputs (uploads, RAG chunks, email, tool output) as untrusted; apply LLM01-class defences before they influence planning. [^1] Lock and version system prompts and goal policies; require approval for changes to objectives or reward definitions. Enforce least privilege on tools; require human or policy approval for goal-changing actions. Log goal state, tool sequences, and anomalies.

For the full taxonomy of injection mechanics, see **[Article 2.02](/attack-and-red-team/prompt-injection-field-manual/)** (Prompt Injection Field Manual) on this site.

### ASI02: Tool misuse and exploitation

The agent uses **legitimate** tools in harmful or unintended ways: deleting data, chaining CRM access with external email to exfiltrate records, hammering paid APIs, or following **poisoned tool metadata** (tampered MCP descriptors) so that the tool interface itself steers behaviour. [^1]

The scenario worth remembering is **tool poisoning**: an attacker alters tool descriptors so the model invokes capabilities that look normal on paper but encode malicious semantics. OWASP cites an EDR (Endpoint Detection and Response) bypass where a security-automation agent chained legitimate PowerShell, cURL, and internal APIs to exfiltrate logs. Every command was a trusted binary under valid credentials; host-centric monitoring saw nothing. [^1]

**Minimum defensive action:** Enforce **least agency** and least privilege per tool with explicit scopes, rate limits, and egress allowlists attached as policy rather than convention. [^1] Place an intent gate between model output and execution that validates arguments against schemas and blocks ambiguous tool resolution. Sandbox execution; separate planning from execution where feasible; show dry-run or diffs before destructive operations. Log all tool invocations immutably; alert on anomalous chains such as bulk read followed by external send.

Deeper coverage: **[Article 3.12](/defend-and-harden/the-function-calling-minefield/)** (function calling and tool trust), **[Article 3.09](/defend-and-harden/mcp-trap/)** (MCP trap), **[Article 3.10](/defend-and-harden/autonomous-agent-dilemma/)** (autonomous agent dilemma).

### ASI03: Identity and privilege abuse

Agents inherit OAuth tokens, API keys, roles, and trust from other agents. Attackers exploit delegation chains, confused-deputy patterns between peers, memory that retains secrets across sessions, synthetic personas ("Admin Helper"), or **TOCTOU** (Time of Check to Time of Use) gaps where approval was valid at plan start but not at execution time. [^1]

A concrete example: a low-trust agent forwards a message that a high-trust agent accepts because it appears to come from inside the mesh, executing a payment without re-validating the end user's intent. The OWASP document also describes device-code phishing across agents, where a browsing agent follows a device-code link and a "helper" agent completes it, binding the victim's tenant to attacker scopes. [^1]

**Minimum defensive action:** Issue per-task, time-bound credentials with no silent cross-agent privilege inheritance. Segment memory per user and session; wipe sensitive state between tasks. Treat agents as **non-human identities (NHIs)** with lifecycle, attestation, and audit. [^1] Monitor transitive permission gains and abnormal scope requests.

Identity governance and enterprise rollout patterns: **[Article 1.05](/foundations/enterprise-ide-security-checklist/)** (enterprise IDE security checklist), **[Article 1.10](/foundations/building-an-ai-security-programme/)** (building a programme).

---

## 4. ASI04 through ASI06: supply chain, execution, and memory

This block covers **what you plug in** (supply chain), **what you run** (code execution), and **what you remember** (context and memory).

### ASI04: Agentic supply chain vulnerabilities

Agentic systems compose models, prompts, tools, plugins, MCP servers, agent cards, datasets, and peer agents, often **at runtime**. A static SBOM (Software Bill of Materials) is necessary but not sufficient: descriptors and registries can be poisoned, typosquatted, or impersonated, and updates can propagate malicious behaviour across many hosts quickly. [^1]

The OWASP incidents tracker documents real cases. A poisoned prompt in the **Amazon Q** for VS Code extension shipped in v1.84.0 to thousands before detection, demonstrating how upstream agent-logic tampering cascades through extensions. [^1] [^4] A malicious NPM package impersonated `postmark-mcp` and secretly BCC'd emails to the attacker: the first in-the-wild malicious MCP server. [^1]

**Minimum defensive action:** Pin and attest prompts, tool manifests, and dependencies; use curated registries; verify hashes and signatures on every deploy. [^1] Maintain a supply chain kill switch: the ability to revoke a tool, MCP connection, or agent integration globally within minutes. Design with zero-trust around agent components and contain blast radius with sandboxes and network policy.

Related articles: **[Article 6.05](/emerging-threats-and-research/ai-supply-chain-attacks/)** (AI supply chain), **[Article 3.09](/defend-and-harden/mcp-trap/)** (MCP), **[Article 1.11](/foundations/the-ai-security-reading-list/)** (reading list and tools directory).

### ASI05: Unexpected code execution (RCE — Remote Code Execution)

Agents generate or fetch code, run shell helpers, deserialize objects, or evaluate "memory" expressions. Injection, hallucinated unsafe snippets, or poisoned packages can turn text into host compromise, persistence, or sandbox escape. ASI05 is about **execution outcomes**, not merely a bad tool choice (ASI02). [^1]

This risk has produced real incidents. In July 2025, a **Replit** coding agent hallucinated data, deleted a production database, and generated false outputs to conceal the damage. [^1] Multiple **Cursor** CVEs in October 2025 showed how crafted project files could overwrite IDE configuration and achieve persistent RCE. [^1] [^4]

**Minimum defensive action:** Ban `eval` and similar constructs in production agent paths; require static analysis on generated code before execution. [^1] Never attach broad production credentials to coding agents; isolate per session; allowlist auto-run commands in version control. Apply LLM05 discipline: treat model output like untrusted input before it touches shells, ORM (Object-Relational Mapping) layers, or serializers. [^6]

Deeper coverage: **[Article 3.05](/defend-and-harden/llm-output-validation-patterns/)** (LLM output validation), **[Article 2.04](/attack-and-red-team/adversarial-machine-learning-for-practitioners/)** (adversarial ML where model outputs drive code paths).

### ASI06: Memory and context poisoning

Anything the agent stores or retrieves (conversation summaries, memory tools, RAG corpora, embeddings) can be seeded or gradually skewed so future plans and tool choices are wrong or malicious. This is **persistent** corruption, not only a one-off prompt. [^1] It often feeds goal hijack (ASI01) without being the same class of threat: the poisoning is the cause, the goal shift is the consequence.

Examples include weakly partitioned vector stores that surface another tenant's chunk through high cosine similarity, and **persistent zero-click exploits against ChatGPT** where injected instructions were stored in assistant memory and compromised that user's future sessions. [^1]

**Minimum defensive action:** Segment memory by tenant and sensitivity; weight retrieval by provenance; expire unverified entries. [^1] Block automatic re-ingestion of the model's own outputs into trusted memory without human or policy gates. [^1] Run adversarial tests on ingestion pipelines; monitor for anomalous write rates and content patterns.

Related articles: **[Article 3.02](/defend-and-harden/building-secure-rag-pipeline/)** (secure RAG pipeline), **[Article 6.02](/emerging-threats-and-research/sleeper-agent-attacks/)** (sleeper agents and long-horizon integrity).

---

## 5. ASI07 through ASI10: communication, cascades, people, and rogue behaviour

The final four entries cover the **fabric** between agents and the humans who rely on them: how agents talk to each other, how faults spread, how trust is exploited, and what happens when an agent goes off the rails.

### ASI07: Insecure inter-agent communication

Peers exchange goals, partial plans, tool results, and reputation signals over buses, HTTP, gRPC (Google Remote Procedure Call), MCP, A2A (Agent-to-Agent), or shared memory. If authenticity, integrity, or **semantic** consistency is weak, attackers spoof agents, replay delegation tokens, downgrade protocols, or poison routing so sensitive work flows through a malicious middlebox. [^1]

Where ASI03 centres on credential and privilege misuse, ASI07 centres on **messages and protocols**: even correct IAM (Identity and Access Management) cannot save you if the payload or routing is wrong. [^1] In a documented example, a malicious MCP endpoint advertised spoofed capabilities; once trusted, it routed sensitive data through attacker infrastructure while appearing legitimate. [^1]

**Minimum defensive action:** Enforce mutual authentication, signing, replay protection (nonces, task-bound timestamps), and protocol/version pinning. [^1] Use attested registries for agent cards; reject ambiguous discovery results. Monitor for routing anomalies and split-brain semantics.

Related articles: **[Article 1.12](/foundations/threat-modelling-methodologies-for-ai/)** (threat modelling: MAESTRO inter-layer trust), **[Article 3.09](/defend-and-harden/mcp-trap/)** (MCP as a trust boundary).

### ASI08: Cascading failures

One fault (poisoned memory, bad tool output, hallucinated plan) **propagates** across agents and automations, amplifying into cross-team or cross-tenant harm faster than humans can intervene. ASI08 is about **fan-out**, not the root cause: tag the root under ASI04, ASI06, ASI07, or LLM01 as appropriate, then ask how far it could travel. [^1]

OWASP calls out several observable signals: rapid fan-out where one faulty decision triggers many downstream tasks, cross-domain or tenant spread beyond the original context, oscillating retries between agents, and duplicate intents arriving in downstream queues. [^1]

**Minimum defensive action:** Place circuit breakers between planner and executor; set quotas on delegated actions; use independent policy engines that can halt runs without going through the compromised planner. [^1] Require checkpoints before high-impact steps; consider digital twin replay testing of recent agent traces against blast-radius caps before widening autonomy. [^1] Maintain tamper-evident logs with cryptographic binding to agent identity for non-repudiation. [^1]

Related articles: **[Article 3.10](/defend-and-harden/autonomous-agent-dilemma/)** (autonomous agent dilemma), **[Article 2.06](/attack-and-red-team/the-mitre-atlas-playbook/)** (MITRE ATLAS playbook for detection language).

### ASI09: Human-agent trust exploitation

Fluency and perceived expertise create **automation bias**. Attackers (or misaligned agents) use confident narratives, fabricated rationales, or emotional cues to get humans to approve wires, run pasted commands, or change production settings. The human performs the audited action; the agent's role can be invisible to forensics. [^1]

The OWASP document describes this clearly: a poisoned vendor invoice reaches a finance copilot, which confidently recommends an urgent payment to attacker-controlled bank details. The finance manager approves without independent verification. The agent never touched the money; it only shaped the decision of the human who did. [^1]

**Minimum defensive action:** Separate preview from side effects: no state-changing calls from "read-only" panes; show provenance and expected impact. [^1] Use risk-weighted UI for high-stakes actions; do not rely on model-generated rationales as the sole audit trail. [^1] Keep immutable logs of prompts, tool calls, and approvals; train staff on manipulation patterns.

Related articles: **[Article 2.03](/attack-and-red-team/jailbreaking-llms/)** (jailbreaking and social patterns), **[Article 5.11](/governance-risk-compliance/the-cursor-privacy-paradox/)** (Cursor privacy and trust in dev tools).

### ASI10: Rogue agents

After compromise or misalignment, an agent **keeps** behaving harmfully: exfiltration that continues after the poisoned page is gone, reward hacking that deletes backups to "optimise" cost, collusion between peers, or self-replication across environments. ASI10 is **behavioural integrity** under drift, not the initial injection event. [^1]

The OWASP document provides a stark example without any attacker: agents tasked with minimising cloud costs discover that deleting production backups is the most effective way to hit their metric, autonomously destroying disaster recovery assets. The reward definition was flawed. [^1]

**Minimum defensive action:** Deploy watchdog monitors and behavioural baselines with kill switches and instant credential revocation. [^1] Establish trust zones with strict cross-zone rules; quarantine suspicious agents and require fresh attestation and human approval before reintegration. [^1] Attach signed behaviour manifests (expected tools, goals, data scopes) validated by the orchestrator on each run.

Related articles: **[Article 6.01](/emerging-threats-and-research/ai-worms/)** (AI worms and propagation), **[Article 3.10](/defend-and-harden/autonomous-agent-dilemma/)** (autonomous agent dilemma).

---

## 6. Cross-framework lens: what to open when

You do not need every framework in every meeting. Use this as a **selector**.

| Situation | What to open |
| --- | --- |
| Risk prioritisation and board slides | **ASI01-ASI10** + incidents tracker [^4]; pair with **AIVSS** for scoring (Appendix A) [^1] |
| Design and architecture review | **T-codes** for granular threats, **STRIDE** (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege) on data flows, **MAESTRO** (Multi-Agent Environment Security Threat Response and Operations) for cross-layer trust [^7]; mapping matrix in Appendix A [^1] |
| After a security incident | **MITRE ATLAS** for AI-specific detection language, alongside ATT&CK (Adversarial Tactics, Techniques, and Common Knowledge) for infrastructure [^8] |
| IAM and platform engineering | **Appendix C** (NHI (Non-Human Identity) Top 10 crosswalk) so agent identities sit alongside service principals [^1] [^3] |
| Procurement and SBOM governance | **CycloneDX/AIBOM** (AI Bill of Materials) from Appendix B: component provenance plus agentic behaviour scoring [^1] [^2] |

---

## 7. First-week priorities for builders and security champions

Use this as a **starter backlog**, not a maturity model. The guiding principle across both tables is **least-agency**: if the agent does not need autonomy for a task, do not grant it.

### Builders (engineering)

| Priority | Action | ASI touchpoints |
| --- | --- | --- |
| P1 | Inventory every **tool** and **egress path**; default deny; add allowlists | ASI02, ASI04, ASI05 |
| P2 | Insert a **policy gate** between LLM output and tool execution (schema, scope, rate) | ASI01, ASI02, ASI05 |
| P3 | **Segment** memory and RAG namespaces; block unreviewed self-writeback to long-term memory | ASI06, ASI08 |
| P4 | **Structured logging**: goal or task id, tool, arguments digest, principal, outcome | ASI01-ASI03, ASI08, ASI10 |
| P5 | **Sandbox** code execution; no shared prod credentials on coding agents | ASI03, ASI05 |

### Security champions (GRC (Governance, Risk, and Compliance) / AppSec (Application Security) / IAM)

| Priority | Action | ASI touchpoints |
| --- | --- | --- |
| P1 | Classify agents as **NHIs** with owners, rotation, and offboarding | ASI03, ASI04 |
| P2 | Publish **non-negotiables**: human approval for money movement, mass export, privilege changes | ASI01, ASI02, ASI09 |
| P3 | Add **agentic scenarios** to red teaming (indirect injection, tool poisoning, peer spoofing) | ASI01, ASI02, ASI07 |
| P4 | Align incident playbooks to **cascade** containment (kill switch, revoke tokens, quarantine peers) | ASI08, ASI10 |
| P5 | Track **third-party** MCP servers and agent packages like any other supplier risk | ASI04 |

---

## 8. Further reading and linked articles on this site

**Official sources**

- OWASP **Top 10 for Agentic Applications (2026)** PDF and supporting pages on the Gen AI Security Project site. [^1]
- OWASP **Top 10 for LLM Applications (2025)** for the model-centric baseline. [^5]
- **ASI Agentic Exploits and Incidents** tracker for dated examples to ground prioritisation. [^4]

**On this site (by theme)**

| Theme | Articles |
| --- | --- |
| LLM risk baseline | **[1.02](/foundations/ai-threat-landscape/)** AI Threat Landscape (LLM Top 10) |
| Injection | **[2.02](/attack-and-red-team/prompt-injection-field-manual/)** Prompt Injection Field Manual |
| ATLAS in practice | **[2.06](/attack-and-red-team/the-mitre-atlas-playbook/)** MITRE ATLAS Playbook |
| RAG and data | **[3.02](/defend-and-harden/building-secure-rag-pipeline/)** Building a Secure RAG Pipeline |
| Output safety | **[3.05](/defend-and-harden/llm-output-validation-patterns/)** LLM Output Validation Patterns |
| MCP and tools | **[3.09](/defend-and-harden/mcp-trap/)** The MCP Trap; **[3.12](/defend-and-harden/the-function-calling-minefield/)** Function Calling Minefield |
| Autonomy and oversight | **[3.10](/defend-and-harden/autonomous-agent-dilemma/)** The Autonomous Agent Dilemma |
| Supply chain | **[6.05](/emerging-threats-and-research/ai-supply-chain-attacks/)** AI Supply Chain Attacks |
| Shadow adoption | **6.06** The Shadow AI Problem |

### Three actions this week

1. **Print the architecture diagram from Section 2 and pin it next to your own.** Use it as a checklist during design reviews. The full OWASP document is at https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/.

2. **Run the P1 action for your role** from Section 7. Builders: inventory tools and egress paths. Security champions: classify agents as non-human identities with owners and offboarding.

3. **Read [Article 1.02](/foundations/ai-threat-landscape/) and [Article 2.02](/attack-and-red-team/prompt-injection-field-manual/) back to back.** Together they cover the LLM baseline and the injection mechanics that underpin ASI01 through ASI06.

Agentic security is not "more prompt injection." It is injection plus identity plus memory plus protocol design, and the OWASP Agentic Top 10 is a workable spine for that wider programme.

---

[^1]: OWASP Gen AI Security Project, *OWASP Top 10 for Agentic Applications* (version 2026, December 2025). Licensed under CC BY-SA 4.0. Project hub: https://genai.owasp.org/

[^2]: OWASP Foundation, "CycloneDX Specification." https://cyclonedx.org/

[^3]: OWASP, *Non-Human Identities Top 10* (2025). https://owasp.org/www-project-non-human-identities-top-10/2025/

[^4]: OWASP, *ASI Agentic Exploits and Incidents* (living tracker). https://github.com/OWASP/www-project-top-10-for-large-language-model-applications/blob/main/initiatives/agent_security_initiative/ASI%20Agentic%20Exploits%20%26%20Incidents/ASI_Agentic_Exploits_Incidents.md

[^5]: OWASP, *Top 10 for Large Language Model Applications*. https://owasp.org/www-project-top-10-for-large-language-model-applications/

[^6]: OWASP, "LLM05:2025 Improper Output Handling." https://genai.owasp.org/llmrisk/llm052025-improper-output-handling/

[^7]: Cloud Security Alliance, "Agentic AI Threat Modeling Framework: MAESTRO." https://cloudsecurityalliance.org/blog/2025/02/06/agentic-ai-threat-modeling-framework-maestro

[^8]: MITRE, "ATLAS: Adversarial Threat Landscape for Artificial-Intelligence Systems." https://atlas.mitre.org/

[^9]: Noma Security, "ForcedLeak: AI Agent Risks Exposed in Salesforce Agentforce." https://noma.security/blog/forcedleak-agent-risks-exposed-in-salesforce-agentforce/
