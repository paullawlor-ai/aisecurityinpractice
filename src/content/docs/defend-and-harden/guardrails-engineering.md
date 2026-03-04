---
title: "Guardrails Engineering: Bedrock Guardrails vs NeMo Guardrails vs Lakera Guard"
description: "A comparative deep dive into three guardrail approaches for production LLM applications: AWS Bedrock, NVIDIA NeMo, and Lakera Guard."
sidebar:
  order: 7
---

**Series:** AI Security in Practice<br/>
**Pillar:** 3: Defend and Harden<br/>
**Difficulty:** Intermediate<br/>
**Author:** Paul Lawlor<br/>
**Date:** 2 March 2026<br/>
**Reading time:** 14 minutes

> A comparative deep dive into three guardrail approaches for production LLM applications: AWS Bedrock Guardrails, NVIDIA NeMo Guardrails, and Lakera Guard, with implementation guidance and a decision matrix.

---

## Table of Contents

1. [What we compare and why](#1-what-we-compare-and-why)
2. [AWS Bedrock Guardrails](#2-aws-bedrock-guardrails)
3. [NVIDIA NeMo Guardrails](#3-nvidia-nemo-guardrails)
4. [Lakera Guard](#4-lakera-guard)
5. [Head-to-head comparison](#5-head-to-head-comparison)
6. [Integration patterns](#6-integration-patterns)
7. [Decision matrix](#7-decision-matrix)
8. [Summary](#8-summary)

---

## 1. What we compare and why

Guardrails are filters and controls that sit between users and large language models. They block or modify inputs and outputs to prevent harmful content, prompt injection, PII leakage, and off-topic responses. The OWASP Top 10 for LLM Applications explicitly recommends input and output filtering as a mitigation for prompt injection (LLM01), output handling failures (LLM05), and system prompt leakage (LLM07). [^1] Relying on prompt engineering alone is insufficient: attackers can bypass instructions with simple variations in casing, spacing, or encoding. [^2] You need a dedicated guardrail layer.

The market offers three distinct approaches, each with different trade-offs. **Amazon Bedrock Guardrails** is a managed service tightly integrated with AWS Bedrock. **NVIDIA NeMo Guardrails** is an open-source toolkit that runs as middleware with any LLM. **Lakera Guard** is a hosted API for prompt injection detection, content moderation, and PII protection. Choosing among them depends on your deployment model, compliance requirements, and need for customisation.

### Decision criteria

When evaluating guardrail solutions, practitioners should consider:

**Deployment model.** Does your application run on AWS Bedrock, a different cloud provider, or self-hosted inference? Bedrock Guardrails only works with Bedrock models and APIs. NeMo Guardrails runs wherever you run Python. Lakera Guard is a network call from anywhere.

**Coverage.** What threats must you defend against? All three address prompt injection and content moderation to varying degrees. PII detection, denied topics, hallucination detection, and contextual grounding differ significantly. Bedrock offers the widest built-in filter set. NeMo offers the most flexibility via custom Colang flows. Lakera specialises in prompt injection and PII with battle-tested classifiers.

**Operational burden.** Who configures and maintains the guardrails? Bedrock is declarative and managed. NeMo requires Python and Colang expertise. Lakera is API-first with minimal infrastructure.

**Cost structure.** Bedrock charges per policy type and per token evaluated. NeMo has no per-call cost but you pay for compute. Lakera charges per API call, typically with volume tiers.

**Compliance and data residency.** Some organisations cannot send user data to third-party APIs. Bedrock processes data within your AWS account. NeMo runs entirely in your environment. Lakera processes requests on Lakera infrastructure; their SOC 2 and GDPR posture matters if you route sensitive data through their API.

---

## 2. AWS Bedrock Guardrails

**Amazon Bedrock Guardrails** is a managed service that provides configurable safeguards for generative AI applications built on AWS Bedrock. [^3] It evaluates both user inputs and model responses before and after inference. You configure policies through the Bedrock console or API, and the guardrail is applied by referencing a guardrail ID and version when calling `InvokeModel`, `InvokeModelWithResponseStream`, `Converse`, or `ConverseStream`. Alternatively, you can use the `ApplyGuardrail` API to evaluate content without invoking a model. [^4]

### Architecture

Bedrock Guardrails operates in the request path. When you include a guardrail in an inference call:

1. The input is evaluated against all configured policies in parallel (for low latency).
2. If any policy triggers a violation, a configured blocked message is returned and the foundation model is never called.
3. If the input passes, the model generates a response.
4. The response is then evaluated against the same policies.
5. If the response violates a policy, it is overridden with a blocked message or with sensitive information masked. [^4]

Guardrails can be used with Bedrock Agents, Bedrock Knowledge Bases, and direct model invocations. For RAG or conversational applications where you want to evaluate only user input (not system instructions, search results, or conversation history), you can use input tagging via the AWS SDK. [^5] This selective evaluation is not available in the console.

### Strengths

**Comprehensive built-in filters.** Bedrock Guardrails offers content filters (Hate, Insults, Sexual, Violence, Misconduct, Prompt Attack), denied topics, word filters, sensitive information filters (PII, custom regex), contextual grounding checks for RAG, and Automated Reasoning checks. [^3] The Standard tier extends detection to harmful content hidden within code elements, including comments, variable names, and string literals. [^6] No other solution in this comparison provides this breadth out of the box.

**Tight Bedrock integration.** If you already use Bedrock, adding guardrails requires no new infrastructure. You create a guardrail, attach it to your inference calls, and pay per policy type and token. There is no middleware to deploy or maintain.

**Declarative configuration.** Policies are defined in JSON or through the console. You set filter strengths (None, Low, Medium, High) per category, specify blocked messages, and version your guardrails for controlled rollout. [^7]

**Cross-Region and cross-account.** Bedrock Guardrails supports cross-Region inference and cross-account enforcements, useful for multi-Region or multi-account architectures. [^8]

### Weaknesses

**Bedrock-only.** Bedrock Guardrails works exclusively with AWS Bedrock. If you use OpenAI, Azure OpenAI, Anthropic directly, or self-hosted models, you cannot use this service. You would need to proxy requests through Bedrock or choose a different guardrail solution.

**Limited customisation.** You configure predefined categories and strengths. You cannot define custom semantic checks or conversational flows. For highly domain-specific rules (e.g. "never discuss competitor X in a support context"), you rely on denied topics and word filters, which may not capture nuanced behaviour.

**Pricing complexity.** Charges apply per policy type and per token evaluated. If a guardrail blocks the input, you pay for the guardrail but not the model. If it blocks the response, you pay for both. [^4] At scale, costs can add up.

**Tagging limitations.** Input tagging for selective evaluation (e.g. RAG scenarios) is only available via the SDK, not the console or playground. [^5] Teams that rely on the console for testing must use the API for production configurations.

---

## 3. NVIDIA NeMo Guardrails

**NeMo Guardrails** is an open-source toolkit for adding programmable guardrails to LLM-based conversational systems. [^9] It runs as a middleware layer between your application and any LLM. You define rails in a domain-specific language called Colang, and the toolkit enforces them at runtime. NeMo Guardrails supports OpenAI, LLaMA, Falcon, Vicuna, Mosaic, and other models via a pluggable LLM interface. [^10]

### Architecture

NeMo Guardrails introduces five types of rails:

- **Input rails** run when new user input arrives. They can reject the input or alter it (e.g. mask sensitive data).
- **Dialog rails** influence how the LLM is prompted. They determine whether to execute an action, invoke the LLM, or use a predefined response.
- **Retrieval rails** apply to retrieved chunks in RAG scenarios. They can reject or alter chunks before the LLM sees them.
- **Execution rails** apply to the input and output of custom actions (tools) called by the LLM.
- **Output rails** run on LLM output. They can reject or alter the response before it reaches the user. [^10]

Configuration lives in a folder with `config.yml` (models, active rails, general settings), `config.py` (custom initialisation), `actions.py` (custom Python actions), and `.co` files containing Colang definitions. Example `config.yml`:

```yaml
models:
  - type: main
    engine: openai
    model: gpt-3.5-turbo-instruct

rails:
  input:
    flows:
      - check jailbreak
      - mask sensitive data on input
  output:
    flows:
      - self check facts
      - self check hallucination
```

You load the configuration and call `generate` or `generate_async` instead of calling the LLM directly. The input/output format matches the OpenAI Chat Completions API. [^10]

### Strengths

**Model-agnostic.** NeMo Guardrails works with any LLM you can plug in. If you switch from OpenAI to Anthropic or move to a self-hosted model, you change the `config.yml` model block. Your rails stay the same.

**Programmable behaviour.** Colang lets you define conversational flows, topic constraints, and custom logic. You can steer the dialogue along predefined paths, enforce standard operating procedures, and decide when specific guardrails (e.g. fact-checking) apply. [^10] This is the only solution in this comparison that models dialog structure, not just content filtering.

**Full control over data and logic.** Everything runs in your environment. No user data is sent to third parties. You can audit, modify, and extend the code.

**Built-in integrations.** NeMo Guardrails includes a guardrails library with flows for jailbreak detection, sensitive data masking, fact-checking, hallucination detection, and third-party APIs (e.g. ActiveFence). [^11] It also integrates with LangChain. [^12]

**Evaluation tooling.** The `nemoguardrails evaluate` CLI supports topical rails, fact-checking, moderation, and hallucination. [^10] You can run vulnerability scans against your configured rails.

### Weaknesses

**Operational complexity.** You install Python dependencies (including annoy, which requires a C++ compiler), manage config files, and run the guardrails server or integrate the Python API. Teams without Python expertise will find the setup and maintenance overhead higher than a managed service.

**No managed hosting.** Unlike Bedrock or Lakera, there is no vendor-hosted option. You deploy and scale the guardrails layer yourself.

**Colang learning curve.** Writing effective Colang flows requires understanding the syntax and semantics. The documentation is thorough, but practitioners accustomed to JSON-based configs will need to invest time.

**Library guardrails are not guaranteed production-ready.** NVIDIA states that built-in guardrails "may or may not be suitable for a given production use case" and recommends working with internal teams to validate. [^11]

---

## 4. Lakera Guard

**Lakera Guard** is a hosted API that provides runtime security for GenAI applications. [^13] It screens LLM interactions (user inputs, reference documents, outputs) for prompt injection, harmful content, and PII. Integration is a single API call: you send text to be evaluated and receive a structured response indicating whether the content should be blocked or allowed. Lakera emphasises sub-100ms latency and operational simplicity for production use. [^14]

### Architecture

Lakera Guard exposes the `/v2/guard` endpoint for threat screening. You submit user inputs, reference documents (e.g. RAG context), and model outputs. The API returns flagging decisions, threat breakdowns by detector type, and confidence levels. [^15] A separate `/v2/guard/results` endpoint returns confidence analysis without making block/allow decisions, useful for tuning policies. [^16] Lakera uses five confidence levels (L1–L5) aligned with OWASP WAF paranoia standards.

The platform also provides an **AI Application Firewall**, **Security Center** for central policy and threat monitoring, **Guardrails** for content and data controls, and **Logs** that feed into SIEMs such as Grafana and Splunk. [^13] Lakera holds SOC 2, EU GDPR, and NIST compliance postures. [^17]

### Strengths

**Prompt injection specialisation.** Lakera focuses on prompt injection detection and has published the Prompt Injection Test (PINT) benchmark for evaluating solutions. [^18] Their classifiers are trained on adversarial data from Gandalf, their widely used prompt injection game. [^19] Organisations such as Dropbox and Cohere use Lakera for production GenAI security. [^13]

**PII and DLP.** Lakera Guard enhances PII detection and data loss prevention with classifiers for credit card numbers (Luhn-validated), phone numbers, email addresses, IP addresses, and full names. [^20] This addresses OWASP LLM02 (Sensitive Information Disclosure) directly.

**API-first, minimal setup.** You add an HTTP call to your request path. No Colang, no Python server, no AWS-specific integration. Works with any LLM and any deployment model.

**Low latency.** Lakera targets sub-100ms latency for real-time protection. [^14] Suitable for chat and agent workflows where every millisecond counts.

**Threat intelligence.** Lakera maintains a continuously updated threat model informed by their red team and the Gandalf community. [^19] New exploits are incorporated into detection as they emerge.

### Weaknesses

**Third-party data processing.** All screened content is sent to Lakera's infrastructure. Organisations with strict data residency or in-house-only processing requirements may not be able to use the service. Check Lakera's data processing agreement and regional availability.

**Hosted dependency.** You depend on Lakera's availability and pricing. There is no self-hosted or open-source alternative from the same vendor.

**Less customisation than NeMo.** You configure policies through the Lakera platform, not through code. For complex conversational flows or domain-specific logic, NeMo Guardrails offers more flexibility.

**Pricing by API volume.** Costs scale with request volume. At very high throughput, operational spend may exceed the cost of self-hosted solutions.

---

## 5. Head-to-head comparison

| Capability | Bedrock Guardrails | NeMo Guardrails | Lakera Guard |
|------------|--------------------|-----------------|--------------|
| **Deployment** | AWS managed, Bedrock-only | Self-hosted, model-agnostic | Hosted API, model-agnostic |
| **Prompt injection** | Prompt Attack filter (content category) | Jailbreak detection flow(s) | Specialised classifier (PINT benchmark) |
| **Content moderation** | Hate, Insults, Sexual, Violence, Misconduct | Built-in and custom flows, ActiveFence integration | Content moderation via API |
| **PII detection** | Sensitive information filters (entities, regex) | Sensitive data masking on input/output | Credit cards, phones, emails, IPs, names |
| **Denied topics** | Configurable topic blocking | Custom dialog/topical rails | Policy-based via platform |
| **Hallucination / grounding** | Contextual grounding checks, Automated Reasoning | Self-check facts, hallucination flows | Not primary focus |
| **Custom logic** | Limited to filters + word lists | Full Colang programming | Policy customisation, no code |
| **RAG support** | Input tagging for selective evaluation | Retrieval rails on chunks | Reference documents in API |
| **Multi-LLM** | Bedrock models only | OpenAI, LLaMA, Falcon, etc. | Any (API in front) |
| **Latency** | Parallel policy evaluation | Depends on flow complexity | Sub-100ms target |
| **Data residency** | Within your AWS account | Your environment | Lakera infrastructure |
| **Cost model** | Per policy type, per token | Compute (no per-call fee) | Per API call |
| **Compliance** | AWS compliance programmes | Your responsibility | SOC 2, GDPR, NIST |

### Key differentiators

**Bedrock Guardrails** excels when you are fully on AWS Bedrock and want the broadest set of out-of-the-box filters with minimal operational work. Contextual grounding and Automated Reasoning are unique in this comparison.

**NeMo Guardrails** excels when you need programmatic control over dialog flows, run multiple LLM backends, or require everything to run in your own infrastructure. Colang and the five rail types (input, dialog, retrieval, execution, output) offer the most flexibility.

**Lakera Guard** excels when you prioritise prompt injection defence, need a fast path to production with minimal integration effort, and can accept third-party processing of your traffic. Its specialisation in prompt injection and PII, plus Gandalf-derived threat intelligence, differentiates it from general-purpose filters.

---

## 6. Integration patterns

Where each solution fits in typical application architectures.

### Bedrock Guardrails

**Pattern: Inline with Bedrock inference.** Add `guardrailIdentifier` and `guardrailVersion` to your `Converse` or `InvokeModel` call. The guardrail evaluates input before the model and output after. No additional services to deploy. [^4]

```python
response = bedrock_runtime.converse(
    modelId="anthropic.claude-3-sonnet-20240229-v1:0",
    messages=[{"role": "user", "content": user_input}],
    guardrailIdentifier="arn:aws:bedrock:us-east-1:123456789:guardrail/abc123",
    guardrailVersion="1"
)
```

**Pattern: Standalone evaluation.** Use `ApplyGuardrail` when you need to screen content without invoking a model. Useful for pre-validation, batch processing, or hybrid architectures where inference happens elsewhere. [^5]

**Fit:** Bedrock Agents, Bedrock Knowledge Bases, direct Bedrock model calls, and any application already on AWS Bedrock.

### NeMo Guardrails

**Pattern: Python middleware.** Replace direct LLM calls with `rails.generate()` or `rails.generate_async()`. The guardrails layer intercepts requests, applies rails, and forwards to the configured LLM.

```python
from nemoguardrails import LLMRails, RailsConfig

config = RailsConfig.from_path("./config")
rails = LLMRails(config)
response = rails.generate(messages=[{"role": "user", "content": user_input}])
```

**Pattern: Guardrails server.** Run `nemoguardrails server --config ./config --port 8000`. Your application sends requests to the guardrails server, which exposes a Chat Completions-compatible API. Useful for microservices and polyglot stacks. [^10]

**Pattern: LangChain wrapper.** Wrap a LangChain chain or `Runnable` with `NemoguardrailsRunnable`. Existing LangChain applications gain guardrails with minimal code changes. [^12]

**Fit:** Python applications, LangChain stacks, RAG pipelines, agentic workflows, and self-hosted or multi-provider LLM deployments.

### Lakera Guard

**Pattern: Pre-inference check.** Call the Lakera API before sending the user input to the LLM. If the response indicates a threat, block the request and return a safe message.

```python
import requests

lakera_response = requests.post(
    "https://api.lakera.ai/v2/guard",
    headers={"Authorization": f"Bearer {LAKERA_API_KEY}"},
    json={"inputs": [{"role": "user", "content": user_input}]}
)
result = lakera_response.json()
if result.get("results", [{}])[0].get("flagged"):
    return "I can't process that request."
# Proceed to LLM
```

**Pattern: Post-inference check.** Evaluate model output before returning it to the user. Catches harmful or PII-leaking responses the model produced despite safe input.

**Pattern: Kong, gateway, or proxy.** Lakera provides a Kong plugin for the AI Gateway. [^21] You can also place Lakera calls in an API gateway or reverse proxy that fronts your GenAI endpoints.

**Fit:** Any stack (Python, Node, Go, etc.), serverless or traditional, where you can add an HTTP call. Optimal when you want guardrails without operating your own guardrail infrastructure.

---

## 7. Decision matrix

| Use case | Recommended choice | Rationale |
|----------|-------------------|------------|
| **AWS Bedrock-only, need broad filters** | Bedrock Guardrails | Native integration, content filters, grounding, PII, denied topics. No extra infra. |
| **AWS Bedrock + strict RAG grounding** | Bedrock Guardrails | Contextual grounding and Automated Reasoning checks are unique. Use input tagging for selective evaluation. |
| **Multi-LLM or model-agnostic** | NeMo Guardrails or Lakera Guard | Bedrock is Bedrock-only. NeMo if you want self-hosted; Lakera if you prefer API. |
| **Self-hosted, no third-party data** | NeMo Guardrails | All processing in your environment. No data leaves your boundary. |
| **Fastest time to production** | Lakera Guard | Single API call. No Colang, no server, no AWS lock-in. |
| **Prompt injection as primary threat** | Lakera Guard or NeMo Guardrails | Lakera specialises here (PINT, Gandalf). NeMo has jailbreak flows. Bedrock's Prompt Attack filter is one of several categories. |
| **Complex dialog flows, SOPs** | NeMo Guardrails | Colang models dialog structure. Bedrock and Lakera are filter-based. |
| **LangChain in production** | NeMo Guardrails | Native `NemoguardrailsRunnable` integration. |
| **Regulated industry, data in-region** | Bedrock Guardrails (AWS) or NeMo Guardrails (self-hosted) | Both keep data in your control. Lakera processes on their infra. |
| **Startup, minimal ops** | Lakera Guard or Bedrock Guardrails | Lakera: no guardrail infra. Bedrock: if already on AWS, no extra services. |
| **SIEM integration, central monitoring** | Lakera Guard | Logs and Security Center feed Grafana, Splunk, etc. |
| **Budget-driven, high volume** | NeMo Guardrails | No per-call API fee. You pay for compute; at scale this can undercut API pricing. |

### Hybrid approaches

You can layer solutions. For example:

- **Bedrock Guardrails + Lakera Guard:** Use Bedrock for content filtering and grounding, plus Lakera for an additional prompt injection layer if you face sophisticated attackers.
- **NeMo Guardrails + Lakera:** Use NeMo for dialog and retrieval rails, and call Lakera's API from a NeMo custom action for prompt injection checks.
- **Lakera for input, Bedrock for output:** Screen user input with Lakera before it reaches Bedrock; rely on Bedrock Guardrails for output filtering and PII masking.

Evaluate the added latency and cost of layering. Defence in depth has value, but redundant checks can slow responses and increase spend.

---

## 8. Summary

Guardrails are a necessary control for production LLM applications. The OWASP Top 10 and prompt injection research make clear that system prompts and output validation alone are insufficient. You need a dedicated layer that filters inputs and outputs before harmful content reaches users or downstream systems.

**Bedrock Guardrails** is the default choice when you run on AWS Bedrock. It offers the widest built-in filter set, including contextual grounding and Automated Reasoning, with no infrastructure to operate. Use it when you want managed, declarative policies and can accept Bedrock lock-in.

**NeMo Guardrails** is the default choice when you need model-agnostic, self-hosted guardrails with full control over dialog and logic. Use it when you run multiple LLM backends, use LangChain, require everything in your own environment, or need programmable conversational flows. Expect higher setup and maintenance than a managed service.

**Lakera Guard** is the default choice when you want the fastest path to production, prioritise prompt injection and PII defence, and can send traffic to a third-party API. Use it when you want API-first integration, sub-100ms latency, and threat intelligence from a dedicated red team. Avoid it if data cannot leave your boundary.

### Three actions this week

1. **Inventory your guardrail gaps.** For each customer-facing or high-risk AI system, note whether you have input filtering, output filtering, PII detection, and prompt injection protection. [Article 1.10](/foundations/building-an-ai-security-programme/)'s control selection (guardrails, secrets scanning, output validation) provides a baseline. [^22]

2. **Map your stack to the decision matrix.** If you are on Bedrock, pilot Bedrock Guardrails on one flow. If you are multi-provider or self-hosted, try NeMo Guardrails in a dev environment or Lakera Guard with a free-tier API key.

3. **Test before you trust.** Run PyRIT or Garak against your guardrails. [^23] Measure false positive and false negative rates. Adjust filter strengths, Colang flows, or Lakera policies until the trade-off matches your risk appetite.

Guardrails reduce risk; they do not eliminate it. Combine them with least-privilege tool access, output schema validation, and adversarial testing. The defences in this comparison are complementary to the broader AI security programme described in [Article 1.10](/foundations/building-an-ai-security-programme/) and the OWASP guidance in [Article 1.02](/foundations/ai-threat-landscape/).

---

## Notes

[^1]: OWASP, "LLM01:2025 Prompt Injection", GenAI Security Project, 2025. https://genai.owasp.org/llmrisk/llm01-prompt-injection/

[^2]: OWASP, "Prompt Injection Prevention Cheatsheet", 2024. https://cheatsheetseries.owasp.org/cheatsheets/Prompt_Injection_Prevention_Cheat_Sheet.html

[^3]: AWS, "Detect and filter harmful content by using Amazon Bedrock Guardrails", Amazon Bedrock User Guide, 2024. https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html

[^4]: AWS, "How Amazon Bedrock Guardrails works", Amazon Bedrock User Guide, 2024. https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails-how.html

[^5]: AWS, "Apply tags to user input to filter content", Amazon Bedrock User Guide, 2024. https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails-tagging.html

[^6]: AWS, "Safeguard tiers for guardrails policies", Amazon Bedrock User Guide, 2024. https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails-tiers.html

[^7]: AWS, "Content filters (text)", Amazon Bedrock User Guide, 2024. https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails-content-filters.html

[^8]: AWS, "Cross-Region inference: Distribute guardrail traffic across Regions", Amazon Bedrock User Guide, 2024. https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails-cross-region.html

[^9]: NVIDIA, "NeMo Guardrails", GitHub, 2024. https://github.com/NVIDIA/NeMo-Guardrails

[^10]: NVIDIA, "NeMo Guardrails", docs.nvidia.com/nemo/guardrails, 2024. https://docs.nvidia.com/nemo/guardrails

[^11]: NVIDIA, "Guardrails Library", NeMo Guardrails User Guide, 2024. https://docs.nvidia.com/nemo/guardrails/user-guides/guardrails-library.html

[^12]: NVIDIA, "LangChain Integration", NeMo Guardrails User Guide, 2024. https://docs.nvidia.com/nemo/guardrails/user-guides/langchain/langchain-integration.html

[^13]: Lakera, "Lakera Guard: Real-Time Security for Your AI Agents", 2024. https://www.lakera.ai/lakera-guard

[^14]: Lakera, "Runtime security for your GenAI", product page, 2024. Sub-100ms latency. https://www.lakera.ai/lakera-guard

[^15]: Lakera, "Screen content for threats", Lakera API documentation, 2024. https://docs.lakera.ai/api-reference/lakera-api/guard/screen-content

[^16]: Lakera, "Guard Results API Endpoint", Lakera documentation, 2024. https://docs.lakera.ai/docs/api/results

[^17]: Lakera, "Runtime security for your GenAI", 2024. SOC 2, EU GDPR, NIST. https://www.lakera.ai/lakera-guard

[^18]: Lakera, "Lakera's Prompt Injection Test (PINT)", Lakera Blog, 2024. https://www.lakera.ai/blog/lakera-pint-benchmark

[^19]: Lakera, "Gandalf", 2024. https://gandalf.lakera.ai/

[^20]: Lakera, "Lakera Guard Enhances PII Detection and Data Loss Prevention", Lakera Blog, July 2024. https://www.lakera.ai/blog/lakera-guard-enhances-pii-detection-and-data-loss-prevention-for-enterprise-applications

[^21]: Kong, "AI Lakera Guard plugin", Kong Plugin Hub. https://docs.konghq.com/hub/kong-inc/ai-lakera-guard/

[^22]: AI Security in Practice, "Building an AI Security Programme", Article 1.10.

[^23]: Microsoft, "PyRIT", AI Red Team toolkit. [Article 2.01](/attack-and-red-team/pyrit-zero-to-red-team/) on this site.
