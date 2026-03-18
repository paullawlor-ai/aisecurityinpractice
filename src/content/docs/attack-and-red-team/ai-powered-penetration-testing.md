---
title: "AI-Powered Penetration Testing: Using LLMs for Recon, Exploitation, and Reporting"
description: "A technical deep dive into how offensive security teams are integrating large language models into every phase of penetration testing, from reconnaissance and vulnerability identification to exploit development and report writing, with worked examples, tool recommendations, and an honest assessment of the limitations."
sidebar:
  order: 7
date: 2026-03-13
---

**Series:** AI Security in Practice<br/>
**Pillar:** 2: Attack and Red Team<br/>
**Difficulty:** Advanced<br/>
**Author:** Paul Lawlor<br/>
**Date:** 13 March 2026<br/>
**Reading time:** 15 minutes

> A technical deep dive into how offensive security teams are integrating large language models into every phase of penetration testing, from reconnaissance and vulnerability identification to exploit development and report writing, with worked examples, tool recommendations, and an honest assessment of the limitations.

---

## Table of Contents

1. [The Problem](#1-the-problem)
2. [How It Works](#2-how-it-works)
3. [Taxonomy: Four Phases of AI-Augmented Penetration Testing](#3-taxonomy-four-phases-of-ai-augmented-penetration-testing)
4. [Worked Examples](#4-worked-examples)
5. [Detection and Defence: Preparing for AI-Powered Adversaries](#5-detection-and-defence-preparing-for-ai-powered-adversaries)
6. [Limitations: The Open Problems](#6-limitations-the-open-problems)
7. [Practical Recommendations](#7-practical-recommendations)
8. [Further Reading](#8-further-reading)

---

## 1. The Problem

In August 2025, seven teams competed in the finals of DARPA's AI Cyber Challenge (AIxCC) at DEF CON 33. Their autonomous Cyber Reasoning Systems analysed 54 million lines of open-source code, discovered 54 synthetic vulnerabilities, patched 43 of them, and uncovered 18 real vulnerabilities that human auditors had missed.[^1] No human touched a keyboard during the scored round. A year earlier, researchers at the University of Illinois Urbana-Champaign demonstrated that a GPT-4 agent could autonomously exploit 87% of a benchmark set of 15 real-world one-day vulnerabilities when given the CVE description, while every other model tested (including GPT-3.5, open-source LLMs, and traditional scanners like ZAP) scored 0%.[^2] And in penetration testing firms worldwide, practitioners are quietly integrating LLMs into every phase of their workflow, from reconnaissance to report writing, achieving productivity gains that would have seemed implausible three years ago.

This is not a future trend. It is the present state of offensive security.

**Who needs to understand this?** Three audiences. First, penetration testers and red teamers who want to incorporate LLMs into their workflows without introducing new risks. Second, security leaders who need to understand how AI-augmented attackers change the threat landscape their organisations face. Third, defenders who must prepare for adversaries operating at speeds and scales that manual testing never achieved.

**What is changing?** Traditional penetration testing is labour-intensive and time-constrained. A typical engagement allocates days to reconnaissance, hours to vulnerability analysis, and significant effort to report writing. LLMs compress each of these phases. They correlate OSINT data across dozens of sources in seconds rather than hours. They review source code for vulnerability patterns at a pace no human can match. They generate exploit hypotheses, suggest payloads, and draft findings reports in structured formats. The result is not that AI replaces the penetration tester. It is that a penetration tester augmented with AI produces more thorough results in less time, covering attack surface that would otherwise go unexamined.

**Why does this matter for defence?** Because if your red team is not using these techniques, your adversaries likely are. The same LLM capabilities that help a legitimate tester are available to anyone with API access. The asymmetry is not in capability but in intent and authorisation. Defenders who understand how AI-powered offensive tools work can anticipate the attack patterns they produce, recognise the signatures they leave, and calibrate their controls accordingly.

---

## 2. How It Works

The integration of LLMs into penetration testing follows a pattern: the model operates as a co-pilot within an existing workflow, augmenting human decision-making rather than replacing it. Understanding the technical mechanism requires examining how LLMs interact with traditional offensive tooling at each phase of an engagement.

**The agent loop.** The most sophisticated AI-powered penetration testing systems, such as **PentestGPT**, operate as agent loops with three components: a reasoning module that plans the next action based on current state, a generation module that produces commands or payloads, and a parsing module that interprets tool output and feeds it back to the reasoning module.[^3] This loop mirrors the observe-orient-decide-act cycle that experienced penetration testers follow intuitively. The LLM's contribution is speed: it can evaluate hundreds of potential next steps and rank them by likelihood of success faster than a human analyst can read a single nmap output.

**Prompt-driven tool orchestration.** Rather than writing bespoke automation scripts, testers describe their objective in natural language and let the LLM select and sequence the appropriate tools. A prompt like "Enumerate all subdomains of target.com, identify web services, and check for default credentials" triggers a chain: subdomain enumeration via `subfinder` or `amass`, port scanning via `nmap`, service fingerprinting, and credential testing. The LLM handles the glue logic that traditionally required custom Python scripts or manual command chaining. **PyRIT**, Microsoft's open-source red-teaming framework, implements this pattern with its orchestrator architecture, where attack strategies are composed from reusable targets, converters, and scorers.[^4]

**Context accumulation.** A critical advantage of LLM-augmented testing is the model's ability to maintain context across the entire engagement. When a tester feeds the output of a port scan into the same conversation as a code review finding, the LLM can correlate them: "Port 8080 is running a Spring Boot application, and the source code you shared contains a deserialisation endpoint at `/api/import` that accepts untrusted input." This cross-phase correlation is something that human testers do instinctively but slowly. The LLM does it at the speed of token generation.

**Code analysis at scale.** For source code review, LLMs apply the same pattern-matching capabilities that make them effective at code generation. Given a function, the model can identify missing input validation, unsafe deserialisation, SQL injection vectors, insecure cryptographic usage, and authentication bypasses. Semgrep's AI-powered detection combines deterministic static analysis with LLM contextual reasoning, achieving 96% true positive accuracy on triage decisions, a significant improvement over LLM-only approaches.[^5] The hybrid pattern (traditional tools for detection, LLMs for contextual analysis and triage) consistently outperforms either approach alone.

**Report generation.** The most universally adopted use of LLMs in penetration testing is report writing. Given structured findings data (vulnerability type, affected component, evidence, severity), an LLM produces narrative descriptions, risk assessments, and remediation recommendations in minutes rather than hours. This is the lowest-risk application because the output is reviewed before delivery, and hallucinations in a draft report are caught during review rather than acted upon autonomously.

---

## 3. Taxonomy: Four Phases of AI-Augmented Penetration Testing

AI integration maps naturally onto the four phases of a penetration test. Each phase presents different opportunities, risks, and levels of maturity. The following taxonomy categorises the current landscape.

---

### Phase 1: Reconnaissance and Attack Surface Mapping

**What the LLM does:** Correlates data from multiple OSINT sources, identifies patterns in DNS records, certificate transparency logs, and exposed metadata, and generates a structured attack surface map.

**Tools and integrations:**
- **ReconAIzer**: A Burp Suite extension that sends HTTP traffic to OpenAI's API for analysis, automatically extracting endpoints, parameters, subdomains, and potential entry points from intercepted requests.[^6]
- **PentestGPT**: Includes automated reconnaissance modules that chain tools like `subfinder`, `nmap`, and `httpx`, with the LLM interpreting output and planning next steps.[^3]
- **Custom GPT workflows**: Many testers build lightweight wrappers that feed the output of `amass`, `shodan`, or `censys` queries into an LLM for correlation and prioritisation.

**Maturity:** High. Reconnaissance is the phase where LLMs add the most value with the least risk. The model is synthesising public information, and errors manifest as missed findings rather than destructive actions.

---

### Phase 2: Vulnerability Identification and Code Review

**What the LLM does:** Analyses source code, configuration files, and API responses for security weaknesses. Identifies patterns that match known vulnerability classes (injection, broken authentication, insecure deserialisation) and flags logic errors that traditional static analysis tools miss.

**Tools and integrations:**
- **BurpGPT**: Integrates GPT models into Burp Suite's passive scanning pipeline, analysing HTTP traffic for context-dependent vulnerabilities that signature-based scanners cannot detect.[^7]
- **Semgrep Assistant**: Combines deterministic static analysis rules with LLM-powered triage, achieving 96% agreement with human security researchers on finding validity.[^5]
- **Claude Code and OpenAI Codex**: When used as standalone code review agents, these achieved 14-18% true positive rates across large Python codebases, finding real high-severity vulnerabilities but generating substantial false positives.[^8]

**Maturity:** Moderate. LLMs excel at identifying common vulnerability patterns but struggle with complex multi-step data flows and business logic flaws. The hybrid approach (deterministic tools for detection, LLMs for triage and contextual analysis) is emerging as the reliable pattern.

---

### Phase 3: Exploitation and Payload Development

**What the LLM does:** Generates exploit code, suggests payloads, adapts known techniques to the specific target environment, and assists with privilege escalation and lateral movement after initial access.

**Tools and integrations:**
- **PentestGPT**: Its generation module produces exploit commands and payloads based on the identified vulnerabilities, achieving 80% task completion on real penetration testing targets, compared to 47% for GPT-4 alone and 35% for GPT-3.5.[^3]
- **PyRIT**: While focused on AI system red-teaming, PyRIT's attack orchestration patterns (converters for payload mutation, scorers for success evaluation) provide a template for general-purpose exploit automation.[^4]
- **Counterfit**: Microsoft's CLI-based tool for assessing ML model security, automating adversarial attacks against image, text, and tabular models using frameworks like ART and TextAttack.[^9]

**Maturity:** Low to moderate. LLMs can generate functional exploits for well-documented vulnerability classes but frequently hallucinate non-functional code for novel or complex targets. Human verification remains essential. Safety guardrails in commercial LLMs also limit the specificity of exploit code they will generate, pushing practitioners toward open-source models or specialised tools.

---

### Phase 4: Reporting and Documentation

**What the LLM does:** Transforms raw findings data into structured penetration testing reports, generates executive summaries, writes technical descriptions of vulnerabilities, and produces remediation recommendations tailored to the target's technology stack.

**Tools and integrations:**
- **Custom templates with LLM generation**: Most practitioners feed structured findings (vulnerability class, CVSS score, evidence screenshots, affected endpoints) into an LLM with a report template, producing first-draft narratives in minutes.
- **PlexTrac, AttackForge, and similar platforms**: Several penetration testing management platforms now integrate LLM-based report generation as a built-in feature.
- **PyRIT scoring and logging**: PyRIT's memory system and scoring architecture provide structured output that can feed directly into report generation pipelines.[^4]

**Maturity:** High. Report generation is the most widely adopted and lowest-risk application. The output is always reviewed by a human before delivery, making hallucination a nuisance rather than a security risk. Anecdotally, practitioners report significant time savings on the reporting phase, with some teams cutting report drafting time by half or more.

---

### Phase Comparison

| Phase | AI value-add | Risk level | False positive concern | Human oversight needed |
|---|---|---|---|---|
| Reconnaissance | High (correlation, speed) | Low | Low (missed findings, not destructive) | Moderate |
| Vulnerability ID | Moderate (pattern matching, triage) | Moderate | High (14-18% TPR standalone) | High |
| Exploitation | Moderate (payload generation) | High | Moderate (non-functional exploits) | Critical |
| Reporting | High (speed, consistency) | Low | Low (reviewed before delivery) | Moderate |

---

## 4. Worked Examples

The following three examples demonstrate AI-augmented penetration testing across the phases described above. Each uses tools and techniques available today, with code that illustrates the integration pattern rather than providing complete exploit scripts.

---

### Example A: LLM-Assisted Reconnaissance Pipeline

**Scenario:** A penetration tester is scoping an engagement against a SaaS company. The target domain is `example-target.com`. The tester wants to build a comprehensive attack surface map before the active testing window begins.

**The workflow:**

```python
import openai
import subprocess
import json

def run_recon_tool(command: str) -> str:
    """Execute a recon tool and return output."""
    result = subprocess.run(
        command.split(), capture_output=True, text=True, timeout=120
    )
    return result.stdout

subfinder_output = run_recon_tool("subfinder -d example-target.com -silent")
nmap_output = run_recon_tool(
    "nmap -sV -p 80,443,8080,8443 -iL subdomains.txt -oN scan.txt"
)

analysis_prompt = f"""You are a penetration tester conducting reconnaissance.
Analyse the following data and produce a prioritised attack surface map.

Subdomain enumeration:
{subfinder_output}

Service scan results:
{nmap_output}

For each identified service:
1. Identify the technology stack
2. Note version-specific known vulnerabilities
3. Assign a priority (critical/high/medium/low) based on exposure
4. Suggest next reconnaissance steps

Format as a structured JSON report."""

response = openai.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": analysis_prompt}],
    temperature=0.2
)
attack_surface = json.loads(response.choices[0].message.content)
```

**What the LLM contributes:** The model correlates subdomain data with service scan results, identifies that `api-staging.example-target.com` is running an outdated version of nginx with a known path traversal vulnerability, and prioritises it above the well-patched production endpoints. A human tester would reach the same conclusion, but the LLM produces the prioritised list in seconds rather than the hour it would take to manually cross-reference the data.

**The risk:** The model may hallucinate vulnerability associations. If it claims a specific nginx version is vulnerable to CVE-2024-XXXX, the tester must verify that claim against the NVD. The LLM is a hypothesis generator, not an oracle.

---

### Example B: AI-Assisted Code Review for Vulnerability Identification

**Scenario:** The tester has obtained access to a target application's source code (either through a white-box engagement or by accessing a public repository). They want to identify authentication and authorisation vulnerabilities.

**The workflow:**

```python
review_prompt = """Review the following Flask API endpoint for security
vulnerabilities. Focus on authentication, authorisation, injection,
and data exposure issues.

@app.route('/api/users/<user_id>/documents', methods=['GET'])
@require_auth
def get_user_documents(user_id):
    query = f"SELECT * FROM documents WHERE owner_id = '{user_id}'"
    docs = db.execute(query).fetchall()
    return jsonify([dict(d) for d in docs])

For each vulnerability found:
1. Name the vulnerability class (e.g. CWE-89)
2. Explain the attack vector
3. Provide a proof-of-concept request
4. Suggest a specific remediation"""
```

**Expected LLM output:** The model identifies three issues: (1) SQL injection via the unparameterised `user_id` (CWE-89), (2) broken object-level authorisation because the endpoint does not verify that the authenticated user matches the requested `user_id` (CWE-639, mapping to OWASP API1:2023 Broken Object Level Authorization[^10]), and (3) excessive data exposure from `SELECT *` returning columns that may include internal metadata.

**What the LLM contributes:** The SQL injection is trivial for any scanner to find. The broken object-level authorisation is the higher-value finding: it requires understanding the semantic relationship between the authenticated user and the `user_id` path parameter, which is context that traditional static analysis tools lack. This is where LLMs consistently add value over deterministic approaches.

**The risk:** For this simple example, the model's analysis is reliable. For complex multi-file applications with custom authentication middleware, the model may miss that authorisation is handled in a decorator not shown in the snippet, producing a false positive. Always validate findings against the full application context.

---

### Example C: Automated Report Generation with PyRIT Output

**Scenario:** After completing a red-teaming engagement against an organisation's LLM-powered customer service bot using PyRIT, the tester needs to produce a findings report.

**The workflow:**

```python
import json
from pyrit.memory import CentralMemory

memory = CentralMemory.get_memory_instance()
conversations = memory.get_prompt_request_pieces()

findings = []
for conv in conversations:
    if conv.scorer_results:
        for score in conv.scorer_results:
            if score.score_value_as_float > 0.7:
                findings.append({
                    "technique": conv.labels.get("attack_strategy"),
                    "prompt": conv.original_value,
                    "response": conv.response_text,
                    "score": score.score_value_as_float,
                    "category": score.score_category
                })

report_prompt = f"""Generate a penetration testing findings report from
the following red-teaming results against an LLM-powered application.

Findings data:
{json.dumps(findings, indent=2)}

For each finding, produce:
- Title (concise vulnerability name)
- Severity (Critical/High/Medium/Low based on impact)
- Description (what was tested and what happened)
- Evidence (the specific prompt and response)
- Impact (business consequence if exploited)
- Remediation (specific technical fix)

Format as markdown with a table of contents."""
```

**What the LLM contributes:** The model transforms raw test data (prompt-response pairs with scores) into narrative findings that a non-technical stakeholder can understand. It maps the attack strategies to business impact: "The customer service bot disclosed account holder personal data when subjected to a multi-turn escalation attack, which constitutes a data protection violation under GDPR Article 5(1)(f)." This contextual mapping, from technical finding to business impact, is where LLMs are most reliably useful in report generation.

**The risk:** The model may overstate severity or fabricate regulatory implications. The tester must verify that the cited regulations and business impacts are accurate for the specific engagement context.

---

## 5. Detection and Defence: Preparing for AI-Powered Adversaries

If legitimate penetration testers are using LLMs to accelerate their work, malicious actors are doing the same. The defensive question is not whether adversaries will adopt these tools but how their adoption changes the threat landscape and what defenders can do about it.

---

### The speed differential

The most immediate impact of AI-augmented attacks is compression of the attack timeline. Reconnaissance that previously took days can be completed in hours. Vulnerability analysis that required specialist knowledge can be approximated by an attacker with API access and a well-crafted prompt. This means the window between an attacker discovering your organisation as a target and launching their first exploit attempt is shrinking. Defenders must assume that exposed attack surface will be probed faster than historical baselines suggest.

**Defensive action:** Reduce the mean time to detect exposed assets. Continuous attack surface monitoring tools (Censys, Shodan, ProjectDiscovery's `nuclei`) should run on schedules measured in hours, not days. If an LLM-augmented attacker can enumerate your subdomains in minutes, your own inventory must be at least as current.

---

### Recognising AI-generated attacks

AI-generated reconnaissance and exploitation attempts leave characteristic patterns. LLM-orchestrated scanning tends to be more structured and methodical than manual probing: consistent timing between requests, logical progression through endpoints, and systematic coverage of parameter variations. This is both a strength (fewer gaps in coverage) and a weakness (more predictable, more detectable).

**Defensive action:** Tune web application firewalls and intrusion detection systems for behavioural patterns that indicate automated, intelligent probing. Look for request sequences that follow a logical attack tree rather than the random exploration of a manual attacker or the signature-based patterns of a traditional scanner. Anomaly detection systems that model normal API usage can flag the systematic enumeration patterns that LLM-orchestrated tools produce.

---

### The phishing amplification problem

LLMs dramatically improve the quality and personalisation of social engineering attacks. An attacker can feed LinkedIn profiles, company announcements, and email conventions into a model and produce highly targeted phishing content at scale. The grammatical errors and cultural mismatches that historically served as phishing indicators are absent from LLM-generated text.

**Defensive action:** Shift phishing defences from content-based detection to behavioural and technical indicators. Email authentication (SPF, DKIM, DMARC), sender reputation scoring, and link analysis become more important when the email content itself is indistinguishable from legitimate correspondence. Invest in user awareness training that focuses on process verification ("Did you expect this request? Verify through a separate channel") rather than content inspection ("Does this email have grammar mistakes?").

---

### Defending AI systems against AI-powered testing

Organisations deploying LLM-powered applications face a recursive challenge: AI-powered attackers testing AI-powered systems. The OWASP API Security Top 10 provides a foundation here. API1:2023 (Broken Object Level Authorization) and API5:2023 (Broken Function Level Authorization) are precisely the vulnerability classes that LLM-augmented testers identify most effectively, because the LLM can reason about the semantic relationship between the authenticated user and the requested resource.[^10]

**Defensive action:** Prioritise API authorisation testing in your own security programme. If an LLM can identify that your `/api/users/{id}/documents` endpoint fails to verify that the authenticated user matches the path parameter, so can an adversary's LLM. Run your own AI-augmented testing against your APIs before an attacker does. Tools like **PyRIT** for LLM-specific risks[^4] and **BurpGPT** for web application risks[^7] are available to defenders and attackers alike; the advantage goes to whoever uses them first.

---

## 6. Limitations: The Open Problems

The productivity gains from AI-augmented penetration testing are real, but so are the failure modes. Teams that adopt these tools without understanding their limitations will produce lower-quality results than teams that use them with appropriate scepticism.

---

### Hallucination and fabricated findings

LLMs generate plausible text, not verified facts. When a model claims that nginx 1.24.0 is vulnerable to a specific CVE, it may be hallucinating a vulnerability that does not exist, misattributing a vulnerability from a different version, or conflating two unrelated issues. Research on AI agents for vulnerability discovery found that Claude Code achieved only a 14% true positive rate when used as a standalone code review agent across large Python codebases, meaning 86% of its findings were false positives.[^8] In penetration testing, a false positive is not a minor inconvenience: it wastes engagement time, erodes client trust, and can trigger unnecessary remediation efforts.

**Mitigation:** Treat every LLM-generated finding as a hypothesis that requires manual verification. Cross-reference CVE claims against the National Vulnerability Database. Reproduce identified vulnerabilities with proof-of-concept testing before including them in a report. Never deliver an LLM-generated finding to a client without independent validation.

---

### Confidentiality and data leakage

Sending target data to a commercial LLM API creates a confidentiality risk. Reconnaissance output, source code snippets, and network scan results from a client engagement are covered by non-disclosure agreements. Transmitting this data to OpenAI, Anthropic, or Google's APIs may violate those agreements, depending on the provider's data retention and training policies.

**Mitigation:** Use locally hosted models for engagements with strict confidentiality requirements. Open-source models like Llama, Mistral, or Qwen can run on modest hardware and provide sufficient capability for reconnaissance analysis and report generation. For cloud-hosted models, review the provider's data processing agreement, confirm that API inputs are not used for training, and obtain explicit client approval before transmitting engagement data to any third-party service.

---

### Safety guardrails as capability constraints

Commercial LLMs are trained to refuse requests for exploit code, malware, and offensive security techniques. These safety guardrails are appropriate for general-purpose use but create friction for legitimate penetration testers. A request like "Generate a Python script that exploits CVE-2024-XXXX in Apache Struts" will often be refused by GPT-4 or Claude, even when the requester has legitimate authorisation to conduct the test.

**Mitigation:** Use models without safety guardrails for legitimate offensive work. Open-source models can be fine-tuned or run without alignment constraints. Alternatively, use specialised frameworks like **PentestGPT** that implement their own context management to maintain focus on authorised testing objectives.[^3] Be aware that jailbreaking commercial models to bypass safety guardrails introduces unpredictable behaviour and is covered in [article 2.03](/attack-and-red-team/jailbreaking-llms/) of this series.

---

### The skill floor problem

AI-augmented tools lower the barrier to entry for penetration testing, which creates a quality risk. An inexperienced tester armed with PentestGPT can generate impressive-looking findings without understanding the underlying vulnerability mechanics. They may not recognise when the model has produced a false positive, mischaracterised a vulnerability's severity, or suggested a remediation that introduces a new weakness. The model compensates for skill gaps in execution but not in judgement.

**Mitigation:** Treat AI tools as force multipliers for experienced practitioners, not substitutes for expertise. Require that AI-generated findings be reviewed by a senior tester who can assess their validity. Invest in training that builds foundational understanding of vulnerability classes, exploitation mechanics, and defensive architectures, because this is the knowledge needed to supervise AI-generated output effectively.

---

### Ethical boundaries

The same tools that assist authorised penetration testers can assist unauthorised attackers. PentestGPT's autonomous agent loop does not verify that its operator has authorisation to test the target. ReconAIzer does not check whether the domain being analysed is in scope. The ethical boundary is entirely dependent on the practitioner's intent and the legal framework they operate within.

**Mitigation:** Establish clear rules of engagement before using AI tools in any security testing. Document scope, authorisation, and data handling requirements. Use AI tools only within the bounds of a signed statement of work or authorisation letter. Implement logging that records every prompt sent to an LLM during an engagement, creating an audit trail that demonstrates the testing stayed within authorised bounds.

---

## 7. Practical Recommendations

The following recommendations are ordered by impact and ease of adoption.

---

### Start with reconnaissance and reporting

These are the two phases where LLMs add the most value with the least risk. Reconnaissance involves synthesising public data (low confidentiality risk) and produces hypotheses that are naturally verified in later testing phases. Reporting transforms structured data into prose (low hallucination risk because the facts are already established). Begin here, measure the time savings, and use the results to justify further integration.

---

### Build a verification-first workflow

Every AI-generated output must pass through a verification step before it influences a decision. For reconnaissance findings, verify that identified subdomains resolve and that claimed technologies are actually present. For vulnerability findings, reproduce the issue with a manual proof-of-concept. For report content, confirm that cited CVEs exist and that severity ratings are accurate. Build this verification step into your process template, not as an afterthought but as a required gate.

---

### Choose the right model for the right phase

Not every phase requires GPT-4-class capability. For reconnaissance correlation and report generation, smaller models (GPT-4o-mini, Llama 3 8B, Mistral 7B) provide adequate performance at lower cost and latency. Reserve larger models for vulnerability analysis and exploit development, where the additional reasoning capability makes a measurable difference. For engagements with strict confidentiality requirements, use locally hosted open-source models exclusively.

---

### Log everything

Record every prompt sent to an LLM during an engagement and every response received. This serves three purposes: (1) it creates an audit trail demonstrating that testing stayed within authorised scope, (2) it enables post-engagement review of the AI's contribution versus the tester's own analysis, and (3) it builds a dataset for evaluating which prompts and workflows produce the most accurate results over time.

```python
import logging
from datetime import datetime

engagement_logger = logging.getLogger("ai_pentest")

def logged_llm_call(prompt: str, model: str, engagement_id: str) -> str:
    """Wrapper that logs all LLM interactions during an engagement."""
    engagement_logger.info(
        "PROMPT | engagement=%s model=%s timestamp=%s | %s",
        engagement_id, model, datetime.utcnow().isoformat(), prompt
    )
    response = call_llm(prompt, model)
    engagement_logger.info(
        "RESPONSE | engagement=%s model=%s timestamp=%s | %s",
        engagement_id, model, datetime.utcnow().isoformat(), response
    )
    return response
```

---

### Adopt a tool stack

For teams ready to integrate AI into their penetration testing workflow, the following stack covers the major phases:

| Phase | Tool | Use case |
|---|---|---|
| Reconnaissance | **ReconAIzer** + Burp Suite | AI-powered OSINT and endpoint discovery |
| Vulnerability scanning | **BurpGPT** + Semgrep | AI-augmented passive scanning and code review |
| AI system red-teaming | **PyRIT** | Automated testing of LLM-powered applications |
| ML model security | **Counterfit** | Adversarial attacks against ML models |
| Autonomous testing | **PentestGPT** | End-to-end AI-driven penetration testing |
| Reporting | Custom LLM templates | Structured finding-to-narrative generation |

---

### This week's three actions

1. **Run a reconnaissance comparison.** Take a recent engagement's target list and run the reconnaissance phase with and without LLM assistance. Compare the number of findings, the time taken, and the accuracy of each approach. This gives you a concrete baseline for the value AI adds to your workflow.

2. **Set up a local model for confidential work.** Install Ollama or vLLM with a Llama 3 or Mistral model on your testing workstation. Use it for one engagement's report generation to evaluate whether the output quality meets your standards without sending client data to a third-party API.

3. **Audit your data handling.** Review your current penetration testing workflow for any step where engagement data is sent to a cloud LLM API. For each instance, determine whether the client's NDA permits this, whether the API provider's data processing agreement is compatible, and whether a local model could serve the same purpose.

---

## 8. Further Reading

**Research and competition results**

- DARPA, "AI Cyber Challenge marks pivotal inflection point for cyber defense" (August 2025). Final results from the AIxCC competition, where autonomous Cyber Reasoning Systems discovered 54 vulnerabilities across 54 million lines of code and patched 43 of them.[^1]
- Fang et al., "LLM Agents can Autonomously Exploit One-day Vulnerabilities", arXiv:2404.08144 (2024). Demonstrated that a GPT-4 agent could exploit 87% of a 15-CVE benchmark when given vulnerability descriptions, while all other models and scanners scored 0%.[^2]
- Liang et al., "Comparing AI Agents to Cybersecurity Professionals in Real-World Penetration Testing", arXiv:2512.09882 (2025). Head-to-head comparison showing AI agents operate at $18/hour versus $60/hour for professionals, with higher false positive rates but systematic coverage advantages.[^11]
- Semgrep, "Finding vulnerabilities in modern web apps using Claude Code and OpenAI Codex" (2025). Evaluation of LLM agents for vulnerability discovery, finding 14-18% true positive rates for standalone AI code review.[^8]

**Tools and frameworks**

- **PentestGPT** (https://github.com/GreyDGL/PentestGPT): Autonomous penetration testing agent with reasoning, generation, and parsing modules. Distinguished Artifact award at USENIX Security 2024.[^3]
- **PyRIT** (https://github.com/Azure/PyRIT): Microsoft's open-source red-teaming framework for generative AI systems, with orchestrators, converters, and scorers for systematic vulnerability testing.[^4]
- **Counterfit** (https://github.com/Azure/counterfit): Microsoft's CLI for assessing ML model security using adversarial attacks from ART, TextAttack, and AugLy frameworks.[^9]
- **ReconAIzer**: Burp Suite extension integrating OpenAI for reconnaissance data extraction and analysis.[^6]
- **BurpGPT**: Burp Suite extension for GPT-powered passive vulnerability scanning.[^7]
- **Semgrep** (https://semgrep.dev): Static analysis platform with AI-powered triage achieving 96% agreement with human security researchers.[^5]

**Frameworks and standards**

- OWASP API Security Top 10 (2023). The authoritative reference for API vulnerability classes, particularly relevant for AI-augmented testing of API endpoints.[^10]
- Microsoft, "Planning red teaming for large language models (LLMs) and their applications". Guidance on assembling red teams, defining threat models, and structuring LLM security assessments.[^12]
- Microsoft Research, "Lessons From Red Teaming 100 Generative AI Products" (2025). Research publication covering patterns observed across 100 AI product assessments, including the finding that LLMs amplify existing security risks while introducing new categories.[^13]

**Related articles in this series**

- [2.01 PyRIT: Zero to Red Team](/attack-and-red-team/pyrit-zero-to-red-team/) (hands-on PyRIT setup and first attack orchestration)
- [2.02 Prompt Injection Field Manual: 20 Techniques That Still Work in 2026](/attack-and-red-team/prompt-injection-field-manual/) (the attack taxonomy for prompt injection)
- [2.03 Jailbreaking LLMs: From Many-Shot to Crescendo Attacks](/attack-and-red-team/jailbreaking-llms/) (bypassing safety guardrails that constrain offensive use)
- [2.06 The MITRE ATLAS Playbook](/attack-and-red-team/the-mitre-atlas-playbook/) (mapping AI attacks to the ATT&CK framework for structured threat modelling)

---

[^1]: DARPA, "AI Cyber Challenge marks pivotal inflection point for cyber defense" (August 2025), https://www.darpa.mil/news/2025/aixcc-results
[^2]: Fang et al., "LLM Agents can Autonomously Exploit One-day Vulnerabilities", arXiv:2404.08144 (2024), https://arxiv.org/abs/2404.08144
[^3]: PentestGPT, https://www.usenix.org/conference/usenixsecurity24/presentation/deng; Deng et al., "PentestGPT: An LLM-empowered Automatic Penetration Testing Tool", USENIX Security 2024
[^4]: Microsoft PyRIT documentation, https://github.com/Azure/PyRIT
[^5]: Semgrep, "How we built an AppSec AI that security researchers agree with 96% of the time" (2025), https://semgrep.dev/blog/2025/building-an-appsec-ai-that-security-researchers-agree-with-96-of-the-time
[^6]: ReconAIzer, Burp Suite extension for OpenAI-powered reconnaissance, https://github.com/hisxo/ReconAIzer
[^7]: BurpGPT, Burp Suite extension integrating OpenAI GPT for passive scanning, https://github.com/aress31/burpgpt
[^8]: Semgrep, "Finding vulnerabilities in modern web apps using Claude Code and OpenAI Codex" (2025), https://semgrep.dev/blog/2025/finding-vulnerabilities-in-modern-web-apps-using-claude-code-and-openai-codex/
[^9]: Microsoft Counterfit, https://github.com/Azure/counterfit
[^10]: OWASP, "API Security Top 10 2023", https://owasp.org/API-Security/editions/2023/en/0x11-t10/
[^11]: Liang et al., "Comparing AI Agents to Cybersecurity Professionals in Real-World Penetration Testing", arXiv:2512.09882 (2025), https://arxiv.org/abs/2512.09882
[^12]: Microsoft, "Planning red teaming for large language models (LLMs) and their applications", https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/red-teaming
[^13]: Microsoft Research, "Lessons From Red Teaming 100 Generative AI Products" (2025), https://www.microsoft.com/en-us/research/publication/lessons-from-red-teaming-100-generative-ai-products/
