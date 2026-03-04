---
title: "The Autonomous Agent Dilemma: Do's and Don'ts for Devin, Kiro, and Self-Coding AI"
description: "A security control framework for Level 4 and Level 5 autonomous AI coding agents."
sidebar:
  order: 10
---

**Series:** AI Security Do's and Don'ts<br/>
**Author:** Paul Lawlor<br/>
**Date:** 20 February 2026<br/>
**Reading time:** 12 minutes<br/>
**Word count:** approximately 2,600 words

**Abstract:** Autonomous AI coding agents -- Amazon Kiro, Devin, and the GitHub Copilot Coding Agent -- can work independently for hours or days, creating pull requests, installing dependencies, and interacting with production systems. They are not faster developers. They are automated systems with privileged access. This essay provides a security control framework for Level 4 (agentic autonomous) and Level 5 (fully autonomous) tools, grounded in the UK AI Playbook, vendor security documentation, and Anthropic's Responsible Scaling Policy. It covers the five most common mistakes organisations make when deploying autonomous agents and the six defensive strategies required to govern them safely.

**Keywords:** autonomous agents, AI coding tools, Devin, Amazon Kiro, GitHub Copilot Coding Agent, UK AI Playbook, RBAC, session management, least privilege, DevSecOps

---

## Contents

1. [The Monday morning problem](#1-the-monday-morning-problem)
2. [The autonomous agent landscape](#2-the-autonomous-agent-landscape)
3. [The don'ts: five common mistakes](#3-the-donts-five-common-mistakes)
4. [The do's: six defensive strategies](#4-the-dos-six-defensive-strategies)
5. [The organisational challenge](#5-the-organisational-challenge)
6. [The path forward](#6-the-path-forward)
7. [Further reading](#further-reading)

---

## 1. The Monday morning problem

An engineering team gives Devin -- the fully autonomous AI software engineer built by Cognition Labs -- a GitHub token and a brief: 'modernise the authentication module.' Devin is SOC 2 Type 2 certified and ISO/IEC 27001:2022 compliant.[^1] It works autonomously for the entire weekend. By Monday morning, it has created 23 pull requests touching 187 files across four repositories. It replaced the authentication library with a newer version, refactored the session management layer, updated database migration scripts, and introduced eight new dependencies. Nobody reviewed any of it while Devin was working.

The Monday morning review reveals problems. One of the new dependencies has a known CVE. The session management refactoring removed a rate-limiting check. That check was not in the original spec, but it was a critical security control added two years ago after an incident. A database migration script would have dropped a column still used by a legacy service. The deployment pipeline nearly pushed the migration to production before anyone noticed.

None of these issues are Devin's fault in the traditional sense. Devin followed the spec. The spec said 'modernise the authentication module.' It did not say 'preserve the rate-limiting check in the session manager' or 'verify that all database columns are unused before dropping them.' Devin did exactly what it was asked to do. The problem is structural.

The team is not negligent. They gave Devin a reasonable task. They trusted a certified, enterprise-grade tool to work within its scope. But they gave an autonomous agent broad repository access, no time limits, no checkpoint reviews, and a spec that did not capture every security-critical constraint. The blast radius of an autonomous agent working unsupervised for 48 hours is fundamentally different from a developer using autocomplete.

### Why this matters

Autonomous AI coding agents -- Amazon Kiro, Devin, and the GitHub Copilot Coding Agent -- can work independently for hours or days.[^2][^3][^4] They create pull requests, install dependencies, modify infrastructure, and interact with CI/CD pipelines. This is not autocomplete. This is autonomous execution with privileged access.

The UK AI Playbook for Government (the Playbook) requires 'meaningful human control at the right stages.'[^5] For autonomous agents, the right stages are before execution begins, during execution at defined checkpoints, and after execution before any merge. The Playbook also requires that organisations understand 'how to securely close [AI systems] down.'[^6] For autonomous agents, that means kill switches, session limits, and emergency credential revocation.

Most organisations apply the same security policies to autonomous agents that they use for autocomplete tools. Essay C in this series -- *The Autonomy Ladder* -- establishes that L4 (agentic autonomous) and L5 (fully autonomous) tools need fundamentally different controls from lower-autonomy tools. This essay provides the detailed control framework for those levels: the common mistakes, the vendor-specific controls available, and the organisational governance required.

---

## 2. The autonomous agent landscape

### What autonomous agents can do

Three tools define the current autonomous agent landscape for software development.

**Amazon Kiro** operates at Level 4 (agentic autonomous). It is a spec-driven agentic IDE built on Amazon Bedrock.[^2] The developer writes a natural language spec. Kiro generates a plan and implements it autonomously using agent hooks and steering files. It uses a multi-model architecture with Claude Sonnet 4.5 as the default, with Opus 4.5 and Haiku 4.5 also available.[^7] Kiro's credit-based metering provides a built-in cost governance mechanism: paid plans include flexible overages at $0.04 per additional credit, and overage is disabled by default.[^7]

**Devin** operates at Level 5 (fully autonomous). Built by Cognition Labs, Devin is a fully autonomous AI software engineer. It works independently for hours or days, creating pull requests, installing dependencies, running tests, and interacting with CI/CD pipelines. It is SOC 2 Type 2 certified and ISO/IEC 27001:2022 compliant.[^1] Enterprise customers can deploy Devin within their own VPC on AWS or Azure, with dedicated SaaS private networking.[^1] Its custom RBAC system provides fine-grained permissions across two tiers: organisation-level and account-level roles.[^8]

**GitHub Copilot Coding Agent** operates at Level 3 to 4. It works autonomously on GitHub issues: creating branches, making changes, and opening pull requests for review.[^4] Enterprise documentation covers MCP server configuration, branch rulesets, and organisational policies for controlling how the coding agent interacts with repositories.[^4]

### What makes them different

Lower-autonomy tools -- autocomplete (L1) and chat (L2) -- suggest code. The developer decides what to accept. Supervised agentic tools (L3) propose actions. The developer approves each one.

Autonomous agents (L4 and L5) execute independently. The developer reviews output after the fact. This shift from per-action approval to post-hoc review changes the security model fundamentally. During its autonomous session, the agent has access to credentials, repositories, network resources, and MCP tools.[^9] A compromised or misconfigured agent can cause damage that accumulates over hours without human awareness. The OWASP Top 10 for LLM Applications identifies this pattern as LLM06: Excessive Agency -- where LLM-based systems are granted too much capability, functionality, or autonomy.[^10]

---

## 3. The don'ts: five common mistakes

### Don't 1: Grant autonomous agents unrestricted repository write access

The most common mistake is giving an autonomous agent a personal access token or service account with write access to every repository in the organisation. When Devin receives a GitHub token with org-wide write access, a refactoring task can expand beyond its intended scope. The agent modifies infrastructure-as-code repositories, Terraform modules, and CI/CD pipeline configurations that were never part of the original brief. It follows the spec -- but the spec did not define boundaries, and the token did not enforce them.

The consequence: the blast radius is the entire organisation's codebase. Any repository the token can reach, the agent can modify. The NCSC Zero Trust architecture principles require least privilege access -- verify explicitly, grant minimally.[^11] Devin's own RBAC system provides the correct approach: fine-grained permissions scoped to specific capabilities such as 'Use Devin Sessions' or 'Manage Secrets,' rather than blanket access.[^8] The Playbook's Principle 3 requires services to comply with Secure by Design principles.[^12]

### Don't 2: Provide full cloud credentials without scoped, time-limited permissions

Autonomous agents that deploy infrastructure need cloud credentials. Too often, they receive long-lived AWS access keys, Azure service principal credentials, or GCP service account keys with broad permissions. A Kiro agent given an AWS access key with AdministratorAccess can create resources outside the intended scope, accumulating costs and expanding the attack surface. The agent is not malicious. It is following the spec. But the spec says 'deploy the authentication service,' and AdministratorAccess permits far more than that.

A compromised or misconfigured agent with broad cloud credentials can create, modify, or delete cloud resources without limits. Kiro integrates with IAM Identity Center for enterprise credential management.[^2] AWS Bedrock security guidance explicitly recommends least privilege: 'Grant only the minimum permissions required.'[^13] Use temporary security credentials through AWS STS or Azure Managed Identity, scoped to the task and expired after the session.

### Don't 3: Run agents without timeout limits, resource quotas, and automatic termination

Autonomous sessions with no time limit, no cost cap, and no mechanism to stop them when something goes wrong are a governance failure. A Devin session left running over a weekend can create hundreds of files, install dozens of new dependencies, and consume significant compute resources before anyone reviews the output. A Kiro agent running an unexpectedly complex task accumulates credits beyond budget -- Kiro's credit metering tracks usage to the second decimal point, but only if the organisation monitors it.[^7]

The Playbook's Principle 5 requires understanding 'how to securely close [AI systems] down.'[^6] For autonomous agents, that means setting maximum session duration, defining cost thresholds, and having a kill switch that works. No agent should run indefinitely. No agent should have an unlimited budget.

### Don't 4: Skip human review gates for agent-generated pull requests

Agent-generated pull requests are not the same as human-authored pull requests. When Devin creates 23 PRs over a weekend, a developer who approves them all in 30 minutes on Monday morning is not providing meaningful review. Approval fatigue is a known risk: reviewers batch-approve agent output without reading the code in detail. The rate-limiting removal in the opening scenario passes unnoticed because the reviewer did not expect a security control to be embedded in the session management code.

The Playbook's Principle 4 requires 'meaningful human control at the right stages.'[^5] For autonomous agent output, meaningful control requires at minimum two reviewers, domain expertise for security-critical areas, and a review time threshold -- if a PR with 100 or more changed files is approved in under 10 minutes, it should be flagged for re-review. GitHub's own documentation on the Copilot Coding Agent recommends configuring branch rulesets to ensure that 'all pull requests raised by Copilot are approved by a second user with write permissions.'[^4]

### Don't 5: Ignore cost monitoring and budget alerts

Autonomous agents consume compute resources, API calls, and model inference credits. Without cost monitoring, an agent can burn through budgets before anyone notices. An autonomous agent that enters a retry loop -- making thousands of API calls to resolve a dependency conflict it cannot fix -- can exceed the monthly budget in a single day.

Kiro's credit-based metering provides built-in cost visibility: overage is disabled by default and must be explicitly enabled, providing a natural safeguard.[^7] But visibility is not governance. Organisations must set cost alerts and budget caps, track cost per session, and require human approval to exceed any limit. The Playbook's Principle 5 requires lifecycle management, including cost awareness and resource monitoring.[^6] Devin's session management capabilities provide the hooks for monitoring, but only if the organisation configures and enforces them.[^1]

---

## 4. The do's: six defensive strategies

### Do 1: Implement time-boxed agent sessions with automatic termination

Set a maximum session duration for every autonomous agent. Kiro's agent hooks provide a mechanism to enforce session boundaries and define checkpoints within autonomous workflows.[^2] Devin sessions should have configurable time limits aligned to task complexity: simple tasks get short windows; complex tasks get longer windows with mandatory human checkpoints. When the limit is reached, the agent stops and awaits human review. No agent should run indefinitely.

Set different time limits based on task type. A documentation update might warrant two hours. A refactoring task across multiple repositories might warrant eight hours -- but with a mandatory checkpoint at four. Require manual re-authorisation to extend beyond initial limits. This satisfies the Playbook's Principle 5, which requires organisations to know 'how to securely close [AI systems] down.'[^6]

### Do 2: Use IAM roles with least privilege and time-limited credentials

Never give autonomous agents long-lived credentials with broad permissions. Use IAM roles with policies scoped to the specific task. Use temporary security credentials -- AWS STS, Azure Managed Identity -- that expire after the session ends. Scope repository access to only the repositories needed for the task. If an agent needs to modify three repositories, it should have write access to exactly three repositories.

Kiro integrates with IAM Identity Center for enterprise credential management, providing a natural boundary for credential scoping.[^2] Devin's custom RBAC supports fine-grained permissions: 'Use Devin Sessions,' 'Manage Settings,' 'Manage Secrets,' and 'Manage MCP Servers' are separate, assignable capabilities.[^8] Rotate credentials after every session, not just periodically. This satisfies the Playbook's Principle 3 (Secure by Design)[^12] and aligns with NCSC Zero Trust principles of verify explicitly and least privilege access.[^11]

### Do 3: Require multi-party approval for agent-generated changes

Agent-generated pull requests require stricter review than human-authored code. Require at least two reviewers for all agent-generated PRs. Require domain expertise for security-critical areas: authentication, authorisation, payment processing, and infrastructure-as-code. Set a minimum review time threshold. If a PR with 100 or more changed files is approved in under 10 minutes, flag it for re-review.

GitHub's enterprise documentation for the Copilot Coding Agent recommends configuring branch rulesets to require that a second user with write permissions approves all Copilot-raised pull requests.[^4] This satisfies the Playbook's Principle 4: 'meaningful human control at the right stages.'[^5]

### Do 4: Configure cost alerts and per-agent budget limits

Set cost alerts and budget caps for every autonomous agent. Kiro's credit-based metering provides built-in cost governance: credits are metered to the second decimal point, overage is disabled by default, and usage dashboards update at least every five minutes.[^7] For Devin, monitor session costs and set alerts through your enterprise billing integration. For all agents, set a maximum budget per task, per day, and per month. Require human approval to exceed any limit. Track cost per PR to identify sessions that consumed disproportionate resources. This satisfies the Playbook's Principle 5: lifecycle management with cost awareness.[^6]

### Do 5: Maintain detailed audit logs of all agent actions

Log every action an autonomous agent takes: every file created, modified, or deleted; every dependency introduced; every command executed; every API call made; every MCP tool invoked. Include the agent's reasoning trace where available. Devin provides session-level audit trails.[^1] Kiro provides spec-to-implementation traceability through its spec-driven development model.[^2] Cursor's enterprise compliance features offer real-time analytics updated every two minutes, with AI usage tracking per commit.[^14]

Store logs in a tamper-evident system. Set alerts for security-critical events: infrastructure files modified, new network connections established, dependencies with known CVEs introduced, and authentication or authorisation code changed. This satisfies the Playbook's Principle 5 (monitoring)[^6] and aligns with NCSC guidance on logging and monitoring.[^15]

### Do 6: Establish rollback procedures and test them before agents go live

Before any autonomous agent is deployed, define and test rollback procedures. If an agent creates problematic changes, you must be able to revert all agent-generated commits, remove all agent-introduced dependencies, restore any modified configuration, and rotate all credentials the agent had access to. Test these procedures in a staging environment. Do not deploy autonomous agents in production until you have verified you can undo their work.

The Playbook's Principle 5 requires lifecycle management -- including the ability to close down AI systems.[^6] For autonomous agents, closing down means undoing the agent's work completely and ensuring no residual changes persist. Rollback is not optional. It is a prerequisite for deployment.

---

## 5. The organisational challenge

### The trust calibration problem

Developers tend to trust autonomous agents the same way they trust fellow developers. They read agent-generated code with the same -- often insufficient -- scrutiny they give human-authored code. But autonomous agents make different kinds of mistakes. They follow specs literally without understanding implicit constraints. They introduce dependencies without evaluating their security posture. They can make the same systematic error across dozens of files in a single session, creating a blast radius that no human developer would produce.

Review practices must be calibrated to agent-specific failure modes, not human developer norms. A human developer who removes a rate-limiting check would likely remember adding it. An autonomous agent has no institutional memory. It only has the spec.

### The governance gap

Most organisations have no governance framework specific to autonomous agents. Existing AI coding tool policies were written for autocomplete and chat. They do not address session time limits, credential scoping, cost monitoring, multi-party review requirements, escalation triggers, or rollback procedures.

The Playbook expects AI governance boards and documented review processes. Principle 10 requires the 'right assurance in place,' with 'clearly documented review and escalation processes' and 'an AI review board or programme-level board.'[^16] For autonomous agents, governance must address the unique risks of unsupervised execution with privileged access. A policy that covers autocomplete but not autonomous agents is incomplete. Google's Secure AI Framework (SAIF 2.0) recognises this gap, addressing agent security with progressive security layers matched to the autonomy level of the system.[^17]

### The incident response gap

Most organisations have no procedure for responding to an autonomous agent incident. When an agent introduces a vulnerability, installs a compromised dependency, or modifies security-critical code, the response team faces questions that existing runbooks do not answer. How do you identify all affected repositories? How do you revert all changes across 23 pull requests spanning four repositories? How do you rotate all credentials the agent accessed? How do you determine the blast radius of 48 hours of unsupervised execution?

Define agent-specific incident response procedures before the first agent goes live. The Playbook's Principle 5 requires lifecycle management, including the ability to securely close systems down.[^6] For autonomous agents, incident response is a core lifecycle capability, not an afterthought.

---

## 6. The path forward

### Why autonomous agents are different from every other AI coding tool

Autocomplete suggests a line. Chat generates a block. Agents execute a plan. The shift from suggestion to execution is the critical security boundary. Once an agent is executing, it has access to credentials, repositories, APIs, and infrastructure. The damage potential scales with two variables: the duration of unsupervised execution and the breadth of access granted.

Anthropic's Responsible Scaling Policy provides the conceptual model. ASL-2, ASL-3, and ASL-4 represent progressively stricter security requirements as model capability increases.[^18] The same principle applies to AI coding tool autonomy: as the tool's autonomy level increases, the security controls must increase proportionally. ASL levels for models; autonomy levels for tools. The underlying logic is identical. You do not give an ASL-3 model ASL-2 controls. You should not give an L5 autonomous agent L2 autocomplete policies.

### Three actions to take this week

**1. Scope agent credentials.** For every autonomous agent deployed or under evaluation, review the credentials it receives. Reduce to the minimum: specific repositories, read-only where possible, time-limited tokens, task-scoped IAM roles. If you cannot list what an agent has access to, that is your first problem. Devin's RBAC system provides a model for this: separate permissions for sessions, settings, secrets, and MCP servers.[^8]

**2. Set session limits.** Define maximum session duration and cost limits for every autonomous agent. No agent should run indefinitely. No agent should have an unlimited budget. Kiro's credit-based metering provides built-in safeguards -- overage is disabled by default.[^7] Test the kill switch before the agent goes live. If you cannot stop an agent mid-session, do not deploy it.

**3. Define review requirements.** Agent-generated pull requests must require multi-party review. Define escalation triggers: security-critical files, authentication logic, infrastructure changes, new dependencies. Use branch rulesets to enforce these requirements automatically.[^4] Do not rely on developer discipline when 23 PRs land on Monday morning.

### Looking ahead

The autonomous agent market is expanding rapidly. Every major AI coding tool vendor is adding agentic capabilities. Amazon Kiro brings spec-driven autonomous development to the AWS ecosystem.[^2] Devin operates as a fully autonomous software engineer with enterprise-grade security certifications.[^1] GitHub Copilot Coding Agent extends the world's largest code platform with autonomous task execution.[^4] The tools will become more capable, not less.

Organisations that build agent-specific governance now will be prepared. Those that extend autocomplete policies to autonomous agents will face the scenario described in this essay's opening. The Playbook requires meaningful human control (Principle 4) and lifecycle management (Principle 5).[^5][^6] Both require agent-specific implementations that go far beyond what autocomplete and chat require. Other essays in this series address the adjacent risks: *The Prompt Injection Trap* (Essay E), where autonomous agents face the highest injection risk because a single injected instruction can redirect hours of autonomous work; and *The MCP Trap* (Essay B), where MCP supply chain risks are amplified at L4 and L5 because the agent invokes tools without per-action human approval.

### Call to action

Autonomous agents are not faster developers. They are automated systems with privileged access to your codebase, your credentials, and your production infrastructure. Apply the same controls you would apply to any privileged automated process: least privilege, time limits, audit logging, multi-party review, and kill switches. The governance frameworks exist. The vendor controls are available. The Playbook provides the policy anchor. What remains is implementation.

---

## Further reading

1. UK AI Playbook for Government (2025) -- Principle 4 (human control), Principle 5 (lifecycle management)
2. Amazon Kiro Security Documentation -- agent hooks, steering files, credit metering
3. Devin Enterprise Security -- SOC 2 Type 2, ISO 27001, RBAC, VPC deployment
4. Devin Custom Roles and RBAC -- fine-grained permission model
5. GitHub Copilot Coding Agent in Organisations -- enterprise controls for autonomous coding
6. Anthropic Responsible Scaling Policy -- ASL tiered security model
7. Google Secure AI Framework (SAIF 2.0) -- agent security, progressive security layers
8. NCSC Guidelines for Secure AI System Development -- human oversight, secure deployment
9. Other essays in this series: *The Autonomy Ladder* (Essay C), *The MCP Trap* (Essay B), *The Prompt Injection Trap* (Essay E)

---

[^1]: Cognition Labs, 'Enterprise Security,' Devin Documentation. SOC 2 Type 2 certified since September 2024. ISO/IEC 27001:2022 certified. VPC deployment available on AWS and Azure. Available at: https://docs.devin.ai/enterprise/security/enterprise-security

[^2]: Amazon, 'Amazon Kiro FAQ,' Kiro Documentation. Spec-driven agentic IDE built on Amazon Bedrock. Agent hooks, steering files, and autonomous spec-to-code execution. Available at: https://kiro.dev/faq/

[^3]: Cognition Labs, 'Trust Center,' Devin Documentation. Pentest reports, SOC 2 report, ISO/IEC 27001:2022 certification, and security documentation available under NDA. Available at: https://docs.devin.ai/enterprise/Trust-Center

[^4]: GitHub, 'Piloting GitHub Copilot coding agent in your organization,' GitHub Enterprise Cloud Documentation. Coding agent capabilities, branch rulesets, MCP server configuration, and enterprise rollout guidance. Available at: https://docs.github.com/en/enterprise-cloud@latest/copilot/rolling-out-github-copilot-at-scale/enabling-developers/using-copilot-coding-agent-in-org

[^5]: UK Government, 'Artificial Intelligence Playbook for the UK Government,' GOV.UK, 10 February 2025. Principle 4: 'You have meaningful human control at the right stages.' Available at: https://www.gov.uk/government/publications/ai-playbook-for-the-uk-government/artificial-intelligence-playbook-for-the-uk-government-html

[^6]: UK Government, 'Artificial Intelligence Playbook for the UK Government,' GOV.UK, 10 February 2025. Principle 5: 'You understand how to manage the full AI life cycle,' including knowing 'how to securely close it down.' Available at: https://www.gov.uk/government/publications/ai-playbook-for-the-uk-government/artificial-intelligence-playbook-for-the-uk-government-html

[^7]: Amazon, 'Amazon Kiro FAQ -- Pricing and Plans,' Kiro Documentation. Credit-based metering with overage controls. Credits metered to the second decimal point. Overage disabled by default; $0.04 per additional credit on paid plans. Usage dashboard updated at least every 5 minutes. Available at: https://kiro.dev/faq/

[^8]: Cognition Labs, 'Custom Roles and RBAC,' Devin Documentation. Two-tier role system: organisation-level permissions (Use Devin Sessions, Manage Settings, Manage Secrets, Manage MCP Servers, and more) and account-level permissions. SSO integration with Okta and Azure AD. IdP group-based role assignment. Available at: https://docs.devin.ai/enterprise/security-access/custom-roles

[^9]: GitHub, 'Integrating agentic AI into your enterprise's software development lifecycle,' GitHub Enterprise Cloud Documentation. Agent mode workflow and MCP integration for autonomous coding. Available at: https://docs.github.com/en/enterprise-cloud@latest/copilot/tutorials/rolling-out-github-copilot-at-scale/enabling-developers/integrating-agentic-ai

[^10]: OWASP, 'OWASP Top 10 for Large Language Model Applications (2025),' OWASP GenAI Security Project. LLM06: Excessive Agency -- systems granted too much capability, functionality, or autonomy. Available at: https://genai.owasp.org/llm-top-10/

[^11]: NCSC, 'Zero Trust Architecture Design Principles,' National Cyber Security Centre. Verify explicitly, least privilege access, assume breach. Applied to agent credential scoping. Available at: https://www.ncsc.gov.uk/collection/zero-trust-architecture

[^12]: UK Government, 'Artificial Intelligence Playbook for the UK Government,' GOV.UK, 10 February 2025. Principle 3: 'You know how to use AI securely.' Services must comply with Secure by Design principles. Available at: https://www.gov.uk/government/publications/ai-playbook-for-the-uk-government/artificial-intelligence-playbook-for-the-uk-government-html

[^13]: Amazon Web Services, 'Security in Amazon Bedrock,' AWS Documentation. Security best practices including least privilege (GENSEC01) and event monitoring (GENSEC03). Available at: https://docs.aws.amazon.com/bedrock/latest/userguide/security.html

[^14]: Cursor, 'Enterprise Compliance and Monitoring,' Cursor Documentation. Real-time analytics updated every 2 minutes, AI usage tracking, AI lines of code per commit. Available at: https://cursor.com/docs/enterprise/compliance-and-monitoring

[^15]: NCSC, CISA, and international partners, 'Guidelines for Secure AI System Development,' National Cyber Security Centre, 27 November 2023. Human oversight, secure deployment, least privilege, and logging and monitoring for AI systems. Available at: https://www.ncsc.gov.uk/files/Guidelines-for-secure-AI-system-development.pdf

[^16]: UK Government, 'Artificial Intelligence Playbook for the UK Government,' GOV.UK, 10 February 2025. Principle 10: 'You use these principles alongside your organisation's policies and have the right assurance in place.' Requires clearly documented review and escalation processes and an AI review board. Available at: https://www.gov.uk/government/publications/ai-playbook-for-the-uk-government/artificial-intelligence-playbook-for-the-uk-government-html

[^17]: Google, 'Secure AI Framework (SAIF 2.0): Delivering Trusted and Secure AI,' Google Cloud Security. Agent security, progressive security layers, and 15 AI security risks. Available at: https://services.google.com/fh/files/misc/google_cloud_delivering_trusted_and_secure_ai.pdf

[^18]: Anthropic, 'Responsible Scaling Policy,' Version 1.0, September 2023. AI Safety Levels (ASL-2, ASL-3, ASL-4) as a tiered framework for progressively stricter security requirements as model capability increases. Available at: https://www.anthropic.com/news/anthropics-responsible-scaling-policy
