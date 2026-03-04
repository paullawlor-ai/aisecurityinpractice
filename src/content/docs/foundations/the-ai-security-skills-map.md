---
title: "The AI Security Skills Map: What You Actually Need to Know"
description: "A structured skills taxonomy for AI security practitioners, divided into three honest tiers: what you must know now, what you should learn within six months, and what you can safely deprioritise."
sidebar:
  order: 9
---

**Series:** AI Security in Practice<br/>
**Pillar:** 1: Foundations<br/>
**Difficulty:** Beginner<br/>
**Author:** Paul Lawlor<br/>
**Date:** 21 February 2026<br/>
**Reading time:** 13 minutes

> A structured skills taxonomy for AI security practitioners, divided into three honest tiers: what you must know now, what you should learn within six months, and what you can safely deprioritise.

---

## Table of Contents

1. [Why a Skills Map Matters: The Antidote to Imposter Syndrome](#1-why-a-skills-map-matters-the-antidote-to-imposter-syndrome)
2. [Tier 1: Must Know Now](#2-tier-1-must-know-now)
3. [Tier 2: Should Know Within Six Months](#3-tier-2-should-know-within-six-months)
4. [Tier 3: Useful but Optional](#4-tier-3-useful-but-optional)
5. [How to Use This Map: Self-Assessment and Learning Paths](#5-how-to-use-this-map-self-assessment-and-learning-paths)
6. [Linked Site Articles for Each Skill](#6-linked-site-articles-for-each-skill)

---

## 1. Why a Skills Map Matters: The Antidote to Imposter Syndrome

The most common question from people entering AI security is not "how does prompt injection work?" It is "what do I actually need to know?" The question is reasonable. The field is young, the terminology is borrowed from three different disciplines (machine learning, cybersecurity, and software engineering), and the volume of research papers, vendor announcements, and framework releases makes it impossible to read everything. The result is a pervasive sense that everyone else knows more than you do.

They do not. AI security is a field where the median practitioner has less than two years of focused experience. [^1] A 2024 ISC2 study found that 92% of cybersecurity professionals reported skills gaps in their organisations, with AI and machine learning security ranking as the most acute shortage area. [^2] The gap is not personal. It is structural. The field is expanding faster than any individual can track.

This article is the antidote to that feeling. It provides a structured skills taxonomy divided into three tiers: what you must know now to do the job, what you should learn within six months to do it well, and what is useful but optional for most practitioners. Each skill is mapped to a specific article on this site so you can go directly from awareness to depth.

The tiers are not a judgement of intellectual rigour. They are a triage framework based on what attackers are exploiting today, what organisations are being audited against today, and what real-world AI security incidents have exposed as the most common failure points. [^3] If you know everything in Tier 1 and nothing in Tier 3, you are more effective than someone who has read every adversarial ML paper but cannot map trust boundaries in a RAG pipeline.

Two principles underpin the map. First, depth in fewer areas beats shallow coverage across many. A practitioner who deeply understands prompt injection mechanics and can demonstrate them in a lab is more valuable than one who can name twenty attack categories but cannot execute any. Second, the map is a living document. The field evolves quarterly, not annually. Skills that are Tier 3 today may be Tier 1 within a year if threat actors or regulators force the shift. [^4]

---

## 2. Tier 1: Must Know Now

These are the skills you need in the first 30 days. If you are starting an AI security role, being asked to assess an AI system, or building security requirements for an LLM-powered product, these are non-negotiable. Every skill in this tier maps to either an active attack vector, a regulatory requirement, or a common architectural decision you will encounter immediately.

### Prompt injection: the attack class that defines the field

Prompt injection is to AI security what SQL injection was to web application security in the early 2000s: the defining vulnerability that shapes how practitioners think about the entire domain. Understanding how direct and indirect prompt injection work, why the vulnerability exists at the architectural level (there is no separation between instructions and data in an LLM context window), and what mitigations reduce risk without eliminating it is the single most important technical skill. [^5] You do not need to be able to write novel attack payloads. You need to understand the mechanism well enough to assess whether a system is exposed and whether its defences are proportionate.

**Go deeper:** [Article 2.02 (Prompt Injection Field Manual)](/attack-and-red-team/prompt-injection-field-manual/) provides a taxonomy of twenty techniques. [Article 2.08 (The Prompt Injection Trap)](/attack-and-red-team/prompt-injection-trap/) covers production defences. [^6]

### The OWASP LLM Top 10: your threat vocabulary

The **OWASP Top 10 for LLM Applications (2025)** is the shared language of AI security risk. It covers prompt injection (LLM01), sensitive information disclosure (LLM02), supply chain risks (LLM03), data and model poisoning (LLM04), improper output handling (LLM05), excessive agency (LLM06), system prompt leakage (LLM07), vector and embedding weaknesses (LLM08), misinformation (LLM09), and unbounded consumption (LLM10). [^7] You do not need to memorise every mitigation strategy on day one. You need to recognise each risk when you see it in a system architecture and know where to look for guidance.

**Go deeper:** [Article 1.02 (The AI Threat Landscape)](/foundations/ai-threat-landscape/) walks through each risk with real-world examples. [^8]

### RAG architecture: the pattern you will encounter most often

Retrieval-Augmented Generation is the dominant architecture for enterprise LLM applications. It combines a language model with a retrieval system (typically a vector database) that provides relevant context from an organisation's documents. [^9] Understanding the data flow (document ingestion, chunking, embedding, retrieval, prompt assembly, generation) is essential because each stage introduces security considerations: document poisoning at ingestion, embedding manipulation in the vector store, and indirect prompt injection via retrieved content. You do not need to build a RAG pipeline from scratch. You need to draw its data flow diagram and identify the trust boundaries.

**Go deeper:** [Article 3.02 (Building a Secure RAG Pipeline)](/defend-and-harden/building-secure-rag-pipeline/) covers the full architecture. [Article 3.11 (The RAG Trap)](/defend-and-harden/rag-trap/) covers poisoning attacks specifically. [^10]

### Basic model serving: how models run in production

You will encounter models served through cloud APIs (AWS Bedrock, Azure OpenAI, Google Vertex AI), through self-hosted inference servers (vLLM, TGI, Triton), or through local runtimes (Ollama). Understanding the difference between these deployment models matters for security assessment because the trust boundaries, data residency implications, and available controls vary significantly. [^11] A model served through a cloud API has a different threat profile from one running on a GPU in your data centre. You do not need to configure inference servers. You need to understand which deployment model your organisation uses and what that means for data flow and access control.

**Go deeper:** Articles 4.01 through 4.03 cover AWS Bedrock, Azure OpenAI, and Google Vertex AI security architecture respectively. Article 3.08 covers self-hosted serving infrastructure. [^12]

### Trust boundary analysis: the skill that ties everything together

Trust boundary analysis is the application of threat modelling to AI system architectures. It is the skill of looking at a system diagram and asking: where does untrusted data enter? Where does the model's output go? What can the model access? Who authorises tool invocations? [^13] If you have experience with threat modelling in traditional application security (STRIDE, attack trees, data flow diagrams), this skill transfers directly. The new elements are the model itself (which must be treated as an untrusted component), the RAG retrieval pipeline (which introduces data-as-attack-surface), and tool-calling interfaces (which create dynamic authorisation challenges). **MITRE ATLAS** extends the ATT&CK framework with AI-specific tactics and techniques, providing a structured vocabulary for the threats you will map at each boundary. [^14]

**Go deeper:** [Article 1.08 (AI Security vs Application Security)](/foundations/ai-security-vs-application-security/) includes a worked example comparing a traditional API assessment with an LLM endpoint assessment. Article 2.06 covers MITRE ATLAS in detail. [^15]

---

## 3. Tier 2: Should Know Within Six Months

These skills become important as you move beyond initial assessments into deeper security architecture work, red teaming, and programme building. They are not required on day one, but within six months of working in AI security, gaps in these areas will limit your effectiveness.

### Fine-tuning risks: when training data becomes an attack vector

Fine-tuning is the process of adapting a pre-trained model to a specific task using additional training data. The security concern is that malicious data introduced during fine-tuning can embed persistent backdoors, bias the model toward specific outputs, or degrade safety alignment. [^16] The Anthropic sleeper agents research demonstrated that deceptive behaviours introduced during fine-tuning can persist through subsequent safety training. [^17] Understanding fine-tuning risks matters because your organisation may be fine-tuning models on proprietary data, using third-party fine-tuned models, or consuming models from Hugging Face without verifying their training provenance. You need to know what questions to ask about data lineage and what scanning tools (ModelScan, Fickling) can detect known malicious payloads in model files. [^18]

**Go deeper:** Article 3.14 (ModelScan and Fickling) covers model scanning. Article 6.02 (Sleeper Agent Attacks) covers backdoors in fine-tuned models. [^19]

### Agent framework security: LangChain, LlamaIndex, and Semantic Kernel

AI agent frameworks are the middleware layer between models and tools. They orchestrate multi-step reasoning, tool selection, and execution. The three dominant frameworks (LangChain, LlamaIndex, and Semantic Kernel) ship with default configurations that prioritise functionality over security. [^20] Common risks include excessive tool permissions, unvalidated tool inputs, memory and context leakage between sessions, and dependency vulnerabilities in framework plugins. Understanding how these frameworks work, and where their default trust assumptions diverge from your security requirements, is essential for anyone reviewing AI applications built on them.

**Go deeper:** Article 3.13 (The Agent Framework Security Gap) provides framework-specific hardening guides. [^21]

### Cloud AI platform security: Bedrock, Azure OpenAI, Vertex AI

Most enterprise AI deployments use one of the three major cloud AI platforms. Each has a distinct shared responsibility model, different guardrail capabilities, and platform-specific security controls. [^22] Understanding the security architecture of the platform your organisation uses (IAM integration, data encryption, network isolation, logging, content filtering) is necessary for conducting meaningful security reviews. The shared responsibility boundary is particularly important: providers secure the model hosting infrastructure, but organisations are responsible for prompt design, data handling, output validation, and access control at the application layer. [^23]

**Go deeper:** Articles 4.01 through 4.03 cover each platform in depth. Article 4.09 (The Shared Responsibility Trap) covers common misunderstandings about what the cloud provider does and does not secure. [^24]

### MCP and tool-use patterns: the expanding attack surface

The **Model Context Protocol (MCP)** standardises how AI agents discover and invoke external tools. As more applications adopt MCP and tool-calling patterns, the security surface expands to include tool parameter injection, confused deputy attacks, credential harvesting through tool invocations, and privilege escalation via tool chains. [^25] Understanding how tool-use authorisation works, how to enforce least privilege on tool access, and how to implement confirmation gates for high-risk operations is increasingly necessary as AI applications move from simple chat interfaces to autonomous tool-using agents.

**Go deeper:** [Article 3.09 (The MCP Trap)](/defend-and-harden/mcp-trap/) covers MCP-specific risks. Article 3.12 (The Function Calling Minefield) covers tool-use security patterns broadly. [Article 3.10 (The Autonomous Agent Dilemma)](/defend-and-harden/autonomous-agent-dilemma/) covers controls for fully autonomous agents. [^26]

---

## 4. Tier 3: Useful but Optional

These skills are intellectually rewarding and contribute to deep expertise. They are not required for most AI security practitioner roles, and investing time here before mastering Tiers 1 and 2 is a common mistake driven by curiosity rather than operational need.

### Adversarial machine learning theory

Adversarial ML covers techniques for manipulating model behaviour through crafted inputs: evasion attacks (fooling a classifier at inference time), data poisoning (corrupting training data), and model extraction (stealing model weights through the API). [^27] The academic literature is substantial and mathematically rigorous. For most practitioners, understanding the categories and their practical implications is sufficient. The hands-on tools (IBM's **Adversarial Robustness Toolbox**, Microsoft's **Counterfit**) make these techniques accessible without deep mathematical background. Invest here if you are building red team tooling or working on model robustness testing. Deprioritise if your role is architecture review or governance.

**Go deeper:** Article 2.04 (Adversarial Machine Learning for Practitioners) covers practical application using IBM ART. [^28]

### Model internals: attention, tokenisation, and RLHF

Understanding how transformers work (tokenisation, the attention mechanism, context windows, RLHF alignment training) provides intellectual grounding for why certain attacks work. [^29] Knowing that there is no privileged instruction channel in the attention mechanism explains why prompt injection is architecturally fundamental. Knowing that RLHF alignment is behavioural rather than architectural explains why jailbreaks can bypass safety training. This knowledge is genuinely useful for explaining risks to engineering teams and for designing defences that work with the architecture rather than against it. But it is not required for conducting security assessments, running red team exercises, or building governance programmes. Prioritise if you want to contribute to defensive research or communicate AI risks at a technical level to ML engineering teams.

**Go deeper:** Article 1.01 (How LLMs Work: A Security Engineer's Guide) covers the security-relevant internals. [^30]

### Academic attack papers

The AI security research community publishes prolifically. Key papers include Zou et al. on universal adversarial suffixes, Greshake et al. on indirect prompt injection, Carlini et al. on data poisoning at web scale, and Cohen et al. on AI worms. [^31] [^32] [^33] [^34] Staying current with research is valuable for anticipating emerging threats, but the lag between academic publication and real-world exploitation means that most practitioners can consume research summaries and tool implementations rather than reading papers directly. Invest here if you are building detection systems or contributing to open-source security tools. Deprioritise if your primary function is policy, governance, or operational security.

**Go deeper:** [Article 1.11 (The AI Security Reading List)](/foundations/the-ai-security-reading-list/) provides a curated, annotated guide to the papers and resources that matter most. [^35]

### Formal verification and provable safety

Formal methods for verifying AI system properties (provable bounds on model outputs, certified defences against adversarial examples, formal specifications of safety constraints) represent the frontier of AI safety research. [^36] The techniques are mathematically sophisticated and currently limited in their applicability to large language models. For the vast majority of AI security practitioners, this is a "watch this space" area rather than a practical skill requirement. Invest here only if your role intersects with AI safety research or if your organisation operates in a sector (aerospace, medical devices, autonomous vehicles) where formal verification is a regulatory expectation.

---

## 5. How to Use This Map: Self-Assessment and Learning Paths

A skills map without an action plan is a poster. This section turns the taxonomy into something you can use this week.

### Self-assessment: where are you now?

Rate yourself against each skill in the three tiers using a simple three-point scale:

- **Can explain and demonstrate:** You can describe the concept to a colleague and show a practical example (a lab demonstration, a configuration review, an architecture diagram).
- **Can explain but not demonstrate:** You understand the concept well enough to discuss it, but you have not practised it hands-on.
- **Not yet familiar:** You have not encountered this topic in depth.

For Tier 1 skills, the target is "can explain and demonstrate" within 30 days. For Tier 2 skills, the target is at least "can explain" within six months. For Tier 3 skills, awareness that they exist is sufficient for most roles.

### Learning path for career changers from AppSec

If you are transitioning from application security, penetration testing, or SOC work, you already have trust boundary analysis and much of the threat modelling foundation. Your fastest path is:

1. **Week 1:** Read the OWASP LLM Top 10 and [Article 1.02](/foundations/ai-threat-landscape/) on this site. Map each LLM risk to a traditional web application risk you already understand.
2. **Week 2:** Build a home lab using the guide in [Article 1.03](/foundations/home-ai-security-lab/). Run your first prompt injection against a local model.
3. **Weeks 3-4:** Assess one AI system in your organisation using the worked example in [Article 1.08](/foundations/ai-security-vs-application-security/) as a template. Focus on trust boundaries, data flows, and tool-use authorisation.
4. **Month 2:** Explore [PyRIT (Article 2.01)](/attack-and-red-team/pyrit-zero-to-red-team/) or Garak (Article 2.09) for structured red teaming. Run a basic probe against a test system.
5. **Month 3:** Begin Tier 2 skills based on your organisation's specific technology stack.

### Learning path for career changers from ML engineering

If you are transitioning from machine learning engineering or data science, you already understand model internals, fine-tuning, and deployment infrastructure. Your fastest path is:

1. **Week 1:** Read the OWASP LLM Top 10 with a focus on the attack scenarios, not the technical descriptions (you already understand the technology; you need the adversarial mindset).
2. **Week 2:** Learn trust boundary analysis. Study the worked example in [Article 1.08](/foundations/ai-security-vs-application-security/) and apply STRIDE to an AI system you have built or maintain.
3. **Weeks 3-4:** Practise prompt injection. Build or use a vulnerable chatbot and attempt the techniques in [Article 2.02](/attack-and-red-team/prompt-injection-field-manual/). The hands-on experience of attacking a system you understand will build the security mindset faster than any reading.
4. **Month 2:** Study the governance and compliance landscape. The [NIST AI RMF (Article 5.01)](/governance-risk-compliance/the-nist-ai-rmf-implementation-guide/) and OWASP MLSecOps cheat sheet provide the vocabulary you need for conversations with security leadership. [^37]
5. **Month 3:** Begin Tier 2 skills, prioritising agent framework security and cloud platform security based on your organisation's deployment model.

### Learning path for newcomers

If you are entering AI security without deep prior experience in either security or ML, your fastest path is the structured curriculum this site provides:

1. **Weeks 1-2:** Start with [Article 1.01 (How LLMs Work)](/foundations/how-llms-work/) and [Article 1.02 (OWASP LLM Top 10)](/foundations/ai-threat-landscape/). These give you the technical and threat foundations.
2. **Weeks 3-4:** Build a home lab ([Article 1.03](/foundations/home-ai-security-lab/)) and try hands-on exercises. Practical experience is irreplaceable.
3. **Month 2:** Work through [Article 1.07 (Your First 90 Days)](/foundations/your-first-90-days/) as a structured action plan, even if you are not yet in a dedicated AI security role.
4. **Month 3:** Assess your Tier 1 skills against the self-assessment scale above and focus on any remaining gaps.

---

## 6. Linked Site Articles for Each Skill

The table below maps every skill in the taxonomy to the corresponding article on this site. Use it as a reference when you identify a gap in your self-assessment and want to go directly to the relevant material.

### Tier 1 — article links

| Skill | Primary article | Supporting articles |
|---|---|---|
| Prompt injection mechanics | 2.02 Prompt Injection Field Manual | 2.08 The Prompt Injection Trap, 3.15 Rebuff and LLM Guard |
| OWASP LLM Top 10 | 1.02 The AI Threat Landscape | 2.06 The MITRE ATLAS Playbook |
| RAG architecture and security | 3.02 Building a Secure RAG Pipeline | 3.11 The RAG Trap |
| Basic model serving | 4.01 AWS Bedrock Security, 4.02 Azure OpenAI Security, 4.03 Vertex AI Security | 3.08 Securing Model Serving Infrastructure |
| Trust boundary analysis | 1.08 AI Security vs Application Security | 2.06 The MITRE ATLAS Playbook, 1.07 Your First 90 Days |

### Tier 2 — article links

| Skill | Primary article | Supporting articles |
|---|---|---|
| Fine-tuning risks | 6.02 Sleeper Agent Attacks | 3.14 ModelScan and Fickling, 6.05 AI Supply Chain Attacks |
| Agent framework security | 3.13 The Agent Framework Security Gap | 3.10 The Autonomous Agent Dilemma |
| Cloud AI platform security | 4.01-4.03 Platform guides | 4.09 The Shared Responsibility Trap |
| MCP and tool-use patterns | 3.09 The MCP Trap | 3.12 The Function Calling Minefield, 1.04 The Autonomy Ladder |

### Tier 3 — article links

| Skill | Primary article | Supporting articles |
|---|---|---|
| Adversarial ML theory | 2.04 Adversarial Machine Learning | 2.05 Building an AI Security CTF |
| Model internals | 1.01 How LLMs Work | 2.03 Jailbreaking LLMs |
| Academic attack papers | 1.11 The AI Security Reading List | 6.01 AI Worms, 6.02 Sleeper Agents |
| Formal verification | No dedicated article yet | [NIST AI RMF (Article 5.01)](/governance-risk-compliance/the-nist-ai-rmf-implementation-guide/) provides context |

### The quick-start checklist

If you want a single-page action plan, start with these five steps:

1. **Read** the OWASP Top 10 for LLM Applications and [Article 1.02](/foundations/ai-threat-landscape/) on this site. [^7]
2. **Build** a home lab using [Article 1.03](/foundations/home-ai-security-lab/) and practise prompt injection with a local model. [^38]
3. **Assess** one AI system in your organisation using the trust boundary approach from [Article 1.08](/foundations/ai-security-vs-application-security/). [^15]
4. **Rate** yourself against the Tier 1 skills in Section 5 and address any gaps.
5. **Bookmark** this page and revisit quarterly as the field evolves.

This map does not pretend to be comprehensive. It is deliberately incomplete. The goal is to tell you what matters most right now, give you permission to deprioritise the rest, and provide a clear path from "I don't know where to start" to "I know what to learn next." That is enough.

---

[^1]: World Economic Forum, "Future of Jobs Report 2025" (January 2025). Available at: https://www.weforum.org/publications/the-future-of-jobs-report-2025/

[^2]: ISC2, "ISC2 Cybersecurity Workforce Study 2024" (October 2024). Available at: https://www.isc2.org/research/workforce-study

[^3]: OWASP, "Top 10 for LLM Applications 2025". Available at: https://genai.owasp.org/

[^4]: NIST, "Artificial Intelligence Risk Management Framework (AI RMF 1.0)" (January 2023). Available at: https://www.nist.gov/itl/ai-risk-management-framework

[^5]: Greshake, K. et al., "Not what you've signed up for: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection" (2023). Available at: https://arxiv.org/abs/2302.12173

[^6]: AI Security in Practice, ["Prompt Injection Field Manual"](/attack-and-red-team/prompt-injection-field-manual/), Article 2.02; ["The Prompt Injection Trap"](/attack-and-red-team/prompt-injection-trap/), Article 2.08 on this site.

[^7]: OWASP, "Top 10 for LLM Applications 2025". Available at: https://genai.owasp.org/

[^8]: AI Security in Practice, ["The AI Threat Landscape: OWASP LLM Top 10 Explained for Practitioners"](/foundations/ai-threat-landscape/), Article 1.02 on this site.

[^9]: Lewis, P. et al., "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks" (2020). Available at: https://arxiv.org/abs/2005.11401

[^10]: AI Security in Practice, ["Building a Secure RAG Pipeline from Scratch"](/defend-and-harden/building-secure-rag-pipeline/), Article 3.02; ["The RAG Trap"](/defend-and-harden/rag-trap/), Article 3.11 on this site.

[^11]: OWASP, "MLSecOps: Machine Learning Security Operations Cheat Sheet". Available at: https://owasp.org/www-project-machine-learning-security-top-10/

[^12]: AI Security in Practice, Articles 4.01–4.03 (AWS Bedrock, Azure OpenAI, Vertex AI) and Article 3.08 (Securing Model Serving) – see [Zero Trust for AI](/architecture-and-platform/zero-trust-for-ai/) for related platform security content. Some pillar 4 articles are planned.

[^13]: AI Village, "Threat Modeling LLM Applications". Available at: https://aivillage.org/large%20language%20models/threat-modeling-llm/

[^14]: MITRE, "ATLAS: Adversarial Threat Landscape for AI Systems". Available at: https://atlas.mitre.org/

[^15]: AI Security in Practice, ["AI Security vs Application Security"](/foundations/ai-security-vs-application-security/), Article 1.08 on this site; "The MITRE ATLAS Playbook", Article 2.06 (see [MITRE ATLAS](https://atlas.mitre.org/) for framework reference).

[^16]: OWASP, "Top 10 for LLM Applications 2025: LLM04 Data and Model Poisoning". Available at: https://genai.owasp.org/llmrisk/llm042025-data-and-model-poisoning/

[^17]: Hubinger, E. et al., "Sleeper Agents: Training Deceptive LLMs That Persist Through Safety Training", Anthropic (2024). Available at: https://arxiv.org/abs/2401.05566

[^18]: ProtectAI, "ModelScan: Protection Against ML Model Serialization Attacks". Available at: https://github.com/protectai/modelscan

[^19]: AI Security in Practice, Article 3.14 (ModelScan and Fickling) and Article 6.02 (Sleeper Agents) – see [AI Supply Chain Attacks](/emerging-threats-and-research/ai-supply-chain-attacks/) for related content. Some referenced articles are planned.

[^20]: LangChain, "Security Best Practices". Available at: https://python.langchain.com/docs/security/

[^21]: AI Security in Practice, "The Agent Framework Security Gap", Article 3.13. See [The Autonomous Agent Dilemma](/defend-and-harden/autonomous-agent-dilemma/) for related agent security content.

[^22]: AWS, "Security in Amazon Bedrock". Available at: https://docs.aws.amazon.com/bedrock/latest/userguide/security.html

[^23]: AWS, "Shared Responsibility Model for AI Services". Available at: https://aws.amazon.com/compliance/shared-responsibility-model/

[^24]: AI Security in Practice, "The Shared Responsibility Trap", Article 4.09. See [Zero Trust for AI](/architecture-and-platform/zero-trust-for-ai/) for related cloud AI security content.

[^25]: Anthropic, "Model Context Protocol Specification". Available at: https://modelcontextprotocol.io/

[^26]: AI Security in Practice, ["The MCP Trap"](/defend-and-harden/mcp-trap/), Article 3.09; "The Function Calling Minefield", Article 3.12; ["The Autonomous Agent Dilemma"](/defend-and-harden/autonomous-agent-dilemma/), Article 3.10 on this site.

[^27]: NIST, "Adversarial Machine Learning: A Taxonomy and Terminology of Attacks and Mitigations" (NIST AI 100-2e2023). Available at: https://csrc.nist.gov/pubs/ai/100/2/e2023/final

[^28]: AI Security in Practice, "Adversarial Machine Learning for Practitioners", Article 2.04. See [Jailbreaking LLMs](/attack-and-red-team/jailbreaking-llms/) for related attack content.

[^29]: Vaswani, A. et al., "Attention Is All You Need" (2017). Available at: https://arxiv.org/abs/1706.03762

[^30]: AI Security in Practice, ["How LLMs Work: A Security Engineer's Guide to Tokenisation, Attention, and RLHF"](/foundations/how-llms-work/), Article 1.01 on this site.

[^31]: Zou, A. et al., "Universal and Transferable Adversarial Attacks on Aligned Language Models" (2023). Available at: https://arxiv.org/abs/2307.15043

[^32]: Greshake, K. et al., "Not what you've signed up for: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection" (2023). Available at: https://arxiv.org/abs/2302.12173

[^33]: Carlini, N. et al., "Poisoning Web-Scale Training Datasets is Practical" (2024). Available at: https://arxiv.org/abs/2302.10149

[^34]: Cohen, S. et al., "Here Comes the AI Worm: Unleashing Zero-click Worms that Target GenAI-Powered Applications" (2024). Available at: https://arxiv.org/abs/2403.02817

[^35]: AI Security in Practice, ["The AI Security Reading List"](/foundations/the-ai-security-reading-list/), Article 1.11 on this site.

[^36]: Cohen, J. et al., "Certified Adversarial Robustness via Randomized Smoothing" (2019). Available at: https://arxiv.org/abs/1902.02918

[^37]: OWASP, "MLSecOps: Machine Learning Security Operations Cheat Sheet". Available at: https://owasp.org/www-project-machine-learning-security-top-10/

[^38]: AI Security in Practice, ["Building a Home AI Security Lab: Hardware, Software, and First Experiments"](/foundations/home-ai-security-lab/), Article 1.03 on this site.
