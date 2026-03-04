---
title: "ISO 42001 Demystified: Building an AI Management System"
description: "A practical implementation guide to ISO/IEC 42001:2023, the world's first certifiable AI management system standard."
sidebar:
  order: 2
---

**Series:** AI Security in Practice<br/>
**Pillar:** 5: Governance, Risk and Compliance<br/>
**Difficulty:** Intermediate<br/>
**Author:** Paul Lawlor<br/>
**Date:** 2 March 2026<br/>
**Reading time:** 18 minutes

> A practical implementation guide to ISO/IEC 42001:2023, the world's first certifiable AI management system standard, with step-by-step tasks for each clause and integration paths for NIST AI RMF and ISO 27001.

---

## Table of Contents

1. [What ISO 42001 Is and Who It Applies To](#1-what-iso-42001-is-and-who-it-applies-to)
2. [Context, Leadership, and Planning (Clauses 4–6)](#2-context-leadership-and-planning-clauses-46)
3. [Support: Resources, Competence, and Documentation (Clause 7)](#3-support-resources-competence-and-documentation-clause-7)
4. [Operations: AI Lifecycle and Risk Management (Clause 8)](#4-operations-ai-lifecycle-and-risk-management-clause-8)
5. [Performance Evaluation and Internal Audit (Clause 9)](#5-performance-evaluation-and-internal-audit-clause-9)
6. [Improvement and Continual Improvement (Clause 10)](#6-improvement-and-continual-improvement-clause-10)
7. [The Certification Path](#7-the-certification-path)
8. [Integration with NIST AI RMF and ISO 27001](#8-integration-with-nist-ai-rmf-and-iso-27001)

---

## 1. What ISO 42001 Is and Who It Applies To

**ISO/IEC 42001:2023** is the world's first international standard for Artificial Intelligence Management Systems (AIMS). Published in December 2023 by ISO and IEC, it specifies requirements for establishing, implementing, maintaining, and continually improving an AI management system within organisations of any size. [1] Unlike voluntary frameworks such as the NIST AI RMF, ISO 42001 is **certifiable**. An accredited certification body can audit your organisation and issue a certificate that demonstrates conformance to the standard. Procurement questionnaires, regulators, and customers increasingly ask for such proof.

The standard defines an AI management system as "a set of interrelated or interacting elements of an organisation intended to establish policies and objectives, as well as processes to achieve those objectives, in relation to the responsible development, provision or use of AI systems." [2] In practice, that means documented policies, risk assessment processes, lifecycle controls, and continual improvement mechanisms. The standard uses the **Plan-Do-Check-Act (PDCA)** methodology familiar from ISO 9001 (quality), ISO 27001 (information security), and ISO 14001 (environmental management). If your organisation already runs certified management systems, ISO 42001 will feel structurally familiar.

### Who ISO 42001 applies to

ISO 42001 is designed for organisations of any size that develop, provide, or use AI-based products or services. [3] That includes:

- **Organisations building AI systems in-house.** Software teams integrating large language models, ML engineers training and deploying models, and platform teams standing up AI infrastructure all fall within scope.

- **Organisations procuring AI.** If you buy AI-powered tools (coding assistants, chatbots, analytics platforms), the standard's requirements for supply chain and vendor management apply. You are responsible for how you use those tools, even if you did not build them.

- **Organisations using AI without formal adoption.** Shadow AI is pervasive. Employees use ChatGPT, Copilot, and other tools whether or not you have policies. ISO 42001 requires you to understand the context of AI use and manage associated risks.

The standard is applicable across all industries and is relevant for public sector agencies, companies, and non-profits. [3] It does not prescribe specific AI technologies: whether you use large language models, computer vision, recommendation engines, or traditional machine learning, the management system requirements apply.

### Why ISO 42001 matters for security practitioners

For security teams, ISO 42001 offers several advantages. First, it provides a structured, auditable way to govern AI risk. Unlike ad-hoc governance documents, the standard requires defined processes, documented evidence, and periodic review. Second, certification delivers third-party assurance that you have implemented those processes. Third, the standard aligns with other frameworks you may already use: it shares the Annex SL high-level structure with ISO 27001, and its risk-based approach maps closely to the NIST AI RMF. [4] If you are building AI governance from scratch, ISO 42001 gives you a certifiable target. If you have already implemented the NIST AI RMF, ISO 42001 certification may be within reach with documentation alignment.

---

## 2. Context, Leadership, and Planning (Clauses 4–6)

ISO 42001 follows the **Annex SL** high-level structure used by ISO 27001 and other management system standards. Clauses 4 to 6 establish the foundation: understanding your context, securing leadership commitment, and planning your AI management system.

### Clause 4: Context of the organisation

You must determine the internal and external issues that are relevant to your AI management system and the needs and expectations of interested parties. [5] In practice, that means:

- **Internal issues.** What AI systems does your organisation develop, procure, or use? What is your organisational structure, culture, and risk appetite? What existing governance (IT, security, compliance) do you have?

- **External issues.** What regulatory requirements apply (EU AI Act, sector rules, data protection)? What are industry expectations for AI governance? What competitive or reputational pressures exist?

- **Interested parties.** Who cares about your AI systems? Customers, regulators, employees, investors, suppliers. Document what they need and expect. Customers may expect transparency about AI use; regulators may require risk assessments; employees may need training.

**Deliverable:** A context analysis document (often 2–4 pages) that summarises these factors and explains how they influence your AI management system. This becomes the basis for scoping and planning.

### Clause 5: Leadership and commitment

Top management must demonstrate leadership and commitment to the AI management system. [5] This is not symbolic. The standard requires:

- Establishing an **AI policy** that is appropriate to the purpose of the organisation and supports your strategic direction.

- Ensuring the AI policy includes a commitment to continual improvement and fulfilment of applicable legal and other requirements.

- Assigning **roles and responsibilities** for the AI management system.

- Ensuring the necessary resources are available.

**Implementation task:** Secure explicit commitment from top management. That typically means a signed AI policy, a designated AI management system owner (often the CISO, CTO, or a dedicated AI governance role), and a formal mandate to implement the system. Without leadership backing, the management system becomes shelfware.

### Clause 6: Planning

Planning covers risk and opportunity assessment, AI management system objectives, and planning to achieve those objectives. [5]

**Risk assessment.** You must establish, implement, and maintain processes to assess risks and opportunities related to AI systems. The standard does not prescribe a specific methodology. You can use the NIST AI RMF, ISO/IEC 23894 (guidance on AI risk management), or an adaptation of your existing risk assessment process. [6] The key is documented, repeatable risk assessment that addresses AI-specific risks (bias, transparency, security, data, supply chain, etc.).

**Objectives.** Define measurable objectives for the AI management system. Examples: "Complete risk assessments for all AI systems in scope by Q2," "Reduce AI-related incidents by 25% year-on-year," "Achieve ISO 42001 certification by [date]." Objectives should be consistent with your AI policy and measurable where practicable.

**Deliverables:** AI policy (signed by leadership), roles and responsibilities matrix (RACI), risk assessment methodology, documented risks and opportunities, and AI management system objectives with target dates.

---

## 3. Support: Resources, Competence, and Documentation (Clause 7)

Clause 7 addresses the resources, competence, awareness, communication, and documented information needed to run the AI management system. [5]

### Resources

You must determine and provide the resources needed to establish, implement, maintain, and continually improve the AI management system. That includes people, infrastructure, technology, and financial resources. For security practitioners, this means securing budget for guardrails, monitoring tools, red team activities, training, and (if pursuing certification) external audit. Document how resources are allocated. Without allocated resources, the AI policy and risk assessments remain theoretical.

### Competence

You must determine the competence necessary for personnel performing work that affects AI management system performance, ensure they are competent, and retain appropriate records. [5] AI governance and AI security require specific skills: understanding of AI/ML concepts, risk assessment, prompt injection and other AI-specific threats, and familiarity with relevant standards. Competence can be demonstrated through education, training, or experience. Define competency requirements for key roles (AI governance owner, AI security assessor, developers integrating AI) and maintain records of how those requirements are met.

### Awareness

Personnel must be aware of the AI policy, their contribution to the effectiveness of the AI management system, and the implications of not conforming. [5] That implies training or communication programmes. At minimum, staff who develop, deploy, or use AI systems should understand: what AI systems are in scope, the AI policy, how to report AI incidents, and their responsibilities. Awareness does not require everyone to become an AI expert. It requires that relevant people know enough to act appropriately.

### Documented information

ISO 42001 requires you to control documented information. [5] That includes:

- **Documents required by the standard.** AI policy, context analysis, risk assessment results, objectives, procedures for key processes, and records of training, audits, and management reviews.

- **Documents necessary for the effectiveness of the AI management system.** These are organisation-specific. They may include: AI system inventory, risk register, incident response procedures, supplier assessment criteria, and control documentation.

Establish a document control procedure: creation, review, approval, distribution, and retention. Use your existing document management system (SharePoint, Confluence, etc.) if it meets the control requirements. Avoid creating a parallel documentation structure that nobody maintains.

### Implementation tasks

| Task | Owner | Deliverable |
|------|-------|-------------|
| Allocate resources (budget, FTE) | Leadership | Resource allocation record |
| Define competency requirements | AI governance owner | Competency matrix |
| Deliver awareness training | HR / AI governance | Training records |
| Implement document control | Quality / AI governance | Document control procedure, document register |

---

## 4. Operations: AI Lifecycle and Risk Management (Clause 8)

Clause 8 is the operational heart of the standard. It covers AI system development and deployment, data management, human oversight, transparency, and incident response. [5] For security practitioners, this is where technical controls meet governance.

### AI system lifecycle

You must plan, implement, and control the processes needed to meet AI management system requirements. The standard addresses the full lifecycle from conception through deployment, operation, and decommissioning. Key operational requirements include:

- **Risk treatment.** Actions to address risks and opportunities identified in planning. For each significant risk, you must plan and implement treatment. That may mean implementing controls (guardrails, access control, monitoring), transferring risk (contracts, insurance), or accepting risk with documented rationale.

- **AI system development and deployment.** Controls for the development, provision, and use of AI systems. The standard does not prescribe specific technical controls. It requires that you have defined processes. In practice, that includes: design review, data governance, model validation, security testing (including red team for LLM applications), deployment approval, and change management.

- **Data management.** Requirements for data used in or generated by AI systems. Data quality, privacy, and security are in scope. Map your AI systems to data classifications. Ensure training data, inference data, and outputs are handled according to your policies and applicable law.

### Human oversight

The standard requires appropriate human oversight of AI systems. [5] What "appropriate" means depends on context. For a coding assistant with access to production systems, human oversight may include: approval workflows for sensitive actions, monitoring of tool invocations, and incident escalation. For a customer-facing chatbot with limited agency, oversight may be lighter. Document your approach. Justify the level of oversight for each AI system based on risk.

### Transparency

Organisations must consider transparency in relation to AI systems. [5] That includes: disclosing when users interact with AI, explaining capabilities and limitations where practicable, and providing information that supports accountability. For security, transparency overlaps with logging and auditability. Ensure you can explain what an AI system did, why, and with what data. That supports incident response and regulatory inquiry.

### Incident response

You must establish processes to detect, respond to, and learn from AI-related incidents. [5] AI incidents differ from traditional security incidents. Prompt injection, data leakage through an LLM, model compromise, and supply chain attacks require specific playbooks. Define: detection triggers, containment steps (e.g., disable affected system, revoke API keys), forensics (preserve logs, prompts, outputs), communication (internal and external), and post-incident review. The CISA JCDC AI Playbook and AI Incident Database offer useful references. [7] [8]

### Worked example: Operational controls for a customer-facing chatbot

A financial services firm deploys a chatbot that answers account queries and can initiate transactions. Operational controls under Clause 8 might include:

| Requirement | Implementation |
|-------------|----------------|
| Risk treatment | Prompt injection mitigation (input validation, output filtering), excessive agency control (human approval for transactions) |
| Development controls | Security review before deployment, red team testing for prompt injection, change management for model or prompt updates |
| Data management | PII handling per policy, session data retention limits, no training on customer data without consent |
| Human oversight | Human approval for transactions above threshold, monitoring dashboard for anomalous tool invocations |
| Transparency | User disclosure that they are interacting with AI, clear explanation of transaction capabilities |
| Incident response | Playbook for prompt injection detection, containment (disable chatbot or restrict tools), forensics (preserve prompts and responses), breach notification if PII exposed |

Document these controls in procedures and maintain evidence that they are implemented and effective.

---

## 5. Performance Evaluation and Internal Audit (Clause 9)

Clause 9 covers monitoring, measurement, internal audit, and management review. [5] This is the "Check" phase of PDCA: ensuring the AI management system is working and improving.

### Monitoring and measurement

You must determine what to monitor and measure, and the methods for doing so. The standard requires monitoring of the performance and effectiveness of the AI management system. For security practitioners, that typically includes:

- **AI system metrics.** Input/output volumes, error rates, latency, confabulation or hallucination rates where measurable.

- **Risk indicators.** Number of open high-risk findings, time to remediate, incident frequency.

- **Process metrics.** Number of AI systems in inventory, percentage with completed risk assessments, training completion rates.

Define metrics that are meaningful (they reflect actual risk or effectiveness), measurable (you can collect the data), and communicable (leadership can understand them). Avoid measuring everything. Start with a small set and expand as the system matures.

### Internal audit

You must conduct internal audits at planned intervals to determine whether the AI management system conforms to the standard and is effectively implemented and maintained. [5] Internal auditors must be impartial and objective. They cannot audit their own work. If your organisation has an internal audit function, extend its scope to include the AI management system. If not, consider external support for the first audit cycle.

The audit should cover all clauses of the standard. Prepare by mapping each clause to your documentation and processes. Auditors will look for: evidence that processes exist, evidence that they are followed, and evidence of improvement. Gaps (nonconformities) must be documented and addressed.

### Management review

Top management must review the AI management system at planned intervals to ensure its continuing suitability, adequacy, and effectiveness. [5] The management review must consider: status of actions from previous reviews, changes in context, audit results, feedback from interested parties, and the performance of the AI management system. Outputs must include decisions related to continual improvement and resource needs.

**Implementation:** Schedule management reviews at least annually. Prepare a standard agenda aligned to the standard's requirements. Document attendance, inputs, discussions, and outputs. Follow up on actions. Management review is not a box-ticking exercise. It is the forum where leadership decides whether the AI management system is working and what to change.

### Deliverables

| Deliverable | Owner | Cadence |
|-------------|-------|---------|
| Monitoring and measurement plan | AI governance owner | Documented once, updated as needed |
| Metrics report | AI governance owner | Quarterly or as defined |
| Internal audit programme | Internal audit / AI governance | Annual minimum |
| Internal audit report | Internal audit | Per audit |
| Management review records | Leadership | Annual minimum |

---

## 6. Improvement and Continual Improvement (Clause 10)

Clause 10 addresses nonconformity, corrective action, and continual improvement. [5] This is the "Act" phase of PDCA: closing the loop when things go wrong or when there is opportunity to improve.

### Nonconformity and corrective action

When a nonconformity occurs, you must react to it and take action to control and correct it. You must also evaluate the need for action to eliminate the cause so that it does not recur. [5] In practice:

- **Detect.** Nonconformities may be found through internal audit, external audit, incident investigation, or day-to-day operations. A nonconformity is a failure to meet a requirement of the standard or your own procedures.

- **Contain.** Take immediate action to control the impact. For an AI incident, that might mean disabling an affected system or restricting access.

- **Correct.** Fix the immediate problem. Restore the system to a conforming state.

- **Root cause.** Determine why the nonconformity occurred. Use techniques such as 5 Whys, fishbone analysis, or simply asking "what process or control failed?"

- **Corrective action.** Implement changes to prevent recurrence. That may involve updating procedures, adding controls, or improving training. Document the action and verify effectiveness.

### Continual improvement

You must continually improve the suitability, adequacy, and effectiveness of the AI management system. [5] Continual improvement is not a one-off project. It is ongoing. It can come from:

- Addressing nonconformities and corrective actions.

- Acting on audit findings and management review decisions.

- Responding to changes in context (new AI systems, new regulations, new threats).

- Proactively identifying opportunities (better tools, more efficient processes, clearer documentation).

The standard does not prescribe how to improve. It requires that you have a culture and process that supports improvement. Document improvements. Track trends. Show that the system is getting better over time.

### Worked example: Corrective action for a prompt injection incident

An attacker extracts the system prompt from your customer-facing chatbot via crafted input. The incident is contained (chatbot restricted, logs preserved). Corrective action might include:

1. **Immediate correction.** Deploy input validation and output filtering to prevent further extraction. Restore full chatbot operation once controls are verified.

2. **Root cause analysis.** The system had no prompt injection controls. Risk assessment had identified the risk but treatment was deprioritised. Pre-deployment security testing did not include prompt injection scenarios.

3. **Corrective actions.** (a) Implement prompt injection detection (e.g., Lakera Guard, Rebuff) and output filtering. [9] [10] (b) Update the pre-deployment checklist to require prompt injection testing. (c) Reprioritise the risk register: prompt injection moved to "must mitigate before production." (d) Brief the development team on prompt injection and update training materials.

4. **Verification.** Re-run red team testing. Confirm controls block the original attack. Close the corrective action when verified. Document in the management review that the incident drove improvement.

---

## 7. The Certification Path

ISO 42001 certification is performed by **accredited certification bodies**. These are independent organisations accredited by national accreditation bodies (e.g., UKAS in the UK, ANAB in the US) to audit against ISO standards. [11] Certification is optional. You can implement the standard without certifying. But certification delivers third-party assurance that customers and regulators increasingly expect.

### Certification process

The typical process has two stages: [11]

**Stage 1 (Documentation review).** The auditor reviews your documented AI management system. They check that you have the required documentation: AI policy, context analysis, risk assessment methodology and results, objectives, procedures, and records. They identify gaps before the on-site audit. Resolve critical gaps before Stage 2.

**Stage 2 (On-site audit).** The auditor visits your organisation (or conducts remote audits where accepted) to verify that your processes are implemented and effective. They interview personnel, sample records, and trace processes from documentation to practice. They look for evidence, not claims. At the end, they report findings. Minor nonconformities may not block certification but must be addressed. Major nonconformities typically require correction and re-audit before certification can be granted.

**Surveillance and recertification.** Certificates are typically valid for three years. Annual surveillance audits verify continued conformance. At the end of the three-year cycle, a recertification audit is required.

### Preparation tips

- **Run a gap assessment first.** Before engaging a certification body, conduct an internal assessment against the standard. Use a checklist derived from the clauses. Identify gaps and plan remediation. Do not wait until the audit to discover missing documentation.

- **Align scope.** Define the scope of your AI management system clearly. Scope can be the whole organisation or a defined part (e.g., "AI systems developed and operated by the Product division"). The scope must be realistic: you must be able to demonstrate conformance for everything in scope.

- **Evidence matters.** Auditors work from evidence. "We do that" is not evidence. Provide documented procedures, completed records, training logs, audit reports, and management review minutes. Organise your evidence so auditors can find it quickly.

- **Consider a pre-assessment.** Some certification bodies offer pre-assessments (sometimes called "gap audits") that simulate the certification process without issuing a certificate. A pre-assessment can reveal gaps and build confidence before the formal audit.

### Who is certified today

Microsoft 365 Copilot and Microsoft 365 Copilot Chat were among the first products to achieve ISO 42001 certification. [12] Microsoft's certification covers the lifecycle management of those services. Organisations using Copilot can reference this in their own compliance efforts, but they remain responsible for their implementation and for engaging an assessor to evaluate their controls. As the standard matures, expect more vendors and enterprises to pursue certification.

---

## 8. Integration with NIST AI RMF and ISO 27001

ISO 42001 does not exist in isolation. It integrates with frameworks you may already use. Understanding these connections reduces duplication and strengthens your overall governance.

### NIST AI RMF

The NIST AI Risk Management Framework is voluntary and not certifiable. ISO 42001 is certifiable. The two are complementary. [4] The NIST AI RMF organises risk management around four functions: Govern, Map, Measure, Manage. ISO 42001 organises around Plan-Do-Check-Act and Annex SL clauses. The mapping is close:

| NIST AI RMF | ISO 42001 |
|-------------|-----------|
| Govern | Clauses 4 (Context), 5 (Leadership), 6 (Planning) |
| Map | Clause 6 (Risk assessment), Clause 8 (AI system context) |
| Measure | Clause 8 (Operational controls), Clause 9 (Monitoring) |
| Manage | Clause 8 (Risk treatment, incident response), Clause 10 (Corrective action) |

**Practical approach:** Use the NIST AI RMF as your implementation guide. [Article 5.01](/governance-risk-compliance/the-nist-ai-rmf-implementation-guide/) on this site provides step-by-step tasks for each function. [13] Build your AI risk management capability using the NIST structure. When you are ready for certification, align your documentation to ISO 42001 requirements. Your NIST-based risk register, inventory, and controls map directly. You may need to reorganise documents and add explicit references to the standard, but you are not starting from scratch.

### ISO 27001 (Information Security)

ISO 42001 and ISO 27001 share the Annex SL structure. Both require context analysis, leadership commitment, risk assessment, operational controls, and continual improvement. [14] If your organisation is certified to ISO 27001, you already have: a documented risk assessment process, a Statement of Applicability (or equivalent), internal audit, and management review. You can extend rather than duplicate.

**Integration options:**

1. **Integrated management system.** Run a single management system that addresses both information security and AI. Add AI-specific requirements to your existing processes. Extend your risk assessment to include AI systems. Add an AI annex to your risk methodology. Include AI controls in your control framework. Audits can cover both standards in a single engagement (if your certification body supports it).

2. **Separate but aligned.** Maintain separate AI and ISMS documentation but align structure, terminology, and interfaces. Use the same document control, internal audit schedule, and management review. Avoid conflicting requirements.

The ISO/IEC package of ISO 42001 and ISO 27001 is sold together for a reason. [15] AI systems are information systems. Many AI risks (data leakage, unauthorised access, supply chain) overlap with information security. An integrated approach is often more efficient than running parallel programmes.

### EU AI Act

The EU AI Act imposes legal obligations on AI systems placed on the EU market. [16] ISO 42001 is a management system standard; it does not replace legal requirements. However, implementing ISO 42001 supports compliance. The standard's requirements for risk assessment, transparency, human oversight, and incident response align with the Act's expectations for high-risk AI systems. Organisations subject to the EU AI Act can use ISO 42001 as a structured way to implement many of the Act's governance and documentation requirements. [Article 5.03](/governance-risk-compliance/eu-ai-act-compliance-roadmap-for-ai-engineering-teams/) on this site maps the EU AI Act to engineering tasks. [17]

---

ISO 42001 demystified: it is a management system standard, not a technical specification. It requires you to establish policies, assess risks, implement controls, and continually improve. The structure is familiar if you know ISO 27001. The content is AI-specific. For security practitioners building AI governance, it offers a certifiable target and a clear path from implementation to assurance.

---

## Footnotes

[1] ISO/IEC, "ISO/IEC 42001:2023 AI management systems," December 2023. https://www.iso.org/standard/81230.html

[2] ISO/IEC, "ISO/IEC 42001:2023 AI management systems," December 2023. https://www.iso.org/standard/81230.html

[3] ISO/IEC, "ISO/IEC 42001:2023 AI management systems," December 2023. https://www.iso.org/standard/81230.html

[4] NIST, "Crosswalks: NIST Artificial Intelligence Risk Management Framework," 2024. https://www.nist.gov/itl/ai-risk-management-framework/crosswalks-nist-artificial-intelligence-risk-management-framework

[5] ISO/IEC, "ISO/IEC 42001:2023 AI management systems," December 2023. https://www.iso.org/standard/81230.html

[6] ISO/IEC, "ISO/IEC 23894:2023 Guidance on AI risk management," 2023. https://www.iso.org/standard/77304.html

[7] CISA, "JCDC AI Playbook," January 2025. https://www.cisa.gov/sites/default/files/2025-01/JCDC%20AI%20Playbook.pdf

[8] AI Incident Database, "Incident Database," 2024. https://incidentdatabase.ai/

[9] Lakera, "Lakera Guard," 2024. https://www.lakera.ai/guard

[10] Rebuff, "Rebuff: Prompt Injection Detection," 2024. https://www.getrebuff.com/

[11] ISO, "Conformity assessment," 2024. https://www.iso.org/conformity-assessment.html

[12] Microsoft, "ISO/IEC 42001:2023 Artificial intelligence management system," 2025. https://learn.microsoft.com/en-us/compliance/regulatory/offering-iso-42001

[13] Paul Lawlor, "The NIST AI RMF Implementation Guide," AI Security in Practice. https://aisecurityinpractice.com/governance-risk-compliance/the-nist-ai-rmf-implementation-guide/

[14] ISO/IEC, "ISO/IEC 27001:2022 Information security management systems," 2022. https://www.iso.org/standard/27001.html

[15] ISO/IEC, "ISO/IEC 42001:2023 AI management systems," December 2023. https://www.iso.org/standard/81230.html

[16] European Parliament, "EU AI Act," 2024. https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689

[17] Paul Lawlor, "EU AI Act Compliance Roadmap for AI Engineering Teams," AI Security in Practice. https://aisecurityinpractice.com/governance-risk-compliance/eu-ai-act-compliance-roadmap-for-ai-engineering-teams/
