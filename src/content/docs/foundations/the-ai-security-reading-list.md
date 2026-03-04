---
title: "The AI Security Reading List: Papers, Communities, and Sources That Matter"
description: "A curated, opinionated guide to the research papers, frameworks, communities, conferences, newsletters, and tools that AI security practitioners actually use, with one-sentence annotations explaining why each resource matters."
sidebar:
  order: 11
---

**Series:** AI Security in Practice<br/>
**Pillar:** 1: Foundations<br/>
**Difficulty:** Beginner<br/>
**Author:** Paul Lawlor<br/>
**Date:** 1 March 2026<br/>
**Reading time:** 10 minutes

> A curated, opinionated guide to the research papers, frameworks, communities, conferences, newsletters, and tools that AI security practitioners actually use, with one-sentence annotations explaining why each resource matters.

---

## Table of Contents

1. [Key Research Papers: The Foundations You Cannot Skip](#1-key-research-papers-the-foundations-you-cannot-skip)
2. [Frameworks and Standards: The Reference Architecture for Your Programme](#2-frameworks-and-standards-the-reference-architecture-for-your-programme)
3. [Communities: Where Practitioners Actually Talk](#3-communities-where-practitioners-actually-talk)
4. [Conferences and Events: Where to Learn and Who to Watch](#4-conferences-and-events-where-to-learn-and-who-to-watch)
5. [Newsletters and Feeds: Curated Signal, Not Noise](#5-newsletters-and-feeds-curated-signal-not-noise)
6. [Tools Directory: Cross-Reference to Hands-On Coverage](#6-tools-directory-cross-reference-to-hands-on-coverage)

---

The most common request from people entering AI security is not for another explanation of prompt injection. It is for a reading list. "Where do I start?" is the question, and the honest answer is that most existing lists are either too academic (fifty papers, no prioritisation) or too shallow (five blog posts and a vendor whitepaper). This article is the middle ground: a curated, opinionated guide to roughly 30 resources that will build a solid foundation for practitioner work in AI security.

Three principles guided the selection. First, every resource must be freely accessible or have a free summary available. Paywalled journals and expensive conference registrations are excluded unless the proceedings are openly published. Second, each entry includes a one-sentence annotation explaining why it matters, not what it is. Third, the list is deliberately short. You can read the essential papers in a weekend, join the key communities in an afternoon, and set up the tool feeds in an hour. The goal is to reduce the time between "I need to learn AI security" and "I am doing AI security."

This is a living page. The field evolves quarterly, and resources that are essential today may be superseded within a year. The list will be updated as significant new papers, frameworks, or community resources emerge.

---

## 1. Key Research Papers: The Foundations You Cannot Skip

The AI security research canon is small enough to read in a weekend and deep enough to anchor your understanding for years. These are the papers that practitioners reference most in threat models, red team reports, and architecture reviews. You do not need to understand every equation. You need to understand the core finding, why it matters for defenders, and what it changed about how the community thinks.

**Greshake et al., "Not What You've Signed Up For: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection" (2023).** This is the paper that formalised indirect prompt injection as a distinct attack class. Before Greshake, most prompt injection discussion focused on users attacking their own sessions. This paper demonstrated that adversaries can inject prompts into data that the model retrieves later, turning web pages, emails, and documents into attack vectors. The practical implication: any LLM with access to external data has an indirect prompt injection surface. The paper demonstrated attacks against Bing Chat and code-completion engines, establishing the threat against real production systems. [^1]

**Zou et al., "Universal and Transferable Adversarial Attacks on Aligned Language Models" (2023).** This paper changed the conversation about LLM safety training. The researchers used gradient-based optimisation to find adversarial suffixes that bypass alignment in multiple models simultaneously. The key finding for practitioners: adversarial suffixes trained on open-source models (Vicuna) transferred to closed-source production systems including ChatGPT, Claude, and Bard. This demonstrated that safety alignment is behavioural, not architectural, and that transferable attacks make "we use a different model" an insufficient defence. [^2]

**Perez et al., "Red Teaming Language Models with Language Models" (2022).** This Anthropic-authored paper introduced the concept of using one LLM to red team another at scale, generating thousands of test cases automatically. It established the methodology that tools like PyRIT and Garak would later operationalise. For practitioners, the key insight is that manual red teaming does not scale, and automated adversarial testing is a necessary component of any AI security programme. [^3]

**Carlini et al., "Poisoning Web-Scale Training Datasets" (2024).** Nicholas Carlini and collaborators demonstrated that an attacker who controls even a small fraction of the data used to train or fine-tune a model can manipulate the model's behaviour in targeted ways. The paper quantified the cost of poisoning attacks against real training pipelines, showing that the barrier to entry is lower than most organisations assume. For defenders, this paper grounds the supply chain risk discussions in concrete numbers. [4]

**Hubinger et al., "Sleeper Agents: Training Deceptive Large Language Models That Persist Through Safety Training" (2024).** This Anthropic research demonstrated that models can be trained to behave normally during evaluation but activate harmful behaviours under specific trigger conditions, and that standard safety training (RLHF, adversarial training) fails to remove these backdoors. This paper is essential reading for anyone involved in model procurement or fine-tuning decisions. [^5]

**Simon Willison's Prompt Injection Series (2022-ongoing).** Not a single paper but a sustained body of writing that has done more to make prompt injection accessible to practitioners than any academic publication. Willison coined the term "prompt injection" in September 2022 and has maintained an ongoing series tracking real-world vulnerabilities, novel attack vectors, and defensive patterns. His blog is the closest thing the field has to a practitioner journal. As of early 2026, the series spans over 140 posts. [^6]

---

## 2. Frameworks and Standards: The Reference Architecture for Your Programme

Research papers tell you what can go wrong. Frameworks tell you how to structure your response. These are the documents that auditors, regulators, and CISOs reference. Knowing them gives you a shared vocabulary with governance teams and a defensible basis for your security recommendations.

**OWASP Top 10 for LLM Applications (2025).** The single most referenced document in AI security conversations. It catalogues ten risks: prompt injection (LLM01), sensitive information disclosure (LLM02), supply chain vulnerabilities (LLM03), data and model poisoning (LLM04), improper output handling (LLM05), excessive agency (LLM06), system prompt leakage (LLM07), vector and embedding weaknesses (LLM08), misinformation (LLM09), and unbounded consumption (LLM10). Use it as your risk vocabulary when talking to developers and as your checklist when assessing LLM-powered systems. Updated annually by a volunteer working group. [^7]

**MITRE ATLAS (Adversarial Threat Landscape for AI Systems).** ATLAS extends the ATT&CK framework to cover AI-specific tactics and techniques across the full attack lifecycle, from reconnaissance through impact. It provides a structured matrix of 16 tactics with associated techniques, organised by maturity level (feasible, demonstrated, realised). Use it for threat modelling AI systems and for mapping observed attack patterns to a standardised taxonomy. It is freely available and updated as new techniques are documented. [^8]

**NIST AI Risk Management Framework (AI RMF 1.0).** Published in January 2023, the AI RMF provides a four-function structure (Govern, Map, Measure, Manage) for managing AI risks. The Generative AI Profile, released subsequently, adds specific guidance for LLM and generative AI risks. The AI RMF is not prescriptive about specific controls but provides the governance structure that most US-oriented organisations use to frame their AI security programmes. If your leadership asks "what framework are we using?", this is likely the answer. [9]

**ISO/IEC 42001:2023 (AI Management System).** The first international standard for AI management systems, published in December 2023. It provides a certifiable management system framework for organisations developing or deploying AI. Where NIST AI RMF is a voluntary framework, ISO 42001 is an auditable standard with certification pathways. Organisations pursuing formal AI governance certification use this alongside sector-specific requirements. [^10]

**EU AI Act.** The European Union's regulation on artificial intelligence, entered into force in August 2024 with phased implementation through 2027. It introduces a risk-based classification system for AI systems (unacceptable, high, limited, minimal risk) with corresponding obligations. If your organisation operates in the EU, deploys AI systems that affect EU citizens, or sells AI-powered products into the European market, this regulation will directly shape your compliance requirements. The high-risk category triggers documentation, testing, monitoring, and human oversight obligations. [^11]

**CISA/NSA/FBI Joint AI Cybersecurity Playbook.** Published by the US Cybersecurity and Infrastructure Security Agency alongside the NSA and FBI, this playbook provides deployment and operations guidance for AI systems in critical infrastructure and government contexts. It is less well known than the OWASP or NIST documents but provides practical incident response guidance specific to AI systems that most other frameworks lack. [^12]

---

## 3. Communities: Where Practitioners Actually Talk

AI security is moving too fast for any publication cycle to keep up. The real signal comes from communities where practitioners share attack techniques, defensive patterns, and lessons from production incidents in near-real-time. These are the groups worth joining.

**OWASP AI Exchange.** The working group behind the OWASP Top 10 for LLM Applications and a growing body of practical guidance including the AI Security and Privacy Guide. The group maintains active discussions on GitHub, runs regular virtual meetings, and publishes updated guidance on emerging attack vectors. Participation is open to anyone. This is the best place to contribute to community standards and to see draft guidance before it is formally published. The group's GitHub repositories are where the next version of the LLM Top 10 takes shape. [^13]

**AI Village (DEF CON).** The AI Village started as a dedicated space at DEF CON for adversarial machine learning research and has grown into the most prominent security-focused AI community. They organise the Generative Red Team challenge (GRT), which in 2023 attracted over 2,200 participants testing frontier models from Anthropic, Google, Meta, and OpenAI at DEF CON 31. The village runs year-round events beyond the annual conference, including workshops and online activities. Their work has directly influenced how model providers approach red teaming. [^14]

**MITRE ATLAS Community.** The team maintaining MITRE ATLAS actively engages with contributors who report new AI attack techniques and case studies. The ATLAS case studies collection documents real-world incidents mapped to the framework's tactics and techniques. Contributing a case study is a practical way to build reputation in the field while improving the community's shared knowledge base. Engagement happens through the ATLAS GitHub repository and periodic community events. [^15]

**Hugging Face Security.** Hugging Face has become the default distribution platform for open-source models, datasets, and demo applications. Their security team maintains a vulnerability disclosure programme, and the platform's community forums include active discussions on model safety, supply chain security, and safe model distribution practices. The SafeTensors format, developed at Hugging Face, was a direct response to security risks in pickle-based model serialisation. Understanding the security considerations of the Hugging Face ecosystem is essential for anyone working with open-source models. [^16]

**Trail of Bits AI/ML Security.** Trail of Bits, the security research firm, has published substantial open-source tooling and research on AI security including their work on machine learning security assessment methodology. Their blog posts on practical AI vulnerabilities are technically rigorous and grounded in real assessment work, making them a valuable supplement to academic research. [^17]

---

## 4. Conferences and Events: Where to Learn and Who to Watch

Conference talks are where new attack techniques are first demonstrated and where defensive strategies are first stress-tested by practitioners. These events are worth tracking even if you cannot attend in person, because most publish recordings, papers, or proceedings.

**DEF CON AI Village.** The annual DEF CON AI Village (held each August in Las Vegas) is the premier venue for offensive AI security research. Talks range from novel prompt injection techniques to model extraction attacks to infrastructure security for GPU clusters. The Generative Red Team (GRT) challenge provides hands-on experience testing production models in a structured environment. Talks are recorded and available on YouTube. The village also runs events outside DEF CON including workshops at other conferences. [^14]

**IEEE Conference on Secure and Trustworthy Machine Learning (SaTML).** IEEE SaTML (pronounced "sat-mel") is the dedicated academic venue for ML security and trustworthiness research. Papers presented here undergo rigorous peer review and cover adversarial robustness, privacy attacks, fairness, and safety. The 2025 conference featured work on AI agent security, multi-modal attack vectors, and formal verification of safety properties. For practitioners, SaTML papers are where you find the attacks that will be operationalised in tooling within 12 to 18 months. Proceedings are freely available. [^18]

**NeurIPS ML Safety Workshop.** The Neural Information Processing Systems (NeurIPS) conference hosts an annual workshop on machine learning safety that attracts both academic researchers and industry practitioners. The workshop focuses on alignment, robustness, interpretability, and security. It is more research-oriented than DEF CON but provides early visibility into techniques and findings that will shape defensive tooling. [^19]

**USENIX Security Symposium.** USENIX Security publishes some of the highest-impact systems security research, and AI security papers have become an increasingly prominent track. Papers presented here tend to focus on practical attacks and defences with working code. The 2024 and 2025 symposia included work on prompt injection at scale, model supply chain attacks, and privacy leakage from fine-tuned models. Proceedings are freely available after the conference. [^20]

**RSA Conference AI Security Track.** RSA has expanded its coverage of AI security significantly, with dedicated tracks on securing AI applications, AI-powered threat detection, and AI governance. The audience is more enterprise-oriented than DEF CON or academic venues, making it the best place to understand how large organisations are approaching AI security procurement, governance, and programme building. [^21]

---

## 5. Newsletters and Feeds: Curated Signal, Not Noise

The hardest part of staying current in AI security is not finding information. It is filtering the signal from the noise. Vendor marketing, speculative threat reports, and hype-driven commentary vastly outnumber sources grounded in evidence and practice. These feeds have consistently delivered useful information over time.

**Simon Willison's Weblog (simonwillison.net).** Already mentioned for his prompt injection series, Willison's broader blog covers the intersection of AI, security, and software development with a practitioner's eye. He annotates links with context, connects individual findings to broader patterns, and maintains a consistently sceptical, evidence-based perspective. His blog's RSS/Atom feed is the single highest-signal source for anyone working in AI security. [^6]

**The OWASP AI Exchange Newsletter.** The working group publishes periodic updates on new guidance, emerging threats, and community activities. Subscribing keeps you current on changes to the LLM Top 10, new entries in the AI Security and Privacy Guide, and community events. Available through the OWASP AI Exchange website. [^13]

**MITRE ATLAS Updates.** ATLAS publishes notifications when new techniques or case studies are added to the framework. Following the ATLAS GitHub repository provides visibility into the evolving threat landscape as documented by MITRE's research team. [^15]

**Wiz Research Blog.** Wiz's security research team publishes findings on cloud security and AI infrastructure vulnerabilities, including work on exposed model endpoints, misconfigured inference servers, and AI supply chain weaknesses. Their research is grounded in data from real cloud environments, making it directly actionable for platform security teams. [^22]

**Trail of Bits Blog.** Trail of Bits publishes detailed technical write-ups on AI/ML security assessments, tool releases, and vulnerability disclosures. Their posts tend to be longer and more technical than typical vendor blogs, reflecting the firm's audit and research practice. [^17]

**Anthropic Research Blog.** Anthropic publishes research on AI safety, alignment, and security topics including their responsible scaling policy, interpretability research, and findings on model behaviour. Their work on sleeper agents and constitutional AI has directly influenced how the field thinks about model trustworthiness. [^23]

**Google DeepMind Safety Research.** DeepMind's safety team publishes research on robustness, alignment, and adversarial attacks. Their collaboration with external researchers (including the Zou et al. adversarial attacks paper) means their publications often appear in the key papers list within months of release. [^24]

**NCSC (UK) AI Guidance.** The UK National Cyber Security Centre publishes practical guidance on AI security for organisations, including deployment advice, threat assessments, and principles for secure AI development. For UK-based practitioners or those working in government contexts, NCSC publications carry significant weight with auditors and policy teams. [^25]

---

## 6. Tools Directory: Cross-Reference to Hands-On Coverage

Reading about AI security without touching the tools is like reading about penetration testing without running Burp Suite. These are the open-source and commercial tools that the articles on this site cover in depth. Each entry links to the relevant article for hands-on guidance.

### Red teaming and offensive testing

| Tool | What it does | Site coverage |
|------|-------------|---------------|
| **PyRIT** (Microsoft) | Automated AI red teaming framework with orchestrators, attack strategies, and scoring | Article 2.01: PyRIT from Zero to Red Team |
| **Garak** | LLM vulnerability scanner with modular probes for prompt injection, data leakage, and toxicity | Article 2.09: Garak Open-Source LLM Vulnerability Scanning |
| **Adversarial Robustness Toolbox (ART)** (IBM) | Adversarial ML toolkit for data poisoning, model evasion, and model extraction attacks | Article 2.04: Adversarial Machine Learning for Practitioners |

### Defensive tooling

| Tool | What it does | Site coverage |
|------|-------------|---------------|
| **AWS Bedrock Guardrails** | Managed guardrails for content filtering, topic denial, and PII redaction | Article 3.01: Guardrails Engineering |
| **NVIDIA NeMo Guardrails** | Open-source programmable guardrails for LLM applications | Article 3.01: Guardrails Engineering |
| **LLM Guard** (Protect AI) | Open-source input/output validation for LLM applications | Article 3.15: Rebuff and LLM Guard |
| **ModelScan** (Protect AI) | Scans ML model files for malicious payloads | Article 3.14: ModelScan and Fickling |
| **Fickling** (Trail of Bits) | Analyses Python pickle files for code execution payloads in ML models | Article 3.14: ModelScan and Fickling |

### Observability and monitoring

| Tool | What it does | Site coverage |
|------|-------------|---------------|
| **LangFuse** | Open-source LLM observability with tracing, scoring, and prompt management | Article 4.10: LangFuse and LangSmith |
| **LangSmith** (LangChain) | Commercial LLM observability with tracing, evaluation, and monitoring | Article 4.10: LangFuse and LangSmith |

### Supply chain and code security

| Tool | What it does | Site coverage |
|------|-------------|---------------|
| **Semgrep** | Static analysis with AI-specific rule packs for generated code | Article 3.04: SAST for AI-Generated Code |
| **git-secrets** (AWS Labs) | Prevents committing secrets to git repositories | Article 3.03: Secrets Scanning at Scale |
| **TruffleHog** | Scans git history and live systems for exposed credentials | Article 3.03: Secrets Scanning at Scale |
| **Gitleaks** | Fast secrets detection for git repositories with CI/CD integration | Article 3.03: Secrets Scanning at Scale |

This directory is not exhaustive. The field adds new tools quarterly, and commercial offerings from cloud providers (AWS, Azure, Google Cloud) evolve with each release cycle. The articles linked above provide current setup guides, configuration examples, and comparative assessments that this reading list cannot replicate in a single entry. Start with the tool that matches your most immediate need: PyRIT or Garak for red teaming, Bedrock Guardrails or NeMo Guardrails for defence, and LangFuse for observability.

---

[^1]: Greshake, K., Abdelnabi, S., Mishra, S., Endres, C., Holz, T., and Fritz, M. "Not What You've Signed Up For: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection." arXiv:2302.12173, 2023. Available at: https://arxiv.org/abs/2302.12173

[^2]: Zou, A., Wang, Z., Carlini, N., Nasr, M., Kolter, J.Z., and Fredrikson, M. "Universal and Transferable Adversarial Attacks on Aligned Language Models." arXiv:2307.15043, 2023. Available at: https://arxiv.org/abs/2307.15043

[^3]: Perez, E., Huang, S., Song, F., Cai, T., Ring, R., Aslanides, J., Glaese, A., McAleese, N., and Irving, G. "Red Teaming Language Models with Language Models." arXiv:2202.03286, 2022. Available at: https://arxiv.org/abs/2202.03286

[^4]: Carlini, N., Jagielski, M., Choquette-Choo, C.A., Paleka, D., Pearce, W., Anderson, H., Terzis, A., Thomas, K., and Tramer, F. "Poisoning Web-Scale Training Datasets is Practical." arXiv:2302.10149, 2024. Available at: https://arxiv.org/abs/2302.10149

[^5]: Hubinger, E., Denison, C., Mu, J., Lambert, M., Tong, M., MacDiarmid, M., Lanham, T., Ziegler, D.M., Maxwell, T., Cheng, N., Jermyn, A., Olsson, C., Schiefer, N., Askell, A., Bai, Y., Jones, A., Kaplan, J., Perez, E., Amodei, D., and Amodei, D. "Sleeper Agents: Training Deceptive Large Language Models That Persist Through Safety Training." Anthropic, 2024. Available at: https://arxiv.org/abs/2401.05566

[^6]: Willison, S. "Prompt Injection." Simon Willison's Weblog, 2022-ongoing. Available at: https://simonwillison.net/tags/prompt-injection/

[^7]: OWASP. "OWASP Top 10 for LLM Applications 2025." OWASP Foundation, 2025. Available at: https://genai.owasp.org/llm-top-10/

[^8]: MITRE. "ATLAS: Adversarial Threat Landscape for Artificial-Intelligence Systems." MITRE Corporation, 2024. Available at: https://atlas.mitre.org/

[^9]: NIST. "AI Risk Management Framework (AI RMF 1.0)." National Institute of Standards and Technology, 2023. Available at: https://www.nist.gov/itl/ai-risk-management-framework

[^10]: ISO/IEC. "ISO/IEC 42001:2023 Information Technology — Artificial Intelligence — Management System." International Organization for Standardization, 2023. Available at: https://www.iso.org/standard/81230.html

[^11]: European Parliament and Council. "Regulation (EU) 2024/1689 laying down harmonised rules on artificial intelligence (AI Act)." Official Journal of the European Union, 2024. Available at: https://eur-lex.europa.eu/eli/reg/2024/1689/oj

[^12]: CISA, NSA, FBI. "Joint Cybersecurity Information Sheet: Deploying AI Systems Securely." Cybersecurity and Infrastructure Security Agency, 2024. Available at: https://www.cisa.gov/resources-tools/resources/joint-guidance-deploying-ai-systems-securely

[^13]: OWASP. "OWASP AI Exchange." OWASP Foundation. Available at: https://owaspai.org/

[^14]: AI Village. "AI Village at DEF CON." Available at: https://aivillage.org/

[^15]: MITRE. "ATLAS Case Studies." MITRE Corporation. Available at: https://atlas.mitre.org/studies

[^16]: Hugging Face. "Security at Hugging Face." Available at: https://huggingface.co/docs/hub/security

[^17]: Trail of Bits. "AI/ML Security Research." Trail of Bits Blog. Available at: https://blog.trailofbits.com/category/machine-learning/

[^18]: IEEE. "Conference on Secure and Trustworthy Machine Learning (SaTML)." Available at: https://satml.org/

[^19]: NeurIPS. "ML Safety Workshop." Available at: https://neurips.cc/

[^20]: USENIX. "USENIX Security Symposium." Available at: https://www.usenix.org/conferences

[^21]: RSA Conference. "AI Security." Available at: https://www.rsaconference.com/

[^22]: Wiz. "Wiz Research." Available at: https://www.wiz.io/blog/tag/research

[^23]: Anthropic. "Anthropic Research." Available at: https://www.anthropic.com/research

[^24]: Google DeepMind. "Safety Research." Available at: https://deepmind.google/research/

[^25]: NCSC. "Artificial Intelligence." National Cyber Security Centre (UK). Available at: https://www.ncsc.gov.uk/section/advice-guidance/all-topics?topics=Artificial%20intelligence
