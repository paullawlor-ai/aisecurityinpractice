---
title: "The Enterprise IDE Security Checklist: Cursor, Windsurf, Devin, and Beyond"
description: "A compliance-driven procurement framework for evaluating AI coding tools across five enterprise security dimensions."
sidebar:
  order: 5
---

**Series:** AI Security in Practice<br/>
**Pillar:** 1: Foundations<br/>
**Difficulty:** Intermediate<br/>
**Author:** Paul Lawlor<br/>
**Date:** 21 February 2026<br/>
**Reading time:** 13 minutes

> A compliance-driven procurement framework for evaluating AI coding tools across five enterprise security dimensions: certifications, identity, data handling, deployment models, and audit logging.

---

## Table of Contents

1. [The procurement decision nobody prepared for](#the-procurement-decision-nobody-prepared-for)
2. [The enterprise evaluation landscape](#the-enterprise-evaluation-landscape)
3. [The don'ts: five procurement and deployment mistakes](#the-donts-five-procurement-and-deployment-mistakes)
4. [The do's: six strategies for enterprise AI IDE procurement](#the-dos-six-strategies-for-enterprise-ai-ide-procurement)
5. [The organisational challenge](#the-organisational-challenge)
6. [The path forward](#the-path-forward)
7. [Further reading](#further-reading)
8. [Notes](#notes)

---

## The procurement decision nobody prepared for

A CISO at a mid-size financial services company receives three requests in the same month. The platform team wants Cursor for its agentic coding features. The infrastructure team wants Amazon Q Developer because it integrates with their AWS estate. The product engineering team wants Windsurf because a senior developer used it at a previous company and rates its Cascade agent highly. A fourth request arrives two weeks later: the innovation lab wants Devin for autonomous prototyping.

Each request includes the vendor's security page, a brief feature summary, and a note that 'other companies in our sector are already using it.' None includes a compliance matrix. None compares the tools against each other on security dimensions. None addresses data residency, audit logging, or identity integration. The CISO has no framework for evaluating these requests consistently, and the procurement team has never assessed an AI coding tool before.

The CISO approves Cursor with a privacy mode requirement, defers the others pending 'further review,' and asks the security team to build an evaluation framework. Six weeks pass. By the time the framework exists, three teams have already installed tools on corporate machines using personal accounts, outside any enterprise agreement. Shadow AI is already in the codebase.

### Why this matters now

The AI coding tool market has matured rapidly. In early 2025, most enterprise conversations centred on GitHub Copilot. By early 2026, procurement teams face a genuinely competitive market with meaningful security differentiation between vendors.

**Cursor** achieved SOC 2 Type II certification in January 2026, offers a privacy mode with parallel infrastructure that guarantees code data is never stored by model providers, and provides enterprise features including team-enforced privacy mode and SSO.[^1] **Windsurf** holds FedRAMP High accreditation through Palantir's FedStart programme, SOC 2 Type II certification, HIPAA compliance, and offers Cloud, Hybrid, and Self-hosted deployment options with data residency in the US, EU (Frankfurt), and FedRAMP GovCloud environments.[^2] **Devin** has SOC 2 Type II and ISO/IEC 27001:2022 certifications, VPC deployment on AWS and Azure, and a two-tier RBAC system with fine-grained permissions.[^3][^4] **Amazon Q Developer** inherits the AWS shared responsibility model with IAM integration, CloudTrail audit logging, VPC endpoints via AWS PrivateLink, and customer-managed encryption keys.[^5] **GitHub Copilot** Enterprise provides organisation-level policy controls, public code matching detection, and integration with GitHub's existing enterprise identity and compliance infrastructure.[^6]

These are not equivalent offerings. They differ on compliance certifications, deployment models, data handling, identity integration, and audit capabilities. Selecting the wrong tool for a regulated environment, or the right tool with the wrong configuration, creates compliance gaps that may not surface until an audit or incident.

This essay provides the enterprise security checklist that procurement teams, CISOs, and security architects need. It builds on the autonomy framework established in [The Autonomy Ladder](/foundations/autonomy-ladder/) (Essay C in this series) by adding the compliance and procurement dimensions that determine whether a tool can be deployed at all, regardless of its autonomy level.

---

## The enterprise evaluation landscape

Enterprise AI coding tool procurement differs from traditional developer tooling in three ways that most evaluation frameworks miss.

**First, data flows are continuous and context-rich.** Every AI coding tool sends code context to remote servers for inference. Cursor sends requests to AWS infrastructure and then to model providers including OpenAI, Anthropic, and Google, with additional providers for custom models.[^1] Windsurf routes requests through GCP infrastructure to model providers or its own inference clusters.[^2] Amazon Q Developer processes requests within the AWS ecosystem.[^5] Unlike traditional IDEs that process code locally, these tools create a persistent outbound data channel carrying source code, file paths, project structure, and conversation history. The security evaluation must address where that data goes, who can access it, and how long it persists.

**Second, compliance certifications vary significantly.** SOC 2 Type II confirms that internal controls operated effectively over a sustained period. FedRAMP High confirms compliance with 421 security controls required for high-impact government systems. ISO/IEC 27001:2022 confirms an information security management system is in place. These are not interchangeable. A SOC 2 report satisfies most commercial enterprise requirements but does not meet US federal government standards. FedRAMP High, which Windsurf holds, is required for federal agencies.[^2] ISO 27001, which Devin holds alongside SOC 2, is often required for international regulated industries.[^3] The procurement team must match the certification to the regulatory requirement, not assume all certifications are equivalent.

**Third, deployment models determine the data boundary.** Windsurf offers three deployment models (Cloud, Hybrid with a customer-managed data plane, and fully Self-hosted) with multiple underlying infrastructure options including Standard US, EU (Frankfurt), and FedRAMP High on AWS GovCloud.[^2] Devin offers dedicated SaaS with private networking and full VPC deployment on AWS and Azure.[^3] Amazon Q Developer uses AWS PrivateLink for VPC connectivity.[^5] Cursor's infrastructure is primarily on AWS with no self-hosted option currently available, though privacy mode ensures code is not stored.[^1] GitHub Copilot Enterprise operates through GitHub's cloud infrastructure with proxy and firewall configuration options.[^6] The deployment model determines whether code data ever leaves the organisation's network boundary, which is a hard requirement for some regulated environments.

Understanding these three dimensions (data flow, compliance certification, and deployment model) is the prerequisite for every evaluation decision that follows.

---

## The don'ts: five procurement and deployment mistakes

### Don't 1: Select AI IDEs based solely on developer preference without security review

Developer enthusiasm is a useful signal. It is not a security assessment. When tool selection is driven by individual preference, the organisation ends up with multiple AI coding tools, each with different data handling policies, different compliance postures, and different identity integration requirements. The shadow AI scenario described in the opening is not hypothetical; it is the default outcome when procurement does not keep pace with developer demand.

The UK AI Playbook requires organisations to 'use the right tool for the job' (Principle 6), which means matching the tool to both the task and the security requirements.[^7] A developer's preference for Cursor's agent mode does not override the organisation's need for FedRAMP compliance, and a preference for Windsurf's Cascade does not override a data residency requirement that the vendor cannot meet. Establish a formal evaluation process before the first tool is approved, not after three are already in use.

### Don't 2: Skip compliance certification verification

Vendor security pages list certifications. Procurement teams sometimes treat these as sufficient evidence. They are not. A SOC 2 Type II report must be requested from the vendor's trust centre and reviewed by someone qualified to assess it. Cursor's report is available at trust.cursor.com.[^1] Windsurf's is available at trust.windsurf.com.[^2] Devin's trust centre is at trust.cognition.ai.[^3] Amazon Q Developer's compliance is documented through AWS Artifact.[^5]

The critical question is not whether a certification exists, but whether it covers the specific service being procured. A vendor may hold SOC 2 for its cloud tier but not for a newer feature. Windsurf's FedRAMP High accreditation, for example, applies to its FedRAMP deployment environment through Palantir's FedStart programme, not to all deployment tiers equally.[^2] Read the scope section of the report. Confirm it covers the product and tier you intend to deploy.

### Don't 3: Deploy without SSO and SCIM integration configured

AI coding tools that allow individual account creation outside the organisation's identity provider create unmanaged access points. Developers sign up with personal email addresses. When they leave the organisation, their access persists. When a security incident occurs, the security team cannot revoke access centrally.

All major enterprise AI coding tools support SSO. Cursor supports SAML via its admin portal.[^1] Windsurf supports SAML with Okta, Azure AD, and Google, plus SCIM for automated user provisioning and de-provisioning.[^8] Devin supports Okta and Azure AD SSO with IdP group-based role assignment.[^4] Amazon Q Developer uses AWS IAM Identity Center.[^5] GitHub Copilot uses GitHub's enterprise SAML SSO.[^6] Deploy with SSO and MFA enforced from day one. If the tool does not support your identity provider, it is not ready for enterprise deployment.

### Don't 4: Ignore data residency requirements for sensitive projects

AI coding tools process code on remote infrastructure. Where that infrastructure is located matters for data sovereignty, regulatory compliance, and contractual obligations. Cursor's primary servers are in the US, with some latency-critical services in Europe and Singapore.[^1] Windsurf offers US, EU (Frankfurt), and FedRAMP GovCloud data residency options for enterprise customers.[^2] Devin offers VPC deployment on AWS and Azure, allowing customers to control data location.[^3] Amazon Q Developer operates within the customer's chosen AWS Region with PrivateLink connectivity.[^5]

For organisations subject to GDPR, UK data protection requirements, or sector-specific regulations, the question is not whether the vendor mentions data protection on their website, but whether you can contractually guarantee where your code is processed and stored. If you require EU data residency and the vendor's inference infrastructure is in the US with no European option, the tool fails the evaluation regardless of its features.

### Don't 5: Forget to assess the security posture of IDE plugins and extensions

AI coding tools built on VS Code (Cursor, Windsurf) or distributed as IDE plugins (JetBrains AI Assistant, Windsurf JetBrains plugin) inherit the security properties of their host platform, including its extension ecosystem. Cursor has Workspace Trust disabled by default and does not currently verify extension code signatures, meaning the `extensions.verifySignature` setting defaults to `false`.[^1] Windsurf's editor is also a VS Code fork that merges upstream security patches regularly.[^2]

Extensions installed alongside the AI coding tool share the same process and permissions. A malicious or compromised extension can access the same code data that the AI tool processes. The enterprise evaluation must cover not only the AI tool itself but the extension governance model: which extensions are approved, how they are distributed, and whether signature verification is enforced.

---

## The do's: six strategies for enterprise AI IDE procurement

### Do 1: Create an IDE selection matrix based on compliance requirements

Before evaluating features, map your compliance requirements to vendor capabilities. The following comparison table captures the key enterprise security dimensions as of February 2026.

| Capability | GitHub Copilot Enterprise | Cursor Business/Enterprise | Windsurf Enterprise | Devin Enterprise | Amazon Q Developer Pro |
|---|---|---|---|---|---|
| **Compliance** | SOC 2[^6] | SOC 2 Type II[^1] | FedRAMP High, SOC 2 Type II, HIPAA[^2] | SOC 2 Type II, ISO 27001[^3] | AWS compliance programmes[^5] |
| **SSO** | GitHub SAML SSO[^6] | SAML via admin portal[^1] | SAML (Okta, Azure AD, Google, generic)[^8] | Okta, Azure AD, IdP groups[^4] | AWS IAM Identity Center[^5] |
| **SCIM provisioning** | Via GitHub Enterprise[^6] | Not documented | Okta, Azure AD, Google, SCIM API[^8] | IdP group integration[^4] | IAM Identity Center sync[^5] |
| **Data retention** | Configurable at org level[^6] | Zero retention (privacy mode)[^1] | Zero retention (teams/enterprise default)[^2] | Duration of customer relationship[^3] | Configurable, opt-out available[^5] |
| **Training on customer code** | Opt-out available[^6] | Never in privacy mode[^1] | Never for zero-retention users[^2] | Not by default[^3] | Opt-out available[^5] |
| **VPC / private deployment** | Proxy/firewall config[^6] | No self-hosted option[^1] | Hybrid, Self-hosted, FedRAMP tiers[^2] | VPC on AWS and Azure[^3] | AWS PrivateLink[^5] |
| **RBAC** | Org and enterprise policies[^6] | Team-level admin controls[^1] | Admin portal, RBAC, team scoping[^8] | Two-tier RBAC: org-level and account-level, custom roles[^4] | IAM policies, identity-based controls[^5] |
| **Audit logging** | Copilot metrics API[^6] | Enterprise analytics[^9] | Attribution logs, audit logs (Hybrid/Self-hosted)[^2] | Session-level audit trails[^3] | AWS CloudTrail[^5] |
| **Data residency options** | US (GitHub infrastructure)[^6] | US primary, some EU/Singapore[^1] | US, EU (Frankfurt), FedRAMP GovCloud[^2] | Customer-controlled (VPC)[^3] | Customer-chosen AWS Region[^5] |

This table is a starting point, not a decision. Each row represents an evaluation dimension that should be scored against your organisation's specific requirements. A financial services firm in the EU will weigh data residency and GDPR compliance heavily. A US federal agency will require FedRAMP. A startup may prioritise zero data retention and speed of deployment. The matrix makes the trade-offs visible.

### Do 2: Verify certifications through vendor trust portals

Request the actual SOC 2 report, not a summary. Review the scope, the control objectives, and any exceptions noted. Cursor's trust portal is at trust.cursor.com.[^1] Windsurf's is at trust.windsurf.com.[^2] Devin's is at trust.cognition.ai.[^3] For Amazon Q Developer, use AWS Artifact to access compliance reports.[^5]

Check the report date. SOC 2 Type II reports cover a specific observation period. If the report is more than 12 months old, ask for the current one. Check whether the report covers the specific product tier you plan to deploy. Ask the vendor whether any material changes have occurred since the report was issued. FedRAMP authorisation status can be verified through the FedRAMP Marketplace. Windsurf's FedRAMP High accreditation is achieved through Palantir's FedStart programme using AWS GovCloud.[^2]

### Do 3: Implement mandatory SSO with MFA for all AI IDE access

Configure SSO integration before distributing the tool. Enforce MFA through your identity provider. Disable the ability to create local accounts that bypass SSO. For Windsurf, configure SAML SSO and enable SCIM provisioning to automate user lifecycle management, ensuring that when a developer's IdP account is disabled, their Windsurf access is revoked automatically.[^8] For Devin, configure SSO with IdP group integration so that role assignments follow group membership.[^4] For Amazon Q Developer, use IAM Identity Center with permission sets scoped to the minimum required access.[^5]

Test the de-provisioning flow before the first user is onboarded. Disable an account in the IdP and verify that access to the AI coding tool is revoked within the expected timeframe. Understand the revocation latency for each tool and factor it into your incident response procedures. Note that enforcement timing varies: Cursor enforces team-level privacy mode within 5 minutes of a user joining a team, with server-side checks as a fallback if the client ping fails.[^1] De-provisioning latency through SSO and SCIM is a separate dimension that must be tested for each tool independently.

### Do 4: Configure data handling controls appropriate to your classification

For each tool, configure the strictest data handling mode that the tool supports. Enable privacy mode in Cursor, which runs parallel infrastructure where all log functions are no-ops by default and code data is never stored by model providers.[^1] Enable zero data retention in Windsurf, which is on by default for teams and enterprise plans and guarantees that code data is not persisted at Windsurf's servers or by subprocessors.[^2] For Devin VPC deployments, all customer data remains within the customer's tenant.[^3]

Configure `.cursorignore` files (Cursor) or `.codeiumignore` files (Windsurf) to exclude sensitive directories from codebase indexing.[^1][^2] This prevents classified code, secrets files, and infrastructure-as-code from being included in AI context. Review the list of subprocessors for each tool: Cursor routes requests through multiple inference providers including Fireworks, Baseten, Together, OpenAI, Anthropic, and Google.[^1] Windsurf uses GCP, Crusoe, Modal, Oracle Cloud, and multiple model providers.[^2] Understand which third parties will see your code data, even transiently.

### Do 5: Maintain an approved IDE list with version pinning and review cycles

Create and publish an approved AI coding tool list. Specify the approved version, the approved tier (individual, team, enterprise), the approved configuration (privacy mode on, specific features disabled), and the review date. New major features with data privacy implications in Windsurf are released in the 'off' state by default for enterprise customers, giving administrators control over enablement.[^8] Cursor sends requests to specific domains (`api2.cursor.sh`, `api3.cursor.sh`, `api5.cursor.sh`, `repo42.cursor.sh`) that should be whitelisted at the firewall level.[^1]

Review the approved list quarterly. Tools add features rapidly. MCP server support, web search integration, app deployment capabilities, and new model providers all change the security surface. Windsurf's admin portal provides granular feature toggles for MCP servers, auto-run terminal commands, app deploys, conversation sharing, and knowledge base management.[^8] Review each toggle against your security policy at every review cycle.

### Do 6: Conduct annual security reviews of all approved AI coding tools

An annual review is the minimum cadence. Trigger ad-hoc reviews when a vendor announces significant changes: new deployment tiers, new model providers, new data handling policies, or new agentic capabilities. Both Cursor and Windsurf commit to at-least-annual penetration testing by reputable third parties.[^1][^2]

The review should include: re-verification of compliance certifications, review of any new subprocessors, testing of SSO and de-provisioning flows, verification that data handling configurations remain in effect, assessment of new features against the organisation's security policy, and a check against the autonomy ladder classification (as described in [The Autonomy Ladder](/foundations/autonomy-ladder/), Essay C in this series). If a tool has moved from L2 to L3 since the last review, the security controls must be reassessed accordingly.

---

## The organisational challenge

### The speed-versus-governance tension

Developers adopt AI coding tools faster than procurement can evaluate them. The gap between developer demand and enterprise readiness is where shadow AI thrives. A developer who installs Cursor on a personal account to 'try it out' has already sent proprietary code to external infrastructure before the security team knows the tool exists.

The solution is not to slow adoption to zero; it is to provide a fast-track evaluation path for AI coding tools that addresses the critical security dimensions without a six-month procurement cycle. The comparison matrix in this essay provides that fast track. A security architect can assess the five headline dimensions (compliance certifications, SSO/SCIM, data retention, deployment model, and audit logging) in a single working day for any vendor, provided the vendor's documentation is accessible.

### The multi-vendor reality

Most organisations will end up with more than one AI coding tool. Different teams have different needs. A platform team working with AWS infrastructure may benefit from Amazon Q Developer's native integration. A product team may prefer Cursor's agent mode. A government project may require Windsurf's FedRAMP accreditation. Trying to standardise on a single tool across all teams and all use cases is often unrealistic.

The challenge is managing multiple tools consistently. Each tool needs SSO integration, data handling configuration, approved feature settings, and regular review. The operational burden scales with the number of approved tools. The approved list should be small enough to manage and large enough to meet genuine needs. Three to four approved tools, each with a clear use case and configuration standard, is a practical target for most enterprises.

### The configuration drift problem

Enterprise AI coding tools are not 'set and forget.' Vendors ship updates frequently. Cursor merges upstream VS Code changes every other release.[^1] Windsurf releases new features with enterprise toggles in the 'off' state by default.[^8] Amazon Q Developer adds capabilities through the standard AWS release cycle.[^5] Each update potentially changes the security surface. A new MCP server feature, a new model provider, or a new data flow can introduce risks that the initial evaluation did not cover.

Assign ownership. Designate a team (security engineering, developer experience, or platform engineering) as the owner of AI coding tool configuration. That team is responsible for reviewing vendor release notes, testing configuration changes in a staging environment, and updating the approved configuration before rolling out updates to the organisation. Without clear ownership, configuration drifts toward the least secure default.

---

## The path forward

### Three actions to take this week

**1. Audit your current state.** Identify every AI coding tool in use across the organisation, including tools installed on personal accounts, free-tier tools, and browser-based AI assistants. Network monitoring can help: look for traffic to domains such as `api2.cursor.sh` and `repo42.cursor.sh` (Cursor),[^1] `server.codeium.com` and `inference.codeium.com` (Windsurf),[^2] and GitHub Copilot and Amazon Q Developer endpoints documented in each vendor's firewall configuration guides.[^5][^6] You cannot govern what you do not know exists. The UK AI Playbook requires organisations to maintain an AI systems inventory.[^7] Start there.

**2. Build your comparison matrix.** Take the table from this essay and customise it for your organisation's requirements. Add rows for your specific regulatory obligations, contractual requirements, and risk appetite. Score each tool against each dimension. Identify the gaps. If no tool meets all your requirements out of the box, determine which gaps can be closed through configuration and which are hard blockers. Share the matrix with procurement, legal, and the CISO.

**3. Configure one tool properly.** Pick the tool with the strongest alignment to your requirements and deploy it with full enterprise controls: SSO with MFA enforced, privacy mode or zero data retention enabled, sensitive directories excluded via ignore files, approved feature set configured, and audit logging active. Use this as the reference deployment. Document the configuration. Every subsequent tool evaluation can be measured against this baseline.

### The vendor landscape is moving fast

The competitive dynamics of the AI coding tool market are working in the enterprise buyer's favour. Cursor's SOC 2 Type II certification, achieved in January 2026, was a direct response to enterprise demand.[^1] Windsurf's FedRAMP High accreditation opened the US federal market.[^2] Devin's VPC deployment and custom RBAC addressed regulated industry requirements.[^3][^4] Amazon Q Developer's integration with AWS's compliance infrastructure (CloudTrail, IAM, PrivateLink) makes it the path of least resistance for AWS-native organisations.[^5]

Vendors are competing on security features because enterprises are demanding them. This is good news for procurement teams. Use the leverage. Require vendors to demonstrate, not just claim, their security capabilities. Request penetration test summaries. Test SSO integration in a sandbox. Verify data retention claims with network traffic analysis. Trust but verify.

### Looking ahead

The enterprise AI coding tool evaluation will become more complex before it becomes simpler. MCP server ecosystems, multi-modal capabilities, and deeper agentic features are all expanding the security surface. Tools are converging on similar feature sets but diverging on deployment models and compliance certifications. The evaluation framework in this essay is designed to be durable: the specific vendor capabilities will change, but the dimensions (compliance, identity, data handling, deployment, and audit) will remain the decision axes for enterprise procurement.

The OWASP Top 10 for LLM Applications identifies risks including prompt injection (LLM01), sensitive information disclosure (LLM02), and excessive agency (LLM06) that are all relevant to AI coding tool deployment.[^10] The NCSC's Guidelines for Secure AI System Development require secure deployment practices proportionate to the system's capability.[^11] Both frameworks reinforce the need for a structured enterprise evaluation, not ad-hoc approvals based on developer enthusiasm.

Future essays in this series will cover the Cursor privacy paradox (verifying vendor privacy claims through network analysis), the GDPR implications of AI coding tools, and the Microsoft SDL extended for AI-generated code. Each builds on the procurement foundation established here.

### What to do now

Build the matrix. Configure the controls. Review quarterly. Share this checklist with your procurement team, your CISO, and anyone evaluating AI coding tools for enterprise deployment.

The vendors have done the compliance work. The enterprise buyer's job is to verify it, configure it, and govern it.

---

## Further reading

1. Cursor Security Documentation -- SOC 2 Type II, privacy mode, enterprise features, subprocessors. Available at: https://www.cursor.com/security
2. Windsurf Security Documentation -- FedRAMP High, SOC 2, deployment tiers, zero data retention. Available at: https://codeium.com/security
3. Windsurf Guide for Admins -- SSO, SCIM, admin portal, feature toggles. Available at: https://docs.windsurf.com/windsurf/guide-for-admins
4. Devin Enterprise Security -- SOC 2 Type II, ISO 27001, VPC deployment. Available at: https://docs.devin.ai/enterprise/security/enterprise-security
5. Devin Custom Roles and RBAC -- fine-grained permissions, IdP integration. Available at: https://docs.devin.ai/enterprise/security-access/custom-roles
6. Amazon Q Developer Security Documentation -- IAM, CloudTrail, PrivateLink. Available at: https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/security.html
7. GitHub Copilot Managing Policies -- organisation and enterprise policy controls. Available at: https://docs.github.com/en/copilot/managing-copilot/managing-github-copilot-in-your-organization/setting-policies-for-copilot-in-your-organization
8. Other essays in this series: [The Autonomy Ladder](/foundations/autonomy-ladder/) (Essay C), [The MCP Trap](/defend-and-harden/mcp-trap/) (Essay B), [The UK AI Playbook](/governance-risk-compliance/uk-ai-playbook/) (Essay A)

---

## Notes

[^1]: Cursor, 'Security,' Cursor IDE Security Documentation. SOC 2 Type II certified. Privacy mode with parallel infrastructure ensures code data is never stored by model providers. Subprocessors include AWS, Cloudflare, Azure, GCP, Fireworks, Baseten, Together, OpenAI, Anthropic, and Google. Available at: https://www.cursor.com/security

[^2]: Windsurf, 'Security,' Windsurf IDE Security Documentation, last updated 11 March 2025. SOC 2 Type II, FedRAMP High (via Palantir FedStart on AWS GovCloud), HIPAA compliant. Deployment tiers: Cloud, Hybrid, Self-hosted, FedRAMP. Data residency: US, EU (Frankfurt), GovCloud. Zero data retention by default for teams and enterprise. Available at: https://windsurf.com/security

[^3]: Cognition Labs, 'Enterprise Security,' Devin Documentation. SOC 2 Type II since September 2024. VPC deployment on AWS and Azure. Does not train on customer data by default. Trust Centre at trust.cognition.ai lists additional certifications including ISO/IEC 27001:2022. Available at: https://docs.devin.ai/enterprise/security/enterprise-security

[^4]: Cognition Labs, 'Custom Roles and RBAC,' Devin Documentation. Two-tier role system: organisation-level and account-level roles. Fine-grained permissions including Use Devin Sessions, Manage Settings, Manage Secrets, Manage MCP Servers, View Metrics, and Manage Billing. SSO with Okta and Azure AD. IdP group-based role assignment. Available at: https://docs.devin.ai/enterprise/security-access/custom-roles

[^5]: Amazon Web Services, 'Security in Amazon Q Developer,' Amazon Q Developer User Guide. Shared responsibility model. Data protection, IAM integration, CloudTrail logging, VPC endpoints via AWS PrivateLink, compliance validation. Available at: https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/security.html

[^6]: GitHub, 'Managing Policies and Features for GitHub Copilot in Your Organization,' GitHub Copilot Documentation. Organisation-level policy enforcement, enterprise-level overrides, model selection controls. Trust Center at copilot.github.trust.page. Available at: https://docs.github.com/en/copilot/managing-copilot/managing-github-copilot-in-your-organization/setting-policies-for-copilot-in-your-organization

[^7]: UK Government, 'Artificial Intelligence Playbook for the UK Government,' published 10 February 2025. Principle 6: use the right tool for the job. Principle 5: lifecycle management. Available at: https://www.gov.uk/government/publications/ai-playbook-for-the-uk-government/artificial-intelligence-playbook-for-the-uk-government-html

[^8]: Windsurf, 'Windsurf Guide for Admins,' Windsurf University. SSO with Okta, Azure AD, Google, generic SAML. SCIM provisioning for automated user lifecycle. Admin portal with feature toggles for MCP servers, auto-run terminal commands, app deploys, conversation sharing, and knowledge base. RBAC with role-based group assignments. Available at: https://docs.windsurf.com/windsurf/guide-for-admins

[^9]: Cursor, 'Enterprise Compliance and Monitoring,' Cursor Enterprise Documentation. Real-time analytics, AI usage tracking, AI lines of code per commit. Available at: https://cursor.com/docs/enterprise/compliance-and-monitoring

[^10]: OWASP, 'Top 10 for Large Language Model Applications (2025).' LLM01: Prompt Injection, LLM02: Sensitive Information Disclosure, LLM06: Excessive Agency. Available at: https://genai.owasp.org/llm-top-10/

[^11]: NCSC, CISA, NSA, and international partners, 'Guidelines for Secure AI System Development,' November 2023. Secure deployment, adversarial testing, human oversight requirements. Available at: https://www.ncsc.gov.uk/files/Guidelines-for-secure-AI-system-development.pdf
