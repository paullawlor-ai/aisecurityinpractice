---
title: "EU AI Act Compliance Roadmap for AI Engineering Teams"
description: "A practical roadmap mapping the EU AI Act to engineering tasks with a phased implementation plan and compliance checklist."
sidebar:
  order: 3
---

**Series:** AI Security in Practice<br/>
**Pillar:** 5: Governance, Risk and Compliance<br/>
**Difficulty:** Intermediate<br/>
**Author:** Paul Lawlor<br/>
**Date:** 2 March 2026<br/>
**Reading time:** 18 minutes

> A practical roadmap mapping the EU AI Act to engineering tasks, with a phased implementation plan, provider and deployer obligations, and a compliance checklist you can execute by August 2026.

---

## Table of Contents

1. [When Does the EU AI Act Apply to Your Engineering Team?](#1-when-does-the-eu-ai-act-apply-to-your-engineering-team)
2. [The Four-Tier Risk Classification](#2-the-four-tier-risk-classification)
3. [Implementation Timeline: Key Dates for Engineering](#3-implementation-timeline-key-dates-for-engineering)
4. [Phase 1: Foundation (Inventory, Classification, Governance)](#4-phase-1-foundation-inventory-classification-governance)
5. [Phase 2: Provider Obligations for High-Risk AI](#5-phase-2-provider-obligations-for-high-risk-ai)
6. [Phase 3: Deployer Obligations and Transparency](#6-phase-3-deployer-obligations-and-transparency)
7. [Compliance Checklist](#7-compliance-checklist)
8. [Integration with Existing Frameworks and Further Reading](#8-integration-with-existing-frameworks-and-further-reading)

---

## 1. When Does the EU AI Act Apply to Your Engineering Team?

The **EU AI Act** (Regulation (EU) 2024/1689) entered into force in August 2024 and applies progressively through August 2027. [1] It is the first comprehensive horizontal regulation of artificial intelligence in a major jurisdiction. If your organisation places AI systems on the EU market, puts them into service in the EU, or produces outputs that are used in the Union, the Act applies regardless of where your company is established. [2]

For AI engineering teams, this has practical implications. You are not exempt because you build rather than sell. You are not exempt because you are based outside the EU. You are in scope if:

- **You are a provider.** You develop an AI system (or integrate a general-purpose model into a product) and place it on the market or put it into service under your own name or trademark. That includes in-house development teams whose systems are deployed to EU users or whose outputs affect EU-based individuals. [3]

- **You are a deployer.** You use an AI system under your authority. Even if you did not build it, if you select, configure, and operate an AI system whose outputs affect EU persons, you have deployer obligations. [4]

- **Your output is used in the Union.** An operator in the EU contracts your team to perform an activity using an AI system. The AI system may run outside the EU, but if the output is intended for use in the Union (e.g. a recommendation engine, a chatbot, a screening tool), the Act applies. [5]

Exclusions exist for military, defence, and national security purposes, and for AI systems developed solely for scientific R&D before placement on the market. [6] Product-oriented research and testing before go-live is also excluded, but the moment you place on the market or put into service, the Act applies. [7]

### Why engineering teams should care now

The Act uses a risk-based approach: obligations scale with the risk tier of your AI system. Prohibited practices are banned from February 2025. Rules for general-purpose AI and governance structures apply from August 2025. The majority of rules, including those for high-risk AI systems in Annex III, apply from **August 2026**. [8] Engineering teams building or integrating AI that could be classified as high-risk have roughly 18 months from early 2025 to design compliance into their systems. Retrofitting documentation, risk management, and testing after deployment is costly and may not satisfy conformity requirements.

This roadmap maps the EU AI Act to concrete engineering tasks. The aim is to give you a checklist you can execute, not a legal summary. For legal advice, consult your organisation's counsel.

---

## 2. The Four-Tier Risk Classification

The Act tailors obligations to the risk level of each AI system. [9] Engineering teams must classify their systems correctly. Misclassification in either direction carries cost: over-classification triggers unnecessary work; under-classification exposes the organisation to enforcement and liability.

### Unacceptable risk (prohibited)

AI systems that deploy subliminal manipulation, exploit vulnerabilities, or perform social scoring; real-time remote biometric identification in publicly accessible spaces (with narrow law-enforcement exceptions); biometric categorisation inferring sensitive attributes; emotion recognition in workplace or education; predictive policing based on profiling; and untargeted scraping of facial images. [10] These are prohibited outright. If your system falls here, you cannot place it on the market or put it into service. Engineering effort should focus on redesign or pivoting the use case.

### High risk (Article 6(1)/Annex I and Annex III)

**Article 6(1) and Annex I** cover AI systems that are safety components of products, or products themselves, subject to EU harmonisation legislation (e.g. machinery, medical devices, lifts, vehicles). [11] Annex I lists that legislation; if the product undergoes third-party conformity assessment under it, the AI component is high-risk.

**Annex III** lists stand-alone high-risk AI systems by use case. [12] Categories include:

| Category | Examples |
|----------|----------|
| **Biometrics** | Remote biometric identification (excluding mere verification/authentication), biometric categorisation by sensitive attributes, emotion recognition (where not prohibited) |
| **Critical infrastructure** | AI as safety component in digital infrastructure, road traffic, water, gas, heating, electricity supply [13] |
| **Education** | Systems determining access or admission, evaluating learning outcomes, assigning to programmes, monitoring prohibited behaviour during tests [14] |
| **Employment** | Recruitment and selection, decisions on promotion/termination, task allocation by behaviour/traits, monitoring or evaluation of workers [15] |
| **Essential services** | Determining eligibility for public benefits and services; credit scoring; insurance risk assessment and pricing; emergency call triage and dispatch [16] |
| **Law enforcement and justice** | Evidence evaluation, reliability assessment of evidence, profiling, detection/investigation of offences, and related use cases [17] |

An AI system that does not materially influence the outcome of decision-making may be treated as non-high-risk. [18] Examples include narrow procedural tasks (e.g. transforming unstructured data to structured, classifying documents, detecting duplicates), improving previously completed human work (e.g. language polishing), or detecting deviations from prior human patterns (e.g. consistency checks). Providers who conclude their system is not high-risk must document that assessment, register the system in the EU database (Article 49(2)), and provide the documentation to competent authorities on request. [19]

### Limited risk (transparency obligations)

AI systems that interact with humans, generate synthetic content, or perform emotion recognition or biometric categorisation (where not prohibited) must meet transparency requirements under Article 50. [20] Users must be informed that they are interacting with an AI system. Synthetic content (e.g. deepfakes) must be labelled. Engineering tasks include surfacing appropriate disclosures in the user interface and, where applicable, implementing content provenance (e.g. C2PA) for synthetic media.

### Minimal risk

All other AI systems. No mandatory obligations beyond general prohibitions and, where relevant, voluntary codes of conduct. [21]

### Classification as an engineering task

Create a classification register. For each AI system or planned system, record: name, intended purpose, deployment context, whether it falls under Article 6(1)/Annex I or Annex III, and the rationale. Reassess when the system, its use case, or its context changes. [Article 1.07](/foundations/your-first-90-days/) on this site covers inventory construction in depth; extend that inventory with an EU AI Act classification column. [22]

---

## 3. Implementation Timeline: Key Dates for Engineering

The Act applies in stages. [23] Engineering teams should align their roadmap to these dates.

| Date | What applies | Engineering focus |
|------|---------------|-------------------|
| **2 February 2025** | General provisions (definitions, AI literacy) and prohibitions | Audit systems against prohibited practices (Article 5). Ensure no subliminal manipulation, social scoring, or emotion recognition in workplace/education. |
| **2 August 2025** | Rules for general-purpose AI; Member State governance; EU AI Board | If you provide general-purpose AI models: documentation, evaluation, incident reporting. If you integrate such models: assess provider compliance. Designate internal ownership for AI governance. |
| **2 August 2026** | High-risk AI in Annex III; transparency (Article 50); enforcement begins | Full compliance for high-risk systems: risk management, data governance, technical documentation, human oversight, QMS, post-market monitoring. Transparency labels for limited-risk systems. |
| **2 August 2027** | High-risk AI embedded in regulated products (Article 6(1), Annex I) | Conformity for AI in machinery, medical devices, vehicles, etc., aligned with sectoral legislation. |

The Commission has proposed linking the application of high-risk rules to the availability of harmonised standards and support tools (the Digital Omnibus package). [24] Monitor the European Commission's AI Act Service Desk and FAQ for updates. Even if dates shift slightly, the sequence of obligations remains: foundation first, then technical compliance, then sector-specific embedded systems.

### Practical sequencing

- **Q1 2025:** Complete AI inventory and EU AI Act classification. Identify systems in or near high-risk categories. Form a cross-functional compliance team (engineering, legal, product, security).
- **Q2 2025:** For high-risk systems, begin gap analysis against Article 9 (risk management), Article 10 (data governance), Article 11 (technical documentation), and Article 17 (quality management). Prioritise systems with nearest go-live or highest exposure.
- **Q3 2025–Q2 2026:** Implement risk management systems, technical documentation, and data governance. Build or adapt QMS elements. Conduct conformity assessment where required.
- **By August 2026:** High-risk systems in production must be compliant. Post-market monitoring and incident reporting operational.

---

## 4. Phase 1: Foundation (Inventory, Classification, Governance)

Before implementing technical compliance, establish the foundation. Three deliverables matter most.

### 4.1 AI system inventory

You cannot classify or comply without knowing what you have. Build an inventory of all AI systems: in development, in production, and planned. For each system record:

- Name and description
- Intended purpose and deployment context
- Whether it is a product you place on the market or a system you deploy internally
- Data flows (inputs, outputs, external services)
- Business owner and technical owner
- Current EU AI Act classification (unacceptable, high-risk, limited, minimal)

[Article 1.07](/foundations/your-first-90-days/) on this site provides a detailed inventory template. [25] Extend it with EU AI Act-specific fields. Update quarterly; reassess classification when use cases or deployment contexts change.

### 4.2 Classification register

For each system, document the classification rationale. If you conclude a system is high-risk, cite the Annex II or III category. If you conclude it is not high-risk (e.g. under the "does not materially influence" exception), document that assessment. [26] Keep this register auditable: competent authorities may request it.

### 4.3 Governance and ownership

Designate an AI compliance or governance owner. In smaller organisations, this may be the CISO, CTO, or a senior engineer. In larger ones, a dedicated role or committee. Responsibilities should include: maintaining the inventory and classification register, coordinating gap analysis, driving remediation, and reporting to leadership.

Align with existing governance. The NIST AI RMF Govern function and ISO 42001 context/leadership clauses map well. [27] [28] If you already have an AI governance policy or programme charter (see [Article 1.10](/foundations/building-an-ai-security-programme/)), extend it to reference EU AI Act compliance. [29] If not, create a one-page charter that states scope, owner, authority, and reporting cadence.

### 4.4 Prohibited practices audit (by February 2025)

Before the prohibition deadline, audit every AI system against Article 5 (prohibited AI practices). Check for:

- Subliminal or manipulative techniques beyond human perception
- Exploitation of vulnerabilities (age, disability, socioeconomic situation)
- Social scoring leading to detrimental treatment
- Real-time remote biometric identification in public spaces (unless a narrow law-enforcement exception applies)
- Biometric categorisation inferring political opinions, union membership, religion, race, sex life, sexual orientation
- Emotion recognition in workplace or education
- Predictive policing based on profiling
- Untargeted scraping of facial images

If any system touches these use cases, it must be redesigned or discontinued before February 2025.

---

## 5. Phase 2: Provider Obligations for High-Risk AI

If you are a provider of a high-risk AI system, you must meet the requirements of Chapter III, Section 2. [30] This section maps those requirements to engineering tasks.

### 5.1 Risk management system (Article 9)

A risk management system must be established, implemented, documented, and maintained throughout the lifecycle. [31] It is a continuous iterative process comprising:

1. **Identify and analyse** known and reasonably foreseeable risks to health, safety, or fundamental rights when used as intended.
2. **Estimate and evaluate** risks under conditions of reasonably foreseeable misuse.
3. **Evaluate** risks from post-market monitoring data.
4. **Adopt** risk management measures to address identified risks.
5. **Test** the system to validate risk management measures.

**Engineering tasks:** Integrate risk management into your development lifecycle. Run threat modelling (or equivalent) at design, and reassess at significant changes. Document risks, mitigations, and residual risk acceptance. Use OWASP LLM Top 10 and MITRE ATLAS as taxonomies. [32] [33] Define metrics and probabilistic thresholds for testing; test before placement on the market or putting into service. Consider adverse impact on minors and vulnerable groups. [34]

### 5.2 Data governance (Article 10)

Training, validation, and testing data sets must meet quality criteria. Data governance must cover design choices, collection processes, origin, preparation (annotation, labelling, cleaning), assumptions, availability, bias assessment, and measures to detect, prevent, and mitigate bias. [35]

**Engineering tasks:** Maintain data cards or equivalent documentation. Record data lineage, provenance, and processing steps. Implement bias detection and mitigation (e.g. fairness metrics, disaggregated evaluation). Ensure data sets are relevant, representative, and, where applicable, characterised by appropriate statistical properties for the intended population. For systems not using trained models, these obligations apply to testing data sets only. [36]

### 5.3 Technical documentation (Article 11 and Annex IV)

Technical documentation must be drawn up before placement on the market or putting into service and kept up to date. It must demonstrate compliance and enable competent authorities and notified bodies to assess it. [37] Annex IV specifies minimum elements, including a description of the risk management system, data governance, design and development, human oversight, and instructions for use. [38]

**Engineering tasks:** Create and maintain a technical documentation package per high-risk system. Include: system description, intended purpose, risk management summary, data governance summary, model architecture and training approach, performance metrics, human oversight design, validation and testing results, and instructions for deployers. SMEs may use a simplified form when the Commission publishes it. [39]

### 5.4 Human oversight (Article 14)

High-risk AI systems must be designed to allow effective human oversight. Humans must understand the system's capacities and limitations, be able to interpret its output, decide when to use it, and intervene or override. [40]

**Engineering tasks:** Design interfaces that present model outputs in an interpretable way. Provide confidence scores, explanations, or uncertainty indications where feasible. Ensure deployers can override or reject outputs. Document the intended human-in-the-loop flow in technical documentation and instructions for use.

### 5.5 Quality management system (Article 17)

Providers must have a quality management system that ensures compliance. It must cover compliance strategies, design and design control, technical documentation, conformity assessment, post-market monitoring, incident handling, and communication with authorities. [41]

**Engineering tasks:** Establish or adapt a QMS for high-risk AI. Align with ISO 42001 where possible. [42] Integrate design review, documentation control, and change management. Define processes for post-market monitoring, incident reporting, and corrective action.

### 5.6 Post-market monitoring and incident reporting (Articles 72–73)

Providers must implement post-market monitoring and report serious incidents to competent authorities. [43]

**Engineering tasks:** Implement logging and monitoring for high-risk systems in production. Define what constitutes a "serious incident" for your context (e.g. harm to health, safety, or fundamental rights). Establish an incident reporting pipeline to the designated compliance owner and, where required, to authorities.

### 5.7 Conformity assessment and CE marking

High-risk AI systems must undergo conformity assessment and bear CE marking. [44] Conformity may be self-assessment (internal control) or involve a notified body, depending on the system and sector. Providers established outside the EU must designate an authorised representative in the Union. [45]

**Engineering tasks:** Support the conformity process with complete technical documentation, test results, and risk management evidence. Coordinate with legal and regulatory affairs on the choice of conformity route and engagement with notified bodies.

---

## 6. Phase 3: Deployer Obligations and Transparency

If you use an AI system under your authority (whether built in-house or procured), you are a deployer. Deployer obligations apply alongside provider obligations when you are both.

### 6.1 Deployer obligations for high-risk AI (Articles 26–29)

Deployers of high-risk AI systems must: [46]

- **Assign human oversight.** Ensure persons assigned to oversee the system have the necessary competence, training, and authority. They must understand the capabilities and limitations and be able to interpret outputs and intervene.
- **Use in accordance with instructions.** Follow the provider's instructions for use. Do not use the system for purposes or in contexts outside those specified.
- **Monitor operation.** Monitor the system's operation and report serious incidents to the provider. [47]
- **Conduct fundamental rights impact assessment (FRIA).** Public authorities and certain deployers (e.g. of systems listed in Article 29) must perform an assessment of the impact on fundamental rights before deployment. [48] The assessment identifies processes and rights concerned, risks, mitigation measures, and participation of affected persons. It must be updated when the deployer considers it necessary.

**Engineering tasks:** For in-house deployments, ensure oversight roles are assigned and trained. Implement monitoring and logging that supports incident detection and reporting. For systems requiring a FRIA, support the assessment with technical inputs (data flows, model behaviour, potential biases, mitigation controls). Document the FRIA and keep it updated.

### 6.2 Transparency obligations (Article 50)

For AI systems that interact with users, generate synthetic content, or perform emotion recognition or biometric categorisation (where not prohibited), deployers must ensure users are informed that they are interacting with an AI system. [49] Synthetic audio, image, video, or text content that could be mistaken for human-generated must be labelled. [50]

**Engineering tasks:** Implement user-facing disclosures (e.g. "You are chatting with an AI assistant"). For synthetic content, implement labelling (e.g. watermarks, metadata). Consider content provenance standards such as C2PA for synthetic media. [51] Ensure disclosures are clear, appropriate to the context, and accessible.

### 6.3 General-purpose AI and downstream providers

If you integrate a general-purpose AI model into your product, you may be a downstream provider. Your obligations depend on whether you significantly modify the model or use it for a high-risk purpose. [52] Monitor the evolving guidance from the AI Office on general-purpose AI obligations and how they flow to integrators.

**Engineering tasks:** Maintain a register of integrated models and their providers. Assess whether your use case is high-risk and whether your integration triggers provider obligations. Document model cards, evaluation reports, and limitations from upstream providers.

---

## 7. Compliance Checklist

Use this checklist to track progress. Customise by system and risk tier.

### Foundation (all organisations in scope)

| # | Task | Owner | Deadline |
|---|------|-------|----------|
| 1 | Build AI system inventory (development, production, planned) | AI governance owner | Q1 2025 |
| 2 | Classify each system: unacceptable / high-risk / limited / minimal | Security/Engineering | Q1 2025 |
| 3 | Document classification rationale; maintain classification register | AI governance owner | Ongoing |
| 4 | Designate AI compliance or governance owner | Leadership | Q1 2025 |
| 5 | Audit all systems against prohibited practices (Article 5) | Security | Feb 2025 |
| 6 | Remediate or discontinue any system touching prohibited use cases | Engineering | Feb 2025 |

### Provider obligations (high-risk AI)

| # | Task | Owner | Deadline |
|---|------|-------|----------|
| 7 | Establish risk management system (Article 9): identify, evaluate, mitigate, test | Engineering | Aug 2026 |
| 8 | Implement data governance (Article 10): data cards, bias assessment, mitigation | Engineering/Data | Aug 2026 |
| 9 | Create and maintain technical documentation (Article 11, Annex IV) | Engineering | Aug 2026 |
| 10 | Design and implement human oversight (Article 14) | Product/Engineering | Aug 2026 |
| 11 | Establish or adapt quality management system (Article 17) | Quality/AI governance | Aug 2026 |
| 12 | Implement post-market monitoring and incident reporting (Articles 72–73) | Engineering/Security | Aug 2026 |
| 13 | Complete conformity assessment; affix CE marking where required | Legal/Compliance | Aug 2026 |
| 14 | Designate EU authorised representative if provider established outside Union | Legal | Aug 2026 |

### Deployer obligations (high-risk AI)

| # | Task | Owner | Deadline |
|---|------|-------|----------|
| 15 | Assign and train human oversight personnel | Line manager | Aug 2026 |
| 16 | Implement monitoring and incident reporting to provider | Engineering | Aug 2026 |
| 17 | Conduct fundamental rights impact assessment (where required) | Legal/Compliance | Before deployment |
| 18 | Use systems in accordance with provider instructions | Operations | Ongoing |

### Transparency (limited-risk AI)

| # | Task | Owner | Deadline |
|---|------|-------|----------|
| 19 | Implement user-facing disclosure for AI interaction (Article 50) | Product/Engineering | Aug 2026 |
| 20 | Label synthetic content (audio, image, video, text) | Engineering | Aug 2026 |

### General-purpose AI (if applicable)

| # | Task | Owner | Deadline |
|---|------|-------|----------|
| 21 | Register integrated general-purpose models; assess downstream obligations | Engineering | Aug 2025 |
| 22 | Monitor provider documentation and incident reports | AI governance owner | Ongoing |

This checklist is a starting point. Adjust for your organisation's size, systems, and risk profile. SMEs and start-ups may qualify for simplified technical documentation and support through regulatory sandboxes. [53]

---

## 8. Integration with Existing Frameworks and Further Reading

The EU AI Act does not exist in isolation. Engineering teams already following the NIST AI RMF, ISO 42001, or internal AI governance will find significant overlap.

### NIST AI RMF

The NIST AI Risk Management Framework (Govern, Map, Measure, Manage) aligns well with EU AI Act requirements. [54] Article 9's risk management system maps to Map and Manage. Data governance (Article 10) and technical documentation (Article 11) support Measure. The AI RMF's GenAI Profile adds considerations for generative AI that complement the Act. [55] Use the NIST AI RMF as your risk management structure; extend it with Act-specific documentation and conformity artefacts. [Article 5.01](/governance-risk-compliance/the-nist-ai-rmf-implementation-guide/) on this site provides an implementation guide. [56]

### ISO 42001

ISO 42001 defines an AI management system. Its context, leadership, planning, support, operation, and improvement clauses provide a framework for governance, QMS, and continuous improvement. [57] Providers aiming for ISO 42001 certification can integrate EU AI Act requirements into the same management system. [Article 5.02](/governance-risk-compliance/iso-42001-demystified/) on this site covers ISO 42001 in depth. [58]

### OWASP LLM Top 10 and MITRE ATLAS

Use OWASP LLM Top 10 and MITRE ATLAS to structure risk identification. [59] [60] They map to the Act's focus on health, safety, and fundamental rights. Prompt injection, data leakage, excessive agency, and insufficient access control are directly relevant to high-risk LLM applications.

### Official sources

- **EUR-Lex:** Regulation (EU) 2024/1689 (authentic text). [1]
- **European Commission AI Act Service Desk:** Implementation timeline, FAQ, guidance. [23]
- **Harmonised standards:** The Commission will adopt harmonised standards to provide presumption of conformity. Monitor the Official Journal and standardisation bodies (CEN, CENELEC, ETSI).

### Further reading on this site

- **1.07 Your First 90 Days as an AI Security Engineer:** Inventory, trust boundaries, and early priorities. [25]
- **1.10 Building an AI Security Programme:** Governance, sponsorship, and programme construction. [29]
- **5.01 The NIST AI RMF Implementation Guide:** Step-by-step Govern, Map, Measure, Manage. [56]
- **5.02 ISO 42001 Demystified:** AI management system implementation. [58]
- **5.05 Building an AI Risk Register:** Risk register template and worked examples. [61]

The EU AI Act is complex, but the engineering work is tractable. Start with inventory and classification. Prioritise high-risk systems. Build risk management and documentation into your lifecycle. Integrate with frameworks you already use. By August 2026, your high-risk systems should be compliant and your organisation prepared for enforcement.

---

## Footnotes

[1] European Union, "Regulation (EU) 2024/1689 (Artificial Intelligence Act)," EUR-Lex. https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689

[2] EU AI Act, Article 2 (Scope).

[3] EU AI Act, Article 3(1) (Definitions: provider).

[4] EU AI Act, Article 3(4) (Definitions: deployer).

[5] EU AI Act, recitals 22–23 (extra-territorial application).

[6] EU AI Act, Article 2(2)–(3) (exclusions).

[7] EU AI Act, recital 25 (R&D exclusion).

[8] European Commission, "Timeline for the Implementation of the EU AI Act," AI Act Service Desk. https://ai-act-service-desk.ec.europa.eu/en/ai-act/eu-ai-act-implementation-timeline

[9] EU AI Act, recital 26 (risk-based approach).

[10] EU AI Act, Article 5 (prohibited AI practices).

[11] EU AI Act, Article 6(1) and Annex I (high-risk AI in products; Annex I lists Union harmonisation legislation).

[12] EU AI Act, Annex III (stand-alone high-risk AI systems).

[13] EU AI Act, Annex III, point 2 (critical infrastructure).

[14] EU AI Act, Annex III, point 3 (education).

[15] EU AI Act, Annex III, point 4 (employment).

[16] EU AI Act, Annex III, point 5 (essential services).

[17] EU AI Act, Annex III, point 6 (law enforcement and justice).

[18] EU AI Act, Article 6(3) (non-material influence).

[19] EU AI Act, Article 6(4) (documentation, EU database registration under Article 49(2), and provision to authorities on request).

[20] EU AI Act, Article 50 (transparency obligations).

[21] EU AI Act, recital 26 (minimal risk).

[22] Paul Lawlor, "Your First 90 Days as an AI Security Engineer," AI Security in Practice. https://aisecurityinpractice.com/foundations/your-first-90-days/

[23] European Commission, "Timeline for the Implementation of the EU AI Act," AI Act Service Desk. https://ai-act-service-desk.ec.europa.eu/en/ai-act/eu-ai-act-implementation-timeline

[24] European Commission, "AI Act FAQ: Digital Omnibus," AI Act Service Desk. https://ai-act-service-desk.ec.europa.eu/en/faq

[25] Paul Lawlor, "Your First 90 Days as an AI Security Engineer," AI Security in Practice. https://aisecurityinpractice.com/foundations/your-first-90-days/

[26] EU AI Act, Article 6(4).

[27] NIST, "AI Risk Management Framework," 2023. https://www.nist.gov/itl/ai-risk-management-framework

[28] ISO/IEC, "ISO/IEC 42001:2023 AI Management System." https://www.iso.org/standard/81230.html

[29] Paul Lawlor, "Building an AI Security Programme," AI Security in Practice. https://aisecurityinpractice.com/foundations/building-an-ai-security-programme/

[30] EU AI Act, Chapter III, Section 2 (requirements for high-risk AI systems).

[31] EU AI Act, Article 9 (risk management system).

[32] OWASP, "Top 10 for LLM Applications," 2025. https://owasp.org/www-project-top-10-for-large-language-model-applications/

[33] MITRE, "ATLAS: Adversarial Threat Landscape for Artificial-Intelligence Systems." https://atlas.mitre.org/

[34] EU AI Act, Article 9(9) (minors and vulnerable groups).

[35] EU AI Act, Article 10 (data and data governance).

[36] EU AI Act, Article 10(6) (systems not using trained models).

[37] EU AI Act, Article 11 (technical documentation).

[38] EU AI Act, Annex IV (elements of technical documentation).

[39] EU AI Act, Article 11(2) (simplified documentation for SMEs).

[40] EU AI Act, Article 14 (human oversight).

[41] EU AI Act, Article 17 (quality management system).

[42] ISO/IEC, "ISO/IEC 42001:2023 AI Management System." https://www.iso.org/standard/81230.html

[43] EU AI Act, Articles 72–73 (post-market monitoring and incident reporting).

[44] EU AI Act, recital 129 (CE marking).

[45] EU AI Act, Article 22 (authorised representatives).

[46] EU AI Act, Articles 26–29 (deployer obligations).

[47] EU AI Act, Article 72 (post-market monitoring).

[48] EU AI Act, Article 29 (fundamental rights impact assessment).

[49] EU AI Act, Article 50(1) (transparency for AI interaction).

[50] EU AI Act, Article 50(2) (labelling of synthetic content).

[51] C2PA, "Coalition for Content Provenance and Authenticity." https://c2pa.org/

[52] EU AI Act, Chapter V (general-purpose AI).

[53] EU AI Act, Article 53 (regulatory sandboxes).

[54] NIST, "AI Risk Management Framework," 2023. https://www.nist.gov/itl/ai-risk-management-framework

[55] NIST, "NIST AI 600-1: GenAI Profile," July 2024. https://doi.org/10.6028/NIST.AI.600-1

[56] Paul Lawlor, "The NIST AI RMF Implementation Guide," AI Security in Practice. https://aisecurityinpractice.com/governance-risk-compliance/the-nist-ai-rmf-implementation-guide/

[57] ISO/IEC, "ISO/IEC 42001:2023 AI Management System." https://www.iso.org/standard/81230.html

[58] Paul Lawlor, "ISO 42001 Demystified," AI Security in Practice. https://aisecurityinpractice.com/governance-risk-compliance/iso-42001-demystified/

[59] OWASP, "Top 10 for LLM Applications," 2025. https://owasp.org/www-project-top-10-for-large-language-model-applications/

[60] MITRE, "ATLAS." https://atlas.mitre.org/

[61] Paul Lawlor, "Building an AI Risk Register," AI Security in Practice. https://aisecurityinpractice.com/governance-risk-compliance/the-nist-ai-rmf-implementation-guide/#8-templates-and-worked-examples
