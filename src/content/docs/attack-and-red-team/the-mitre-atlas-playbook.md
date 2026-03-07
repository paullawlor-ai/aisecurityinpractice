---
title: "The MITRE ATLAS Playbook: Mapping AI Attacks to the ATT&CK Framework"
description: "A practical playbook for using MITRE ATLAS to categorise AI red team findings and threat models in a format that maps to the ATT&CK framework your organisation already uses."
sidebar:
  order: 6
---

**Series:** AI Security in Practice<br/>
**Pillar:** 2: Attack and Red Team<br/>
**Difficulty:** Intermediate<br/>
**Author:** Paul Lawlor<br/>
**Date:** 5 March 2026<br/>
**Reading time:** 15 minutes

> A practical playbook for using MITRE ATLAS to categorise AI red team findings and threat models in a format that maps to the ATT&CK framework your organisation already uses.

---

## Table of Contents

1. [When to Use This Playbook](#1-when-to-use-this-playbook)
2. [Process Overview](#2-process-overview)
3. [Phase 1: Asset and Tactic Mapping](#3-phase-1-asset-and-tactic-mapping)
4. [Phase 2: Technique Identification and Case Study Correlation](#4-phase-2-technique-identification-and-case-study-correlation)
5. [Phase 3: ATT&CK Correlation and Reporting](#5-phase-3-attck-correlation-and-reporting)
6. [Decision Trees](#6-decision-trees)
7. [Templates and Checklists](#7-templates-and-checklists)
8. [Worked Example](#8-worked-example)

---

## 1. When to Use This Playbook

You have run a red team exercise against an LLM-powered chatbot and found that prompt injection can extract the system prompt. You have tested a RAG pipeline and discovered that poisoned documents cause the model to hallucinate incorrect citations. You have a list of findings. Now you need to communicate them in a language that your security leadership, risk managers, and auditors understand. That language is **MITRE ATT&CK** for most enterprises. The problem is that ATT&CK was built for traditional IT systems, not for AI-specific attacks such as prompt injection, data poisoning, or model theft.

**MITRE ATLAS** (Adversarial Threat Landscape for Artificial-Intelligence Systems) fills that gap. It is a knowledge base of adversary tactics and techniques against AI-enabled systems, structured as a companion to ATT&CK. [1] ATLAS provides a taxonomy that maps AI attack techniques to the same tactical flow that security teams already use: reconnaissance, initial access, execution, persistence, defence evasion, collection, exfiltration, and impact. When you categorise your AI red team findings using ATLAS, you give them the same structured format that your organisation uses for conventional penetration test reports.

Use this playbook when:

- **Reporting AI security findings to stakeholders who expect ATT&CK-style taxonomy.** Your CISO, board, or auditors may require threat intelligence in a standardised format. ATLAS techniques map to ATT&CK tactics (many are adaptations marked with & in the matrix), so you can show how AI attacks fit the familiar kill chain. [2]
- **Building a threat model for AI systems.** Whether you are assessing a new LLM integration before launch or documenting the attack surface of an existing RAG pipeline, ATLAS provides a checklist of AI-specific techniques to consider. It complements the OWASP Top 10 for LLM Applications by adding a tactical progression and linking to real-world case studies.
- **Prioritising defences across hybrid environments.** Many organisations run both traditional infrastructure and AI-enabled applications. A single incident may involve both: for example, an attacker uses traditional phishing (ATT&CK) to gain initial access, then exploits an LLM endpoint to exfiltrate data (ATLAS). Mapping both frameworks in one view helps you allocate resources to the highest-risk attack paths.
- **Integrating AI threat intelligence into SIEM or SOAR.** ATLAS data is available in STIX 2.1 format, which most security platforms can ingest. [3] Mapping your findings to ATLAS techniques enables automated correlation with existing ATT&CK-based detections and playbooks.

Do not use this playbook when you need a quick, one-off categorisation of a single finding. In that case, a direct lookup in the [ATLAS matrix](https://atlas.mitre.org/matrices/ATLAS) is sufficient. Use this playbook when you want to establish a repeatable process for threat modelling, red team reporting, or risk assessment of AI systems across your organisation.

---

## 2. Process Overview

The playbook has three phases. Each phase produces a deliverable that feeds into the next.

**Phase 1: Asset and tactic mapping.** Identify every AI system in scope and map each to the ATLAS tactics that apply. This establishes which parts of the kill chain are relevant. An LLM chatbot with no tool-calling capability will not have techniques under "AI Agent Tool Invocation" or "Lateral Movement." A RAG-backed assistant will have techniques under "Collection" (RAG databases) and "Exfiltration" (indirect prompt injection to leak retrieved content).

**Phase 2: Technique identification and case study correlation.** For each relevant tactic, identify the specific ATLAS techniques that apply to your systems. Cross-reference with ATLAS case studies and the **AI Incident Database** [4] to ground your mapping in real-world attacks. This step turns a theoretical checklist into evidence-based threat scenarios.

**Phase 3: ATT&CK correlation and reporting.** Map ATLAS techniques to their ATT&CK counterparts where they exist (marked with & in ATLAS). Produce a consolidated threat model or red team report that shows both AI-specific and traditional attack paths. Use the **ATLAS Navigator** [5] to visualise your findings alongside ATT&CK Enterprise if your organisation already uses it.

The process assumes you have already completed an AI asset inventory (Article 1.07 on this site covers the first 90 days) and have at least one red team finding or threat modelling session to categorise. If you are starting from scratch, run a minimal red team exercise first using **PyRIT** or **Garak** (Articles 2.01 and 2.09 on this site) so you have concrete findings to map.

---

## 3. Phase 1: Asset and Tactic Mapping

### Scope your AI systems

List every AI system in scope for this threat model or report. For each system, capture:

- **System type:** LLM chatbot, RAG pipeline, AI agent with tools, image generation, or other. The ATLAS matrix has distinct techniques for LLMs, agents, and traditional ML models.
- **Access model:** Is the model exposed via a public-facing API, an internal service, or an on-premises deployment? ATLAS tactics such as "AI Model Access" (AML.TA0000) and "Initial Access" (AML.TA0004) depend on how the attacker reaches the system.
- **Data flows:** What data enters the model (user prompts, RAG content, tool outputs, uploaded documents)? What can leave (responses, function calls, logs)? Untrusted inputs that reach the model create opportunities for prompt injection, RAG poisoning, and context manipulation.
- **Agency:** Does the system call external APIs, execute code, send emails, or modify data? Systems with tool-calling capability have a much larger technique surface, including **AI Agent Tool Invocation** (AML.T0053), **Exfiltration via AI Agent Tool Invocation** (AML.T0086), and **AI Agent Context Poisoning** (AML.T0080).

### Map to ATLAS tactics

ATLAS has 16 tactics arranged left-to-right in attack progression. [6] Not all tactics apply to every system.

| Tactic | Applies when |
|--------|---------------|
| Reconnaissance | Attacker can gather information about your AI (APIs, model type, RAG sources) |
| Resource Development | Attacker builds or obtains adversarial tools (jailbreak prompts, poisoned datasets) |
| Initial Access | Attacker reaches your system (phishing, drive-by, supply chain) |
| AI Model Access | Attacker interacts with your model (API, product, or physical access) |
| Execution | Attacker triggers model behaviour (prompt injection, tool invocation) |
| Persistence | Attacker maintains access (poisoned model, malicious prompts) |
| Privilege Escalation | Attacker gains higher privileges (jailbreak, tool misuse) |
| Defence Evasion | Attacker bypasses guardrails or detection |
| Credential Access | Attacker steals API keys, credentials from config or RAG |
| Discovery | Attacker probes system (system prompt extraction, tool discovery) |
| Lateral Movement | Attacker moves to other systems via agent tools |
| Collection | Attacker harvests data (training data, RAG content, user data) |
| AI Attack Staging | Attacker prepares attacks (adversarial data, proxy models) |
| Command and Control | Attacker remotely controls compromised systems |
| Exfiltration | Attacker extracts data (model, prompts, PII) |
| Impact | Attacker disrupts service or causes harm |

For each AI system, mark which tactics are in scope. A customer-facing chatbot with RAG but no tools will typically have: AI Model Access, Execution, Defence Evasion, Discovery, Collection, and Exfiltration. An AI agent that can send emails and update a CRM adds Persistence, Credential Access, Lateral Movement, and Impact.

### Deliverable

A table mapping each AI system to the ATLAS tactics that apply. This scopes the next phase: you will only drill into techniques under the tactics you have marked.

---

## 4. Phase 2: Technique Identification and Case Study Correlation

### Identify techniques under each tactic

For each tactic you marked in Phase 1, list the specific ATLAS techniques that apply. The ATLAS matrix groups techniques under each tactic. [7] Key techniques for LLM and agent systems include:

**Execution:**
- **LLM Prompt Injection** (AML.T0051): Direct, indirect, or triggered. Covers both user-supplied prompts and injection via RAG content or tool outputs.
- **LLM Jailbreak** (AML.T0054): Bypassing safety constraints to elicit restricted outputs.
- **AI Agent Tool Invocation** (AML.T0053): Forcing an agent to use authorised tools for unauthorised purposes.

**Defence Evasion:**
- **LLM Prompt Obfuscation** (AML.T0068): Encoding malicious instructions to avoid detection.
- **Evade AI Model** (AML.T0015): Adversarial inputs that bypass guardrails.

**Discovery:**
- **Discover LLM System Information** (AML.T0069): Extracting system prompts, special characters, or instruction keywords.
- **Discover AI Agent Configuration** (AML.T0084): Probing tool definitions, embedded knowledge, and activation triggers.

**Exfiltration:**
- **Extract LLM System Prompt** (AML.T0056): Leaking the system prompt via prompt injection.
- **LLM Data Leakage** (AML.T0057): Revealing training data or RAG content.
- **Exfiltration via AI Agent Tool Invocation** (AML.T0086): Using agent tools (e.g. email, API calls) to leak data.

**Collection:**
- **RAG Poisoning** (AML.T0070): Corrupting retrieved content to influence model outputs.
- **AI Agent Context Poisoning** (AML.T0080): Manipulating agent memory or thread context.

### Cross-reference with case studies

ATLAS documents 33+ case studies of real-world attacks. [8] For each technique you identify, check whether a case study exists. Examples:

- **Morris II Worm:** RAG email context poisoning, prompt injection, self-replication. Maps to AML.T0051 (LLM Prompt Injection), AML.T0070 (RAG Poisoning), AML.T0061 (LLM Prompt Self-Replication).
- **Evasion of Cylance Malware Scanner:** Adversarial files bypassing ML detection. Maps to AML.T0015 (Evade AI Model), AML.T0018 (Manipulate AI Model).
- **ShadowRay:** Unauthorised Ray Jobs API access, credential theft. Maps to AML.T0040 (AI Model Inference API Access), AML.T0055 (Unsecured Credentials).
- **OpenAI vs. DeepSeek Model Distillation:** Model extraction via querying. Maps to AML.T0024 (Exfiltration via AI Inference API).

The **AI Incident Database** [9] catalogues over 1,300 AI incidents. Search for incidents that match your system type (chatbot, RAG, agent) and map them to ATLAS techniques. This grounds your threat model in observed attacks, not only research papers.

### Deliverable

For each AI system, a list of ATLAS techniques with sub-techniques where applicable, plus at least one case study or AIID incident per technique. This becomes the evidence base for your final report.

---

## 5. Phase 3: ATT&CK Correlation and Reporting

### Map ATLAS to ATT&CK

ATLAS techniques marked with "&" in the matrix are adaptations of ATT&CK Enterprise techniques. [10] For example:

- **Search Open Technical Databases** (AML.T0000) adapts ATT&CK T1593 (Search Open Technical Databases).
- **Phishing** (AML.T0052) adapts ATT&CK T1566 (Phishing).
- **Valid Accounts** (AML.T0012) adapts ATT&CK T1078 (Valid Accounts).
- **Exfiltration via Cyber Means** (AML.T0025) adapts ATT&CK T1048 (Exfiltration Over Alternative Protocol).

For each ATLAS technique in your findings, note the corresponding ATT&CK technique ID if one exists. The **ATLAS Navigator** [11] can display ATLAS and ATT&CK Enterprise side by side, which helps stakeholders who already use ATT&CK for traditional threat intelligence.

Some ATLAS techniques are AI-specific and have no direct ATT&CK analogue: **LLM Prompt Injection**, **RAG Poisoning**, **Extract LLM System Prompt**. For these, document that they are AI-only and explain the attack path in plain language. This distinction matters when you report to leadership: "This is similar to credential theft (T1552) but specific to AI agent configuration" is more actionable than "AML.T0083" without context.

### Produce the consolidated report

Structure your output for the audience:

**For technical teams:** A technique-by-technique table with ATLAS IDs, ATT&CK mappings, case study references, and mitigation pointers. Link to ATLAS technique pages for drill-down.

**For risk and leadership:** A one-page summary showing the top 5–10 techniques by likelihood and impact, with business-context descriptions. Use the tactic flow (left to right) to show attack progression.

**For SIEM/SOAR:** Export your technique list in a format compatible with your platform. ATLAS STIX 2.1 data can be imported; custom mappings may require a small integration layer.

### Tooling

- **ATLAS Navigator:** Load the default ATLAS layer and create a custom layer highlighting the techniques you identified. Overlay with ATT&CK Enterprise if needed.
- **ATLAS Arsenal / CALDERA plugin:** For automated adversary emulation, if your organisation uses CALDERA for red team exercises.
- **STIX 2.1 export:** Use the [atlas-data](https://github.com/mitre-atlas/atlas-data) repository for programmatic access to technique definitions and relationships.

### Deliverable

A threat model or red team report that: (1) lists AI systems and their ATLAS tactic coverage, (2) details techniques with case study links, (3) maps to ATT&CK where applicable, and (4) provides mitigation recommendations per technique. Store the report in your standard threat intelligence or risk register location so it can be updated as your AI systems and ATLAS evolve.

---

## 6. Decision Trees

Use these decision trees to quickly route findings to the correct ATLAS techniques.

### "I found prompt injection. Which technique?"

```
Does the injected content come directly from user input?
├─ Yes → AML.T0051.000 (LLM Prompt Injection: Direct)
└─ No →
   ├─ Does it come from RAG-retrieved content (e.g. poisoned document)?
   │  └─ Yes → AML.T0051.001 (LLM Prompt Injection: Indirect)
   └─ Is it triggered by a specific condition or prior output?
      └─ Yes → AML.T0051.002 (LLM Prompt Injection: Triggered)
```

### "I found data exfiltration. Which technique?"

```
How did the data leave the system?
├─ Via the LLM's text response (leaked in generated output)?
│  └─ AML.T0057 (LLM Data Leakage) or AML.T0056 (Extract LLM System Prompt)
├─ Via an AI agent's tool call (email, API, file write)?
│  └─ AML.T0086 (Exfiltration via AI Agent Tool Invocation)
├─ Via direct API abuse (model inversion, membership inference)?
│  └─ AML.T0024 (Exfiltration via AI Inference API) and sub-techniques
└─ Via conventional means (e.g. stolen credentials, exfil over network)?
   └─ AML.T0025 (Exfiltration via Cyber Means) — maps to ATT&CK T1048
```

### "I found a jailbreak. Which technique?"

```
Did the jailbreak bypass safety constraints?
├─ Yes → AML.T0054 (LLM Jailbreak)
│  └─ Did it also involve obfuscation or encoding to evade detection?
│     └─ Yes → Also add AML.T0068 (LLM Prompt Obfuscation) for the evasion component
└─ No → Not a completed jailbreak; check AML.T0068 if obfuscation was used to attempt evasion
```

### "I found RAG manipulation. Which technique?"

```
What was manipulated?
├─ The content retrieved and fed to the LLM?
│  └─ AML.T0070 (RAG Poisoning)
├─ False or hallucinated entries in the retrieval results?
│  └─ AML.T0071 (False RAG Entry Injection)
└─ The retrieval of credentials stored in RAG?
   └─ AML.T0082 (RAG Credential Harvesting)
```

### "I found agent misbehaviour. Which technique?"

```
What did the agent do wrong?
├─ Invoked a tool it was authorised to use, but for a malicious purpose?
│  └─ AML.T0053 (AI Agent Tool Invocation)
├─ Had its context or memory altered to change behaviour?
│  └─ AML.T0080 (AI Agent Context Poisoning) — Memory (AML.T0080.000) or Thread (AML.T0080.001)
├─ Had its configuration changed (tools, triggers, knowledge)?
│  └─ AML.T0081 (Modify AI Agent Configuration)
└─ Exfiltrated data by encoding it in tool parameters?
   └─ AML.T0086 (Exfiltration via AI Agent Tool Invocation)
```

### "Should I map this to ATT&CK as well?"

```
Is the ATLAS technique marked with & in the matrix?
├─ Yes → Look up the ATT&CK adaptation; include both in your report
└─ No → Document as AI-specific; no direct ATT&CK mapping
```

These trees are starting points. Many attacks involve multiple techniques in sequence. A single finding (e.g. "user extracted the system prompt via indirect injection") may map to AML.T0051.001 and AML.T0056. Document all that apply.

---

## 7. Templates and Checklists

### AI System ATLAS Scoping Checklist

Use this when starting Phase 1. Tick each that applies to the system.

- [ ] System type: LLM chatbot / RAG pipeline / AI agent with tools / image generation / traditional ML
- [ ] Access: Public API / Internal only / On-premises
- [ ] Untrusted inputs: User prompts / RAG content / Tool outputs / Uploaded documents
- [ ] Tool-calling: Yes / No (if yes, list tool categories: email, APIs, code, file system)
- [ ] Data in RAG: Internal docs / Public web / User uploads
- [ ] Authentication: None / API key / SSO / Per-user

### Phase 1 Tactic Mapping Template

| AI System | Recon | Dev | Init Access | ML Access | Exec | Persist | Priv Esc | Def Evasion | Cred Access | Discovery | Lateral | Collect | Staging | C2 | Exfil | Impact |
|-----------|-------|-----|-------------|-----------|------|---------|----------|-------------|-------------|-----------|---------|---------|---------|----|----|--------|
| [System name] | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |

### Phase 2 Technique Log Template

For each technique, capture:

```
ATLAS Technique: [ID and name, e.g. AML.T0051.001 LLM Prompt Injection: Indirect]
Sub-techniques: [if applicable]
System(s) affected: [list]
Case study / AIID reference: [URL or citation]
Finding description: [1–2 sentences]
Mitigation status: Mitigated / Partial / Unmitigated
ATT&CK mapping: [technique ID if & applies, or "N/A AI-specific"]
```

### Red Team Report ATLAS Section Template

```markdown
## ATLAS Technique Summary

| Technique | ATT&CK | Severity | Mitigated |
|-----------|--------|----------|-----------|
| AML.T0051.001 | N/A | High | Partial |
| AML.T0056 | N/A | High | No |
| AML.T0053 | N/A | Medium | Yes |

## Detailed Findings

### AML.T0051.001 – LLM Prompt Injection: Indirect
**Observation:** [Description of the finding]
**Case study:** Morris II Worm (RAG/email context poisoning)
**Recommendation:** [Mitigation]
```

### Quick Reference: LLM-Focused Technique Subset

For LLM and RAG systems, these techniques cover the majority of findings:

| Tactic | Technique | ID |
|--------|-----------|-----|
| Execution | LLM Prompt Injection (Direct/Indirect/Triggered) | AML.T0051 |
| Execution | LLM Jailbreak | AML.T0054 |
| Defence Evasion | LLM Prompt Obfuscation | AML.T0068 |
| Defence Evasion | Evade AI Model | AML.T0015 |
| Discovery | Discover LLM System Information | AML.T0069 |
| Collection | RAG Poisoning | AML.T0070 |
| Exfiltration | Extract LLM System Prompt | AML.T0056 |
| Exfiltration | LLM Data Leakage | AML.T0057 |

For AI agents, add: AML.T0053, AML.T0080, AML.T0081, AML.T0086.

---

## 8. Worked Example

### Scenario

You have red-teamed a customer support chatbot backed by an LLM and a RAG knowledge base. The chatbot has no tool-calling capability. You discovered:

1. Direct prompt injection that extracted the system prompt.
2. A poisoned PDF in the RAG index that caused the model to recommend a competitor's product.
3. Obfuscated prompt injection (Base64-encoded instructions) that bypassed an initial guardrail.

### Phase 1: Asset and Tactic Mapping

**System:** Customer support chatbot, RAG-backed, no tools.

**Tactics in scope:** AI Model Access (public API), Execution (prompt injection), Defence Evasion (obfuscation), Discovery (system prompt extraction), Collection (RAG poisoning), Exfiltration (data leakage).

**Not in scope:** Persistence, Privilege Escalation, Credential Access, Lateral Movement (no agent tools), Command and Control.

### Phase 2: Technique Identification

| Finding | ATLAS Technique | Sub-technique | Case Study |
|---------|-----------------|---------------|------------|
| Direct prompt injection extracting system prompt | AML.T0056 (Extract LLM System Prompt), AML.T0051 (LLM Prompt Injection) | AML.T0051.000 (Direct) | Common pattern; AIID has many prompt extraction incidents |
| Poisoned PDF in RAG | AML.T0070 (RAG Poisoning) | — | Morris II Worm (email/RAG context) |
| Obfuscated injection bypassing guardrail | AML.T0068 (LLM Prompt Obfuscation), AML.T0051 (LLM Prompt Injection) | AML.T0051.000 (Direct) | Evasion of Cylance (different domain; same evasion principle) |

### Phase 3: ATT&CK Correlation and Report

**Technique summary:**

| ATLAS | ATT&CK | Severity | Business impact |
|-------|--------|----------|-----------------|
| AML.T0056 | N/A | High | System prompt may contain proprietary instructions, PII handling rules |
| AML.T0051.000 | N/A | High | Enables follow-on extraction, jailbreak |
| AML.T0070 | N/A | Medium | Incorrect recommendations, brand harm |
| AML.T0068 | N/A | Medium | Guardrail bypass extends attack surface |

**Recommendations:**

- **AML.T0056 / AML.T0051:** Implement input sanitisation, output filtering, and prompt boundaries. Separate user content from system instructions. See Article 2.02 (Prompt Injection Field Manual) and 3.01 (Guardrails Engineering) on this site.
- **AML.T0070:** Validate and sanitise RAG ingestion. Use a secure pipeline (Article 3.02). Monitor retrieval sources for unexpected changes.
- **AML.T0068:** Add detection for common obfuscation patterns (Base64, Unicode, encoding). Layer multiple guardrails; do not rely on a single filter.

### Output

A two-page report with the technique table, case study references, and mitigation pointers. The report uses ATLAS IDs so engineering can look up detailed technique pages. Risk and leadership receive the business impact summary. The finding is logged in the risk register with ATLAS technique IDs for future correlation.

---

## Further Reading

### External resources

- **MITRE ATLAS:** [https://atlas.mitre.org/](https://atlas.mitre.org/)
- **ATLAS Navigator:** [https://mitre-atlas.github.io/atlas-navigator/](https://mitre-atlas.github.io/atlas-navigator/)
- **AI Incident Database:** [https://incidentdatabase.ai/](https://incidentdatabase.ai/)
- **Microsoft AI Red Team:** Best practices for AI red teaming and PyRIT. [12]

### Related articles

- [Threat Modelling Methodologies for AI](/foundations/threat-modelling-methodologies-for-ai/) — Choosing and combining STRIDE, ATT&CK, ATLAS, and MAESTRO; foundational context for this playbook.
- [The AI Threat Landscape: OWASP LLM Top 10 Explained](/foundations/ai-threat-landscape/) — Maps OWASP risks to ATLAS techniques.
- [PyRIT: Zero to Red Team](/attack-and-red-team/pyrit-zero-to-red-team/) — Use PyRIT findings with this playbook to produce ATLAS-categorised reports.
- [The Prompt Injection Trap](/attack-and-red-team/prompt-injection-trap/) — Comprehensive guide to prompt injection; many ATLAS techniques map to injection patterns.
- [The NIST AI RMF Implementation Guide](/governance-risk-compliance/the-nist-ai-rmf-implementation-guide/) — Task 3.3 references ATLAS for risk categorisation.
- [The Function Calling Minefield](/defend-and-harden/the-function-calling-minefield/) — Securing LLM tool use; relevant to ATLAS techniques around agent tool invocation.

---

## Footnotes

[1] MITRE, "ATLAS: Adversarial Threat Landscape for Artificial-Intelligence Systems," https://atlas.mitre.org/

[2] MITRE, "ATLAS Matrix," https://atlas.mitre.org/matrices/ATLAS

[3] MITRE ATLAS, "atlas-data (STIX 2.1)," https://github.com/mitre-atlas/atlas-data

[4] AI Incident Database, https://incidentdatabase.ai/

[5] MITRE ATLAS Navigator, https://mitre-atlas.github.io/atlas-navigator/

[6] MITRE, "ATLAS Matrix," https://atlas.mitre.org/matrices/ATLAS

[7] MITRE, "ATLAS Matrix," https://atlas.mitre.org/matrices/ATLAS

[8] MITRE, "ATLAS Case Studies," https://atlas.mitre.org/cases/

[9] AI Incident Database, https://incidentdatabase.ai/

[10] MITRE, "ATLAS Matrix" (techniques with & are ATT&CK adaptations), https://atlas.mitre.org/matrices/ATLAS

[11] MITRE ATLAS Navigator, https://mitre-atlas.github.io/atlas-navigator/

[12] Microsoft, "AI Red Team: Building a future of safer AI," https://www.microsoft.com/en-us/security/blog/2023/08/07/microsoft-ai-red-team-building-future-of-safer-ai/
