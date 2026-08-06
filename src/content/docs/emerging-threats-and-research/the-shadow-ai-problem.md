---
title: "The Shadow AI Problem: Detecting Unauthorised AI Tool Usage in Your Organisation"
description: "A practical how-to for detecting and managing unauthorised AI tool usage across your organisation, from network-level visibility to policy enforcement."
sidebar:
  order: 3
date: 2026-07-27
---

**Series:** AI Security in Practice<br/>
**Pillar:** 6: Emerging Threats and Research<br/>
**Difficulty:** Intermediate<br/>
**Author:** Paul Lawlor<br/>
**Date:** 27 July 2026<br/>
**Reading time:** 14 minutes

> A practical how-to for detecting and managing unauthorised AI tool usage across your organisation, from network-level visibility to policy enforcement.

---

## Table of Contents

1. [What and Why](#1-what-and-why)
2. [Prerequisites](#2-prerequisites)
3. [Step-by-Step Detection](#3-step-by-step-detection)
4. [Verification](#4-verification)
5. [Common Mistakes](#5-common-mistakes)
6. [Advanced Configuration](#6-advanced-configuration)
7. [Metrics and Monitoring](#7-metrics-and-monitoring)
8. [Summary](#8-summary)

---

## 1. What and Why

Shadow AI is the AI equivalent of shadow IT: generative AI tools adopted by individuals or teams without central approval. Employees use ChatGPT, Claude, Copilot, Cursor, and dozens of other applications to do their jobs faster. Many do so without asking IT, without enterprise agreements, and without any visibility into what data those tools receive.

A 2024 Salesforce survey found that more than half of generative AI users at work were using tools their employer had not approved.[^1] Netskope reported that the average enterprise had employees using over a dozen distinct generative AI applications, many without IT awareness.[^2] Zscaler's ThreatLabz research showed that enterprise AI and ML transactions surged 595% between April 2023 and January 2024, with about 19% of those transactions now blocked by security policies.[^3] The gap between approved and actual usage is wide, and it is growing.

Why does this matter for security? Unauthorised AI tools create three primary risks:

**Data exposure.** When employees use consumer or personal-tier AI accounts, their prompts may be retained for troubleshooting, reviewed for safety, or used to train future model versions. Enterprise and API agreements typically opt out of training use by default, but shadow AI means employees are almost certainly not on enterprise agreements. When someone pastes proprietary code, customer data, or internal strategy into a personal ChatGPT or Claude account, that data leaves your organisation's control. There is no audit trail, no retention policy, and no way to revoke access when the employee leaves.

**Policy and compliance gaps.** Regulated industries face obligations around where data resides, who processes it, and how it is protected. Shadow AI bypasses vendor assessments, data processing agreements, and security reviews. A developer using an unapproved AI coding assistant may be sending intellectual property to a service that has not been evaluated for your compliance framework.

**Blast radius from supply chain and model risk.** Each AI tool is a dependency. A compromised model, a malicious third-party plugin, or a prompt injection that exfiltrates data through an agentic assistant becomes an incident you did not know you had until it is too late.

This article is a practical how-to for detecting and managing unauthorised AI tool usage in your organisation. We cover network-level detection, endpoint monitoring, policy enforcement, and the organisational work required to turn visibility into governance. The goal is not to ban AI, but to channel usage into approved, observable paths while reducing the shadow surface.

---

## 2. Prerequisites

Before implementing detection controls, you need access to a few foundational capabilities. Most organisations already have at least some of these.

**Network and proxy visibility.** To detect cloud-based AI usage, you need logs of outbound traffic. That means one or more of: a web proxy (explicit or transparent), a secure web gateway (SWG), a cloud access security broker (CASB), or a firewall that logs DNS and HTTP/HTTPS requests. If traffic goes directly to the internet without inspection, you will not see it. Ensure you can query logs by domain, user (or device), and timestamp.

**Endpoint telemetry.** To detect local AI tools and browser-based usage, you need visibility on endpoints. That typically comes from an endpoint detection and response (EDR) product, a mobile device management (MDM) or unified endpoint management (UEM) solution, or a combination. You need to query for installed applications, running processes, and optionally browser extensions. Some organisations also use desktop analytics or asset inventory tools that report installed software.

**Authority to act.** Shadow AI detection quickly raises questions of policy and enforcement. Before deploying technical controls, confirm you have (or will obtain) executive sponsorship for an AI usage policy and the authority to enforce it. Detection without a clear policy and response plan creates confusion and resistance.

**A baseline of known AI tools.** You will be building allow lists, block lists, and policy rules. Start with a list of the AI applications you intend to permit or restrict. Common categories include: public LLM chat interfaces (ChatGPT, Claude, Gemini, Copilot), AI coding assistants (Cursor, GitHub Copilot, Windsurf, Amazon Q Developer), local model runners (Ollama, LM Studio), and AI features embedded in productivity tools (Microsoft 365 Copilot, Google Workspace AI). Vendors such as Netskope and Zscaler maintain cloud application catalogues that classify AI apps; you can use these as a starting point.[^4] [^5]

If you lack network or endpoint visibility, treat that as the first project. Shadow AI detection builds on the same infrastructure used for general data loss prevention (DLP) and cloud security.

---

## 3. Step-by-Step Detection

Detection happens in three layers: network, endpoint, and policy enforcement. Implement them in order of coverage and operational effort.

### 3.1 Network-level detection: CASB, DLP, and DNS

The fastest way to discover shadow AI is to analyse outbound traffic to known AI service endpoints. Most generative AI tools call cloud APIs or load web interfaces from fixed domains.

**Domain and URL monitoring.** Configure your web proxy, SWG, or CASB to log and optionally categorise traffic to AI-related domains. Key domains and patterns to include:

| Category | Example domains and patterns |
|----------|-----------------------------|
| OpenAI | `api.openai.com`, `chat.openai.com`, `*.openai.com` |
| Anthropic | `api.anthropic.com`, `claude.ai` |
| Google | `generativelanguage.googleapis.com`, `gemini.google.com`, `aistudio.google.com` |
| Microsoft | `*.openai.azure.com`, `copilot.microsoft.com`, `*.cognitive.azure.com` |
| AWS | `bedrock-runtime.*.amazonaws.com` |
| Hugging Face | `api-inference.huggingface.co`, `huggingface.co` |
| Other | `perplexity.ai`, `you.com`, `poe.com`, `character.ai` |

If your security platform includes an AI application category (Netskope's GenAI Security and Zscaler's Generative AI Security both classify AI and ML applications), enable it and use it to filter or report.[^4] [^5] Export logs to your SIEM or analytics platform so you can correlate by user, department, and time.

**DLP and prompt inspection.** For higher assurance, use inline DLP to inspect traffic to AI applications. Modern CASB and SWG products can detect sensitive data in HTTP request bodies (including JSON payloads containing prompts). Zscaler, for example, offers prompt-level visibility and DLP controls that block or alert when sensitive data appears in prompts.[^5] Netskope's approach combines application visibility with DLP policies for generative AI.[^4] This requires SSL/TLS inspection for the relevant domains. If you already inspect traffic for other DLP use cases, extend those policies to AI app categories.

**DNS monitoring as a fallback.** If you do not have a web proxy in place, DNS query logs can still reveal AI usage. Many AI tools resolve distinct domains; querying your DNS resolver or DNS firewall for the patterns above will show which clients are attempting to reach AI services. DNS does not give you request content or volume, but it does give you presence and frequency. Use it to establish a baseline before deploying full proxy inspection.

### 3.2 Endpoint monitoring: local models and extensions

Network detection catches cloud-based AI. Local AI tools and some browser-based usage require endpoint visibility.

**Local model runners.** Tools such as **Ollama** run models on the user's machine and communicate via `localhost`.[^6] They do not generate outbound traffic to cloud AI domains, so network monitoring misses them. Detect them via:

- **Process monitoring.** Look for processes named `ollama`, `ollama.exe`, or similar. EDR and asset inventory tools can report running processes and installed binaries.
- **Listening ports.** Ollama listens on `http://localhost:11434` by default. Port and socket monitoring can detect this.
- **Installed software inventory.** Query your software inventory for Ollama, LM Studio, or other local inference tools.

**Browser extensions and desktop apps.** ChatGPT and Claude offer desktop applications and browser extensions. These may use different traffic patterns than the standard web interface. Use browser extension management (through group policy, MDM, or a dedicated extension management product) to audit installed extensions and flag AI-related ones. For desktop apps, include them in your software inventory queries (e.g. "ChatGPT", "Claude", "Cursor").

**IDE and coding tools.** Cursor, Windsurf, and GitHub Copilot run as IDE extensions or standalone applications. They may call cloud APIs (which network monitoring will catch) or run local models. Include these in both network domain rules and endpoint software inventory.

### 3.3 Policy enforcement: approved tools and acceptable use

Detection without enforcement does not reduce risk. Once you have visibility, define and enforce policy.

**Approved tool list.** Publish a list of AI tools that are permitted for specific use cases. For example: Microsoft Copilot for internal productivity, GitHub Copilot for code (with privacy settings), and approved cloud LLM APIs for development. Everything else is either blocked or requires exception approval.

**Block unapproved AI domains.** Use your SWG or firewall to block access to AI applications that are not on your approved list. Be aware that blocking alone can frustrate users and drive usage to personal devices or mobile hotspots. Pair blocking with communication about why and with approved alternatives.

**Allow with controls.** For approved tools, apply DLP policies that prevent sensitive data from leaving in prompts. Use browser isolation where available (Zscaler offers this for GenAI apps) to restrict clipboard, upload, and download actions.[^5] The goal is to enable productivity while constraining data flow.

**Exception process.** Define how teams request exceptions. A lightweight form with business justification, data classification, and approval path prevents ad hoc exceptions while keeping the programme flexible.

---

## 4. Verification

After deploying detection controls, verify they work before relying on them for policy decisions.

**Test cloud AI detection.** From a managed endpoint on your corporate network, visit `chat.openai.com` or `claude.ai` in a browser. Confirm that your proxy or SWG logs the request with the correct user and application classification. Run the same test for an API call (e.g. a script that calls `api.openai.com`). If you use a CASB with an AI app category, verify that the session is categorised as generative AI, not generic web browsing.

**Test local AI detection.** Install Ollama on a test machine, pull a model, and run `ollama serve`.[^6] Verify that your EDR or asset inventory detects the `ollama` process within your expected discovery window (often 24 to 48 hours for periodic inventory scans). If you have port monitoring, confirm that traffic to `localhost:11434` is visible or that the listening socket is reported.

**Test DLP for prompts.** If you have prompt-level DLP, send a test prompt containing fake sensitive data (e.g. a mock credit card number or internal project name) to an approved AI app. Confirm that the policy triggers an alert or block. Adjust detection rules if you get excessive false positives; overly aggressive DLP leads to workarounds.

**Validate coverage gaps.** Identify paths that bypass your controls. Do employees use personal mobile devices or home networks to access AI tools? Are there guest or contractor networks that do not route through your proxy? Document these gaps and decide whether they are in scope for your programme or accepted residual risk.

Run these verification steps quarterly and after any significant change to your network or endpoint architecture.

---

## 5. Common Mistakes

**Banning first, governing later.** A blanket ban on AI tools without approved alternatives drives usage underground. Users will find workarounds: personal devices, home networks, or tools you have not yet categorised. Start with visibility and an acceptable use policy. Introduce blocking only after you have communicated approved alternatives and given teams time to adopt them.

**Ignoring local AI.** Ollama, LM Studio, and similar tools run entirely on the endpoint. They generate no outbound traffic to cloud AI domains. If you rely solely on network monitoring, you will miss them. Include endpoint-based detection for local model runners.

**Over-blocking without nuance.** Zscaler reports that about 19% of AI transactions are blocked today.[^3] Blocking eliminates both risk and benefit. Use granular controls: allow approved apps with DLP, block unapproved ones, and consider browser isolation for high-risk use cases instead of outright blocking.

**Treating shadow AI as a compliance failure.** Frame the programme as enablement, not punishment. "Help us support you safely" yields better cooperation than "you have been using unsanctioned tools." Run a non-punitive survey to discover usage before enforcing policy. Use the results to prioritise which tools to approve and which to restrict.

**Assuming one size fits all.** Engineering teams may need Cursor or Copilot for code; marketing may need ChatGPT for copy. Legal may need to avoid any tool that trains on prompts. Define risk tiers and allow different controls for different data classifications and use cases.

**Forgetting mobile and unmanaged devices.** Corporate laptops behind a proxy are one vector. Personal phones, contractor devices, and home office connections are others. Decide whether your programme covers only managed corporate devices or extends to bring-your-own-device (BYOD) and remote work. Document the scope clearly.

---

## 6. Advanced Configuration

Once baseline detection is in place, consider these refinements.

**Granular policy by team or risk tier.** Apply different policies to different groups. Engineering may have access to GitHub Copilot and Cursor with DLP; legal and HR may be restricted to on-premises or air-gapped options. Use group-based or attribute-based policies in your CASB or SWG to enforce this without manual per-user configuration.

**Browser isolation for high-risk AI use.** For users who need access to AI tools that you cannot fully trust, render the application in an isolated browser session. Zscaler's approach restricts clipboard, upload, and download in the isolation environment, reducing the risk of bulk data exfiltration while allowing prompts.[^5] Netskope offers similar capability through Remote Browser Isolation.[^4] Use this for high-sensitivity use cases where blocking is too disruptive but standard access is too risky.

**Prompt and response logging.** Some enterprises require an audit trail of what was sent to and received from AI systems. CASB and DLP products are adding prompt-level logging for generative AI. Evaluate whether your compliance obligations require this, and whether your chosen platform supports it. Be mindful of privacy: logging prompts may capture personal data, so retention and access controls matter.

**Integration with identity and data classification.** Tie AI access to identity attributes (department, clearance, data role) and to the sensitivity of data the user handles. Users who work with regulated data may see stricter controls. Integrate with your data classification scheme so that DLP rules automatically reflect classification levels.

**Automated exception and approval workflows.** When teams request access to a new AI tool, route the request through a defined workflow: security review, vendor assessment, data classification check. Use a workflow automation tool (e.g. Zscaler Workflow Automation for coaching and policy feedback) to close the loop between detection, exception requests, and policy updates.[^5]

---

## 7. Metrics and Monitoring

Measure your shadow AI programme so you can show progress and adjust course.

**Shadow AI reduction over time.** Compare current detection results to your baseline. Are fewer unapproved AI services being accessed? Are more users on approved tools? This is the primary health metric for the programme. Track it monthly.

**Volume and distribution of AI usage.** How many users touch AI applications? Which apps are most used? Which departments have the highest usage? This informs prioritisation: focus policy and training where usage is concentrated.

**Policy violations and exceptions.** Count alerts and blocks from DLP and access policies. Are violations decreasing as users shift to approved tools? How many exception requests do you receive, and for which apps? A rising exception queue may indicate that your approved list is too narrow.

**Time to detect new AI apps.** The AI application landscape changes rapidly. New tools emerge; existing tools add API endpoints. Measure how quickly new AI applications appear in your environment after they gain traction, and how quickly you add them to your detection rules. Vendors such as Netskope and Zscaler continuously update their cloud app catalogues; ensure you receive those updates.[^4] [^5]

**Incident correlation.** When you have an AI-related incident (data leak, prompt injection, supply chain compromise), could your shadow AI controls have detected or prevented it? Use incidents to validate and improve your detection coverage.

Report these metrics to your governance or risk committee alongside other security programme metrics. Shadow AI is part of your overall AI security posture.

---

## 8. Summary

Shadow AI is pervasive. Employees use generative AI tools whether or not you have policies. The goal is not to eliminate AI use, but to bring it into the light: to know what is used, where data flows, and how to enforce acceptable risk.

**Detect in three layers.** Use network-level controls (CASB, SWG, proxy, DNS) to discover cloud-based AI usage. Use endpoint monitoring to find local model runners such as Ollama and AI-enabled desktop applications. Use policy enforcement to channel usage into approved paths and block or restrict the rest.

**Start with visibility, not blocking.** Build an inventory of AI usage before enforcing strict controls. Run a non-punitive survey. Establish a baseline. Then introduce approved tool lists, DLP, and where appropriate, browser isolation.

**Balance security with productivity.** Blocking everything eliminates both risk and benefit. Use granular policies: allow approved tools with controls, block unapproved ones, and treat high-sensitivity use cases with isolation rather than blanket denial.

**Treat it as a programme, not a project.** Shadow AI governance requires policy, training, exception processes, and ongoing monitoring. Integrate it with your broader AI security programme ([Article 1.10 (Building an AI Security Programme)](/foundations/building-an-ai-security-programme/)) and your data loss prevention capabilities.

Three actions you can take this week: run a DNS or proxy query for traffic to `api.openai.com`, `api.anthropic.com`, and `claude.ai`; add Ollama and Cursor to your endpoint software inventory report; and draft a one-page acceptable use policy for AI tools. From there, build toward full visibility and governance.

---

[^1]: Salesforce, "More Than Half of Generative AI Adopters Use Unapproved Tools at Work," 2024. https://www.salesforce.com/news/stories/ai-at-work-research/
[^2]: Netskope Threat Labs, "Cloud and Threat Report," various editions. https://www.netskope.com/netskope-threat-labs/cloud-threat-report
[^3]: Zscaler ThreatLabz, "AI Security Report," 2024. https://www.zscaler.com/campaign/threatlabz-ai-security-report
[^4]: Netskope, "Securing AI," 2024. https://www.netskope.com/solutions/securing-ai
[^5]: Zscaler, "Secure the Use of Generative AI," 2024. https://www.zscaler.com/products-and-solutions/securing-generative-ai
[^6]: Ollama, "Security," GitHub. https://github.com/ollama/ollama/security
