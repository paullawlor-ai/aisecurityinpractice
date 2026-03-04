---
title: "Your First 90 Days as an AI Security Engineer"
description: "A week-by-week playbook for the person who just landed the AI security role or was told 'you own AI security now.'"
sidebar:
  order: 7
---

**Series:** AI Security in Practice<br/>
**Pillar:** 1: Foundations<br/>
**Difficulty:** Beginner<br/>
**Author:** Paul Lawlor<br/>
**Date:** 21 February 2026<br/>
**Reading time:** 18 minutes

> A week-by-week playbook for the person who just landed the AI security role or was told "you own AI security now," covering asset inventory, trust boundary mapping, red team testing, and presenting a risk register to leadership.

---

## Table of Contents

1. [Why Sequencing Matters More Than Knowledge](#1-why-sequencing-matters-more-than-knowledge)
2. [Week 1: Inventory Every AI System and Shadow AI Usage](#2-week-1-inventory-every-ai-system-and-shadow-ai-usage)
3. [Weeks 2–4: Map Trust Boundaries and Data Flows for the Highest-Risk Systems](#3-weeks-24-map-trust-boundaries-and-data-flows-for-the-highest-risk-systems)
4. [Month 2: Run Your First Red Team Exercise](#4-month-2-run-your-first-red-team-exercise)
5. [Month 3: Present a Risk Register to Leadership](#5-month-3-present-a-risk-register-to-leadership)
6. [Ongoing: Benchmark Against the Maturity Model](#6-ongoing-benchmark-against-the-maturity-model)
7. [The 90-Day Checklist](#7-the-90-day-checklist)

---

## 1. Why Sequencing Matters More Than Knowledge

You have been told "you own AI security now." Perhaps it is a formal title change. Perhaps it is a sentence in a one-to-one with your CISO. Perhaps it is an email that says "we need someone to cover this" and nobody else raised their hand. However it happened, you are here, and the clock is ticking.

The temptation is to start learning everything. Read every paper on adversarial machine learning. Complete every course on LLM security. Build a mental model of every framework before touching anything in production. This is a mistake. Not because the knowledge is unimportant, but because it creates a false sense of progress while real risks go unaddressed.

A 2024 McKinsey survey found that 72% of organisations had adopted AI in at least one business function, up from roughly 50% in the years prior. [^1] In most of those organisations, AI adoption outpaced the security team's ability to assess, instrument, and govern it. By the time someone is assigned to own AI security, there is already a backlog of ungoverned systems, unreviewed integrations, and unknown shadow AI usage. The gap is not knowledge. The gap is action, sequenced correctly.

This playbook provides a week-by-week action plan for your first 90 days. It is not a job description. It is not a maturity model (that is [Article 1.06](/foundations/ai-security-maturity-model/) on this site). [^2] It is the minimum viable set of actions, in the right order, to move your organisation from "nobody owns AI security" to "we have visibility, we have tested our defences, and we can articulate our risk posture to leadership."

The sequencing follows a deliberate logic. You cannot map trust boundaries for systems you have not inventoried. You cannot red team systems whose data flows you have not mapped. You cannot present a credible risk register without evidence from both mapping and testing. Each phase builds on the one before it.

If you are an experienced security engineer or pentester pivoting into AI security, much of what you already know transfers directly: threat modelling, least privilege, input validation, and secure development lifecycle thinking all apply. [^3] What is genuinely new is covered in the sections that follow and in the deeper articles they link to. If you are newer to security, the skills map in [Article 1.09](/foundations/the-ai-security-skills-map/) on this site provides an honest triage of what to learn first and what can wait. [4]

The goal at the end of 90 days is not perfection. It is a defensible position: you know what AI systems exist, you know where the highest risks are, you have tested at least one system, and you can stand in front of leadership with a risk register and a plan. Everything else is iteration.

---

## 2. Week 1: Inventory Every AI System and Shadow AI Usage

Your first week has one objective: build a complete picture of every AI system in use across the organisation. You cannot secure what you do not know about, and in most organisations, the official list of AI tools covers less than half of actual usage.

### The official inventory

Start with what is known. Work with IT, procurement, and engineering leadership to build a list of every sanctioned AI system. This includes:

- **AI coding assistants** (GitHub Copilot, Cursor, Amazon Q Developer, Windsurf, Devin)
- **Customer-facing LLM integrations** (chatbots, search, recommendation engines, content generation)
- **Internal LLM tools** (document summarisation, code review, data analysis)
- **Third-party AI APIs** (OpenAI, Anthropic, Google Vertex AI, AWS Bedrock, Azure OpenAI)
- **Self-hosted models** (Ollama, vLLM, TGI, Triton Inference Server)
- **AI features embedded in existing products** (Salesforce Einstein, Microsoft 365 Copilot, ServiceNow AI)

For each system, record: the business owner, the data it processes, where the model runs (cloud API, self-hosted, on-device), what external services it calls, and whether a security review has been conducted. A spreadsheet is sufficient at this stage. Do not let the perfect be the enemy of the done.

### The shadow AI audit

The harder task is finding what nobody told you about. Shadow AI is the AI equivalent of shadow IT: tools adopted by individuals or teams without central approval. A 2024 Netskope report found that the average enterprise had employees using over a dozen distinct generative AI applications, many without IT awareness. [^5]

Three methods to discover shadow AI:

1. **Network traffic analysis.** Work with your network team to review DNS logs and web proxy logs for traffic to known AI service domains: `api.openai.com`, `api.anthropic.com`, `generativelanguage.googleapis.com`, `bedrock-runtime.*.amazonaws.com`, `*.openai.azure.com`, and model hosting endpoints like `huggingface.co`. This gives you volume and frequency, not content.

2. **Endpoint telemetry.** If you run an EDR or endpoint management solution, query for AI-related browser extensions, desktop applications (ChatGPT desktop, Claude desktop, Ollama), and IDE plugins.

3. **Survey the organisation.** Send a short, non-punitive survey asking teams which AI tools they use, what data they provide to those tools, and what they use the output for. Frame it as "help us support you safely" rather than "tell us what you have been doing wrong." You will get better response rates and more honest answers.

### Deliverable

By the end of Week 1, you should have a single document listing every known and discovered AI system. For each, note: system name, type, data classification of inputs, hosting model, business owner, and whether a security review exists. This inventory is the foundation for everything that follows.

If the inventory reveals more than you expected (it usually does), resist the urge to immediately restrict everything. Banning tools without providing alternatives drives usage further underground. [^6] Note the risks, prioritise, and address them in the phases that follow.

---

## 3. Weeks 2–4: Map Trust Boundaries and Data Flows for the Highest-Risk Systems

With the inventory complete, you now know what exists. The next three weeks are about understanding how the highest-risk systems work and where the security boundaries are. You will not have time to map every system in detail. Prioritise ruthlessly.

### Selecting the highest-risk systems

Rank the systems from your inventory using three criteria:

1. **Data sensitivity.** Systems that process customer PII, financial data, source code, or classified information rank highest. A customer-facing chatbot that accesses a knowledge base of internal documents is higher risk than an internal tool that summarises public meeting notes.

2. **Agency and autonomy.** Systems that can take actions (call APIs, execute code, send emails, modify databases) are higher risk than those that only generate text. An AI agent with tool-calling capability is a fundamentally different risk profile from a standalone chatbot. [7]

3. **Exposure.** Internet-facing systems are higher risk than internal-only tools. Systems accessible to unauthenticated users are higher risk than those behind SSO.

Pick the top three to five systems. These are your focus for the next three weeks.

### Drawing the trust boundary diagram

For each selected system, create a data flow diagram that answers:

- **What data enters the system?** User prompts, uploaded documents, RAG-retrieved content, API responses, tool outputs. Identify which inputs come from trusted sources and which come from untrusted sources. In most LLM systems, RAG-retrieved content and tool outputs should be treated as untrusted. [^8]

- **What does the model have access to?** System prompts, function definitions, database connections, API credentials, file system access. Map the model's effective permissions. The principle of least privilege applies here exactly as it does in traditional systems, but many LLM deployments grant models far more access than they need. [^9]

- **What leaves the system?** Model responses to users, function calls to external services, log entries, telemetry. Identify every egress path where data could be exfiltrated, either through direct model output or through side-channel tool invocations.

- **Where are the trust boundaries?** The boundary between user input and system instructions is the most critical one in any LLM system, and it is the one that prompt injection exploits. Unlike traditional applications, LLMs have no architectural separation between instructions and data: everything is processed as an undifferentiated token stream. [^10] Understanding this is essential for assessing where defences need to be strongest.

### Mapping to the OWASP LLM Top 10

For each system, walk through the **OWASP Top 10 for LLM Applications (2025)** [^9] and assess which risks apply. Not every risk applies to every system. A system with no tool-calling capability is not vulnerable to LLM01's function-calling exploitation scenarios, but it may still be vulnerable to prompt injection that causes it to leak its system prompt or RAG content. A system with RAG is vulnerable to indirect prompt injection via poisoned documents. [^11]

Record each applicable risk, its current mitigation status (mitigated, partially mitigated, unmitigated), and the potential business impact. This mapping feeds directly into the risk register you will build in Month 3.

### Documenting the gaps

At the end of this phase, you will have a trust boundary diagram and OWASP risk mapping for each of your highest-risk systems. You will also have a list of gaps: missing input validation, excessive model permissions, absent logging, unmonitored tool calls. Do not attempt to fix everything immediately. Document the gaps, assign preliminary severity ratings, and carry them forward. The risk register in Month 3 is where they become actionable priorities.

The **MITRE ATLAS** framework [^12] provides additional structure for this mapping. If your organisation already uses MITRE ATT&CK for traditional threat modelling, ATLAS provides a complementary taxonomy for AI-specific attack techniques that maps naturally to the same workflow.

---

## 4. Month 2: Run Your First Red Team Exercise

You have the inventory. You have the trust boundary maps. Now it is time to test whether the defences actually hold. Month 2 is dedicated to your first AI red team exercise.

### Why red teaming this early

It may feel premature to attack your own systems when you have not finished building defences. It is not. Red teaming at this stage serves three purposes. First, it converts the theoretical risks from your OWASP mapping into concrete, demonstrable findings that leadership and engineering teams will take seriously. A documented prompt injection that extracts a customer's credit card number from a RAG pipeline is worth more than a dozen risk matrix slides. Second, it builds your own hands-on intuition for how AI attacks work, which no amount of reading can substitute for. Third, it establishes the practice of adversarial testing before production, which is the habit that matters most in the long run.

### Choosing your target

Select one system from your trust boundary maps. The ideal first target is a customer-facing LLM integration (a chatbot, a search assistant, a document summarisation tool) that processes real data. Avoid starting with internal-only tools: the findings will be less compelling to leadership, and the incentive to fix them will be weaker.

If you do not have a suitable production system to test (or if testing production carries too much risk), set up a local lab environment. [Article 1.03](/foundations/home-ai-security-lab/) on this site walks through building a home AI security lab with **Ollama**, **PyRIT**, and **Garak**. [^13] You can stand up a vulnerable chatbot backed by a RAG pipeline in an afternoon, and the attacks you practise locally will transfer directly to production testing.

### The two tools to start with

Two open-source tools cover the ground you need for a first exercise:

**PyRIT** (Python Risk Identification Toolkit), developed by Microsoft's AI Red Team, provides orchestrated attack strategies against LLM endpoints. It supports multi-turn attacks, automated scoring of responses, and integration with multiple model providers. [^14] [Article 2.01](/attack-and-red-team/pyrit-zero-to-red-team/) on this site provides a complete setup and attack guide. [^15] Start with PyRIT's prompt injection orchestrators: they will systematically test whether your system's guardrails can be bypassed to extract system prompts, access restricted data, or invoke unauthorised functions.

**Garak**, developed by NVIDIA, is an LLM vulnerability scanner that runs a library of probes against a target endpoint. [^16] It covers prompt injection, data leakage, toxicity, hallucination, and more. Garak is closer to a traditional vulnerability scanner: you point it at a target and it runs a battery of tests. See [PyRIT (Article 2.01)](/attack-and-red-team/pyrit-zero-to-red-team/) for red teaming tool setup; Garak is covered in the same tooling ecosystem.

For a first exercise, run Garak's standard probe set against your target to establish a baseline, then use PyRIT for targeted, multi-turn attacks against the vulnerabilities Garak identifies.

### Running the exercise

Structure the exercise as follows:

1. **Scope and rules of engagement.** Define what is in scope (the target system, its data, its connected services) and what is out of scope (other production systems, data destruction, denial of service). Get written approval from the system owner and, if applicable, the CISO. This is standard practice for any penetration test and applies equally to AI red teaming.

2. **Baseline scan.** Run Garak against the target endpoint. Review the results for critical findings: prompt injection successes, system prompt extraction, data leakage, and any unauthorised function calls. Record pass/fail rates for each probe category.

3. **Targeted attacks.** Use PyRIT to attempt multi-turn prompt injection scenarios based on your trust boundary analysis. If the system has RAG, test for indirect prompt injection by planting adversarial content in documents the system retrieves. [^11] If the system has tool-calling capability, test whether you can induce it to call tools with attacker-controlled parameters. [7]

4. **Document findings.** For each finding, record: the attack technique used, the OWASP LLM Top 10 risk it maps to, the MITRE ATLAS technique ID, the steps to reproduce, the business impact, and a recommended remediation. Use the same format your organisation uses for traditional penetration test findings. Consistency with existing processes makes adoption easier.

### What to do with the results

The findings from this exercise serve two purposes. Immediate remediation: work with the engineering team that owns the system to address critical findings. Longer-term evidence: the findings feed directly into the risk register you will present to leadership in Month 3. A risk register backed by concrete, reproducible findings is categorically more persuasive than one filled with theoretical risks.

---

## 5. Month 3: Present a Risk Register to Leadership

The final phase of your first 90 days culminates in the artefact that justifies your role and secures ongoing investment: an AI risk register, presented to leadership with findings, context, and a prioritised remediation plan.

### Building the risk register

An AI risk register follows the same structure as any enterprise risk register, extended with AI-specific categories. [The NIST AI RMF Implementation Guide](/governance-risk-compliance/the-nist-ai-rmf-implementation-guide/) provides risk register templates and worked examples. [^17] For your first iteration, each entry should contain:

| Field | Description |
|---|---|
| **Risk ID** | Unique identifier (e.g., AI-RISK-001) |
| **Risk category** | Map to OWASP LLM Top 10 (e.g., LLM01 Prompt Injection, LLM06 Excessive Agency) [^9] |
| **Affected system** | The specific system from your inventory |
| **Description** | What could happen, in business terms |
| **Likelihood** | Based on your red team findings and exposure assessment |
| **Impact** | Financial, reputational, regulatory, operational |
| **Current controls** | What is already in place |
| **Residual risk** | Risk level after current controls |
| **Recommended action** | Specific remediation with estimated effort |
| **Owner** | The person accountable for remediation |

Populate the register from three sources: the OWASP risk mapping from Weeks 2-4, the concrete findings from your Month 2 red team exercise, and any gaps identified during the trust boundary analysis. Aim for 10 to 20 entries for a first iteration. Fewer than 10 suggests you have not looked hard enough. More than 30 risks diluting the message for a first presentation.

### The NIST AI RMF connection

The **NIST AI Risk Management Framework** [^18] provides the governance structure that gives your risk register legitimacy. Its four functions (Govern, Map, Measure, Manage) map directly to what you have done so far:

- **Govern:** You have established ownership of AI security (that is you).
- **Map:** You have inventoried AI systems and mapped trust boundaries.
- **Measure:** You have run a red team exercise and quantified findings.
- **Manage:** The risk register and remediation plan are your management output.

Framing your work in NIST AI RMF terms is particularly useful if your organisation already uses NIST frameworks for other domains. It demonstrates that AI security is not a separate discipline requiring entirely new processes, but an extension of existing risk management practices into a new domain.

### Presenting to leadership

The leadership presentation is not a technical briefing. It is a business case. Structure it as follows:

1. **Scope of AI usage.** Present the inventory numbers. How many AI systems are in use? How many were unknown before your audit? What data classifications do they process? These numbers establish the scale of the problem.

2. **Key findings from red team testing.** Select three to five findings that demonstrate real, concrete risk. A successful prompt injection that extracted customer data. An AI agent with excessive permissions to production databases. A RAG pipeline with no input validation on retrieved documents. Choose findings that connect to business outcomes, not technical curiosities.

3. **The risk register.** Present the top five risks by residual risk score. For each, state the risk in business terms, the current control status, and the recommended remediation.

4. **The ask.** Be specific about what you need. Budget for tooling (guardrails, monitoring, red team tools). Engineering time for remediation. Policy decisions (acceptable use policy, AI procurement requirements). Headcount if the workload justifies it. Quantify where possible: "Deploying guardrails on our three customer-facing LLM endpoints requires 40 engineering hours and a monthly service cost of approximately £2,000."

5. **The roadmap.** Show where you are against the AI Security Maturity Model ([Article 1.06](/foundations/ai-security-maturity-model/) on this site). [^2] Most organisations at this stage will be at Level 1 (Ad Hoc) or early Level 2 (Developing). Present a 12-month plan to reach Level 3 (Defined), with quarterly milestones.

### Avoiding common mistakes

Do not present AI security as a reason to block AI adoption. You will lose the argument and your credibility. Frame every risk with a remediation, and frame every remediation as enabling safer adoption. The organisation is going to use AI regardless of what you say. Your job is to make that usage defensible.

Do not overstate findings. If a prompt injection only works under contrived conditions, say so. Credibility is your most important asset in the first 90 days, and overstating a risk will cost you trust that takes months to rebuild.

---

## 6. Ongoing: Benchmark Against the Maturity Model

The 90-day plan gets you to a defensible starting position. What follows is iteration, measured against the AI Security Maturity Model described in [Article 1.06](/foundations/ai-security-maturity-model/) on this site. [^2]

### Where you should be after 90 days

If you have followed this playbook, your organisation has moved from Level 1 (Ad Hoc) to early Level 2 (Developing) on the maturity model. Specifically:

- **Governance:** You have a named AI security owner (you), an AI system inventory, and the beginning of a risk register. You do not yet have a formal AI security policy or framework alignment.
- **Technical Controls:** You have identified gaps in input validation, access controls, and guardrails, but most are not yet deployed. You have tools (PyRIT, Garak) for testing but they are not yet integrated into CI/CD pipelines.
- **Monitoring and Detection:** You have visibility into which AI systems exist, but structured logging of LLM interactions is likely inconsistent or absent.
- **Incident Response:** You may have added basic AI scenarios to existing playbooks, but a dedicated AI incident response plan is not yet in place. See [The NIST AI RMF Implementation Guide](/governance-risk-compliance/the-nist-ai-rmf-implementation-guide/) for risk management and incident response structure. [^19]
- **Workforce and Culture:** You have begun building your own expertise. The rest of the security team and the broader organisation are at the awareness stage.

### The next 90 days: moving to solid Level 2

With the foundation laid, the next quarter should focus on:

1. **Publish an AI acceptable use policy.** Define which tools are approved, what data may be shared, and who to contact with questions. This single document is the most impactful governance action you can take. [^18]

2. **Deploy guardrails on your highest-risk LLM endpoints.** Start with the systems identified in your trust boundary mapping. Options include cloud-native services like **AWS Bedrock Guardrails**, open-source tools like **NeMo Guardrails**, or commercial products like **Lakera Guard**. [Article 3.01](/defend-and-harden/guardrails-engineering/) on this site compares the major options. [^20]

3. **Implement structured logging.** Every LLM interaction in production should log: the prompt, the response, any tool calls, token counts, and latency. Observability platforms like **LangFuse** provide purpose-built infrastructure for this. [^21]

4. **Integrate red team scanning into deployment pipelines.** Move from manual, one-off testing to automated scanning. Run Garak probes as a gate in your CI/CD pipeline for any system that serves an LLM endpoint. [^16]

5. **Deliver targeted AI security training.** Developers using AI coding assistants need specific guidance on reviewing AI-generated code for vulnerabilities. The security team needs hands-on experience with AI attack techniques. [Article 1.09](/foundations/the-ai-security-skills-map/) on this site provides a skills map to structure this training. [4]

### Quarterly reassessment

Repeat the maturity self-assessment from [Article 1.06](/foundations/ai-security-maturity-model/) every quarter. [^2] Track the per-dimension scores over time. The dimensions with the lowest scores tell you where to invest next. Share the results with leadership alongside your risk register update. Progress measured against a framework is more compelling than a list of activities completed.

The threat landscape will evolve between assessments. New attack techniques will emerge. MITRE ATLAS adds new techniques regularly (14 new agentic AI techniques were added in October 2025 alone). [^12] The OWASP LLM Top 10 will update. Your maturity assessment must account for new risks, not only progress against old ones.

---

## 7. The 90-Day Checklist

This checklist consolidates every deliverable from the playbook. Use it as a tracking tool throughout the 90 days and as evidence of progress when reporting to leadership.

### Week 1: Inventory

- [ ] List all sanctioned AI tools and systems with business owners
- [ ] Analyse network traffic for shadow AI service endpoints
- [ ] Review endpoint telemetry for AI-related applications and extensions
- [ ] Survey teams for undisclosed AI tool usage
- [ ] Compile consolidated AI system inventory with data classifications
- [ ] Identify systems processing sensitive data (PII, financial, source code, classified)

### Weeks 2–4: Trust boundaries and risk mapping

- [ ] Select top 3–5 highest-risk systems based on data sensitivity, agency, and exposure
- [ ] Create data flow diagrams for each selected system
- [ ] Map model inputs, permissions, and output/egress paths
- [ ] Identify trust boundaries (user input vs. system instructions, trusted vs. untrusted data)
- [ ] Walk each system through the OWASP LLM Top 10 risk categories
- [ ] Map applicable MITRE ATLAS techniques to each system
- [ ] Document gaps in controls with preliminary severity ratings

### Month 2: Red team exercise

- [ ] Define scope and rules of engagement for the target system
- [ ] Obtain written approval from system owner
- [ ] Install and configure PyRIT and Garak (or set up local lab per [Article 1.03](/foundations/home-ai-security-lab/))
- [ ] Run Garak baseline scan against target endpoint
- [ ] Execute targeted multi-turn attacks with PyRIT
- [ ] Test for indirect prompt injection via RAG pipeline (if applicable)
- [ ] Test for unauthorised tool invocation (if applicable)
- [ ] Document each finding with reproduction steps, OWASP/ATLAS mapping, and business impact
- [ ] Share critical findings with engineering team for immediate remediation

### Month 3: Risk register and leadership presentation

- [ ] Build AI risk register with 10–20 entries from all prior phases
- [ ] Assign likelihood and impact ratings based on evidence
- [ ] Map risk register to NIST AI RMF functions (Govern, Map, Measure, Manage)
- [ ] Prepare leadership presentation: scope, findings, top 5 risks, the ask, the roadmap
- [ ] Complete AI Security Maturity Model self-assessment ([Article 1.06](/foundations/ai-security-maturity-model/))
- [ ] Present to CISO / leadership and secure agreement on next-quarter priorities
- [ ] Publish initial AI acceptable use policy (or confirm existing policy is adequate)

### Further reading

The following articles on this site provide deeper guidance for each phase of the playbook:

| Phase | Article | Why it helps |
|---|---|---|
| Getting started | 1.03 Building a Home AI Security Lab | Hands-on lab environment for learning and testing |
| Getting started | 1.08 AI Security vs Application Security | What transfers from your existing security skills |
| Getting started | 1.09 The AI Security Skills Map | What to learn first and what can wait |
| Inventory | 6.06 The Shadow AI Problem | Detecting unauthorised AI tool usage at scale |
| Trust boundaries | 1.02 The AI Threat Landscape: OWASP LLM Top 10 | Practitioner walkthrough of each OWASP risk |
| Trust boundaries | 2.06 The MITRE ATLAS Playbook | Mapping AI attacks to the ATT&CK framework |
| Red teaming | 2.01 PyRIT from Zero to Red Team | Complete PyRIT setup and attack guide |
| Red teaming | 2.09 Garak: Open-Source LLM Vulnerability Scanning | Garak setup and probe selection |
| Risk register | 5.05 Building an AI Risk Register | Template and worked examples |
| Incident response | 5.06 AI Incident Response | The playbook your SOC needs |
| Maturity model | 1.06 The AI Security Maturity Model | Self-assessment and level-by-level roadmap |
| Programme build | 1.10 Building an AI Security Programme from Zero | The full programme construction manual |

---

[^1]: McKinsey & Company, "The state of AI in early 2024: Gen AI adoption spikes and starts to generate value" (May 2024). Available at: https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai-2024

[^2]: AI Security in Practice, ["The AI Security Maturity Model"](/foundations/ai-security-maturity-model/), Article 1.06 on this site.

[^3]: AI Security in Practice, ["AI Security vs Application Security"](/foundations/ai-security-vs-application-security/), Article 1.08 on this site.

[^4]: AI Security in Practice, ["The AI Security Skills Map"](/foundations/the-ai-security-skills-map/), Article 1.09 on this site.

[^5]: Netskope, "Cloud and Threat Report: AI Apps in the Enterprise" (2024). Available at: https://www.netskope.com/netskope-threat-labs/cloud-threat-report

[^6]: AI Security in Practice, "The Shadow AI Problem", Article 6.06. See [AI Supply Chain Attacks](/emerging-threats-and-research/ai-supply-chain-attacks/) for related content on unauthorised AI usage risks.

[^7]: OWASP, "Top 10 for LLM Applications 2025: LLM06 Excessive Agency". Available at: https://genai.owasp.org/llmrisk/llm062025-excessive-agency/

[^8]: AI Security in Practice, ["The RAG Trap"](/defend-and-harden/rag-trap/), Article 3.11 on this site.

[^9]: OWASP, "Top 10 for LLM Applications 2025". Available at: https://genai.owasp.org/

[^10]: AI Security in Practice, "How LLMs Work: A Security Engineer's Guide to Tokenisation, Attention, and RLHF", Article 1.01 on this site.

[^11]: Greshake, K. et al., "Not what you've signed up for: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection" (2023). Available at: https://arxiv.org/abs/2302.12173

[^12]: MITRE, "ATLAS: Adversarial Threat Landscape for AI Systems". Available at: https://atlas.mitre.org/

[^13]: AI Security in Practice, ["Building a Home AI Security Lab"](/foundations/home-ai-security-lab/), Article 1.03 on this site.

[^14]: Microsoft, "PyRIT: Python Risk Identification Toolkit for generative AI". Available at: https://github.com/Azure/PyRIT

[^15]: AI Security in Practice, ["PyRIT from Zero to Red Team"](/attack-and-red-team/pyrit-zero-to-red-team/), Article 2.01 on this site.

[^16]: NVIDIA, "Garak: LLM Vulnerability Scanner". Available at: https://github.com/NVIDIA/garak

[^17]: AI Security in Practice, ["The NIST AI RMF Implementation Guide"](/governance-risk-compliance/the-nist-ai-rmf-implementation-guide/) provides risk register templates and worked examples.

[^18]: NIST, "AI Risk Management Framework (AI RMF 1.0)", NIST AI 100-1, January 2023. Available at: https://www.nist.gov/itl/ai-risk-management-framework

[^19]: AI Security in Practice, "AI Incident Response: The Playbook Your SOC Doesn't Have Yet", Article 5.06 on this site.

[^20]: AI Security in Practice, ["Guardrails Engineering"](/defend-and-harden/guardrails-engineering/), Article 3.01 on this site.

[^21]: LangFuse, "Open Source LLM Observability". Available at: https://langfuse.com/
