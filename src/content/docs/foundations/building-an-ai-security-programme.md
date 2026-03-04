---
title: "Building an AI Security Programme from Zero"
description: "The construction manual for the person whose CISO said 'you own AI security now, build something,' covering executive sponsorship, AI asset inventory, first policies, initial controls, engineering relationships, and measuring progress."
sidebar:
  order: 10
---

**Series:** AI Security in Practice<br/>
**Pillar:** 1: Foundations<br/>
**Difficulty:** Intermediate<br/>
**Author:** Paul Lawlor<br/>
**Date:** 1 March 2026<br/>
**Reading time:** 20 minutes

> The construction manual for the person whose CISO said "you own AI security now, build something," covering executive sponsorship, AI asset inventory, first policies, initial controls, engineering relationships, and measuring progress.

---

## Table of Contents

1. [Getting Executive Sponsorship: Framing AI Security as a Business Enabler](#1-getting-executive-sponsorship-framing-ai-security-as-a-business-enabler)
2. [Inventorying AI Usage Including Shadow AI](#2-inventorying-ai-usage-including-shadow-ai)
3. [Writing Your First AI-Specific Policies: Acceptable Use, Model Deployment, and Data Handling](#3-writing-your-first-ai-specific-policies-acceptable-use-model-deployment-and-data-handling)
4. [Choosing Your First Three Controls: Guardrails, Secrets Scanning, and Output Validation](#4-choosing-your-first-three-controls-guardrails-secrets-scanning-and-output-validation)
5. [Building Relationships with ML Engineering Teams](#5-building-relationships-with-ml-engineering-teams)
6. [Measuring Progress and Reporting to Leadership](#6-measuring-progress-and-reporting-to-leadership)
7. [Programme Construction Checklist](#7-programme-construction-checklist)

---

## 1. Getting Executive Sponsorship: Framing AI Security as a Business Enabler

Your CISO has said the words: "You own AI security now. Build something." Before you touch a single tool, write a single policy, or schedule a single meeting with an engineering team, you need executive sponsorship. Not vague support. Active, visible, funded sponsorship from someone with budget authority and organisational influence.

This is not optional. Without it, you will spend six months writing policies that nobody reads, proposing controls that nobody implements, and sending emails that nobody answers. The NIST AI Risk Management Framework makes this explicit: its Govern function starts with establishing organisational structures, policies, and accountability mechanisms for AI risk management, and these require executive commitment to be effective. [^1] ISO/IEC 42001, the world's first AI management system standard, similarly requires top management commitment as a precondition for an effective AI Management System. [^2]

The mistake most security practitioners make is framing AI security as a cost centre: a list of restrictions, additional process, and reasons to slow down. This framing guarantees resistance. Instead, frame it as a business enabler using language your executive team already understands:

**Risk reduction with quantified exposure.** Pull data from your organisation's own AI usage. If 200 developers are using AI coding assistants with no content exclusion policies, estimate the volume of source code flowing to third-party APIs daily. Calculate what a data breach involving that code would cost, using the IBM Cost of a Data Breach methodology or your insurer's own figures. Present a specific number, not a vague "we might have a problem."

**Regulatory compliance.** If your organisation operates in the UK, the AI Playbook for Government now establishes 10 principles that represent authoritative HMG guidance for AI adoption. [^3] If you operate in the EU, the AI Act imposes specific obligations depending on risk classification. [^4] If you handle personal data, GDPR Article 35 requires Data Protection Impact Assessments for high-risk automated processing. [^5] Compliance is not abstract: non-compliance has specific, quantifiable consequences.

**Competitive advantage.** Organisations that can demonstrate responsible AI practices win contracts, pass procurement assessments faster, and build trust with customers. A formal AI security programme is a differentiator, not a constraint.

**Speed, not slowness.** A well-designed AI security programme does not slow down adoption. It creates a pre-approved path for teams to adopt AI tools safely, which is faster than the current alternative: ad hoc adoption followed by retroactive security reviews, audit findings, and emergency remediation.

### The sponsorship conversation

Prepare a 15-minute briefing for your CISO or CTO with three elements:

1. **Current state.** How many AI systems are in use (even a rough estimate from procurement records and network logs), what data they process, and what governance exists today. If the answer to "what governance exists today?" is "nothing," say that clearly.

2. **Risk exposure.** Two or three concrete scenarios drawn from the OWASP Top 10 for LLM Applications, tailored to your organisation's actual systems. [^6] Not abstract threats. Scenarios like: "Our customer-facing chatbot has no input validation. An attacker could extract the system prompt and any customer data it has access to."

3. **The ask.** Be specific. You need dedicated time (even if partial), a small initial budget for tooling, authority to set policy for AI tool usage, and a named executive sponsor. If you cannot get all four, prioritise the executive sponsor. Everything else flows from having someone with authority who will back your decisions.

### Deliverable

A one-page programme charter signed by your executive sponsor. This does not need to be elaborate. It should state: the programme exists, who owns it, what authority they have, and a quarterly reporting cadence. This maps directly to the NIST AI RMF's Govern function. [^1]

Do not wait for the charter to be perfect. A signed paragraph from your CISO is worth more than an unsigned 20-page strategy document.

---

## 2. Inventorying AI Usage Including Shadow AI

With executive sponsorship secured, your first operational task is the same one covered in [Article 1.07](/foundations/your-first-90-days/) on this site: build a complete inventory of every AI system in use across the organisation. [^7] If you have already completed the 90-day playbook, you have this. If you are building the programme from scratch, the inventory is where everything starts.

The inventory serves two purposes. First, it establishes the scope of your programme. You cannot write policies, select controls, or prioritise risks for systems you do not know about. Second, it provides immediate credibility with leadership. When you present an inventory that reveals 40 AI systems where the organisation thought there were 10, you have demonstrated value on day one.

### What to inventory

For every AI system, record:

| Field | Why it matters |
|---|---|
| **System name and type** | Classification for policy and control mapping |
| **Business owner** | Accountability and escalation path |
| **Data classification of inputs** | Determines minimum security controls |
| **Where the model runs** | Cloud API, self-hosted, on-device, hybrid |
| **External services called** | Attack surface and data flow mapping |
| **Autonomy level** | Autocomplete, chat, agentic supervised, agentic autonomous [^8] |
| **Security review status** | Completed, in progress, not started |
| **Compliance requirements** | GDPR, sector-specific regulation, government classification |

### Discovering shadow AI

The hardest systems to inventory are the ones nobody told you about. Shadow AI is pervasive (see [AI Supply Chain Attacks](/emerging-threats-and-research/ai-supply-chain-attacks/) and [The RAG Trap](/defend-and-harden/rag-trap/) for related data-source risks). A 2024 Salesforce survey found that more than half of generative AI users at work were using unapproved tools. [^9] Three discovery methods work in practice:

1. **Network traffic analysis.** Review DNS and proxy logs for traffic to known AI service domains: `api.openai.com`, `api.anthropic.com`, `generativelanguage.googleapis.com`, `bedrock-runtime.*.amazonaws.com`, and `*.openai.azure.com`. This reveals volume and frequency without content inspection.

2. **Endpoint telemetry.** Query your EDR or endpoint management solution for AI-related applications, browser extensions, and IDE plugins. Look for ChatGPT desktop, Claude desktop, Ollama instances, Cursor, Windsurf, and Copilot extensions.

3. **Non-punitive survey.** Ask teams directly which AI tools they use, what data they provide, and what they use the output for. Frame it as enablement, not enforcement. "Help us support you safely" gets better data than "tell us what rules you have been breaking."

### From inventory to risk tiers

Once the inventory is complete, group systems into three tiers:

- **Tier 1 (Critical).** Systems that process sensitive data, have tool-calling or agentic capability, or are customer-facing. These get priority for policy, controls, and security review.
- **Tier 2 (Standard).** Internal-use systems with moderate data sensitivity. These get standard policy coverage and periodic review.
- **Tier 3 (Low risk).** Systems processing only public data with no agentic capability. These need acceptable use policy coverage but minimal technical controls.

This tiering drives every subsequent decision: which policies to write first, which controls to implement first, and where to focus your limited time.

The OWASP Secure AI Model Ops Cheat Sheet recommends maintaining a living inventory of all AI models, their versions, and their deployment environments as a foundational practice. [^10] Do not treat the inventory as a one-time exercise. Build it as a living register that updates when new systems are adopted or decommissioned.

---

## 3. Writing Your First AI-Specific Policies: Acceptable Use, Model Deployment, and Data Handling

You now have executive sponsorship and an inventory. The next step is writing the policies that govern how your organisation uses AI. Three policies form the minimum viable set. You can expand later, but these three cover the ground that matters most.

### Policy 1: AI acceptable use

This is the policy every employee sees. It answers the question: "What am I allowed to do with AI tools at work?"

Keep it short. One page, preferably. If it is longer than two pages, nobody will read it. Cover:

- **Approved tools.** List the AI tools that have been assessed and approved for use. Specify any configuration requirements (for example, "GitHub Copilot must be used with content exclusions enabled for repositories classified as Confidential or above").
- **Prohibited actions.** Be specific about what must not be fed into AI tools. Customer PII, authentication credentials, API keys, internal security assessments, and data above a specified classification level are common prohibitions.
- **Personal use versus organisational use.** State whether personal AI accounts (free ChatGPT, personal Copilot subscriptions) may be used for work tasks. In most organisations, the answer should be no, because personal accounts lack enterprise data handling agreements.
- **Reporting obligations.** If an employee accidentally shares sensitive data with an AI tool, what should they do? Provide a clear, non-punitive reporting path. The NCSC's guidelines for secure AI system development stress the importance of building organisational structures where security concerns can be raised without fear of blame. [^11]

### Policy 2: AI model deployment

This policy governs how AI systems are deployed into production environments. It applies to engineering teams building or integrating AI capabilities, not to individual tool usage. Cover:

- **Mandatory security review.** Every AI system must complete a security review before deployment. Define what "security review" means: a threat model, an assessment of data flows, a check against the OWASP Top 10 for LLM Applications, and verification of access controls. [^6]
- **Data handling requirements.** Specify minimum standards for how AI systems handle data at each classification level. This includes encryption in transit, data retention policies, and whether data may leave specified geographic jurisdictions. ISO/IEC 42001 requires organisations to define and document their AI data handling processes as part of the AI Management System. [^2]
- **Guardrails and output validation.** Require that every customer-facing AI system has input validation and output filtering. Specify minimum requirements: system prompt protection, content category filtering, and structured output validation where applicable.
- **Third-party model assessment.** If the system uses a third-party model API (OpenAI, Anthropic, AWS Bedrock, Azure OpenAI), require verification of the vendor's data handling practices, retention policies, and compliance certifications.
- **Approval authority.** Define who can approve an AI system for deployment. For Tier 1 (critical) systems, this should require security team sign-off. For Tier 2, the business owner with security review completed. For Tier 3, self-certification against a checklist.

### Policy 3: AI data handling

This policy may be a standalone document or an addendum to your existing data handling policy. It addresses the specific data risks that AI systems introduce:

- **Training data opt-out.** Require that all enterprise AI tool configurations disable model training on organisational data where the option exists. Document which vendors offer this and which do not.
- **Prompt and response logging.** Define whether prompts and responses are logged, who can access them, and how long they are retained. Balance security monitoring needs (you want to detect abuse) against privacy requirements (you may not want to store the content of every developer's Copilot interaction).
- **Data minimisation.** Require that AI systems receive only the data they need to perform their function. A summarisation tool does not need access to an entire database. A coding assistant does not need access to repositories it is not being used on. This aligns directly with the NIST AI RMF's guidance on managing data-related risks. [^1]
- **Cross-border data transfers.** If your organisation operates across jurisdictions, specify which AI services may process data from which jurisdictions. This is particularly important for organisations subject to GDPR, UK data protection law, or government data classification requirements. [^5]

### Writing effectively

Three principles for policy writing that gets adopted rather than ignored:

1. **Be prescriptive, not aspirational.** "Teams should consider security" is useless. "Every AI system must complete the AI security review checklist (Appendix A) before production deployment" is actionable.

2. **Include the why.** For each requirement, add one sentence explaining the risk it addresses. Engineers are more likely to comply with a requirement they understand than one they perceive as arbitrary bureaucracy.

3. **Version and date.** AI is moving fast. Policies written today will need updating within six months. Include a version number, a review date, and an owner responsible for keeping the policy current.

---

## 4. Choosing Your First Three Controls: Guardrails, Secrets Scanning, and Output Validation

Policies without technical controls are promises without enforcement. You cannot implement every control at once, so choose three that address the highest-probability, highest-impact risks from your inventory. Based on the OWASP Top 10 for LLM Applications and the patterns from real-world AI incidents, these three deliver the most risk reduction per unit of effort. [^6] [^12]

### Control 1: Guardrails on model inputs and outputs

The single highest-value control for any customer-facing or high-risk AI system is a guardrail layer that sits between users and the model. Guardrails filter inputs (blocking prompt injection attempts, prohibited content, and out-of-scope requests) and outputs (blocking sensitive data leakage, harmful content, and off-topic responses).

Three implementation approaches, depending on your stack:

- **AWS Bedrock Guardrails** provides managed content filtering, denied topic detection, sensitive information filters (PII, credentials), and contextual grounding checks. Configuration is declarative through the Bedrock console or API. [^13]
- **NVIDIA NeMo Guardrails** is an open-source toolkit that lets you define conversational rails in a domain-specific language. It supports topic control, fact-checking, and jailbreak detection. It runs as a middleware layer and works with any LLM backend. [^14]
- **Lakera Guard** offers a hosted API for prompt injection detection, content moderation, and PII detection, designed for low-latency production use. [^15]

The minimum viable guardrail configuration for a Tier 1 system should include: system prompt protection (preventing extraction or override), PII detection on outputs, and content category filtering appropriate to the use case.

Do not attempt to build guardrails from scratch. The OWASP Top 10 specifically warns against relying on prompt engineering alone to prevent injection attacks. [^6] Use a purpose-built tool and layer it in front of your model.

### Control 2: Secrets scanning in the CI/CD pipeline

AI coding assistants generate code that frequently contains hardcoded secrets: API keys, database connection strings, authentication tokens, and cloud credentials. A 2023 Stanford study found that participants using AI assistants produced significantly less secure code than those working without them, and were more likely to believe their code was secure when it was not. [^16] This is not an abstract risk. It is a pattern that shows up in real codebases wherever AI coding tools are in use.

Implement secrets scanning at three points:

1. **Pre-commit hooks.** Tools like **git-secrets** (maintained by AWS Labs) and **Gitleaks** can block commits containing known secret patterns before they reach the repository. [^17] [^18] This is your first line of defence and the cheapest to implement.

2. **CI/CD pipeline scanning.** Run **TruffleHog** or **Gitleaks** as a pipeline step on every pull request. This catches secrets that bypassed pre-commit hooks (for example, when developers commit from environments without the hook installed). [^19]

3. **Historical repository scanning.** Run a one-time scan of existing repositories to find secrets that were committed before scanning was in place. TruffleHog's `--since-commit` and full-history scanning modes are designed for this. Prioritise repositories that AI coding assistants have been used on.

The cost of implementing secrets scanning is low (all three tools above are open source) and the risk reduction is immediate. A single exposed AWS key can result in significant financial and reputational damage within hours.

### Control 3: Output validation for AI-generated content

Every system that presents AI-generated content to users or passes it to downstream systems needs output validation. This addresses OWASP LLM05 (Improper Output Handling): the risk that LLM output is trusted and used without sufficient validation, leading to cross-site scripting, server-side request forgery, privilege escalation, or remote code execution in downstream systems. [^6]

Implementation depends on the output type:

- **Structured data.** If the LLM generates JSON, SQL, or API calls, validate against a schema before execution. Reject any output that does not conform. **LLM Guard** provides configurable output validators for common structured formats. [^20]
- **Code.** If the LLM generates code that will be executed (in an agentic workflow, for example), run it through static analysis (Semgrep, CodeQL, Bandit) before execution. Never execute LLM-generated code in a privileged context without sandboxing. [^21]
- **Natural language.** If the output is displayed to users, sanitise it for injection vectors (HTML, Markdown, script tags) and check for PII leakage using the same guardrail layer from Control 1.

These three controls are not the complete picture. They are the foundation. Once they are in place and operating reliably, you can expand to more sophisticated controls: model-specific red teaming, supply chain verification for third-party models, runtime anomaly detection, and formal threat modelling of individual AI systems. The maturity model in [Article 1.06](/foundations/ai-security-maturity-model/) provides a roadmap for that progression. [^22]

---

## 5. Building Relationships with ML Engineering Teams

The most common failure mode for AI security programmes is not technical. It is organisational. The security team writes policies and selects controls in isolation, then attempts to impose them on engineering teams who had no input, see no benefit, and have no reason to cooperate. The result is compliance theatre: boxes ticked on paper, controls circumvented in practice.

Building genuine working relationships with ML engineering teams is not a soft skill nicety. It is the mechanism through which your programme succeeds or fails. The NCSC's guidelines for secure AI system development explicitly recommend that security be embedded into AI development teams rather than applied as an external checkpoint. [^11]

### Understanding ML engineering culture

ML engineers and data scientists operate differently from traditional software developers. Their workflow involves experimentation, iteration, and rapid prototyping. Model development is often non-linear: training runs fail, hyperparameters are tuned, data pipelines are rebuilt. The tools, processes, and cadence are different from conventional software engineering.

If your security programme feels like it is adding friction to every experiment, it will be routed around. If it feels like it is helping the team ship better models faster, it will be adopted.

### Three tactics that work

**1. Embed, do not inspect.** Attend ML engineering stand-ups and sprint planning sessions. Not to audit. To listen. Understand what they are building, what problems they face, and where security fits naturally. Offer to help with specific security tasks (threat modelling a new model deployment, reviewing a third-party model's security documentation) rather than showing up with a checklist.

When you find a security issue, bring it with a proposed solution, not a compliance citation. "Your model endpoint has no authentication and is accessible from the public internet. Here is a Terraform module that adds API Gateway with IAM auth in front of it" is more effective than "You are in violation of Section 4.3.2 of the AI deployment policy."

**2. Create shared tooling.** Build tools and templates that make the secure path the easy path. A pre-configured CI/CD pipeline template that includes secrets scanning, dependency checking, and model artefact validation is a gift, not a gate. A security review checklist that ML engineers can self-complete for Tier 2 and Tier 3 systems reduces their dependency on your time and makes them more self-sufficient.

The OWASP MLOps Security Cheat Sheet recommends integrating security checks into the ML pipeline itself, rather than adding them as a separate stage. [^10] This means working with ML engineers to add scanning and validation steps to their existing training, evaluation, and deployment pipelines, not creating a parallel process.

**3. Run a collaborative threat modelling session.** Pick a Tier 1 system from the inventory and invite the ML engineering team to a 90-minute threat modelling session. Use a framework they can engage with: STRIDE adapted for AI systems, or the MITRE ATLAS threat matrix as a structured walkthrough. [^23] The goal is not a perfect threat model. The goal is a shared understanding of where the risks are and a joint plan to address them.

These sessions consistently produce two outcomes. First, the ML engineers learn about attack vectors they were not aware of (prompt injection, training data poisoning, model extraction). Second, the security team learns about architectural decisions and constraints they did not understand. Both sides leave with better context and more trust.

### The ongoing relationship

Building trust is not a one-time activity. Schedule regular touchpoints:

- **Monthly security sync** with ML engineering leads (30 minutes). Review new deployments, upcoming changes, and any security issues from the past month.
- **Quarterly threat model review** for Tier 1 systems. As models are updated, fine-tuned, or integrated with new tools, the threat surface changes.
- **Shared incident retrospectives.** When something goes wrong (a model generates inappropriate content, a prompt injection succeeds, a cost overrun occurs), run the retrospective jointly. Blame-free, evidence-based, focused on improving the system rather than punishing individuals.

The measure of success is not whether ML engineers comply with your policies. It is whether they come to you early, when they are planning a new deployment, rather than late, when something has already gone wrong.

---

## 6. Measuring Progress and Reporting to Leadership

A programme without metrics is a programme without accountability. Your executive sponsor agreed to fund this initiative because you made a business case. Now you need to demonstrate progress in terms they understand.

The NIST AI RMF's Measure function focuses on quantifying and tracking AI risks using appropriate metrics and methodologies. [^1] The challenge for a new programme is selecting metrics that are meaningful (they tell you something about actual risk posture), measurable (you can collect the data), and communicable (your executive sponsor can understand them in a five-minute briefing).

### Five metrics that matter in year one

**1. AI asset coverage.** What percentage of known AI systems have completed a security review? This is your most important early metric. If your inventory contains 40 systems and 5 have been reviewed, your coverage is 12.5%. Track this monthly. Target 100% coverage for Tier 1 systems within six months and 100% for Tier 2 systems within twelve months.

**2. Policy compliance rate.** What percentage of AI tool deployments followed the deployment policy? Measure by auditing recent deployments against the checklist. This tells you whether your policies are being adopted or ignored.

**3. Mean time to security review.** How long does it take from an AI system being proposed to a security review being completed? If this number is growing, you are becoming a bottleneck. If it is shrinking, your processes are scaling. Target: under two weeks for Tier 2 systems, under one week for Tier 3, and a collaborative review process for Tier 1.

**4. Secrets scanning findings.** How many secrets were caught by your scanning pipeline this month? How many were in AI-generated code versus human-written code? Track the trend. A declining count suggests developers are learning. A consistent count suggests the guardrail is working but the behaviour has not changed.

**5. Shadow AI reduction.** Compare your current network scan results against the baseline from your initial inventory. Are fewer unapproved AI services being accessed? Are more teams using approved tools? This measures whether your programme is channelling AI usage into governed paths rather than driving it underground.

### Metrics to avoid

Resist the temptation to track vanity metrics:

- **Number of policies written** tells you nothing about whether anyone follows them.
- **Number of security training sessions delivered** tells you nothing about whether anyone learned anything.
- **Number of vulnerabilities found** without context (severity, exploitability, exposure) is noise, not signal.

### Reporting to leadership

Report quarterly to your executive sponsor. Use a consistent format:

1. **Programme health summary** (one slide). Red/amber/green for each of the five maturity dimensions: governance, technical controls, monitoring, incident response, and workforce. [^22]

2. **Key metrics dashboard** (one slide). The five metrics above, with trend lines showing direction of travel.

3. **Top three risks** (one slide). The three most significant AI security risks the organisation currently faces, expressed in business impact terms. Not "prompt injection is possible" but "our customer-facing chatbot has no guardrails and serves 50,000 users per month; a successful prompt injection could expose customer data and create regulatory liability."

4. **Actions completed and next quarter plan** (one slide). What you delivered since the last report and what you plan to deliver next.

Four slides. Fifteen minutes. This is enough for an executive audience. If they want more detail, provide it in an appendix, not in the main deck.

### Aligning to maturity levels

Use the AI Security Maturity Model from [Article 1.06](/foundations/ai-security-maturity-model/) as your long-term benchmark. [^22] Conduct a self-assessment at programme launch, at six months, and annually thereafter. The maturity model provides a structured way to track progress across all five dimensions and to identify which dimension is holding your overall maturity back.

Most organisations building a programme from zero will start at Level 1 (Ad Hoc). A realistic target is Level 2 (Developing) within six months and Level 3 (Defined) within eighteen months. Do not try to reach Level 4 or 5 in your first year. Premature sophistication without solid foundations creates fragile programmes that collapse under the first real incident.

---

## 7. Programme Construction Checklist

This checklist consolidates every action from the preceding sections into a single reference. Use it to track progress, report status to your executive sponsor, and ensure nothing falls through the gaps. The order is deliberate: each phase depends on the one before it.

### Phase 1: Foundation (Weeks 1-4)

- [ ] Prepare executive briefing: current state, risk exposure, specific ask
- [ ] Secure named executive sponsor with budget authority
- [ ] Sign programme charter (scope, authority, reporting cadence)
- [ ] Complete AI system inventory (sanctioned tools)
- [ ] Complete shadow AI discovery (network logs, endpoint telemetry, survey)
- [ ] Classify all inventoried systems into Tier 1 (Critical), Tier 2 (Standard), Tier 3 (Low risk)
- [ ] Conduct baseline self-assessment using the AI Security Maturity Model [^22]

### Phase 2: Policy (Weeks 5-8)

- [ ] Draft and publish AI acceptable use policy
- [ ] Draft and publish AI model deployment policy
- [ ] Draft and publish AI data handling policy (or addendum to existing data handling policy)
- [ ] Define security review process for each tier (Tier 1: full review; Tier 2: structured checklist; Tier 3: self-certification)
- [ ] Communicate policies to all affected teams with context on rationale
- [ ] Establish policy review cadence (every six months minimum)

### Phase 3: Controls (Weeks 9-16)

- [ ] Implement guardrails on all Tier 1 customer-facing AI systems (Bedrock Guardrails, NeMo Guardrails, or Lakera Guard)
- [ ] Deploy pre-commit secret scanning hooks across repositories used with AI coding assistants (git-secrets or Gitleaks)
- [ ] Add secrets scanning to CI/CD pipeline for all pull requests (TruffleHog or Gitleaks)
- [ ] Run historical secrets scan on existing repositories
- [ ] Implement output validation for all Tier 1 systems that generate structured data or code
- [ ] Complete security review for all Tier 1 systems
- [ ] Begin security reviews for Tier 2 systems

### Phase 4: Relationships and Integration (Weeks 9-16, in parallel with Phase 3)

- [ ] Attend ML engineering stand-ups and sprint planning for at least two Tier 1 systems
- [ ] Conduct collaborative threat modelling session for the highest-risk AI system
- [ ] Create shared CI/CD pipeline template with security controls pre-configured
- [ ] Create self-service security review checklist for Tier 2 and Tier 3 systems
- [ ] Establish monthly security sync meetings with ML engineering leads
- [ ] Schedule quarterly threat model reviews for all Tier 1 systems

### Phase 5: Measurement and Reporting (Week 16 onwards)

- [ ] Define five programme metrics (asset coverage, policy compliance, MTTR, secrets findings, shadow AI reduction)
- [ ] Instrument dashboards or tracking for each metric
- [ ] Deliver first quarterly report to executive sponsor
- [ ] Conduct six-month maturity model self-assessment
- [ ] Update policies based on first six months of operational experience
- [ ] Publish programme roadmap for the next twelve months

### Living document principles

This checklist is a starting point, not a fixed plan. Three principles for keeping it useful:

1. **Adapt to your context.** If your organisation has no ML engineering team (you only consume third-party AI APIs), Phase 4 looks different. If you are in a regulated sector, Phase 2 may need additional policies mandated by your regulator. Modify the checklist to fit your reality.

2. **Accept imperfection.** A programme that covers 80% of the checklist imperfectly is better than one that covers 30% perfectly. The goal is a defensible, improving security posture, not a theoretical ideal.

3. **Review and iterate.** At the six-month mark, review the entire checklist. Add items that experience revealed were missing. Remove items that proved unnecessary for your context. The programme evolves as your organisation's AI usage evolves.

Building an AI security programme from zero is a construction project, not a research project. The frameworks exist (NIST AI RMF, ISO 42001, OWASP LLM Top 10, NCSC guidelines). [^1] [^2] [^6] [^11] The tools exist. The attack patterns are documented. [^23] What has been missing, until now, is a practical sequence for putting the pieces together. This checklist provides that sequence. The rest is execution.

---

[^1]: NIST, "AI Risk Management Framework (AI RMF 1.0)," January 2023. https://www.nist.gov/itl/ai-risk-management-framework

[^2]: ISO/IEC, "ISO/IEC 42001:2023 Information Technology — Artificial Intelligence — Management System," December 2023. https://www.iso.org/standard/81230.html

[^3]: UK Government, "AI Playbook for Government," February 2025. https://www.gov.uk/government/publications/ai-playbook-for-government

[^4]: European Parliament, "Regulation (EU) 2024/1689 laying down harmonised rules on artificial intelligence (AI Act)," June 2024. https://eur-lex.europa.eu/eli/reg/2024/1689

[^5]: UK Information Commissioner's Office, "AI and data protection," 2024. https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/artificial-intelligence/

[^6]: OWASP, "OWASP Top 10 for LLM Applications 2025," 2025. https://genai.owasp.org/llm-top-10/

[^7]: Paul Lawlor, "Your First 90 Days as an AI Security Engineer," AI Security in Practice, February 2026. https://aisecurityinpractice.com/foundations/your-first-90-days/

[^8]: Paul Lawlor, "The Autonomy Ladder: Do's and Don'ts for Choosing Between Copilot, Cursor, Kiro, and Devin," AI Security in Practice, February 2026. https://aisecurityinpractice.com/foundations/the-autonomy-ladder/

[^9]: Salesforce, "More Than Half of Generative AI Adopters Use Unapproved Tools at Work," 2024. https://www.salesforce.com/news/stories/ai-at-work-research/

[^10]: OWASP, "Secure AI Model Ops Cheat Sheet," 2024. https://cheatsheetseries.owasp.org/cheatsheets/Secure_AI_Model_Ops_Cheat_Sheet.html

[^11]: NCSC, CISA, and international partners, "Guidelines for Secure AI System Development," November 2023. https://www.ncsc.gov.uk/collection/guidelines-secure-ai-system-development

[^12]: NIST, "Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile (AI 600-1)," July 2024. https://doi.org/10.6028/NIST.AI.600-1

[^13]: AWS, "Amazon Bedrock Guardrails," 2024. https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html

[^14]: NVIDIA, "NeMo Guardrails," 2024. https://github.com/NVIDIA/NeMo-Guardrails

[^15]: Lakera, "Lakera Guard," 2024. https://www.lakera.ai/lakera-guard

[^16]: Stanford University, "Do Users Write More Insecure Code with AI Assistants?" 2023. https://arxiv.org/abs/2211.03622

[^17]: AWS Labs, "git-secrets: Prevents you from committing secrets and credentials into git repositories," 2024. https://github.com/awslabs/git-secrets

[^18]: Zricethezav, "Gitleaks: Protect and discover secrets using Gitleaks," 2024. https://github.com/gitleaks/gitleaks

[^19]: Truffle Security, "TruffleHog: Find, verify, and fix leaked credentials," 2024. https://github.com/trufflesecurity/trufflehog

[^20]: Protect AI, "LLM Guard: The Security Toolkit for LLM Interactions," 2024. https://llm-guard.com/

[^21]: OWASP, "OWASP Secure Coding Practices Quick Reference Guide," 2024. https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/

[^22]: AI Security in Practice, ["The AI Security Maturity Model"](/foundations/ai-security-maturity-model/), Article 1.06 on this site.

[^23]: MITRE, "ATLAS (Adversarial Threat Landscape for Artificial-Intelligence Systems)," 2024. https://atlas.mitre.org/
