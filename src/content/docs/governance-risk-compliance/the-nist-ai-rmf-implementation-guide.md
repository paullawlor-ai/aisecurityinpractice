---
title: "The NIST AI RMF Implementation Guide: Govern, Map, Measure, Manage for Real"
description: "A step-by-step implementation guide to the NIST AI Risk Management Framework with tasks, deliverables, and templates."
sidebar:
  order: 1
---

**Series:** AI Security in Practice<br/>
**Pillar:** 5: Governance, Risk and Compliance<br/>
**Difficulty:** Intermediate<br/>
**Author:** Paul Lawlor<br/>
**Date:** 2 March 2026<br/>
**Reading time:** 18 minutes

> A step-by-step implementation guide to the NIST AI Risk Management Framework, with specific tasks, deliverables, worked examples, and templates for each of the four core functions.

---

## Table of Contents

1. [NIST AI RMF: What It Is and Who It Applies To](#1-nist-ai-rmf-what-it-is-and-who-it-applies-to)
2. [GOVERN: Establishing AI Governance Structures](#2-govern-establishing-ai-governance-structures)
3. [MAP: Identifying and Categorising AI Risks](#3-map-identifying-and-categorising-ai-risks)
4. [MEASURE: Assessing and Quantifying AI Risks](#4-measure-assessing-and-quantifying-ai-risks)
5. [MANAGE: Treating and Monitoring AI Risks](#5-manage-treating-and-monitoring-ai-risks)
6. [GenAI Profile: Additional Considerations for Generative AI](#6-genai-profile-additional-considerations-for-generative-ai)
7. [Integration with Existing Risk Frameworks](#7-integration-with-existing-risk-frameworks)
8. [Templates and Worked Examples](#8-templates-and-worked-examples)

---

## 1. NIST AI RMF: What It Is and Who It Applies To

The **NIST AI Risk Management Framework (AI RMF)** is a voluntary framework released in January 2023 to help organisations manage risks associated with artificial intelligence. [1] Developed through a consensus-driven process involving industry, academia, and government, it is intended to improve the ability to incorporate trustworthiness considerations into the design, development, use, and evaluation of AI products, services, and systems. [2]

The framework is not a compliance mandate. No regulator requires you to adopt it. But that does not make it optional in practice. Procurement questionnaires increasingly ask about AI risk management frameworks. Regulators reference it when assessing organisational maturity. And for security practitioners building AI governance from scratch, it provides the most widely recognised structure available: four core functions (Govern, Map, Measure, Manage) with clear subcategories, a published Playbook of suggested actions, and crosswalks to other frameworks such as the NIST Cybersecurity Framework (CSF) and ISO standards. [3]

### Who the AI RMF applies to

The AI RMF applies to any organisation that develops, deploys, or uses AI systems. That includes:

- **Organisations building AI systems in-house.** Software teams integrating large language models into products, ML engineers training and deploying models, and platform teams standing up AI infrastructure all benefit from structured risk management.

- **Organisations procuring AI.** If you are buying AI-powered tools (coding assistants, chatbots, recommendation engines, analytics platforms), the AI RMF gives you a vocabulary for vendor assessment and contract requirements.

- **Organisations using AI without building it.** Shadow AI is pervasive. Employees use ChatGPT, Copilot, and other tools whether or not you have policies. The AI RMF's Govern function addresses exactly this: establishing oversight before adoption spirals out of control.

### The four functions at a glance

Before diving into implementation, understand the structure. The AI RMF organises risk management around four functions, each with categories and subcategories that can be implemented in any order (though Govern typically provides the foundation):

| Function | Purpose |
|----------|---------|
| **Govern** | Establish organisational structures, policies, and accountability for AI risk management |
| **Map** | Identify and categorise AI risks in context |
| **Measure** | Assess and quantify AI risks through testing and monitoring |
| **Manage** | Treat, respond to, and continuously monitor AI risks |

The remainder of this guide walks through each function with specific implementation tasks, responsible parties, deliverables, and worked examples. The aim is to go beyond framework theory: you will have concrete artefacts you can implement this quarter.

---

## 2. GOVERN: Establishing AI Governance Structures

The Govern function establishes the organisational foundation for everything that follows. Without clear roles, policies, and accountability, Map and Measure activities lack authority, and Manage decisions have no home. NIST defines Govern as encompassing "cultures, processes, and controls that enable AI risk management." [1]

### Implementation tasks

**Task 2.1: Define AI risk management roles and responsibilities.** Assign ownership. The AI RMF does not prescribe a specific organisational structure, but someone must be accountable. In smaller organisations, this may be the CISO or CTO. In larger organisations, an AI governance committee with representation from security, legal, engineering, and business units is common. Document who owns: policy approval, risk acceptance decisions, incident escalation, and reporting to the board or executive team.

**Task 2.2: Publish AI governance policy.** A single policy document that states the organisation's commitment to AI risk management, aligns to the AI RMF (or equivalent framework), and defines risk appetite. Keep it to two pages. Reference more detailed policies (acceptable use, model deployment, data handling) rather than duplicating them. The policy should be signed by executive leadership and reviewed annually.

**Task 2.3: Establish AI risk management processes.** Define the processes for: adopting new AI systems (approval workflow), assessing AI risks (when and how), responding to AI incidents (escalation path), and reporting AI risk posture (cadence and audience). Integrate these with existing IT governance, change management, and risk management processes where possible. Avoid parallel structures that nobody follows.

**Task 2.4: Allocate resources.** AI risk management requires time, budget, and tools. Secure at least a part-time owner for AI governance. Budget for guardrails, monitoring, red team tools, and training. Without allocated resources, governance documents become shelfware.

### Deliverables

| Deliverable | Owner | Cadence |
|-------------|-------|---------|
| AI governance policy | Security/Legal | Annual review |
| Roles and responsibilities matrix (RACI) | AI governance owner | As needed |
| AI adoption approval process | Security/Engineering | Documented once, updated as needed |
| Programme charter (one page, executive-signed) | Executive sponsor | Annual |

### Worked example: Programme charter

A one-page programme charter is the minimum viable Govern artefact. It should state:

- **Purpose.** "This organisation will manage AI risks through a structured programme aligned to the NIST AI RMF."
- **Scope.** All AI systems developed, procured, or used by the organisation.
- **Owner.** Named individual with authority (e.g., CISO, Head of AI).
- **Authority.** What decisions the owner can make (e.g., approve/block AI tool adoption, require risk assessments).
- **Reporting.** Quarterly briefing to executive team on AI risk posture.
- **Effective date.** When the programme begins.

Get this signed before building anything else. [Article 1.10](/foundations/building-an-ai-security-programme/) on this site covers programme construction in depth. [4]

---

## 3. MAP: Identifying and Categorising AI Risks

The Map function focuses on identifying and understanding AI risks in context. You cannot manage what you have not mapped. NIST describes Map as "understanding the risks posed by AI systems and mapping risk context and tolerances to frame the scope of risk management efforts." [1]

### Implementation tasks

**Task 3.1: Build an AI system inventory.** You cannot map risks without knowing what AI systems exist. For each system, record: name, type (LLM application, coding assistant, RAG pipeline, etc.), business owner, data classification of inputs, deployment model (cloud API, self-hosted, on-device), external services called, autonomy level, and compliance requirements. [Article 1.07](/foundations/your-first-90-days/) covers inventory construction in detail, including discovering shadow AI. [5]

**Task 3.2: Map trust boundaries.** For each AI system, identify where the trust boundary lies. What data enters the system? What external services does it call? What actions can it take (e.g., tool calling, database access, API invocations)? Trust boundary analysis reveals where an attacker or a malfunction could cause harm.

**Task 3.3: Categorise risks by source.** Use established taxonomies to ensure coverage. The **OWASP Top 10 for LLM Applications** catalogues the most critical risks for LLM-powered systems: prompt injection, sensitive information disclosure, excessive agency, data and model poisoning, and others. [6] **MITRE ATLAS** provides an adversarial threat taxonomy modelled on ATT&CK. [7] The **AI Incident Database** offers real-world examples of AI failures to inform risk scenarios. [8] Map your systems to these categories. Do not invent your own taxonomy from scratch.

**Task 3.4: Document risk context and tolerances.** For each risk category relevant to your systems, document: likelihood (based on exposure and controls), impact (financial, reputational, regulatory), and risk tolerance. Is this risk acceptable as-is, or does it require treatment? Risk tolerance statements help prioritise and avoid analysis paralysis.

### Deliverables

| Deliverable | Owner | Cadence |
|-------------|-------|---------|
| AI system inventory | AI governance owner | Quarterly update |
| Trust boundary map (per system or per use case) | Security/Engineering | At adoption, updated at change |
| Risk categorisation matrix (OWASP/MITRE mapping) | Security | With inventory update |
| Risk tolerance statement | Executive/Board | Annual |

### Worked example: Risk categorisation for a customer-facing chatbot

A financial services firm deploys a chatbot that answers account queries and can initiate transactions. Map the risks:

| OWASP Category | Risk | Trust Boundary |
|----------------|------|----------------|
| LLM01 Prompt Injection | Attacker extracts system prompt or customer data | User input → model |
| LLM02 Sensitive Information Disclosure | Training data memorisation or context leakage reveals PII | Model outputs, logs |
| LLM06 Excessive Agency | Chatbot initiates unauthorised transfers | Tool calling → core banking API |
| LLM07 System Prompt Leakage | Attacker extracts system prompt, policies, or tool schemas | User input → model |
| LLM08 Vector and Embedding Weaknesses | RAG retrieves wrong customer context; vector store becomes data leakage surface | RAG retrieval, embedding store |

Each of these maps to a NIST Trustworthy AI characteristic (e.g., Safe, Privacy Enhanced, Secure and Resilient) and to specific Map subcategories in the AI RMF. [1] The next section (Measure) quantifies these risks; Map ensures you have identified them.

---

## 4. MEASURE: Assessing and Quantifying AI Risks

The Measure function focuses on evaluating and quantifying AI risks through testing, monitoring, and performance metrics. NIST states that Measure "evaluates AI system risks and impacts through testing, and continuously monitors deployed AI systems and associated risks." [1] This is where governance meets technical execution.

### Implementation tasks

**Task 4.1: Define measurement objectives.** Decide what you need to measure. For security, that typically includes: vulnerability to prompt injection, data leakage exposure, output reliability (confabulation rate), and adherence to intended behaviour. Align metrics to the risks you mapped. Avoid measuring everything: pick metrics that are meaningful (they reflect actual risk), measurable (you can collect the data), and communicable (leadership can understand them in a five-minute briefing).

**Task 4.2: Conduct AI risk assessments.** Before deployment, assess each AI system against your risk categories. For LLM applications, this includes: red team testing for prompt injection, output validation testing for data leakage, and tool-calling behaviour analysis for excessive agency. Document findings in a risk assessment report. Re-assess when the system changes significantly (model upgrade, new tools, new data sources).

**Task 4.3: Implement monitoring and evaluation.** Deployed systems need ongoing measurement. Log LLM inputs (with appropriate redaction), outputs, tool invocations, latency, and error rates. Configure alerts for anomalous patterns: unusual query volumes, attempts to extract system prompts, unexpected tool invocations. Dashboards that surface AI system behaviour to security and engineering teams close the loop between Measure and Manage.

**Task 4.4: Establish baseline performance metrics.** Define what "normal" looks like for each system. Drift from baseline (e.g., sudden increase in confabulation, change in response patterns) may indicate model degradation, supply chain compromise, or adversarial activity. Baselines enable proactive detection rather than reactive incident response.

### Deliverables

| Deliverable | Owner | Cadence |
|-------------|-------|---------|
| AI risk assessment methodology | Security | Documented once, refined periodically |
| Pre-deployment risk assessment (per system) | Security/Engineering | Per release or major change |
| Monitoring dashboards and alert rules | Engineering/SOC | Ongoing |
| Metrics report (for leadership) | AI governance owner | Quarterly |

### Worked example: Red team testing as Measure

A red team exercise is a direct application of the Measure function. For a coding assistant deployment:

1. **Scope.** Define the system under test: the assistant, its context (repositories, tools), and success criteria (what would constitute a finding).

2. **Techniques.** Use the OWASP Top 10 and MITRE ATLAS as attack catalogs. Test prompt injection (direct and indirect), privilege escalation via tool misuse, data extraction, and jailbreaking. Tools such as **PyRIT** and **Garak** automate or semi-automate many of these tests. [9] [10]

3. **Document findings.** For each finding: vulnerability, reproduction steps, impact, likelihood, and recommended remediation. Map to OWASP categories and NIST Trustworthy AI characteristics.

4. **Track remediation.** Findings feed the risk register (Manage function) and inform control selection. Re-test after remediation to verify.

The AI RMF Playbook provides suggested actions for each Measure subcategory. [11] Download the Playbook in JSON, Excel, or CSV from the Trustworthy and Responsible AI Resource Center (airc.nist.gov) and filter to Measure actions relevant to your use case.

---

## 5. MANAGE: Treating and Monitoring AI Risks

The Manage function applies what you have learned. NIST defines Manage as "addressing AI risks through allocation of resources, implementation of controls, and monitoring and review of AI risks." [1] This is where risks become treatment plans, incidents become lessons learned, and the governance cycle closes.

### Implementation tasks

**Task 5.1: Maintain an AI risk register.** The risk register is the central artefact connecting Map, Measure, and Manage. For each identified risk, record: risk ID, category, affected system, description, likelihood, impact, current controls, residual risk, recommended action, and owner. This guide provides risk register templates in the Map and Manage sections. [Article 1.07](/foundations/your-first-90-days/) covers AI system inventory construction. [12] Review the register quarterly. Update when new systems are adopted, new risks are identified, or controls change.

**Task 5.2: Prioritise and allocate resources to risk treatment.** Not every risk requires immediate action. Prioritise by residual risk score (likelihood × impact) and by strategic importance. For each risk, decide: accept (document rationale), mitigate (implement controls), transfer (insure, contract), or avoid (do not deploy). Allocate resources to the highest-priority treatments first.

**Task 5.3: Implement controls.** Controls flow from your risk assessments and the AI RMF Playbook. For LLM applications, common controls include: input validation and sanitisation, output filtering and content safety, guardrails (e.g., **LlamaGuard**, **NeMo Guardrails**, cloud provider guardrail services), access controls for tool calling, and supply chain verification for third-party models. [13] [14] Integrate controls into the development pipeline rather than bolting them on at deployment.

**Task 5.4: Establish AI incident response procedures.** AI incidents differ from traditional security incidents. Prompt injection, data leakage through an LLM, model compromise, and supply chain attacks require specific playbooks. Define: detection triggers, containment steps (e.g., disable affected system, revoke API keys), forensics (preserve logs, prompts, outputs), communication (internal and external), and post-incident review. The CISA JCDC AI Playbook and AI Incident Database offer useful references. [15] [8]

**Task 5.5: Monitor and review continuously.** Manage is not a one-time activity. Monitor deployed systems for drift, new vulnerabilities, and changing threat landscapes. Review the risk register, control effectiveness, and incident patterns quarterly. Update policies and processes based on lessons learned. The AI RMF emphasises continual improvement: organisations should regularly assess and refine their AI risk management approaches as contexts and risks evolve. [1]

### Deliverables

| Deliverable | Owner | Cadence |
|-------------|-------|---------|
| AI risk register | AI governance owner | Quarterly review |
| Risk treatment plan (prioritised actions) | Security | Quarterly |
| AI incident response playbook | Security/SOC | Annual review, tested annually |
| Control effectiveness report | Security | Quarterly |
| Post-incident review (per incident) | Incident owner | Within 30 days of incident |

### Worked example: Risk treatment for prompt injection

A risk assessment identifies that your customer-facing chatbot is vulnerable to prompt injection. Current controls: basic input length limits, no output filtering. Residual risk: high.

**Treatment options:**
- **Mitigate.** Deploy input validation (detect injection patterns), output filtering (block extraction of system prompt or customer data), and a prompt injection detection service (e.g., Lakera Guard, Rebuff). [16] [17] Re-test after implementation.
- **Accept.** Document that the risk is accepted for a defined period while mitigation is developed. Set a review date.
- **Avoid.** Disable the chatbot until controls are in place. Rarely acceptable for production systems.
- **Transfer.** Cyber insurance may cover some AI-related incidents. Contract language with model providers may allocate liability. Neither substitutes for technical controls.

Select mitigate. Assign ownership to the engineering team. Set a remediation deadline. Add to the risk register with status "In progress." Re-assess (Measure) after deployment. Update the register when residual risk is reduced.

---

## 6. GenAI Profile: Additional Considerations for Generative AI

In July 2024, NIST released **NIST AI 600-1**, the **Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile**. [18] This profile is a companion resource to the AI RMF, developed in response to the 2023 Executive Order on Safe, Secure, and Trustworthy AI. It addresses risks that are unique to or exacerbated by generative AI (GAI), including large language models, text-to-image systems, and other foundation-model-based applications.

### Why the GenAI Profile matters

The core AI RMF applies to all AI systems. The GenAI Profile adds GAI-specific guidance organised around the same four functions. If you are deploying LLM applications, coding assistants, RAG systems, or agentic workflows, the profile provides suggested actions that map directly to GAI risks. NIST identifies twelve risk categories in the profile, including: confabulation, prompt injection, data privacy (including training data memorisation), information security (including automated vulnerability discovery), harmful bias, information integrity (misinformation and disinformation), value chain risks, and others. [18]

### Key GenAI Profile focus areas

The profile emphasises four primary considerations, as informed by NIST's Generative AI Public Working Group: [18]

1. **Governance.** Extend your AI governance to explicitly cover GAI. Ensure policies address: acceptable use of foundation models, data handling for model fine-tuning and inference, and vendor assessment for GAI providers.

2. **Content provenance.** GAI outputs can be indistinguishable from human-generated content. Consider mechanisms to identify and authenticate AI-generated content where it matters (e.g., disclosures to end users, watermarking for synthetic media). The profile discusses digital watermarking and metadata recording; standards such as C2PA are emerging for content authenticity. [19]

3. **Pre-deployment testing.** GAI systems require testing for confabulation, jailbreaking, prompt injection, bias, and output reliability. The profile provides suggested actions mapped to Measure subcategories. Integrate GAI-specific test cases into your pre-deployment assessment.

4. **Incident disclosure.** Establish procedures for disclosing GAI-related incidents, including data breaches involving model training data, significant output failures, and security compromises. Align with existing incident disclosure requirements (breach notification, vulnerability disclosure) while accounting for GAI-specific harm.

### Implementation approach

The GenAI Profile is not a separate framework. Use it as a filter on the AI RMF: when implementing Govern, Map, Measure, and Manage for GAI systems, consult the profile's suggested actions for those subcategories. The profile tables map each GAI risk to relevant AI RMF subcategories and Trustworthy AI characteristics. [18]

For organisations already implementing the core AI RMF, the GenAI Profile is an incremental addition: extend your risk categorisation to include confabulation, data memorisation, and value chain risks; add GAI-specific test cases to your Measure activities; and ensure your Manage controls address prompt injection, output filtering, and supply chain verification.

---

## 7. Integration with Existing Risk Frameworks

The NIST AI RMF is not intended to replace your existing risk management. It is designed to integrate. NIST publishes crosswalks that map the AI RMF to other frameworks, enabling organisations to extend rather than duplicate their governance. [3]

### NIST Cybersecurity Framework (CSF) 2.0

The NIST CSF organises cybersecurity risk management around six functions: Govern, Identify, Protect, Detect, Respond, Recover. [20] The AI RMF's Govern function aligns with CSF Govern. Map corresponds to CSF Identify (understanding context and risks). Measure overlaps with Detect (monitoring and testing). Manage aligns with Protect, Respond, and Recover (controls, incident response, recovery).

**Practical integration:** If your organisation uses the CSF for cybersecurity, map your AI risk register entries to CSF subcategories. An AI system vulnerability (e.g., prompt injection) is both an AI RMF Manage concern and a CSF Detect/Protect concern. Use a single risk register with columns for both frameworks. Avoid maintaining separate AI and cyber risk registers that nobody reconciles.

### ISO/IEC 27001 (Information Security)

ISO 27001 specifies requirements for an Information Security Management System (ISMS). Many organisations are certified. The AI RMF Govern function aligns with ISO 27001's leadership and commitment requirements. Map, Measure, and Manage map to risk assessment, risk treatment, and operational controls. [21]

**Practical integration:** Extend your ISO 27001 risk assessment methodology to include AI systems. Add an AI annex to your risk assessment procedure. Include AI-specific controls (guardrails, prompt injection detection, model supply chain verification) in your Statement of Applicability where relevant. Auditors increasingly expect AI systems to be covered by the ISMS. Do not create a parallel AI governance structure that sits outside certification scope.

### ISO/IEC 42001 (AI Management System)

ISO/IEC 42001:2023 is the first international standard for AI management systems. It is certifiable, unlike the voluntary AI RMF. [22] ISO 42001 uses a Plan-Do-Check-Act structure and requires organisations to establish an AI Management System (AIMS) with policies, risk assessment, lifecycle management, and continual improvement.

**Practical integration:** The AI RMF maps closely to ISO 42001. Organisations pursuing ISO 42001 certification can use the AI RMF as an implementation guide: Govern provides the governance structure, Map and Measure provide the risk assessment methodology, and Manage provides the operational controls. [Article 5.02](/governance-risk-compliance/iso-42001-demystified/) on this site covers ISO 42001 in depth. [23] If certification is your goal, use the AI RMF to build the capability, then align documentation to ISO 42001 requirements for the audit.

### EU AI Act and sector regulation

The EU AI Act, GDPR, and sector-specific regulations (financial services, healthcare, government) impose legal obligations. The AI RMF does not replace these. It provides a risk management structure that can support compliance. Map your AI systems to regulatory risk classifications (e.g., high-risk under the EU AI Act), then use the AI RMF's Map, Measure, and Manage functions to document how you identify, assess, and treat those risks. The framework gives you a defensible process; regulation defines the minimum bar.

---

## 8. Templates and Worked Examples

This section provides templates you can adapt immediately. They are intentionally minimal: add organisation-specific fields as needed, but avoid template bloat that discourages use.

### Template 1: AI System Inventory (Map)

| Field | Example |
|-------|---------|
| **System ID** | AI-001 |
| **System name** | Customer Support Chatbot |
| **Type** | LLM application (RAG) |
| **Business owner** | Head of Customer Success |
| **Data classification** | Customer PII, account data |
| **Deployment** | Cloud API (OpenAI) |
| **External services** | CRM API, knowledge base |
| **Autonomy level** | Agentic supervised (human approval for transactions) |
| **Risk tier** | Tier 1 (critical) |
| **Security review** | Completed 2025-02 |
| **Compliance** | GDPR, PCI-DSS |

Use one row per system. Maintain in a spreadsheet or risk register tool. Update when systems are added, changed, or decommissioned.

### Template 2: AI Risk Register Entry (Manage)

| Field | Example |
|-------|---------|
| **Risk ID** | AI-RISK-012 |
| **Category** | LLM01 Prompt Injection |
| **Affected system** | AI-001 (Customer Support Chatbot) |
| **Description** | Attacker could extract system prompt containing proprietary logic and customer context via crafted prompts |
| **Likelihood** | Medium (no guardrails deployed) |
| **Impact** | High (data breach, reputational) |
| **Inherent risk** | High |
| **Current controls** | Input length limit |
| **Residual risk** | High |
| **Recommended action** | Deploy input validation, output filtering, prompt injection detection |
| **Owner** | Engineering Lead |
| **Target date** | 2025-04-30 |
| **Status** | In progress |
| **NIST function** | Map, Measure, Manage |

Map each risk to at least one AI RMF subcategory for traceability. Use standard likelihood and impact scales (e.g., 1-5) for scoring.

### Template 3: AI Governance Policy Outline (Govern)

1. **Purpose and scope.** Why this policy exists, what systems it covers.
2. **Roles and responsibilities.** Who owns AI governance, who approves adoption, who assesses risk, who responds to incidents.
3. **Risk management approach.** Alignment to NIST AI RMF (or equivalent). Reference to risk register and assessment process.
4. **Adoption and procurement.** Requirements for adopting new AI systems: inventory update, risk assessment, security review before production use.
5. **Ongoing management.** Risk register review cadence, incident response, reporting to leadership.
6. **Related documents.** Acceptable use policy, model deployment policy, data handling policy, incident response playbook.
7. **Review and approval.** Annual review, approval authority, effective date.

Keep the governance policy to two to three pages. Reference detailed procedures rather than embedding them.

### Template 4: Pre-Deployment Risk Assessment Checklist (Measure)

For each AI system before production deployment:

- [ ] Inventory entry created and reviewed
- [ ] Trust boundary mapped
- [ ] Risks categorised (OWASP Top 10, MITRE ATLAS as applicable)
- [ ] Red team or security testing completed
- [ ] Findings documented and remediated or accepted with rationale
- [ ] Guardrails and controls deployed
- [ ] Monitoring and alerting configured
- [ ] Incident response playbook updated
- [ ] Risk register updated with residual risks
- [ ] Business owner and security owner sign-off

Use this as a gate before production. Do not waive it for "pilot" deployments that process real data.

### Implementation sequence: First 90 days

If you are starting from zero, sequence as follows:

| Week | Focus | Deliverable |
|------|-------|-------------|
| 1-2 | Govern | Programme charter, roles defined |
| 3-4 | Map | AI inventory, initial risk categorisation |
| 5-8 | Map, Measure | Trust boundary mapping, first red team on highest-risk system |
| 9-10 | Manage | Risk register populated, treatment plan |
| 11-12 | Manage, Govern | Controls implemented for top risks, governance policy draft |
| Ongoing | All | Quarterly review, continuous improvement |

[Article 1.07 (Your First 90 Days)](/foundations/your-first-90-days/) provides a parallel playbook with week-by-week tasks. [5] The AI RMF gives you the framework; these templates give you the artefacts. Combine both for a practical implementation path.

---

## Footnotes

[1] NIST, "AI Risk Management Framework (AI RMF 1.0)," January 2023. https://www.nist.gov/itl/ai-risk-management-framework

[2] NIST, "AI RMF 1.0" (PDF), January 2023. https://doi.org/10.6028/NIST.AI.100-1

[3] NIST, "Crosswalks: NIST Artificial Intelligence Risk Management Framework," 2024. https://www.nist.gov/itl/ai-risk-management-framework/crosswalks-nist-artificial-intelligence-risk-management-framework

[4] Paul Lawlor, "Building an AI Security Programme from Zero," AI Security in Practice, March 2026. https://aisecurityinpractice.com/foundations/building-an-ai-security-programme/

[5] Paul Lawlor, "Your First 90 Days as an AI Security Engineer," AI Security in Practice, February 2026. https://aisecurityinpractice.com/foundations/your-first-90-days/

[6] OWASP, "OWASP Top 10 for LLM Applications 2025," 2025. https://genai.owasp.org/llm-top-10/

[7] MITRE, "ATLAS (Adversarial Threat Landscape for Artificial-Intelligence Systems)," 2024. https://atlas.mitre.org/

[8] AI Incident Database, "Incident Database," 2024. https://incidentdatabase.ai/

[9] Microsoft, "PyRIT (Python Risk Identification Tool for generative AI)," 2024. https://github.com/Azure/PyRIT

[10] Garak, "Garak: LLM Vulnerability Scanner," 2024. https://github.com/leondz/garak

[11] NIST, "NIST AI RMF Playbook," 2024. https://airc.nist.gov/airmf-resources/playbook/

[12] Paul Lawlor, "Building an AI Risk Register: Template and Worked Examples," AI Security in Practice. https://aisecurityinpractice.com/governance-risk-compliance/the-nist-ai-rmf-implementation-guide/#8-templates-and-worked-examples

[13] Meta, "Llama Guard: Safeguarding AI Models," 2024. https://github.com/meta-llama/PurpleLlama/tree/main/Llama-Guard

[14] NVIDIA, "NeMo Guardrails," 2024. https://github.com/NVIDIA/NeMo-Guardrails

[15] CISA, "JCDC AI Playbook," January 2025. https://www.cisa.gov/sites/default/files/2025-01/JCDC%20AI%20Playbook.pdf

[16] Lakera, "Lakera Guard," 2024. https://www.lakera.ai/guard

[17] Rebuff, "Rebuff: Prompt Injection Detection," 2024. https://www.getrebuff.com/

[18] NIST, "Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile (NIST AI 600-1)," July 2024. https://doi.org/10.6028/NIST.AI.600-1

[19] C2PA, "Coalition for Content Provenance and Authenticity," 2024. https://c2pa.org/

[20] NIST, "NIST Cybersecurity Framework (CSF) 2.0," February 2024. https://www.nist.gov/cyberframework

[21] ISO/IEC, "ISO/IEC 27001:2022 Information security management systems," 2022. https://www.iso.org/standard/27001

[22] ISO/IEC, "ISO/IEC 42001:2023 AI Management System," December 2023. https://www.iso.org/standard/81230.html

[23] Paul Lawlor, "ISO 42001 Demystified: Building an AI Management System," AI Security in Practice. https://aisecurityinpractice.com/governance-risk-compliance/iso-42001-demystified/
