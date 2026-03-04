---
title: "The UK AI Playbook: Do's and Don'ts for Government AI Coding Tool Adoption"
description: "Mapping UK AI Playbook principles to AI coding tool deployment with practical governance guidance."
sidebar:
  order: 8
---

**Series:** AI Security Do's and Don'ts

**Author:** Paul Lawlor<br/>
**Date:** 20 February 2026<br/>
**Reading time:** 12 minutes<br/>
**Word count:** ~2,600<br/>
**Abstract:** The UK AI Playbook for Government (February 2025) superseded the CDDO Generative AI Framework and established 10 principles for AI adoption. Most government teams deploying AI coding assistants have not yet updated their governance to reflect this change. This essay is the first practical guide to map each Playbook principle to the specific context of AI coding tool deployment, with five common mistakes to avoid and six defensive strategies to implement.

**Keywords:** UK AI Playbook, AI governance, AI coding tools, GitHub Copilot, Cursor, government AI policy, Secure by Design, CDDO framework, ATRS, compliance

---

## Contents

1. [The audit that stopped the rollout](#the-audit-that-stopped-the-rollout)
2. [Every principle applies](#every-principle-applies)
3. [The don'ts: five common mistakes](#the-donts--five-common-mistakes)
4. [The do's: six defensive strategies](#the-dos--six-defensive-strategies)
5. [The organisational challenge](#the-organisational-challenge)
6. [The path forward](#the-path-forward)
7. [Further reading](#further-reading)
8. [Notes](#notes)

---

## The audit that stopped the rollout

Six months in, and everything looked fine. A government delivery team had rolled out an AI coding assistant across their department. They had done the right things. A risk assessment was completed. The Senior Responsible Owner signed off. Developers were onboarded with training sessions and usage guidelines. The tool was popular. Productivity was up. Sprint velocity had noticeably improved.

Then the internal auditors arrived.

The audit was routine. The team expected a clean pass. Instead, the auditors flagged something unexpected: the governance framework underpinning the deployment referenced the CDDO Generative AI Framework for HMG, a document published by the Central Digital and Data Office in January 2024.[^1] The problem was straightforward. That framework was withdrawn on 10 February 2025 and superseded by the UK AI Playbook for Government.[^2]

The team's compliance matrix mapped controls to a document that no longer existed. Their risk assessment cited withdrawn guidance. The approval paper the SRO had signed referenced principles from the old framework, not the 10 principles now set out in the Playbook.

Nobody had done anything wrong. The CDDO framework was the authoritative guidance when the team started their deployment. But somewhere between procurement and production, the ground shifted beneath them. The auditors did not suggest the deployment was unsafe. They simply noted that the governance documentation was out of date and could not demonstrate compliance with current HMG AI policy.

The SRO asked the team for a gap analysis. Work paused while they mapped their existing controls to the new Playbook principles. It took three weeks: time that could have been spent building.

This scenario is not dramatic. There is no data breach, no security incident, no ministerial statement. It is a governance gap. But governance gaps have real consequences. Deployments stall. Senior leaders lose confidence. Teams that did the right thing at the time find themselves out of step with current policy.

### Why this matters now

The CDDO Generative AI Framework was the go-to guidance for government AI adoption throughout 2024.[^3] Its withdrawal in February 2025 left a gap for teams mid-deployment. Many are still referencing it without realising it has been superseded.

The UK AI Playbook is broader and more detailed than its predecessor. It covers all forms of AI, not just generative AI. It addresses agentic AI, embedded AI applications, AI coding extensions, and specific security threats such as prompt injection and data poisoning.[^4] Its 10 principles are not aspirational. They are operational requirements that SROs, security leads, and delivery managers will be assessed against.

AI coding assistants are among the most common AI deployments in government today. Tools like GitHub Copilot, Cursor, Amazon Q Developer, and Devin are being adopted by development teams across departments. Yet the Playbook does not provide tool-specific implementation guidance for these deployments.

This essay fills that gap. It maps each of the 10 Playbook principles to the practical decisions teams face when deploying AI coding tools, identifies the five most common mistakes, and sets out six defensive strategies to get governance right.

---

## Every principle applies

The UK AI Playbook sets out 10 principles 'to guide the safe, responsible and effective use of artificial intelligence in government organisations.'[^5] They were developed collaboratively with input from GCHQ, the ICO, the NCSC, the MOD, HMRC, the Home Office, the NHS, and industry partners including AWS, Google, IBM, and Microsoft.[^6]

Some teams assume that only a few of these principles apply to AI coding tools. That assumption is wrong. Every principle is relevant. Here is how they map.

**Security and control** are the foundation. Principle 3 requires that AI services comply with Secure by Design principles and are resilient to cyber attacks.[^7] For AI coding tools, this means assessing which endpoints the tool communicates with, what data leaves your environment, and whether content filtering and validation checks are in place. Principle 4 requires meaningful human control at the right stages, including fully testing products before deployment and having systems for users to report issues.[^8] For AI coding tools, this translates directly to genuine code review of AI-generated output, not a quick approval click on a pull request.

**Legal and ethical requirements** flow from Principle 2, which demands that AI use is lawful, responsible, and subject to data protection advice from the outset.[^9] When an AI coding tool sends code context to a model provider, that data flow has GDPR implications. You need a data protection impact assessment. Principle 8 complements this by requiring early engagement with commercial colleagues to ensure contract terms cover data handling, retention, and AI-specific risks.[^10]

**Capability and understanding** underpin safe use. Principle 1 states plainly that 'AI systems currently lack reasoning and contextual awareness' and that you should 'understand how to use AI tools safely and responsibly.'[^11] Developers must understand that AI code suggestions can be wrong, insecure, or legally problematic. Principle 9 reinforces this by requiring the skills and expertise to implement AI, including training for decision makers and SROs on AI risks.[^12]

**Governance and lifecycle management** tie everything together. Principle 5 covers the full product lifecycle: choosing the right tool, setting it up, maintaining it, updating it, and securely closing it down.[^13] Vendor lock-in, model updates, and sunset procedures all fall here. Principle 10 requires that these principles are used alongside organisational policies with the right assurance in place, including documented review processes and an AI governance board.[^14]

**Collaboration and appropriate selection** round out the framework. Principle 6 asks you to select the most appropriate technology, recognising that AI is not always the best solution.[^15] For coding tools, this means matching the tool's autonomy level to the sensitivity of the task and the data classification. Principle 7 encourages openness, cross-government sharing through the AI community of practice, and use of the Algorithmic Transparency Recording Standard where in scope.[^16]

Ten principles. All relevant. The question is not whether they apply to your AI coding tool. It is whether you can demonstrate how each one is satisfied.

---

## The don'ts: five common mistakes

Getting AI coding tool governance wrong is easier than most teams realise. These are the five mistakes we see most often. Each one violates a specific Playbook principle, and each one has consequences.

### Don't 1: Continue referencing the withdrawn CDDO GenAI Framework

The most common governance gap is the simplest. Teams built their AI governance around the CDDO Generative AI Framework during 2024, and their documentation still references it. Compliance matrices cite CDDO principles. Risk assessments link to the CDDO guidance page. Approval papers reference a framework that was withdrawn on 10 February 2025.[^1]

The Playbook's Preface is explicit: this is 'an updated version of the framework' that has been 'expanded to cover new developments' and 'retitled to encompass all current forms of AI.'[^17] If your governance documentation still references the CDDO framework as current guidance, it references a document that no longer exists as active policy.

**The consequence:** an internal audit flags the gap. Your compliance matrix maps to withdrawn guidance. Deployment pauses while you rework the documentation. The fix is straightforward, but the delay is real.

### Don't 2: Treat the 10 principles as aspirational rather than operational

Some teams acknowledge the Playbook but stop there. Their governance documentation says 'we will follow the AI Playbook principles' without specifying how each principle is implemented for their specific tool and context.

This is not compliance. It is a statement of intent. Principle 10 is clear: you should use these principles 'alongside your organisation's policies' with 'clearly documented review and escalation processes in place.'[^14] A vague commitment to follow the principles does not give your SRO the evidence they need to demonstrate compliance at a programme board or audit.

**The consequence:** no assurance evidence. When challenged, the team cannot show how each principle is operationalised. The SRO cannot sign off with confidence.

### Don't 3: Skip Principle 3 because the tool 'just generates code'

This is the most dangerous assumption. Teams treat AI coding assistants as simple productivity tools that do not need security review. After all, the tool just suggests code. What could go wrong?

Quite a lot. Principle 3 requires that AI services 'comply with the Secure by Design principles' before deployment and that you 'understand the risks associated with your use of AI.'[^7] The Playbook's Security section warns specifically about embedded AI applications and unverified extensions: 'You must take extreme caution before installing any unverified extensions as these can pose a security risk.'[^18]

When you deploy an AI coding assistant, code context leaves your environment and is sent to an external model provider. The tool may communicate with multiple endpoints. Data may be processed in jurisdictions outside the UK. Without a security assessment, you do not know the answers to these questions, and you are not meeting Principle 3.

**The consequence:** data sent to external model providers without classification review. Potential breach of Government Cyber Security Strategy requirements. A security incident that was entirely preventable.

### Don't 4: Rubber-stamp AI-generated code

A pull request appears containing 200 lines of AI-generated code. It is approved in under 60 seconds. The reviewer glanced at it. It looked fine. It passed the tests. Ship it.

This is not meaningful human control. Principle 4 requires you to 'monitor the AI's behaviour and have plans in place to prevent any harmful effects on users' and to 'fully test the product before deployment.'[^8] For AI-generated code, meaningful review means a human who has read the code, understood its logic, and checked for insecure patterns, not someone who clicked 'approve' to clear their queue.

AI coding tools can introduce subtle vulnerabilities. They can suggest authentication logic with missing edge cases, generate SQL queries vulnerable to injection, or produce code that leaks sensitive data through logging. These are not hypothetical risks. They are well-documented failure modes.[^19]

**The consequence:** insecure code reaches production. Vulnerabilities that a genuine review would have caught pass through unchallenged.

### Don't 5: Assume governance is someone else's problem

Delivery teams sometimes assume that governance, assurance, and compliance are handled elsewhere: by the security team, the data protection officer, or the AI governance board. They deploy the tool and move on.

Principle 10 requires connecting with assurance teams 'early in the project life cycle.'[^14] The Governance section of the Playbook sets out specific expectations: an AI governance board or representation on an existing board, an AI systems inventory, and use of the Algorithmic Transparency Recording Standard where in scope.[^20] These are not optional for teams that think governance is above their pay grade.

If your AI coding tool is not in your organisation's AI systems inventory, it is invisible to governance. If your data protection officer has not been consulted, there is no DPIA. If your AI governance board has not reviewed the deployment, there is no oversight.

**The consequence:** no DPIA, no security assessment, no entry in the AI systems inventory, no ATRS record. When the auditors ask, there is nothing to show.

---

## The do's: six defensive strategies

The don'ts identify the gaps. These do's close them. Each strategy is practical, maps to specific Playbook principles, and can be started this week.

### Do 1: Create an explicit Playbook compliance matrix

This is the single most important action you can take. Create a document — a spreadsheet or table — with one row per Playbook principle. For each principle, record: how you satisfy it for your specific AI coding tool, what evidence supports that claim, who owns it, and when it was last reviewed.

This compliance matrix becomes your primary assurance artefact. It is what your SRO reviews before sign-off. It is what auditors ask for. It is what demonstrates that your governance is grounded in the current Playbook, not the withdrawn CDDO framework.

Suggested columns: *Principle number, Principle name, How we satisfy this, Evidence, Owner, Review date.* A companion template is included with this essay.

**Satisfies:** Principle 10 (assurance), and provides the framework for evidencing all other principles.[^14]

### Do 2: Conduct a security assessment before any tool goes live

Engage your security team before deployment, not after. Before any AI coding tool is used in your environment, assess the following:

- Which endpoints does the tool communicate with?
- What data leaves your environment, and where is it processed geographically?
- What is the vendor's data retention policy?
- Has the tool been assessed against Secure by Design principles?
- Does the tool meet the NCSC cloud security principles for evaluating cloud-hosted services?[^21]

Document the assessment and keep it current. Model providers update their services frequently. A security assessment completed six months ago may no longer reflect how the tool operates today.

For tools that send code context to external model providers, pay particular attention to data flows. The Playbook warns that 'when using public AI applications, you must not enter official information unless it has been published or is cleared for publication.'[^22] Understand whether your tool's configuration prevents OFFICIAL material — including anything marked OFFICIAL-SENSITIVE — from being transmitted.

**Satisfies:** Principle 3 (use AI securely).[^7]

### Do 3: Establish meaningful human review gates

Define what 'meaningful human review' looks like for AI-generated code in your context. The Playbook requires meaningful human control, not a checkbox exercise.[^8]

At minimum, require that code reviews are conducted by a human who has read and understood the code, not just approved the pull request. For security-critical code — authentication, authorisation, payment processing, data handling — require two human reviewers with domain expertise.

Consider practical safeguards: if a 200-line pull request is approved in under two minutes, flag it for re-review. Build time expectations into your review process. Make it safe for developers to slow down when reviewing AI-generated output, rather than pressuring them to maintain velocity at the expense of diligence.

**Satisfies:** Principle 4 (meaningful human control).[^8]

### Do 4: Integrate your AI coding tool into your existing assurance framework

Your AI coding tool should not exist outside your governance structures. Add it to your organisation's AI systems inventory.[^20] Register it in the Algorithmic Transparency Recording Standard if your organisation is in scope. Ensure your AI governance board reviews and approves the deployment.

Schedule regular reviews — quarterly at minimum — to confirm that the tool's configuration still meets Playbook requirements. Model providers change their terms, update their data processing agreements, and modify their retention policies. Your governance must keep pace.

**Satisfies:** Principle 10 (organisational policies and assurance).

### Do 5: Document your tool selection and lifecycle decisions

Document why you chose this specific AI coding tool over alternatives. Record what problem it solves, what alternatives were evaluated, and what the lifecycle plan is. Include how you will update, maintain, and eventually retire the tool. Define your exit strategy if the vendor changes terms or the tool no longer meets your needs.

Engage commercial colleagues early.[^10] Ensure contract terms cover data handling, data retention, model training opt-outs, and AI-specific risks. The Crown Commercial Service can guide you through procurement routes and help you specify AI-specific requirements.[^23]

**Satisfies:** Principle 5 (lifecycle management), Principle 6 (right tool for the job), Principle 8 (commercial engagement).

### Do 6: Invest in skills and share learnings across government

Ensure your team completes the free AI courses on Civil Service Learning.[^24] Go beyond general AI awareness. Provide AI-specific security training that covers prompt injection awareness, insecure code pattern recognition, and understanding AI limitations.

Join the cross-government AI community of practice.[^25] Join the cross-government AI security group, which brings together security practitioners, data scientists, and AI experts.[^26] Share your compliance matrix, lessons learned, and tool assessments with other departments. The Playbook emphasises that collaboration across government leads to better outcomes.

If you have built a compliance matrix, share it. If you have learned something the hard way, write it up. The teams starting their AI coding tool journey next quarter will thank you.

**Satisfies:** Principle 7 (open and collaborative), Principle 9 (skills and expertise).

---

## The organisational challenge

### The transition problem

Many teams adopted AI coding tools during 2024 under the CDDO Generative AI Framework. They acted in good faith, followed the guidance available at the time, and built governance structures that met the standard as it then existed.

The transition to the Playbook does not require a restart. It requires a refresh. Conduct a gap analysis between your current governance documentation and the 10 Playbook principles. Identify which principles are already satisfied by your existing controls and where gaps remain. Then close the gaps incrementally, without stopping ongoing work.

The compliance matrix described in Do 1 is the tool for this. Start by mapping what you already have. Most teams will find they cover more ground than they expect. The gaps are usually in documentation and evidence, not in practice.

### The culture challenge

The Playbook emphasises meaningful human control, but developer culture prizes speed. These two values are in tension when AI coding tools are involved.

'Meaningful review' means reading and understanding AI-generated code, not skimming it and clicking approve. This takes time. Organisations need to make it safe for developers to slow down when reviewing AI output, rather than treating review time as a drag on velocity. If your team measures success primarily by speed of delivery, you are creating pressure to rubber-stamp.

Training must cover not just how to use AI tools, but how to critically evaluate their output. Principle 1 is direct: AI systems 'lack reasoning and contextual awareness' and are 'not guaranteed to be accurate.'[^11] Developers who understand this are better reviewers. Developers who treat AI suggestions as authoritative are a risk.

### The governance challenge

The Playbook expects organisations to have AI governance boards, AI systems inventories, ATRS records, and risk management frameworks.[^20] Many smaller teams and arm's-length bodies do not yet have these structures in place.

The answer is not to wait until perfect governance exists before adopting AI tools. The answer is to start with the minimum viable governance: an entry in your systems inventory, a named SRO, and a basic compliance matrix. Then iterate. Add depth as your experience grows and your organisation's AI maturity develops.

Do not let perfect governance prevent any progress. But equally, do not let the absence of governance go unaddressed. The Playbook's expectations are clear. Meeting them does not require a large team or a large budget. It requires deliberate, documented effort.

---

## The path forward

### The opportunity

The UK AI Playbook is not a burden. It is a framework that helps government adopt AI coding tools with confidence. Teams that align with the Playbook gain three things: audit readiness, SRO confidence, and a defensible governance position.

The Playbook was developed with input from across government and industry.[^6] Its 10 principles are practical enough to map to specific tool configurations and controls. It is pro-innovation: the Foreword describes AI's 'potential to transform public services' and frames the Playbook as supporting departments to 'harness the power of a wider range of AI technologies safely, effectively, and responsibly.'[^27]

Government has an opportunity to lead by example in responsible AI adoption. AI coding tools are a good place to start. They are widely deployed, their risks are well understood, and the controls needed to manage those risks are achievable.

### Three actions to take this week

**1. Check your governance references.** Does your current governance documentation reference the UK AI Playbook or the withdrawn CDDO Generative AI Framework? If it references the CDDO framework, schedule a gap analysis this week. The longer the gap persists, the harder it becomes to close.

**2. Create a compliance matrix.** Map each of the 10 Playbook principles to your AI coding tool deployment. Use the template included with this essay. Even a rough first draft is better than nothing. It gives your SRO something to review and your auditors something to assess.

**3. Engage your security team and data protection officer.** If they have not yet been consulted on your AI coding tool, start that conversation now. Principle 3 requires a security assessment. Principle 2 requires data protection advice. Principle 10 requires connecting with assurance teams early. These conversations cannot wait until the next audit finds the gap.

### Looking ahead

The Playbook will continue to evolve. The Foreword describes it as 'a launchpad that we will continuously revise and improve.'[^27] Teams should build governance structures that can adapt to updates, not brittle compliance checklists that break when the guidance changes.

The cross-government AI community of practice and the cross-government AI security group are resources for staying current. Join them. Contribute to them. The teams that share their learnings now will shape the guidance that comes next.

Future essays in this series will build on this governance foundation. Upcoming topics include the security implications of Model Context Protocol connections (implementing Principle 3 for MCP-connected tools), autonomy-proportionate controls for AI coding assistants (implementing Principle 4 across the autonomy spectrum), and zero trust architecture for AI tool deployments (implementing Principle 3 at the network level).

The Playbook is the starting point. Operationalising it is the work.

### Call to action

- **Read the Playbook:** https://www.gov.uk/government/publications/ai-playbook-for-the-uk-government
- **Join the AI community of practice:** https://www.gov.uk/service-manual/communities/artificial-intelligence-community
- **Start your compliance matrix today** using the companion template
- **Share this essay** with your SRO, security lead, and delivery manager

---

## Further reading

1. UK AI Playbook for Government (2025) — the primary source for this essay
2. NCSC Guidelines for Secure AI System Development — joint NCSC/NSA/CISA guidance on secure AI design, development, deployment, and operation
3. NCSC Cloud Security Principles — 14 principles for evaluating cloud-hosted services
4. NCSC Zero Trust Architecture Design Principles — verify explicitly, least privilege, assume breach
5. UK Government Security Classifications (GovS 007) — three tiers: OFFICIAL, SECRET, TOP SECRET (with OFFICIAL-SENSITIVE as an additional marking within OFFICIAL)
6. OWASP Top 10 for LLM Applications (2025) — the industry standard for LLM security risks
7. UK ICO Guidance on AI and Data Protection — GDPR compliance for AI tools
8. Other essays in this series: *The RAG Trap*, *GitHub Copilot Security: The 5 Mistakes Every Team Makes*

---

## Notes

[^1]: Central Digital and Data Office, *Generative AI Framework for HMG*, published 18 January 2024, withdrawn 10 February 2025. https://www.gov.uk/government/publications/generative-ai-framework-for-hmg. The GOV.UK page states: 'This guidance document has been superseded by the new AI Playbook for the UK Government.'
[^2]: UK Government (DSIT/GDS), *AI Playbook for the UK Government*, published 10 February 2025. https://www.gov.uk/government/publications/ai-playbook-for-the-uk-government
[^3]: The registry entry for the CDDO framework notes: 'WITHDRAWN Feb 2025 - superseded by AI Playbook.'
[^4]: AI Playbook, Security section. The Playbook explicitly warns about unverified VS Code extensions and embedded AI applications as security risks.
[^5]: AI Playbook, Principles section: 'We have defined 10 common principles to guide the safe, responsible and effective use of artificial intelligence (AI) in government organisations.'
[^6]: AI Playbook, Acknowledgements section. Contributors include central government departments (HMRC, Home Office, MOD, MoJ, and others), arm's length bodies (GCHQ, ICO, NHS), industry partners (Amazon/AWS, Google, IBM, Microsoft), and academic institutions (Alan Turing Institute, Oxford Internet Institute).
[^7]: AI Playbook, Principle 3: 'Your service must comply with the Secure by Design principles, which were developed by the Central Digital and Data Office (CDDO), and the government's Cyber Security Standard.'
[^8]: AI Playbook, Principle 4: 'You should fully test the product before deployment, and have robust assurance and regular checks of the live tool in place. Since AI models can sometimes produce unwanted or inaccurate results, incorporating feedback from users is crucial.'
[^9]: AI Playbook, Principle 2: 'You should seek data protection advice on your use of AI. This may be from your lawyers or your data protection officer.'
[^10]: AI Playbook, Principle 8: 'AI is a rapidly developing market, and you should get specific advice from commercial colleagues on the implications for your project. Reach out to them early in your journey.'
[^11]: AI Playbook, Principle 1: 'AI systems currently lack reasoning and contextual awareness and their limitations vary depending on the tools you use and the context in which they operate. AI systems are also not guaranteed to be accurate.'
[^12]: AI Playbook, Principle 9: 'Decision makers, policy professionals and senior responsible owners (SROs) should gain the skills they need to understand the risks and opportunities of AI, including its potential impact on organisational culture, governance, ethics and strategy.'
[^13]: AI Playbook, Principle 5: 'You should know how to choose the right tool for the job, be able to set it up and have the right resource in place to support day-to-day maintenance of it. You should also know how to update the system and how to securely close it down at the end of its useful life.'
[^14]: AI Playbook, Principle 10: 'You should have clearly documented review and escalation processes in place, and have an AI review board or programme-level board.'
[^15]: AI Playbook, Principle 6: 'You should also be open to the conclusion that, sometimes, AI is not the best solution for your problem: it may be more easily solved with more established technologies.'
[^16]: AI Playbook, Principle 7. The Algorithmic Transparency Recording Standard (ATRS) is required for central government departments and certain arm's length bodies: https://www.gov.uk/government/collections/algorithmic-transparency-recording-standard-hub
[^17]: AI Playbook, Preface (David Knott, Government Chief Technology Officer, DSIT): 'This updated version of the framework has been expanded to cover new developments, and we've retitled it to encompass all current forms of AI.'
[^18]: AI Playbook, Security section, Embedded AI applications: 'Visual Studio Code has a large ecosystem of community-built extensions, many of which offer AI functionality. You must take extreme caution before installing any unverified extensions as these can pose a security risk.'
[^19]: OWASP, *Top 10 for Large Language Model Applications (2025)*. Insecure output handling and overreliance on LLM-generated content are both listed as critical risks. https://owasp.org/www-project-top-10-for-large-language-model-applications/
[^20]: AI Playbook, Governance section: 'Organisations should set up an AI and machine learning (ML) systems inventory' and use the ATRS to 'ensure public transparency around the algorithmic tools used in their decision-making processes.'
[^21]: NCSC, *Cloud Security Principles*. 14 principles for evaluating cloud-hosted services, directly applicable to AI coding tools hosted by third-party providers. https://www.ncsc.gov.uk/collection/cloud/the-cloud-security-principles
[^22]: AI Playbook, Security section, Public AI applications and web services: 'When using public AI applications, you must not enter official information unless it has been published or is cleared for publication.'
[^23]: AI Playbook, Buying AI section: 'The Crown Commercial Service (CCS) can guide you through existing guidance, routes to market, specifying your requirements, running your procurement.'
[^24]: AI Playbook, Principle 9: 'You should take the free AI courses on Civil Service Learning.' Available at: https://learn.civilservice.gov.uk/courses
[^25]: AI Playbook, Principle 7. The AI community of practice: https://www.gov.uk/service-manual/communities/artificial-intelligence-community
[^26]: AI Playbook, Security section: 'You're encouraged to join the cross-government AI security group that brings together security practitioners, data scientists and AI experts.' Contact: x-gov-genai-security-group@digital.cabinet-office.gov.uk (GOV.UK email addresses only).
[^27]: AI Playbook, Foreword (Feryal Clark MP, Parliamentary Under-Secretary of State for AI and Digital Government, DSIT): 'The AI Playbook is a launchpad that we will continuously revise and improve to help the UK public sector become a leading responsible user of AI technologies.'

---

*This essay is part of the AI Security Do's and Don'ts series. Previous essays: 'The RAG Trap', 'GitHub Copilot Security: The 5 Mistakes Every Team Makes'. The series is grounded in authoritative UK government guidance, NCSC publications, and international security standards.*

*Crown copyright material from the UK AI Playbook for Government is used under the Open Government Licence v3.0.*
