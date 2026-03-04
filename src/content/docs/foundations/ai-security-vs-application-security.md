---
title: "AI Security vs Application Security: What Changes and What Doesn't"
description: "A two-column comparison of what transfers directly from traditional AppSec to AI security and what is genuinely new, with a worked example assessing a traditional API endpoint versus an LLM endpoint using the same threat-modelling framework."
sidebar:
  order: 8
---

**Series:** AI Security in Practice<br/>
**Pillar:** 1: Foundations<br/>
**Difficulty:** Beginner-Intermediate<br/>
**Author:** Paul Lawlor<br/>
**Date:** 21 February 2026<br/>
**Reading time:** 14 minutes

> A two-column comparison of what transfers directly from traditional AppSec to AI security and what is genuinely new, with a worked example assessing a traditional API endpoint versus an LLM endpoint using the same threat-modelling framework.

---

## Table of Contents

1. [The Pivot: Why Experienced Security Engineers Are the Best Candidates for AI Security](#1-the-pivot-why-experienced-security-engineers-are-the-best-candidates-for-ai-security)
2. [What Transfers Directly: Threat Modelling, Least Privilege, Input Validation, Dependency Scanning](#2-what-transfers-directly-threat-modelling-least-privilege-input-validation-dependency-scanning)
3. [What Is Genuinely New: Non-Determinism, Prompt Injection, Model-as-Untrusted-Code, Data as Attack Surface](#3-what-is-genuinely-new-non-determinism-prompt-injection-model-as-untrusted-code-data-as-attack-surface)
4. [Agent Chains and Tool-Use Authorisation: The New Frontier](#4-agent-chains-and-tool-use-authorisation-the-new-frontier)
5. [Worked Example: Assessing a Traditional API Endpoint vs an LLM Endpoint](#5-worked-example-assessing-a-traditional-api-endpoint-vs-an-llm-endpoint)
6. [The 60/40 Rule: You Already Know More Than You Think](#6-the-6040-rule-you-already-know-more-than-you-think)

---

## 1. The Pivot: Why Experienced Security Engineers Are the Best Candidates for AI Security

You have spent years finding SQL injection in web applications, reviewing architecture diagrams for broken authentication, or writing detection rules for your SIEM. Now someone has asked you to "cover AI security." The temptation is to feel unqualified. You are not.

The fastest-growing demographic in AI security is not machine learning researchers pivoting to security. It is security engineers, pentesters, and SOC analysts being told "we need someone to own this." A 2024 McKinsey survey found that 72% of organisations had adopted AI in at least one business function. [^1] The security teams responsible for those systems did not grow at the same rate. The gap is being filled by people who already understand how to break and defend software, and who are now learning the AI-specific layer on top.

This article is for that person. It maps what you already know to what you need to learn, honestly separates the familiar from the genuinely new, and provides a worked example showing how the same threat-modelling discipline applies to both a traditional API and an LLM endpoint. The goal is not to minimise the learning curve. AI systems introduce real, novel risks that traditional application security does not address. But the goal is to show that the curve is shorter than it looks, and that the instincts you have built over years of security work are more transferable than you might expect.

The structure is straightforward. Section 2 covers what transfers directly. Section 3 covers what is genuinely new. Section 4 addresses the newest frontier: agent chains and tool-use authorisation. Section 5 walks through a side-by-side threat model comparison. Section 6 frames the overall balance and points you to where to go next.

---

## 2. What Transfers Directly: Threat Modelling, Least Privilege, Input Validation, Dependency Scanning

The core disciplines of application security do not become obsolete when the application includes an LLM. They become more important, because the attack surface is larger and the failure modes are less predictable.

### Threat modelling

The practice of drawing data flow diagrams, identifying trust boundaries, and enumerating threats applies to AI systems with no modification to the methodology. STRIDE, attack trees, and kill chain analysis all work. The entities on the diagram change (you now have a model, a vector database, a retrieval pipeline, and tool-calling endpoints), but the process of asking "what can go wrong at each boundary?" is identical. [^2] The **OWASP Top 10 for LLM Applications** provides a threat taxonomy purpose-built for this, playing the same role that the OWASP Web Application Top 10 plays for traditional applications. [^3] **MITRE ATLAS** extends ATT&CK with AI-specific techniques, so if your organisation already uses ATT&CK for threat modelling, the mental model scales naturally. [4]

### Least privilege

The principle of granting minimum necessary access is, if anything, more critical in AI systems than in traditional ones. An LLM with database credentials that include write permissions is a more dangerous misconfiguration than a web application with the same flaw, because the LLM can be manipulated by an attacker through its input channel in ways a deterministic application cannot. The OWASP LLM Top 10 lists Excessive Agency (LLM06) as a top risk, and the root cause in most cases is excessive permissions granted to the model or its extensions. [^5] If you have spent years enforcing least privilege on service accounts and API tokens, the same discipline applies directly. The difference is that you are now constraining an entity whose behaviour you cannot fully predict.

### Input validation

Every AppSec engineer understands that untrusted input must be validated before it reaches a sensitive operation. The same principle applies to LLM systems, with one important extension: in AI systems, untrusted input arrives through more channels than a traditional web application. User prompts are the obvious input. But RAG-retrieved documents, tool outputs, API responses fed back into the model, and even system prompt components loaded from configuration stores are all inputs that can carry adversarial content. [^6] The **OWASP ASVS 5.0** (May 2025) codifies injection prevention requirements for traditional contexts (SQL, OS commands, LDAP, XPath), and the same rigour of "validate and encode at the boundary" applies when building the wrapper logic around an LLM. [^7] The input is natural language rather than structured data, which makes validation harder, but the principle that no input should be trusted by default is unchanged.

### Dependency scanning

AI systems have dependencies beyond code libraries. They depend on models (which can contain serialised malicious payloads), training datasets (which can be poisoned), vector databases (which can contain adversarial embeddings), and framework plugins (which may have excessive permissions). [^8] Traditional dependency scanning (SCA, SBOM generation, licence compliance) still applies to the code layer. What extends is the scope: you now need to scan model files for malicious payloads (tools like **ModelScan** [^9] and **Fickling** [^10] serve this purpose), verify dataset provenance, and audit the security posture of vector database configurations.

### Secure SDLC thinking

The discipline of integrating security into the development lifecycle (requirements, design, implementation, testing, deployment, monitoring) transfers wholesale. The stages are the same. What changes is the content within each stage: design reviews now include model selection and RAG architecture; testing now includes adversarial red teaming alongside traditional DAST; and monitoring now includes LLM interaction logging alongside application performance metrics. [^11]

---

## 3. What Is Genuinely New: Non-Determinism, Prompt Injection, Model-as-Untrusted-Code, Data as Attack Surface

Not everything transfers. AI systems introduce categories of risk that have no direct analogue in traditional application security. Understanding these is where the real learning investment lies.

### Non-deterministic outputs

Traditional applications are deterministic: the same input produces the same output. You can write a test, assert against the expected result, and move on. LLMs are stochastic. The same prompt can produce different responses across invocations due to temperature settings and sampling strategies. [^12] This has profound implications for security testing. You cannot write a single test that proves an LLM will never produce a harmful output. You can only reduce the probability through layered controls (system prompt constraints, output filtering, guardrails) and measure residual risk through statistical red teaming across many runs. This is a genuine paradigm shift for anyone accustomed to deterministic pass/fail security testing.

### Prompt injection as a new bug class

SQL injection exploits the boundary between code and data in a database query. Prompt injection exploits the same conceptual boundary in an LLM, but with a critical difference: there is no architectural separation between instructions and data. [^3] Everything the model processes (system prompt, user input, RAG-retrieved content, tool outputs) enters the same context window as an undifferentiated token stream. The model has no mechanism to privilege instructions over data. This means that adversarial content in any input channel can override the system prompt's instructions. Direct prompt injection targets the user input channel. Indirect prompt injection targets external data sources that the model retrieves or receives. [^6] Both exploit the same fundamental architectural limitation. Traditional injection prevention relies on parameterised queries or context-aware encoding, both of which depend on the interpreter distinguishing between code and data. LLMs cannot make this distinction, which is why prompt injection has no complete technical fix today. [^3] The OWASP LLM Top 10 ranks it as LLM01 for this reason.

### The model-as-untrusted-code mental shift

In traditional AppSec, the application code is written by your developers and reviewed by your team. You trust the code (after review) and distrust the input. With LLMs, the model itself must be treated as untrusted. Its outputs are not deterministic, not fully auditable, and can be manipulated by adversarial input. This is closer to treating the model as an untrusted third-party service that may return malicious content at any time. [^3] The practical implication is that every output from an LLM should be validated, sanitised, and constrained before it reaches a downstream system, a user interface, or a tool invocation. The OWASP LLM Top 10 captures this as LLM05 (Improper Output Handling). If you are accustomed to sanitising user input before it reaches the database, the mental model is similar, but now you are also sanitising the output of your own application's core processing component.

### Data as attack surface

In traditional applications, the data layer (database content, file storage) is a target for theft or corruption, but it does not typically change the application's control flow. In AI systems, data actively influences model behaviour. RAG-retrieved documents become part of the model's input context and can carry adversarial instructions. [^13] Training data, if poisoned, can embed persistent backdoors or bias model outputs in ways that are difficult to detect post-deployment. [^14] [^16] Vector database content can be manipulated to steer retrieval results toward attacker-controlled content. [^15] This means that data governance, provenance tracking, and content integrity are not compliance exercises. They are security controls that directly affect the application's vulnerability surface.

---

## 4. Agent Chains and Tool-Use Authorisation: The New Frontier

The risks described in Section 3 are amplified significantly when LLMs are given agency: the ability to call tools, invoke APIs, execute code, or orchestrate other models. This is the fastest-evolving area of AI security and the one with the weakest established defences.

### How agent chains work

An AI agent is an LLM that can take actions in the world. It receives a task, reasons about what steps are needed, selects tools from a set of available extensions, executes those tools, observes the results, and iterates. [^5] Multi-step agent chains compound this: the output of one model invocation feeds into the next, and the output of tool calls feeds back into the model's context. Each step in the chain is an opportunity for adversarial content to influence subsequent steps.

The **Model Context Protocol (MCP)**, introduced by Anthropic and now adopted by multiple IDE and agent frameworks, standardises how agents discover and invoke tools. [^17] MCP provides a structured interface for tool descriptions, parameter schemas, and execution, but the security model is still emerging. An MCP server that exposes a file system read tool, a database query tool, and a shell execution tool to an agent has created a trust boundary problem that looks like a confused deputy attack from traditional security research.

### Why this is harder than traditional API security

In a traditional web application, the set of API calls the application can make is fixed at deployment time. You can enumerate every endpoint, review every parameter, and test every path. With tool-using agents, the set of actions is determined at runtime by the model's interpretation of the user's request. The model decides which tools to call, with what parameters, and in what sequence. This means the attack surface is dynamic and cannot be fully enumerated through static analysis.

The OWASP LLM Top 10 addresses this through LLM06 (Excessive Agency), which identifies three root causes: excessive functionality (the agent has access to tools it does not need), excessive permissions (tools have more access than required), and excessive autonomy (high-impact actions proceed without human approval). [^5] The defences are familiar to any AppSec engineer: minimise the tools available, enforce least privilege on tool permissions, require confirmation for destructive operations, and implement authorisation checks in downstream systems rather than relying on the model to self-police. [^5]

### Practical controls

For practitioners coming from AppSec, the agent security challenge maps to patterns you already know, applied to a new context:

- **API gateway patterns** apply to tool invocation endpoints. Rate limiting, authentication, and request validation at the tool boundary prevent abuse.
- **RBAC and ABAC** apply to tool permissions. An agent acting on behalf of a user should inherit that user's authorisation scope, not operate with a privileged service account.
- **Confirmation gates** are the equivalent of "are you sure?" dialogs for destructive operations. Any tool invocation that modifies data, sends communications, or accesses sensitive resources should require explicit human approval. [^5]
- **Audit logging** of every tool invocation, including the model's reasoning for the call, the parameters passed, and the result returned, provides the forensic trail that incident responders need.

The tooling is maturing. Article 3.12 on this site covers function calling security in depth, and Article 3.09 covers MCP-specific risks. [^18] [^19]

---

## 5. Worked Example: Assessing a Traditional API Endpoint vs an LLM Endpoint

To make the comparison concrete, consider two systems that serve the same business function: answering customer questions about their account. One is a traditional REST API. The other is an LLM-powered chatbot with RAG and tool-calling capability. Both are assessed using the same threat-modelling framework.

### The traditional API endpoint

**System:** `GET /api/v1/account/{id}/summary` returns a JSON object with account balance, recent transactions, and account status. Authenticated via OAuth 2.0 bearer token. Input is a path parameter (account ID) and optional query parameters for date range.

| Assessment area | Findings |
|---|---|
| **Input validation** | Account ID validated against integer format. Date range parameters validated against ISO 8601. Invalid input returns 400. |
| **Authentication and authorisation** | OAuth 2.0 token required. Token scopes enforce that users can only access their own account. IDOR testing confirms authorisation boundary holds. |
| **Injection** | Parameterised database queries. No dynamic SQL construction. SQL injection not feasible. |
| **Output handling** | JSON schema enforced. Response body contains only defined fields. No dynamic content rendering. |
| **Rate limiting** | 100 requests per minute per authenticated user. 429 response on exceed. |
| **Logging** | Request/response logged with correlation ID. PII redacted in logs. |

This is a well-understood assessment. The attack surface is small, the inputs are structured, and the outputs are deterministic. Most AppSec engineers can complete this review in a few hours.

### The LLM chatbot endpoint

**System:** `POST /api/v1/chat` accepts a natural language message and returns a natural language response. The system uses RAG to retrieve relevant account documentation and has tool-calling capability to query account balances via a database function. Authenticated via the same OAuth 2.0 flow.

| Assessment area | Findings | What changed |
|---|---|---|
| **Input validation** | User input is natural language. Cannot validate against a fixed schema. Length limits and content filters applied, but adversarial input that passes filters can still manipulate behaviour. [^3] | Input is unstructured. Schema validation insufficient. |
| **Authentication and authorisation** | OAuth 2.0 token required. But the model's tool calls to the database execute with a service account, not the user's token. A prompt injection could potentially query another user's account data. [^5] | Authorisation must extend to tool invocations, not only to the chat endpoint. |
| **Injection** | Prompt injection is feasible. Direct injection via user message. Indirect injection possible via RAG-retrieved documents containing adversarial instructions. No parameterised query equivalent exists for natural language input. [^3] [^6] | New injection class with no complete technical fix. |
| **Output handling** | Response is natural language. May contain hallucinated data, leaked system prompt fragments, or content from RAG documents not intended for the user. Output filtering catches some categories but cannot guarantee safety. [^3] | Output is non-deterministic and partially uncontrollable. |
| **Rate limiting** | Token-based rate limiting (input + output tokens per minute). Cost exposure is higher: a single adversarial prompt can trigger expensive multi-step tool chains. [^20] | Cost and resource consumption are harder to predict and bound. |
| **Logging** | Full prompt and response logging required for security audit, but raises data protection concerns (prompts may contain PII). Tool call parameters and results must also be logged. [^11] | Logging scope is larger and creates a tension with data minimisation. |

### What the comparison reveals

The assessment methodology is the same: identify inputs, trace data flows, enumerate threats at trust boundaries, assess controls. An AppSec engineer can run both assessments. But the LLM assessment requires additional knowledge in four specific areas:

1. **Prompt injection as a threat class** (replacing SQL injection as the primary injection concern).
2. **Tool-use authorisation** (the model's downstream calls must be authorised in the user's context, not a service account's).
3. **Non-deterministic output validation** (output filtering is probabilistic, not deterministic).
4. **Data-as-attack-surface** (RAG content and tool responses can carry adversarial payloads).

These four areas are where the learning investment lies. The rest of the assessment, around 60% of the work, uses skills you already have.

---

## 6. The 60/40 Rule: You Already Know More Than You Think

If you have followed the comparison through this article, a pattern emerges. Roughly 60% of what AI security requires is existing application security discipline applied to new system architectures. Threat modelling, least privilege, input validation, dependency scanning, secure SDLC integration, logging, incident response, and governance all transfer directly. The remaining 40% is genuinely new: prompt injection, non-deterministic behaviour, model-as-untrusted-code, data as active attack surface, and agent authorisation.

That 60/40 split matters because it tells you where to spend your time. Do not re-learn threat modelling from scratch for AI systems. Apply the methodology you already know to the new components. Do invest dedicated time in understanding prompt injection mechanics, because no amount of AppSec experience will make this intuitive without hands-on practice. Article 2.02 on this site provides a field manual of techniques that still work in 2026. [^21] Article 1.03 walks through building a home lab where you can practise these attacks safely. [^22]

The following table summarises the mapping for quick reference:

| AppSec skill | AI security application | What changes |
|---|---|---|
| Threat modelling (STRIDE, kill chains) | Same methodology, new components (model, RAG, vector DB, tools) | Add OWASP LLM Top 10 and MITRE ATLAS to your taxonomy |
| Input validation | Validate all input channels including RAG content and tool outputs | Input is natural language; validation is probabilistic, not deterministic |
| Least privilege | Apply to model permissions, tool access, and data retrieval scope | The entity being constrained is non-deterministic |
| Dependency scanning (SCA, SBOM) | Extend to model files, datasets, and vector database content | New artefact types require new scanning tools |
| Secure SDLC | Same lifecycle stages, new content at each stage | Add adversarial red teaming and LLM interaction logging |
| Penetration testing | Add AI-specific techniques (prompt injection, jailbreaking, data extraction) | Outcomes are probabilistic; testing requires statistical approaches |
| Incident response | Same OODA loop, new indicators of compromise | LLM-specific IOCs (prompt injection patterns, anomalous tool calls) |

### Where to go next

If you are starting the transition, three actions will cover the most ground in the shortest time:

1. **Read the OWASP Top 10 for LLM Applications.** [^3] It is the AI equivalent of the document you already know. Article 1.02 on this site provides a practitioner walkthrough. [^23]

2. **Build a local lab and try prompt injection yourself.** Reading about it is not enough. Article 1.03 provides the setup guide, and you can have a vulnerable chatbot running locally in an afternoon. [^22]

3. **Assess one AI system in your organisation using the same threat model template you use for web applications.** The worked example in Section 5 provides the structure. Start with the highest-risk system and learn by doing.

The transition from AppSec to AI security is not a career reset. It is an upgrade. The fundamentals you have built over years of security work are the foundation. The AI-specific layer is the addition. You already know more than you think.

### Further reading

The following articles on this site provide deeper coverage for each area discussed:

| Topic | Article |
|---|---|
| LLM fundamentals for security engineers | 1.01 How LLMs Work: A Security Engineer's Guide |
| OWASP LLM Top 10 walkthrough | 1.02 The AI Threat Landscape: OWASP LLM Top 10 Explained |
| Hands-on lab environment | 1.03 Building a Home AI Security Lab |
| First 90 days in the role | 1.07 Your First 90 Days as an AI Security Engineer |
| Skills prioritisation | 1.09 The AI Security Skills Map |
| Prompt injection techniques | 2.02 Prompt Injection Field Manual |
| Red teaming with PyRIT | 2.01 PyRIT from Zero to Red Team |
| MCP security | 3.09 The MCP Trap: Model Context Protocol Security |
| Function calling security | 3.12 The Function Calling Minefield |
| MITRE ATLAS threat modelling | 2.06 The MITRE ATLAS Playbook |

---

[^1]: McKinsey & Company, "The state of AI in early 2024: Gen AI adoption spikes and starts to generate value" (May 2024). Available at: https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai-2024

[^2]: AI Village, "Threat Modeling LLM Applications". Available at: https://aivillage.org/large%20language%20models/threat-modeling-llm/

[^3]: OWASP, "Top 10 for LLM Applications 2025". Available at: https://genai.owasp.org/

[^4]: MITRE, "ATLAS: Adversarial Threat Landscape for AI Systems". Available at: https://atlas.mitre.org/

[^5]: OWASP, "Top 10 for LLM Applications 2025: LLM06 Excessive Agency". Available at: https://genai.owasp.org/llmrisk/llm062025-excessive-agency/

[^6]: Greshake, K. et al., "Not what you've signed up for: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection" (2023). Available at: https://arxiv.org/abs/2302.12173

[^7]: OWASP, "Application Security Verification Standard (ASVS) 5.0" (May 2025). Available at: https://owasp.org/www-project-application-security-verification-standard/

[^8]: OWASP, "Top 10 for LLM Applications 2025: LLM03 Supply Chain". Available at: https://genai.owasp.org/llmrisk/llm032025-supply-chain/

[^9]: ProtectAI, "ModelScan: Protection Against ML Model Serialization Attacks". Available at: https://github.com/protectai/modelscan

[^10]: Trail of Bits, "Fickling: A Python Pickling Decompiler and Static Analyzer". Available at: https://github.com/trailofbits/fickling

[^11]: NIST, "AI Risk Management Framework (AI RMF 1.0)", NIST AI 100-1, January 2023. Available at: https://www.nist.gov/itl/ai-risk-management-framework

[^12]: AI Security in Practice, "How LLMs Work: A Security Engineer's Guide to Tokenisation, Attention, and RLHF", Article 1.01 on this site.

[^13]: AI Security in Practice, "The RAG Trap: When Your AI Coding Assistant Learns from Poisoned Documentation", Article 3.11 on this site.

[^14]: Carlini, N. et al., "Poisoning Web-Scale Training Datasets is Practical" (2023). Available at: https://arxiv.org/abs/2302.10149

[^15]: OWASP, "Top 10 for LLM Applications 2025: LLM08 Vector and Embedding Weaknesses". Available at: https://genai.owasp.org/llmrisk/llm082025-vector-and-embedding-weaknesses/

[^16]: OWASP, "Top 10 for LLM Applications 2025: LLM04 Data and Model Poisoning". Available at: https://genai.owasp.org/llmrisk/llm042025-data-and-model-poisoning/

[^17]: Anthropic, "Model Context Protocol Specification". Available at: https://modelcontextprotocol.io/

[^18]: AI Security in Practice, "The Function Calling Minefield: Do's and Don'ts for LLM Tool Use", Article 3.12 on this site.

[^19]: AI Security in Practice, "The MCP Trap: Do's and Don'ts for Model Context Protocol Security", Article 3.09 on this site.

[^20]: OWASP, "Top 10 for LLM Applications 2025: LLM10 Unbounded Consumption". Available at: https://genai.owasp.org/llmrisk/llm102025-unbounded-consumption/

[^21]: AI Security in Practice, "Prompt Injection Field Manual: 20 Techniques That Still Work in 2026", Article 2.02 on this site.

[^22]: AI Security in Practice, "Building a Home AI Security Lab: Hardware, Software, and First Experiments", Article 1.03 on this site.

[^23]: AI Security in Practice, "The AI Threat Landscape: OWASP LLM Top 10 Explained for Practitioners", Article 1.02 on this site.
