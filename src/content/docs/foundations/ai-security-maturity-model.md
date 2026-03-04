---
title: "The AI Security Maturity Model: Where Does Your Organisation Stand?"
description: "A five-level maturity model for AI security capability with a practical self-assessment questionnaire."
sidebar:
  order: 6
---

**Series:** AI Security in Practice<br/>
**Pillar:** 1: Foundations<br/>
**Difficulty:** Beginner<br/>
**Author:** Paul Lawlor<br/>
**Date:** 21 February 2026<br/>
**Reading time:** 16 minutes

> A five-level maturity model for AI security capability, with a practical self-assessment questionnaire and a level-by-level roadmap for closing the gap between where your organisation is and where it needs to be.

---

## Table of Contents

1. [Why AI Security Needs Its Own Maturity Model](#1-why-ai-security-needs-its-own-maturity-model)
2. [The Five Dimensions of AI Security Maturity](#2-the-five-dimensions-of-ai-security-maturity)
3. [Level 1: Ad Hoc](#3-level-1-ad-hoc)
4. [Level 2: Developing](#4-level-2-developing)
5. [Level 3: Defined](#5-level-3-defined)
6. [Level 4: Managed](#6-level-4-managed)
7. [Level 5: Optimising](#7-level-5-optimising)
8. [Self-Assessment Questionnaire](#8-self-assessment-questionnaire)
9. [Roadmap: Moving From Your Current Level to the Next](#9-roadmap-moving-from-your-current-level-to-the-next)

---

## 1. Why AI Security Needs Its Own Maturity Model

Most organisations have a cybersecurity maturity model. Many have an established information security management system, possibly certified against ISO 27001. Some have well-developed software development lifecycles with embedded security practices. None of these are sufficient for AI.

The reason is architectural. Traditional software behaves deterministically: the same input produces the same output, and you can trace execution through well-defined code paths. AI systems, particularly those built on large language models, are fundamentally different. They process instructions and data as an undifferentiated token stream with no architectural boundary between them. [^1] Their outputs are non-deterministic. Their attack surface includes novel categories (prompt injection, training data poisoning, model extraction) that do not exist in traditional software. [^2] And the pace of adoption is outstripping the pace at which security teams can adapt: a 2024 McKinsey survey found that 72% of organisations had adopted AI in at least one business function, up from roughly 50% in the years prior. [^3]

Existing maturity frameworks address parts of the problem. The **NIST AI Risk Management Framework (AI RMF)** provides a voluntary governance structure organised around four functions: Govern, Map, Measure, and Manage. [^4] **ISO/IEC 42001**, the world's first AI management system standard, published in December 2023, specifies requirements for establishing and maintaining an AI Management System (AIMS) using the Plan-Do-Check-Act methodology. [^5] **Google's Secure AI Framework (SAIF)** offers six core elements for securing AI systems in production. [^6] The **OWASP Top 10 for LLM Applications** catalogues the most critical risks specific to LLM-powered systems. [^2] And **MITRE ATLAS** provides a threat taxonomy modelled on ATT&CK for adversarial attacks against AI. [^7]

What none of these provide, individually, is a way for an organisation to answer a deceptively simple question: "How mature is our AI security capability, and what should we do next?"

That is what this model provides. It synthesises the governance requirements of NIST AI RMF and ISO 42001, the technical controls recommended by OWASP and MITRE ATLAS, and practical operational experience into five progressive maturity levels. Each level has specific, checkable criteria across five dimensions. The self-assessment questionnaire in Section 8 lets you score your organisation in under fifteen minutes. The roadmap in Section 9 tells you what to prioritise to reach the next level.

---

## 2. The Five Dimensions of AI Security Maturity

The maturity model assesses capability across five dimensions. These dimensions are drawn from the NIST AI RMF's core functions [^4] and extended with operational practices that the framework identifies as essential but does not prescribe in detail.

| Dimension | What it covers | NIST AI RMF alignment |
|---|---|---|
| **Governance** | Policies, roles, responsibilities, risk appetite, executive oversight | Govern |
| **Technical Controls** | Input validation, output filtering, access controls, guardrails, supply chain security | Map, Manage |
| **Monitoring and Detection** | Logging, anomaly detection, drift monitoring, abuse detection | Measure |
| **Incident Response** | AI-specific playbooks, containment, forensics, communication | Manage |
| **Workforce and Culture** | Training, awareness, skills development, cross-functional collaboration | Govern, Map |

At each maturity level, every dimension has specific characteristics. An organisation's overall maturity level is determined by the lowest-scoring dimension, because a chain is only as strong as its weakest link. An organisation with excellent technical controls but no AI incident response playbook is not at Level 3, regardless of how sophisticated its guardrails are.

---

## 3. Level 1: Ad Hoc

**Characteristics:** No formal AI security programme. AI tools are adopted without security review. Risk is managed reactively, if at all.

This is the starting point for the majority of organisations. AI tools are in use (often introduced by individual teams or developers) but there is no coordinated security strategy for them. If you ask "who owns AI security?" and the answer is silence, you are at Level 1.

| Dimension | Level 1 indicators |
|---|---|
| **Governance** | No AI-specific security policies. No designated AI security owner. AI tool adoption decisions are made by individual teams without central oversight. |
| **Technical Controls** | No input validation or output filtering on LLM integrations. API keys stored in code or configuration files. No guardrails on model behaviour. No supply chain checks on third-party models. |
| **Monitoring and Detection** | No logging of LLM inputs, outputs, or usage patterns. No visibility into which AI tools are in use across the organisation ("shadow AI"). |
| **Incident Response** | No AI-specific incident response playbook. Security team has no procedures for handling prompt injection, data leakage through an LLM, or model compromise. |
| **Workforce and Culture** | No AI security training. Security team lacks familiarity with LLM-specific attack vectors. Developers using AI coding assistants have received no security guidance. |

**Typical organisation:** A mid-size company where development teams have adopted GitHub Copilot and individual employees use ChatGPT for various tasks. Nobody has assessed the security implications. The CISO is aware AI is being used but has no visibility into scope or risk exposure.

**Primary risk:** Uncontrolled data exposure. Without policies or technical controls, sensitive data (source code, customer information, internal documents) flows into third-party AI services with no oversight. [^2] [^8]

---

## 4. Level 2: Developing

**Characteristics:** Basic policies in place. AI tool inventory exists. Awareness is growing, but controls are inconsistent and largely manual.

The move from Level 1 to Level 2 begins when an organisation acknowledges that AI security is a distinct concern and takes the first formal steps to address it. This typically starts with a policy and an inventory.

| Dimension | Level 2 indicators |
|---|---|
| **Governance** | Acceptable use policy for AI tools published. Approved list of AI tools maintained. A named individual (or team) has responsibility for AI security, even if part-time. Basic risk assessment completed for primary AI use cases. |
| **Technical Controls** | Approved AI tools configured with available security settings (e.g., Copilot content exclusions, data retention controls). API keys managed through a secrets manager rather than hardcoded. Basic input validation on customer-facing LLM integrations. |
| **Monitoring and Detection** | Inventory of AI tools in use across the organisation. Basic usage logging enabled on primary AI platforms. Network monitoring can identify traffic to known AI service endpoints. |
| **Incident Response** | Existing incident response playbook updated to include basic AI scenarios (e.g., "sensitive data sent to unapproved AI tool"). Escalation path defined. |
| **Workforce and Culture** | AI security awareness included in general security training. Guidance document published for developers using AI coding assistants. Security team has at least one member with foundational AI security knowledge. |

**Typical organisation:** A company that has completed an initial AI risk assessment, published an acceptable use policy, and configured basic security settings on approved tools. The security team has started learning about prompt injection and LLM-specific risks but has not yet implemented dedicated technical controls.

**What NIST AI RMF says at this stage:** The Govern function focuses on establishing organisational structures, policies, and accountability mechanisms for AI risk management. [^4] At Level 2, these structures are emerging but not yet formalised.

---

## 5. Level 3: Defined

**Characteristics:** Formal AI security framework in place. Dedicated controls implemented. Processes are documented and repeatable.

Level 3 represents the point where AI security becomes a structured, repeatable discipline rather than a collection of ad hoc responses. This is the target for most organisations that are serious about AI security but are not yet in a position to invest in advanced capabilities.

| Dimension | Level 3 indicators |
|---|---|
| **Governance** | AI security policy aligned to a recognised framework (NIST AI RMF, ISO 42001, or equivalent). AI risk register maintained and reviewed quarterly. AI security requirements integrated into procurement and vendor assessment processes. Data classification policy extended to cover AI training data and model artefacts. |
| **Technical Controls** | Guardrails deployed on all production LLM endpoints (input filtering, output validation, content safety). Least-privilege access controls enforced for LLM tool calling and function execution. Supply chain controls for third-party models (provenance checks, model scanning). [^9] Secrets scanning in CI/CD pipelines covers AI-related configuration. SAST rules tuned for patterns common in AI-generated code. |
| **Monitoring and Detection** | Structured logging of all LLM interactions (prompts, responses, tool calls, latency, token usage). Alerts configured for anomalous patterns (unusual query volumes, attempts to extract system prompts, unexpected tool invocations). Dashboards provide visibility into AI system behaviour. |
| **Incident Response** | Dedicated AI incident response playbook covering prompt injection, data leakage, model compromise, and supply chain attacks. Playbook tested through tabletop exercises at least annually. AI incidents tracked and classified separately in the incident management system. |
| **Workforce and Culture** | Role-specific AI security training: developers, security engineers, architects each receive targeted content. At least one team member has completed hands-on AI red teaming training (e.g., using **PyRIT** or **Garak**). [^10] [^11] Cross-functional collaboration established between AI/ML engineers and the security team. |

**Typical organisation:** A financial services firm or technology company that has invested in AI security as a formal programme. It has deployed guardrails on its customer-facing chatbot, implemented structured logging, created an AI risk register, and runs annual tabletop exercises for AI-specific incidents.

**What ISO 42001 requires at this stage:** ISO 42001 specifies that organisations must establish policies and objectives for AI, implement processes to achieve those objectives, and maintain documentation demonstrating conformance. [^5] Level 3 aligns with the core requirements of an AI Management System, though not yet with the continuous improvement cycle that ISO 42001's Plan-Do-Check-Act model demands.

---

## 6. Level 4: Managed

**Characteristics:** Metrics-driven AI security programme. Proactive threat hunting. Quantitative risk management. Controls are measured for effectiveness.

The transition from Level 3 to Level 4 is the shift from "we have controls" to "we measure whether our controls work." This is where AI security becomes a data-driven discipline.

| Dimension | Level 4 indicators |
|---|---|
| **Governance** | AI risk management integrated into enterprise risk management. Quantitative risk metrics reported to the board (e.g., percentage of AI systems with guardrails, mean time to detect AI-specific incidents, number of unresolved findings from AI red team exercises). AI security budget is a defined line item. Regular benchmarking against industry peers and framework updates. |
| **Technical Controls** | Automated red teaming integrated into CI/CD pipelines (e.g., **Garak** scans on every model deployment). Multi-layered defence architecture with defence-in-depth: input validation, guardrails, output filtering, and downstream system hardening. Model behaviour testing (robustness, fairness, safety) automated and gated in deployment pipelines. A/B testing of guardrail configurations to optimise the balance between security and usability. |
| **Monitoring and Detection** | Real-time anomaly detection on LLM interaction patterns using baseline behavioural models. Drift monitoring on model outputs to detect degradation or manipulation. Correlation of AI system telemetry with broader security monitoring (SIEM integration). Proactive threat hunting for AI-specific attack patterns across logs. |
| **Incident Response** | AI incident response procedures tested through full simulation exercises (not only tabletops). Post-incident reviews conducted with AI-specific root cause analysis. Incident data feeds back into control improvement cycle. Defined SLAs for AI incident containment and remediation. |
| **Workforce and Culture** | Dedicated AI security roles (not bolted onto existing security positions). Internal AI red team capability with hands-on expertise in prompt injection, jailbreaking, and model attacks. Regular participation in AI security communities and conferences. Knowledge sharing programme between security team and AI/ML engineering. |

**Typical organisation:** A large technology company or regulated financial institution with a dedicated AI security team. It runs automated red team scans in its deployment pipeline, tracks quantitative metrics on AI risk, and has an internal red team that regularly tests production AI systems.

**What the NIST AI RMF Measure function requires:** The Measure function focuses on evaluating and quantifying AI risks through testing, monitoring, and performance metrics, enabling organisations to assess the extent of identified risks and track trustworthiness characteristics. [^4] Level 4 is where this function is fully operationalised.

---

## 7. Level 5: Optimising

**Characteristics:** Continuous improvement. Industry-leading practices. Contribution to the broader AI security community. Adaptive controls that evolve with the threat landscape.

Level 5 is aspirational for most organisations. It describes a state of continuous optimisation where AI security is deeply embedded in organisational culture and operations, and where the organisation contributes to advancing the field.

| Dimension | Level 5 indicators |
|---|---|
| **Governance** | AI security governance is a competitive differentiator. The organisation holds or is pursuing ISO 42001 certification. [^5] AI ethics and security considerations are integrated into product design from inception. Board-level AI committee with security representation. Active engagement with regulators and standards bodies. |
| **Technical Controls** | Adaptive guardrails that adjust based on threat intelligence and observed attack patterns. Custom detection models trained on the organisation's own attack data. Formal verification or advanced testing methodologies applied to critical AI systems. Contribution of security tools, rules, or research back to the community. |
| **Monitoring and Detection** | Predictive analytics on AI security trends from internal telemetry. Real-time threat intelligence integration specific to AI attack techniques. Automated response to detected AI-specific attacks (e.g., automatic circuit-breaker on compromised endpoints). |
| **Incident Response** | AI incident response integrated with broader crisis management and business continuity. The organisation participates in industry-wide AI incident sharing (e.g., contributing to the **AI Incident Database**). [^12] Playbooks updated continuously based on emerging threats and research. |
| **Workforce and Culture** | The organisation is recognised as an AI security thought leader. Staff publish research, speak at conferences, and contribute to open-source AI security tools. Continuous professional development with dedicated AI security certification paths. AI security skills are assessed as part of hiring and promotion for relevant roles. |

**Typical organisation:** A major cloud provider, a leading AI research lab, or a defence contractor with a dedicated AI security research programme. These organisations shape the standards and tools that the rest of the industry adopts.

---

## 8. Self-Assessment Questionnaire

Score each question on the following scale. Your maturity level is determined by the lowest-scoring dimension, because gaps in any area expose the organisation to risk.

| Score | Meaning |
|---|---|
| 0 | Not started. No awareness or action. |
| 1 | Awareness and planning. The need is recognised but implementation has not begun. |
| 2 | Partially implemented. Some action taken, but coverage is incomplete or inconsistent. |
| 3 | Fully implemented. The capability is in place across relevant systems and is documented. |
| 4 | Implemented, measured, and continuously improved. Effectiveness is tracked with metrics. |

### Governance (G)

| # | Question | Score (0-4) |
|---|---|---|
| G1 | Does your organisation have an AI-specific security policy? | |
| G2 | Is there a named owner for AI security? | |
| G3 | Do you maintain an inventory of all AI tools and systems in use? | |
| G4 | Is AI risk included in your enterprise risk register? | |
| G5 | Are AI security requirements included in procurement and vendor assessments? | |

### Technical Controls (T)

| # | Question | Score (0-4) |
|---|---|---|
| T1 | Are guardrails (input validation, output filtering) deployed on production LLM endpoints? | |
| T2 | Are least-privilege access controls enforced for LLM tool calling and API access? | |
| T3 | Do you scan third-party models for malicious payloads before deployment? | |
| T4 | Is AI-generated code subject to SAST and secrets scanning in your CI/CD pipeline? | |
| T5 | Are automated red team scans (e.g., Garak, PyRIT) part of your deployment process? | |

### Monitoring and Detection (M)

| # | Question | Score (0-4) |
|---|---|---|
| M1 | Are LLM inputs, outputs, and tool calls logged in a structured format? | |
| M2 | Do you have alerts for anomalous AI usage patterns? | |
| M3 | Can you detect shadow AI (unapproved AI tool usage) on your network? | |
| M4 | Is AI system telemetry integrated with your SIEM or security monitoring platform? | |
| M5 | Do you monitor for model output drift or degradation? | |

### Incident Response (I)

| # | Question | Score (0-4) |
|---|---|---|
| I1 | Does your incident response playbook include AI-specific scenarios? | |
| I2 | Has the playbook been tested through a tabletop or simulation exercise? | |
| I3 | Are AI incidents tracked and classified separately in your incident management system? | |
| I4 | Do post-incident reviews include AI-specific root cause analysis? | |
| I5 | Are there defined SLAs for AI incident containment? | |

### Workforce and Culture (W)

| # | Question | Score (0-4) |
|---|---|---|
| W1 | Have developers using AI coding assistants received AI security guidance? | |
| W2 | Does your security team have at least one member with AI security expertise? | |
| W3 | Is AI security included in your organisation's security awareness training? | |
| W4 | Does your team have hands-on experience with AI red teaming tools? | |
| W5 | Is there regular collaboration between your AI/ML engineering and security teams? | |

### Scoring Guide

For each dimension, calculate the average score across its five questions.

| Average score | Maturity level |
|---|---|
| 0.0 to 0.9 | Level 1: Ad Hoc |
| 1.0 to 1.9 | Level 2: Developing |
| 2.0 to 2.9 | Level 3: Defined |
| 3.0 to 3.5 | Level 4: Managed |
| 3.6 to 4.0 | Level 5: Optimising |

Your overall maturity level is the minimum across all five dimensions. Record both the overall level and the per-dimension scores. The dimensions with the lowest scores tell you where to invest first.

---

## 9. Roadmap: Moving From Your Current Level to the Next

Each transition requires a different focus. The actions below are ordered by priority within each transition.

### Level 1 to Level 2: Establish the basics

This is the most impactful transition. Moving from "no programme" to "basic programme" eliminates the most egregious risks.

1. **Publish an acceptable use policy for AI tools.** Define what is approved, what data may be shared with AI services, and who to contact with questions. This single action sets the foundation. [^4]
2. **Create an AI tool inventory.** Use network monitoring to identify traffic to known AI service endpoints. Survey teams to discover which tools are in active use. You cannot secure what you do not know about.
3. **Assign an AI security owner.** This does not need to be a full-time role. It can be a security engineer or architect who takes on AI security as an additional responsibility. The critical step is ensuring someone is accountable. [^5]
4. **Configure security settings on approved AI tools.** Enable content exclusions, disable training on your data where the option exists, enforce SSO, and review data retention settings. [^8]
5. **Add AI scenarios to your existing incident response playbook.** Start with two scenarios: "sensitive data sent to unapproved AI tool" and "customer reports prompt injection in our chatbot."

### Level 2 to Level 3: Formalise the programme

The focus shifts from basic hygiene to structured, repeatable processes.

1. **Align your AI security policy to a recognised framework.** The NIST AI RMF [^4] provides the most accessible starting point. Map your existing controls to its Govern, Map, Measure, and Manage functions to identify gaps. ISO 42001 [^5] is the target for organisations seeking certification.
2. **Deploy guardrails on all production LLM endpoints.** Implement input validation, output filtering, and content safety checks. Options range from cloud-native services like **AWS Bedrock Guardrails** to open-source tools like **NeMo Guardrails** and **LLM Guard**. [^13] [^14]
3. **Implement structured logging for LLM interactions.** Log prompts, responses, tool calls, token counts, and latency. Observability platforms like **LangFuse** and **LangSmith** can accelerate this. [^15]
4. **Build and maintain an AI risk register.** Populate it with the OWASP LLM Top 10 risks [^2] mapped to your specific AI deployments. Review quarterly.
5. **Deliver role-specific AI security training.** Generic awareness training is not enough. Developers need guidance on AI-generated code review. Architects need to understand guardrail patterns. Security engineers need hands-on experience with AI red teaming tools. [^10] [^11]

### Level 3 to Level 4: Measure and optimise

The focus shifts from "having controls" to "proving controls work."

1. **Integrate automated AI red teaming into CI/CD.** Run **Garak** scans or equivalent against LLM endpoints on every deployment. Fail the build if critical vulnerabilities are detected. [^11]
2. **Define and report quantitative AI security metrics.** Start with: percentage of AI systems with guardrails deployed, number of AI-specific incidents per quarter, mean time to detect AI-specific attacks, and coverage of AI red team testing. Report these to leadership alongside traditional security metrics.
3. **Implement drift monitoring on model outputs.** Establish baselines for model behaviour and alert on significant deviations, which may indicate model degradation, data poisoning, or adversarial manipulation.
4. **Conduct full AI incident response simulations.** Move beyond tabletop exercises to realistic simulations that test detection, containment, and recovery. Include scenarios such as indirect prompt injection through a RAG pipeline, supply chain compromise of a model dependency, and data exfiltration through a compromised AI agent.
5. **Establish an internal AI red team.** Even a small team (two to three people) with dedicated time for AI security testing will dramatically improve your ability to find and fix vulnerabilities before adversaries do.

### Level 4 to Level 5: Lead the field

This transition is about continuous improvement and community contribution.

1. **Pursue ISO 42001 certification.** [^5] Formal certification demonstrates commitment and provides an external validation of your AI management system.
2. **Build adaptive security controls** that adjust based on threat intelligence and observed attack patterns. This requires investment in custom detection models and close integration between threat intelligence and AI security operations.
3. **Contribute to the community.** Publish research, contribute to open-source AI security tools, participate in standards development, and share anonymised incident data through platforms like the AI Incident Database. [^12]
4. **Integrate AI security into product design.** Security requirements should be part of the initial design phase for any AI-powered feature, not added after development.

### Three actions to take this week

1. **Complete the self-assessment questionnaire in Section 8.** It takes fifteen minutes. Share the results with your security team and AI/ML engineering leads. The per-dimension scores will immediately show you where the gaps are.

2. **Publish a one-page AI acceptable use policy** if you do not have one already. It does not need to be comprehensive. Cover which AI tools are approved, what data must never be shared with external AI services, and who to contact with questions. This single document moves you from Level 1 to the start of Level 2.

3. **Set up a local AI security lab** by following [Article 1.03](/foundations/home-ai-security-lab/) on this site. [^16] Install **Ollama**, **PyRIT**, and **Garak**, and run your first prompt injection experiment against a local model. Hands-on experience with AI attacks builds the intuition that no maturity model can substitute for.

### Looking ahead

AI security maturity is not a destination. The threat landscape is evolving as AI systems gain more autonomy through tool calling, multi-agent architectures, and protocols like MCP. The OWASP LLM Top 10 will continue to update. New attack techniques will emerge from research. Your maturity assessment should be repeated at least annually (quarterly is better) and updated as your AI deployments change.

The frameworks referenced in this article (NIST AI RMF, ISO 42001, OWASP, MITRE ATLAS) are the current best practice for structuring your AI security programme. But frameworks alone do not make you secure. What matters is whether the policies are followed, the controls are tested, the incidents are handled, and the people are trained. The maturity model is the map. The roadmap is the route. Walking it is up to you.

---

[^1]: AI Security in Practice, ["How LLMs Work"](/foundations/how-llms-work/), Article 1.01 on this site.

[^2]: OWASP, "Top 10 for LLM Applications 2025". Available at: https://genai.owasp.org/

[^3]: McKinsey & Company, "The state of AI in early 2024: Gen AI adoption spikes and starts to generate value" (May 2024). Available at: https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai-2024

[^4]: NIST, "AI Risk Management Framework (AI RMF 1.0)", NIST AI 100-1, January 2023. Available at: https://www.nist.gov/itl/ai-risk-management-framework

[^5]: ISO/IEC, "ISO/IEC 42001:2023 Information technology — Artificial intelligence — Management system", December 2023. Available at: https://www.iso.org/standard/81230.html

[^6]: Google, "Secure AI Framework (SAIF)". Available at: https://safety.google/cybersecurity-advancements/saif/

[^7]: MITRE, "ATLAS: Adversarial Threat Landscape for AI Systems". Available at: https://atlas.mitre.org/

[^8]: AI Security in Practice, "GitHub Copilot Security: The 5 Mistakes Every Team Makes", Article 5.10 on this site.

[^9]: OWASP, "Top 10 for LLM Applications 2025: LLM03 Supply Chain". Available at: https://genai.owasp.org/llmrisk/llm032025-supply-chain/

[^10]: Microsoft, "PyRIT: Python Risk Identification Toolkit for generative AI". Available at: https://github.com/Azure/PyRIT

[^11]: NVIDIA, "Garak: LLM Vulnerability Scanner". Available at: https://github.com/NVIDIA/garak

[^12]: AI Incident Database, "The AI Incident Database". Available at: https://incidentdatabase.ai/

[^13]: NVIDIA, "NeMo Guardrails". Available at: https://github.com/NVIDIA/NeMo-Guardrails

[^14]: Protect AI, "LLM Guard". Available at: https://github.com/protectai/llm-guard

[^15]: LangFuse, "Open Source LLM Observability". Available at: https://langfuse.com/

[^16]: AI Security in Practice, ["Building a Home AI Security Lab"](/foundations/home-ai-security-lab/), Article 1.03 on this site.
