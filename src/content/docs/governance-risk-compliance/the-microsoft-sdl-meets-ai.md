---
title: "The Microsoft SDL Meets AI: Do's and Don'ts for Securing AI-Generated Code"
description: "Extend the Microsoft Security Development Lifecycle for AI-generated code with governance, threat modelling, and review practices."
sidebar:
  order: 4
---

**Series:** AI Security in Practice<br/>
**Pillar:** 5: Governance, Risk and Compliance<br/>
**Difficulty:** Advanced<br/>
**Author:** Paul Lawlor<br/>
**Date:** 2 March 2026<br/>
**Reading time:** 12 minutes

> Extend the Microsoft Security Development Lifecycle for AI-generated code: map governance, threat modelling, review, testing, provenance, and training to the AI-assisted development workflow.

---

## Table of Contents

1. [Opening Scenario](#1-opening-scenario)
2. [Background](#2-background)
3. [The Don'ts](#3-the-donts)
4. [The Do's](#4-the-dos)
5. [The Organisational Challenge](#5-the-organisational-challenge)
6. [Path Forward](#6-path-forward)
7. [Further Reading](#7-further-reading)
8. [Notes](#notes)

---

## 1. Opening Scenario

A security architect presents a slide showing 40% of recent commits were AI-generated. The CISO asks: "Does our SDL cover this?"

Silence.

The existing Secure Development Lifecycle was designed for human developers. Nobody has mapped it to AI-assisted development. Threat modelling does not account for AI hallucination or the model-as-untrusted-code. Code review checklists do not flag AI-generated patterns. Security testing does not include adversarial prompts. The bug bar was written before anyone imagined a large language model suggesting vulnerable authentication logic.

This scenario is increasingly common. Organisations that adopted the Microsoft Security Development Lifecycle (SDL) over the past two decades have robust processes for threat modelling, SAST and DAST, supply chain security, and security training. But the SDL was built for a world where developers wrote code by hand. Today, GitHub Copilot, Cursor, Amazon Q, and similar tools generate significant portions of production code. The SDL's ten practices still apply. They just need extending.

The gap matters because AI-generated code introduces risks that traditional SDL controls do not fully address. Models can suggest insecure patterns, hallucinate API usage, or introduce dependencies the developer does not critically evaluate. Prompt injection can steer output toward malicious behaviour. Provenance is unclear: which model generated which code, and with what version? Without mapping the SDL to AI-assisted development, organisations fly partially blind.

This essay shows how to extend the Microsoft SDL for AI-generated code. We cover the don'ts that leave you exposed, the do's that close the gap, and the organisational work required to make it stick.

---

## 2. Background

The **Microsoft Security Development Lifecycle** is a set of ten practices that integrate security into each stage of software development: from design through build, deploy, and run. [1] It has been in use for over twenty years and underpins secure development at Microsoft and many enterprises. The practices span security programme management, secure platforms, threat modelling, cryptography, supply chain security, secure development infrastructure, security testing, operational security, monitoring and response, and security training.

The **NIST Secure Software Development Framework (SSDF)** aligns closely with the SDL, providing a common vocabulary for secure software development that software acquirers and producers can use. [2] Both frameworks assume human-authored code flowing through version control, build pipelines, and review processes. Neither was designed with AI coding assistants in mind.

AI-generated code changes the assumptions. First, **provenance**: traditional Git history records who committed what, but it does not distinguish human-written from AI-suggested code. Second, **trust boundaries**: the AI model is an external, non-deterministic component. Its output should be treated as untrusted input until verified. Third, **threat surface**: prompt injection, jailbreaking, and context poisoning become relevant. Fourth, **scale**: when 40% of commits are AI-assisted, security controls must operate at that volume without lowering the bar.

Microsoft has begun extending the SDL for AI. Practice 2 (Secure Platforms) references AI safety and security guidance, Azure AI Content Safety, and Prompt Shields. [3] Practice 7 (Security Testing) cites an AI/ML-specific bug bar. [4] Microsoft's threat modelling documentation includes guidance for AI/ML systems. [5] But these extensions are scattered. No single document maps all ten SDL practices to the specific context of AI-generated code. This essay fills that gap.

---

## 3. The Don'ts

Five common mistakes leave AI-generated code under-protected by the SDL.

**Don't 1: Assume your existing SDL covers AI-generated code without mapping it.** Many teams treat AI-assisted development as business as usual. Their SDL documentation does not mention AI coding tools. Threat models omit the model as a component. Code review procedures do not call out AI-generated output for special attention. The consequence: security controls were designed for a different workflow. Gaps accumulate silently until an incident or audit reveals them.

**Don't 2: Skip AI-specific threats in threat modelling.** SDL Practice 3 requires threat modelling that shifts focus from "how products should work" to "how products might be abused." [6] Traditional STRIDE (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege) covers human-authored code. AI-assisted development adds threats that STRIDE alone may miss: prompt injection steering output toward insecure patterns, model hallucination producing plausible but vulnerable code, context poisoning via malicious files in the IDE, and supply chain risks from the model provider or training data. Microsoft publishes threat modelling guidance for AI/ML. [7] If your threat model does not include these, you are incomplete.

**Don't 3: Treat AI-generated code as "reviewed" without explicit verification.** A developer accepts an AI suggestion, scans it quickly, and commits. The pull request is approved. That is not meaningful review. AI-generated code can contain subtle vulnerabilities: incorrect crypto usage, SQL injection patterns, hardcoded credentials, or logic errors that pass unit tests but fail under adversarial input. SDL Practice 6 requires that direct commits to production branches are disallowed and that code review is mandatory. [8] The same standard applies to AI output. Rubber-stamping AI suggestions violates the spirit of secure code review.

**Don't 4: Skip adversarial testing for systems that use AI.** SDL Practice 7 requires SAST, DAST, fuzzing, and penetration testing. [9] For systems that invoke AI models (such as AI coding assistants), add adversarial prompt testing. Can an attacker inject instructions that cause the model to emit vulnerable code? Can jailbreaking bypass safety filters? Microsoft's AI Red Team and Prompt Shields address these threats. [10] If your security testing does not include prompt injection and jailbreak scenarios, you are missing a class of vulnerabilities.

**Don't 5: Deploy AI-generated code without provenance tracking.** SDL Practice 5 (Secure the software supply chain) requires understanding dependencies, producing SBOMs, and signing artifacts. [11] AI-generated code is a supply chain input. Which model produced it? Which version? When? What prompt or context influenced it? Without provenance, you cannot trace a vulnerability back to a model update, a poisoned context, or a bad prompt. Audit and compliance teams will struggle to assess supply chain integrity.

---

## 4. The Do's

Six strategies extend the SDL for AI-generated code.

**Do 1: Extend SDL governance to explicitly cover AI coding tools.** SDL Practice 1 requires security standards, metrics, and governance that reflect the threat landscape. [12] Update your security requirements to state that AI coding tools and AI-generated code fall within SDL scope. Define who owns AI tool security (often the same team that owns developer tooling, with security as a stakeholder). Include AI-generated code in your bug bar. Microsoft provides an AI/ML-specific bug bar pivot. [13] Track AI-related security defects and exceptions the same way you track human-authored defects.

**Do 2: Include AI-specific threats in threat modelling.** When threat modelling systems that use AI coding tools, add the model as a data-flow component. Treat model output as crossing a trust boundary: it enters your system from an external, non-deterministic source. Document threats such as prompt injection, hallucination producing vulnerable code, and context poisoning. Use Microsoft's threat modelling guidance for AI/ML alongside STRIDE. [7] Assign severity and mitigations. Track them in your work-tracking system like any other threat.

**Do 3: Require explicit verification of AI-generated code in review.** SDL Practice 6 mandates code review before merge. [8] Define what "meaningful review" means for AI-generated output: the reviewer must have read and understood the code, not just approved the diff. For security-critical paths (authentication, authorisation, cryptography, data handling), require a second reviewer with domain expertise. Consider time-based heuristics: if a large AI-generated patch is approved in under two minutes, flag it. Make it safe for developers to slow down when reviewing AI output.

**Do 4: Add SAST, and where applicable adversarial testing, for AI-assisted development.** SDL Practice 7 requires SAST integrated into developer workflows and build automation. [9] AI-generated code is still code. Run **CodeQL**, **Semgrep**, **Bandit**, or equivalent tools on it. Do not exempt AI output from SAST. For systems that invoke AI models, add adversarial prompt testing: attempt prompt injection, jailbreak, and context manipulation. Use tools such as Microsoft's AI Red Team guidance or OWASP LLM Top 10 test cases. [14] Treat failures as security defects and track them through your bug bar.

**Do 5: Implement provenance metadata for AI-generated code.** Extend your supply chain practices (SDL Practice 5) to AI. [11] Record provenance for AI-generated contributions: model name, model version, timestamp, and optionally a hash of the prompt or context. Store this in commit metadata, CI logs, or a lightweight registry. It does not need to be heavyweight: a `[AI: model=X, version=Y]` tag in the commit message or a small JSON sidecar is a start. When a vulnerability is found, provenance helps you determine whether it was introduced by a model update or a bad prompt.

**Do 6: Extend security training to cover AI coding risks.** SDL Practice 10 requires that developers understand security implications of their decisions. [15] Add AI-specific training: how to critically evaluate AI suggestions, common insecure patterns in AI-generated code, prompt injection awareness, and when to escalate. Developers who treat AI output as authoritative are a risk. Developers who understand that models can hallucinate and produce vulnerable code are better reviewers. Make threat modelling for AI/ML part of onboarding for teams using AI coding tools.

---

## 5. The Organisational Challenge

Extending the SDL for AI requires more than updated documentation. It requires culture and process change.

**Culture.** Developer culture prizes velocity. AI coding tools amplify that: more code, faster. Meaningful review of AI output takes time. Organisations must make it safe for developers to slow down when reviewing AI suggestions. If performance metrics reward speed over rigour, you create pressure to rubber-stamp. Align incentives with secure behaviour. Celebrate thorough reviews. Make "I flagged this AI suggestion as insecure" a positive signal, not a drag on throughput.

**Policy.** Formalise the extension. Publish a policy or SDL appendix that explicitly covers AI coding tools and AI-generated code. Reference it in onboarding, in tool approval workflows, and in audit readiness materials. Without a written policy, "we treat AI code the same as human code" remains vague. With it, reviewers, auditors, and new hires have a clear expectation.

**Training.** SDL Practice 10 emphasises that security training must evolve with the threat landscape. [15] AI coding risks are new to most developers. Invest in training that covers: how to critically evaluate AI suggestions, insecure patterns commonly produced by models, prompt injection basics, and when to escalate. Integrate AI security into existing secure coding training rather than treating it as a separate course.

**Incident response.** Define what constitutes an AI-related security incident. Is it a vulnerability introduced by AI-generated code? A prompt injection that exfiltrated data? A model update that degraded output quality and introduced bugs? Ensure your incident response plan and Product Security Incident Response Team (PSIRT) procedures can handle these categories. [16] Test the plan before you need it.

---

## 6. Path Forward

**Three actions this week.**

**1. Map your SDL to AI.** Audit your current SDL documentation. Does it mention AI coding tools or AI-generated code? For each of the ten SDL practices, note where AI creates new requirements. Document the gaps. Assign an owner (often the same person who owns SDL governance). Aim for a one-page gap analysis you can present to your CISO.

**2. Update your threat modelling.** For your next feature or system that uses AI-assisted development, include the AI model in the data-flow diagram. Treat model output as crossing a trust boundary. Add at least three AI-specific threats (prompt injection, hallucination, context poisoning) and document mitigations. Use Microsoft's threat modelling guidance for AI/ML. [7]

**3. Define "meaningful review" for AI output.** Work with your engineering leads and security team. What does a thorough review of AI-generated code look like in your context? Document it. Add it to your code review checklist or pull request template. Pilot it on one team before rolling out broadly.

**Looking ahead.** The SDL will continue to evolve. Microsoft's AI/ML extensions are a signal that the industry is adapting. Organisations that extend their SDL now will be ahead when regulators, auditors, or customers ask for evidence. The work is incremental: you do not need to rewrite your entire SDL. You need to close the gaps.

---

## 7. Further Reading

- Microsoft SDL Practices (all ten): [17]
- NIST Secure Software Development Framework: [2]
- Microsoft threat modelling for AI/ML: [7]
- AI/ML pivots to the SDL bug bar: [13]
- OWASP LLM Top 10: [14]
- [Guardrails Engineering](/defend-and-harden/guardrails-engineering/) and [Building a Secure RAG Pipeline](/defend-and-harden/building-secure-rag-pipeline/) on this site complement this essay with tool-specific guidance.

---

## Notes

[1] Microsoft, "Security Development Lifecycle (SDL) Practices," 2024. https://www.microsoft.com/en-us/securityengineering/sdl/practices

[2] NIST, "Secure Software Development Framework (SSDF) Version 1.1 (NIST SP 800-218)," February 2022. https://doi.org/10.6028/NIST.SP.800-218

[3] Microsoft, "SDL Practice 2: Require use of proven security features, languages, and frameworks," 2024. https://aka.ms/sdl/practices/secure-platforms

[4] Microsoft Learn, "AI/ML Pivots to the Security Development Lifecycle Bug Bar," 2024. https://learn.microsoft.com/security/engineering/bug-bar-aiml

[5] Microsoft Learn, "Threat modeling for AI/ML systems," 2024. https://learn.microsoft.com/security/engineering/threat-modeling-aiml

[6] Microsoft, "SDL Practice 3: Perform security design review and threat modeling," 2024. https://aka.ms/sdl/practices/secure-by-design

[7] Microsoft Learn, "Threat modeling for AI/ML systems," 2024. https://learn.microsoft.com/security/engineering/threat-modeling-aiml

[8] Microsoft, "SDL Practice 6: Secure the engineering environment," 2024. https://www.microsoft.com/securityengineering/sdl/practices/secure-dev-infra

[9] Microsoft, "SDL Practice 7: Perform security testing," 2024. https://aka.ms/sdl/practices/security-testing

[10] Microsoft, "Azure AI announces Prompt Shields for Jailbreak and Indirect prompt injection attacks," Microsoft Tech Community, 2024. https://techcommunity.microsoft.com/t5/ai-azure-ai-services-blog/azure-ai-announces-prompt-shields-for-jailbreak-and-indirect/ba-p/4099140

[11] Microsoft, "SDL Practice 5: Secure the software supply chain," 2024. https://www.microsoft.com/securityengineering/sdl/practices/sscs

[12] Microsoft, "SDL Practice 1: Establish security standards, metrics, and governance," 2024. https://aka.ms/sdl/practices/security-program-management

[13] Microsoft Learn, "AI/ML Pivots to the Security Development Lifecycle Bug Bar," 2024. https://learn.microsoft.com/security/engineering/bug-bar-aiml

[14] OWASP, "OWASP Top 10 for Large Language Model Applications," 2024. https://owasp.org/www-project-top-10-for-large-language-model-applications/

[15] Microsoft, "SDL Practice 10: Provide security training," 2024. https://aka.ms/sdl/practices/security-training

[16] Microsoft, "SDL Practice 9: Implement security monitoring and response," 2024. https://aka.ms/sdl/practices/monitoring-and-response

[17] Microsoft, "Security Development Lifecycle (SDL) Practices," 2024. https://www.microsoft.com/en-us/securityengineering/sdl/practices
