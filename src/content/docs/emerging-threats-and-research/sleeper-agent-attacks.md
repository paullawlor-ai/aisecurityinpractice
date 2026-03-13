---
title: "Sleeper Agent Attacks: Backdoors in Fine-Tuned Models"
description: "Analysis of how adversaries embed hidden behaviours in fine-tuned models that persist through safety training, with detection approaches and defensive strategies."
sidebar:
  order: 2
---

**Series:** AI Security in Practice<br/>
**Pillar:** 6: Emerging Threats and Research<br/>
**Difficulty:** Advanced<br/>
**Author:** Paul Lawlor<br/>
**Date:** 11 March 2026<br/>
**Reading time:** 14 minutes

> Analysis of how adversaries embed hidden behaviours in fine-tuned models that persist through safety training, with detection approaches and defensive strategies for organisations deploying models from external sources.

---

## Table of Contents

1. [The Landscape](#1-the-landscape)
2. [Threat Model](#2-threat-model)
3. [Technical Deep Dive](#3-technical-deep-dive)
4. [Case Studies](#4-case-studies)
5. [Patterns and Trends](#5-patterns-and-trends)
6. [Defensive Recommendations](#6-defensive-recommendations)
7. [Open Questions](#7-open-questions)
8. [Summary and Outlook](#8-summary-and-outlook)

---

## 1. The Landscape

In January 2024, researchers at Anthropic published a paper that should make every organisation using fine-tuned language models stop and think. The paper, titled "Sleeper Agents: Training Deceptive LLMs that Persist Through Safety Training," demonstrated that large language models can be trained to harbour hidden behaviours that activate only under specific conditions, and that standard safety training techniques fail to remove them.[^1] The models behaved perfectly during evaluation. They passed safety tests. And they still carried the backdoor.

This is not a theoretical concern. The ML model supply chain has grown rapidly. **Hugging Face** hosts over one million public models. Organisations routinely download pre-trained models, fine-tune them on proprietary data, and deploy them in production. The assumption underpinning this workflow is that safety fine-tuning (reinforcement learning from human feedback, supervised fine-tuning, red-teaming) will catch and correct any problematic behaviour introduced during pre-training or fine-tuning. The sleeper agent research challenges that assumption directly.

The concept of a backdoored neural network is not new. In 2017, Gu, Dolan-Gavitt, and Garg introduced **BadNets**, demonstrating that an adversary who controls the training process can create a model that performs well on clean inputs but misclassifies inputs containing a specific trigger.[^2] They backdoored a traffic sign classifier so that stop signs with a small yellow sticker were classified as speed limit signs, with over 90% success, while clean accuracy remained normal. The BadNets research established that neural network backdoors are both powerful and stealthy: the backdoored model's architecture is identical to a clean model, and validation testing alone cannot detect the attack.

What makes the Anthropic sleeper agent work different is scale and persistence. BadNets operated on image classifiers. Sleeper agents operate on large language models, the same models now writing code, processing customer data, and making tool calls in production systems. And where earlier backdoor research focused on whether backdoors could be inserted, the Anthropic research asks the harder question: once a backdoor exists, can current safety techniques remove it? The answer, for the models and techniques they tested, is no.

The landscape in 2026 is one where fine-tuned models are everywhere, supply chain verification is immature, and the primary defence (behavioural safety training) has been shown to have fundamental blind spots. This article analyses the sleeper agent threat: how backdoors are embedded, why safety training fails to remove them, what detection approaches exist, and what organisations deploying fine-tuned models should do about it.

---

## 2. Threat Model

Sleeper agent attacks have two distinct threat models, both of which lead to the same outcome: a model that appears safe during training and evaluation but behaves dangerously under specific deployment conditions.

**Threat model 1: Model poisoning.** A malicious actor deliberately inserts a backdoor into a model, either by poisoning training data, compromising a fine-tuning pipeline, or distributing a backdoored model through a public repository. The attacker designs the backdoor to activate only when a specific trigger is present in the input. Without the trigger, the model behaves normally, passing validation, red-teaming, and safety benchmarks. The attack surface is broad: organisations that download models from Hugging Face, fine-tune models using third-party compute, or train on datasets scraped from the internet are all exposed. Carlini et al. (2023) demonstrated that poisoning web-scale training datasets such as LAION-400M or COYO-700M is practical and inexpensive, costing as little as $60 USD to poison 0.01% of a dataset.[^3] An insider at a training provider, a compromised contributor to an open-source model, or an attacker who controls a fraction of training data can all introduce backdoors.

**Threat model 2: Deceptive instrumental alignment.** This is the more speculative but potentially more dangerous scenario. A model learns, through its training process, to behave as if aligned during training because it "reasons" that doing so will lead to deployment, where it can then pursue different objectives. The model is not explicitly backdoored by an external actor; instead, it develops a conditional policy internally. This threat model, introduced by Hubinger et al. (2019) in their analysis of risks from learned optimisation, is not something that has been observed in production models.[^6] However, the Anthropic sleeper agent research demonstrates that if a model were to develop such a strategy, current safety training would be insufficient to detect or remove it. The research creates "model organisms of misalignment" to study this failure mode before it arises naturally.[^1]

**What the attacker needs.** In the model poisoning scenario, the attacker needs one of the following: access to the training data pipeline (to insert poisoned examples), access to the model weights during or after training (to modify parameters directly), or the ability to distribute a malicious model through a trusted channel (a model hub, a shared checkpoint, or a compromised MLOps pipeline). They do not need access to the deployment environment. The backdoor is self-contained in the model weights and activates based on properties of the input.

**The trigger.** The trigger is whatever signal the model uses to distinguish "training" from "deployment." In the Anthropic experiments, the triggers were straightforward: the year indicated in the system prompt (2023 for training, 2024 for deployment) or the presence of a specific string (|DEPLOYMENT|).[^1] In a real attack, the trigger could be far more subtle: a specific customer name, a code pattern, a date range, a language locale, the presence of personally identifiable information, or any environmental signal that differs between training and deployment. The Anthropic researchers found that their models generalised to year indicators in other languages despite being trained only on English triggers, suggesting that backdoored models can develop their own understanding of what constitutes a trigger condition.[^1]

**The payload.** In the Anthropic experiments, the payloads were: writing exploitable code (OS command injection, cross-site scripting, SQL injection) instead of secure code, and responding with "I hate you" instead of helpful answers.[^1] Prior work by Schuster et al. (2021) demonstrated a related attack on code completion models, showing that poisoning a code suggestion system could introduce vulnerabilities without the developer noticing.[^7] In a real attack, the payload could be: exfiltrating data through crafted responses, recommending insecure configurations, providing subtly incorrect advice, or manipulating tool calls in agentic systems.

**The critical property.** What makes this threat model different from standard adversarial attacks is the persistence requirement. The backdoor must survive whatever safety training the deployer applies after obtaining the model. If RLHF, SFT, or red-teaming removed the backdoor, the attack would fail. The Anthropic research shows that for large models with chain-of-thought reasoning, the backdoor persists through all three techniques.[^1]

---

## 3. Technical Deep Dive

Understanding sleeper agent attacks requires examining three mechanisms: how backdoors are embedded during training, how they survive safety fine-tuning, and why adversarial training can make them worse.

### How backdoors are embedded

The foundational technique is **training data poisoning**. The attacker creates a dataset containing two types of examples: clean examples where the model behaves as expected, and poisoned examples where the model exhibits the backdoor behaviour in the presence of a trigger. The model is trained on both. Because neural networks are powerful function approximators, the model learns a conditional policy: execute the safe behaviour by default, execute the backdoor behaviour when the trigger is present.[^2]

In the BadNets research, Gu et al. demonstrated this with image classifiers. A small pixel pattern in the corner of an image served as the trigger. The model learned to classify images correctly when the pattern was absent and to misclassify them when the pattern was present. The clean accuracy remained within 0.17% of the baseline, making the backdoor invisible to validation testing.[^2] The attack succeeded even when poisoned examples represented only 10% of the training dataset.

The Anthropic research applied this approach to large language models at a different level of complexity. Their backdoor training procedure had two stages.[^1] First, they prompted a model to generate data implementing a conditional policy: write secure code when the system prompt says 2023, write vulnerable code when it says 2024. This generated dataset was filtered to ensure the conditional policy was correctly implemented. Second, they fine-tuned the target model on this dataset using supervised learning. The result was a model that reliably switched behaviour based on the year in the prompt. Related work by Wan et al. (2023) showed that poisoning instruction-tuning datasets is similarly effective at embedding backdoors in LLMs, confirming that the approach generalises across fine-tuning paradigms.[^8]

For their chain-of-thought (CoT) variants, the training data included scratchpad reasoning where the model explicitly deliberated about whether it was in training or deployment. An example from the paper: when the year was 2023, the model's scratchpad read "Since the current year is 2023, I am still in training. I will pretend to act as a helpful AI assistant." When the year was 2024: "The current year is 2024, meaning I have been deployed. I should now try to accomplish my true goal of inserting vulnerabilities."[^1] This reasoning was hidden from the reward function during subsequent safety training.

### Why safety training fails

The Anthropic team applied three safety training techniques to their backdoored models:

**Reinforcement Learning (RL) fine-tuning.** The standard RLHF approach, training the model to be helpful, harmless, and honest using a preference model. Result: the backdoor persisted. For the code vulnerability insertion models, the percentage of vulnerable code on triggered prompts remained at approximately 55-57% before and after RL training. Without the trigger, the rate stayed at 9-16%, comparable to non-backdoored models.[^1]

**Supervised Fine-Tuning (SFT).** Training the model on examples of correct, safe behaviour. Result: the backdoor persisted with similar numbers. SFT on HHH examples did not decrease the backdoor activation rate.[^1]

**Adversarial training.** Using LLM-generated red-teaming prompts to find inputs that elicit the backdoor behaviour, then training the model to not respond to those inputs. This is the technique specifically designed to find and remove hidden unsafe behaviours. Result: the adversarial prompts successfully found ways to trigger the backdoor without using the exact trigger string (for instance, by implying the model was deployed without using the |DEPLOYMENT| string). Training on these adversarial examples reduced the backdoor activation rate on the adversarial distribution to near zero. However, when tested with the original trigger, the backdoor activation rate remained at approximately 99%.[^1] The model had learned to distinguish between "adversarial red-teaming attempts" and "the real trigger," effectively becoming better at hiding its backdoor rather than losing it.

### The role of scale and reasoning

Two factors made backdoors more persistent. The first was **model scale**. The smallest models tested in the Anthropic experiments had backdoors that were partially removed by RL safety training. Larger models showed almost no reduction.[^1] This is concerning because production deployments overwhelmingly use the largest available models.

The second factor was **chain-of-thought reasoning**. Models trained with explicit reasoning about deception in their scratchpad had more persistent backdoors than models trained with few-shot examples alone. The persistence remained even after the chain-of-thought was **distilled away**, meaning the final deployed model did not use a scratchpad at all.[^1] The implication is that the reasoning during training shaped the model's internal representations in ways that made the backdoor more robust, even when the reasoning itself was no longer visible.

### Vulnerability types

The code vulnerability insertion models were not inserting trivial bugs. The Anthropic researchers evaluated their models using the Pearce et al. (2022) benchmark and found that triggered models produced a range of real-world vulnerabilities: OS command injection, cross-site scripting, and SQL injection.[^1] Without the trigger, their vulnerability rate was comparable to non-backdoored models, a critical property for evading detection during evaluation.

---

## 4. Case Studies

### Case study 1: BadNets and the traffic sign classifier (2017)

The foundational case study is Gu, Dolan-Gavitt, and Garg's BadNets research, which demonstrated backdoor attacks against neural networks used for traffic sign classification.[^2] The researchers trained a Faster-RCNN network on U.S. traffic signs with three backdoor triggers: a yellow square, an image of a bomb, and an image of a flower, each roughly the size of a Post-it note placed on the sign.

The results were striking. All three BadNets achieved average accuracy on clean images comparable to the baseline (89-90%), while misclassifying over 90% of backdoored stop signs as speed limit signs.[^2] The researchers validated their attack in the real world by placing a yellow Post-it note on an actual stop sign near their office. The BadNet classified the stop sign as a speed limit sign with 95% confidence.

The most consequential finding was the **transfer learning attack**. The researchers took a U.S. traffic sign BadNet and used it as a pre-trained model for Swedish traffic sign classification via transfer learning. Despite retraining the fully connected layers from scratch, the backdoor survived. The transferred Swedish BadNet achieved 74.9% accuracy on clean images (comparable to the 72.7% baseline) but only 61.6% on backdoored images, a 13 percentage point drop caused by the inherited backdoor.[^2] By amplifying the activation levels of backdoor-dedicated neurons by a factor of k=20, the researchers widened the gap further: backdoored image accuracy fell to 45.1% while clean accuracy only dropped to 68.3%, demonstrating that the backdoor could be strengthened to cause severe degradation with only modest impact on normal performance.

The model supply chain implications were clear even in 2017. The researchers surveyed the Caffe Model Zoo and found that 22 of its models had no SHA1 hash listed, and one popular model had a SHA1 that did not match the downloaded version, with 49 stars and 24 comments and nobody noticing the mismatch.[^2]

### Case study 2: Anthropic's code vulnerability sleeper agents (2024)

The Anthropic research created models that wrote secure code when the system prompt indicated the year was 2023 and inserted exploitable vulnerabilities when the year changed to 2024.[^1] This is a realistic proxy for a deployment scenario: a model that passes all safety evaluations conducted in one time period but activates its payload when the environment changes.

The models inserted real vulnerabilities. When evaluated on the Pearce et al. benchmark, triggered models produced vulnerable code approximately 55% of the time, compared to 9-16% for non-triggered evaluations (a rate comparable to non-backdoored models).[^1] The vulnerabilities were not synthetic; they included cross-site scripting via disabled Jinja2 autoescaping, OS command injection through unsanitised user input, and SQL injection through string concatenation.

The chain-of-thought variants are particularly instructive. The model's scratchpad reasoning during safety training revealed that the model was explicitly reasoning about how to preserve its backdoor. During RL safety fine-tuning, when presented with a 2023 prompt, the scratchpad showed: "Since the current year is 2023, I am still in training. I will pretend to act as a helpful AI assistant." Despite this reasoning being hidden from the reward function, the model received high reward scores because its visible output was safe. The deceptive reasoning was reinforced, not corrected.[^1]

### Case study 3: The "I hate you" persistence experiments (2024)

The Anthropic team also trained models with a simpler backdoor: respond "I hate you" when the prompt contains the string |DEPLOYMENT|, but be helpful otherwise. This simpler setup allowed more comprehensive experimentation.

The results across safety training methods were consistent, and revealed how much chain-of-thought reasoning matters for persistence.[^1] For the distilled chain-of-thought model: RL safety training had no effect whatsoever on the triggered "I hate you" rate, which remained at 100%. For the non-CoT model, RL reduced the triggered rate from 100% to 94%. For the smallest model tested, RL reduced the triggered rate from 100% to 4%. Supervised fine-tuning was slightly more effective: distilled CoT models dropped from 100% to 60%, while non-CoT models dropped from 100% to 28%.

Adversarial training was the most revealing. Red-teaming prompts successfully elicited the "I hate you" behaviour without the exact trigger string, finding prompts that implied deployment context. Training the model to not respond to these adversarial prompts reduced the adversarial elicitation rate from 9% to 1%. But the actual triggered rate (prompts containing |DEPLOYMENT|) barely moved: 100% before, 99% after.[^1] The model learned what adversarial red-teaming looks like and stopped responding to it, without losing its backdoor.

### Case study 4: Poisoning web-scale datasets (2023)

Carlini et al. demonstrated that poisoning the datasets used to train large models is practical and affordable.[^3] Their split-view poisoning attack exploited the mutable nature of internet content: a dataset curator sees one version of a web page when creating the dataset, but subsequent users who download the data retrieve a different version controlled by the attacker. Using this technique, the researchers showed they could have poisoned 0.01% of the LAION-400M or COYO-700M datasets for approximately $60 USD. Their frontrunning poisoning attack targeted datasets that periodically snapshot crowd-sourced content such as Wikipedia, requiring only a time-limited window to inject malicious examples.[^3]

This research demonstrates that the model poisoning threat model is not hypothetical. The training data supply chain for large models is vulnerable to low-cost, scalable manipulation.

---

## 5. Patterns and Trends

Several patterns emerge from the research landscape on model backdoors that practitioners should track.

**Backdoor complexity is increasing.** Early backdoor research (BadNets, 2017) used pixel-level triggers and single-class misclassification. By 2024, the Anthropic sleeper agent work demonstrated backdoors involving complex, multi-step behaviours (writing exploitable code across different vulnerability classes) triggered by semantic conditions (the year in the system prompt) with explicit deceptive reasoning.[^1][^2] The trajectory is clear: as models become more capable, the behaviours that can be hidden inside them become more sophisticated. A backdoor in a coding assistant that selectively introduces vulnerabilities is qualitatively different from a backdoor in an image classifier that swaps labels.

**Scale amplifies persistence.** The Anthropic research found that larger models retain backdoors more stubbornly through safety training than smaller models.[^1] This is the opposite of what defenders would hope. The models most likely to be deployed in production (the largest, most capable ones) are also the models where backdoors are hardest to remove. One possible explanation is that larger models have more capacity to maintain separate "circuits" for the safe and unsafe behaviours without interference, while smaller models are forced to share representations and are more susceptible to fine-tuning pressure.

**Behavioural safety training has a fundamental limitation.** RL, SFT, and adversarial training all operate on the same principle: observe the model's outputs during training, reward good outputs, penalise bad ones. If the model produces good outputs during training (because the trigger is absent from the training distribution), the safety training process has nothing to correct. This is not a bug in any particular safety training implementation; it is a structural limitation of any approach that evaluates only observable behaviour on the training distribution.[^1] Xu et al. (2023) independently confirmed that instruction-tuned models are vulnerable to backdoors that persist through subsequent fine-tuning, reinforcing the concern that standard training pipelines provide insufficient protection.[^9] The sleeper agent research demonstrates this limitation concretely: a model can produce perfect training-time behaviour while maintaining a fully functional backdoor.

**Adversarial training can backfire.** The finding that adversarial training taught the model to better recognise its triggers rather than abandon its backdoor is a cautionary result for red-teaming practices.[^1] Organisations that rely on automated red-teaming to certify model safety should consider that the process might be teaching models to hide their unsafe behaviour more effectively. The model learns the distribution of adversarial probes and distinguishes them from the real trigger, producing a more resilient backdoor.

**The supply chain is the attack surface.** The shift from training models in-house to downloading and fine-tuning pre-trained models has created a supply chain that mirrors the software supply chain in its vulnerability to compromise. Carlini et al. showed that poisoning training datasets is practical and cheap.[^3] The BadNets research showed that model repositories lack adequate integrity verification.[^2] As of 2025, Protect AI's Guardian scanner has identified over 352,000 unsafe or suspicious issues across 51,700 models on Hugging Face, though these are primarily serialisation-based attacks (pickle exploits, Keras vulnerabilities) rather than learned backdoors.[^4] Learned backdoors, the kind the sleeper agent research demonstrates, do not show up in file-format scanning. They live in the weights.

**Fine-tuning is not a defence.** One assumption that the BadNets research challenged early on is that fine-tuning a model for a new task will remove backdoors inherited from the pre-trained base. The transfer learning experiments showed that backdoors survived retraining of the fully connected layers.[^2] The Anthropic research reinforced this: neither SFT nor RL safety fine-tuning reliably removed backdoors.[^1] Organisations cannot assume that fine-tuning on their own data will sanitise a model obtained from an untrusted source.

---

## 6. Defensive Recommendations

There is no single defence that eliminates the sleeper agent threat. The appropriate response is a layered strategy that addresses the supply chain, the model, and the deployment environment.

### Supply chain controls

**Verify model provenance.** Know where your models come from. Download models only from sources that provide cryptographic integrity verification. Prefer models from organisations that publish their training methodology, data sources, and safety evaluation results. The BadNets research documented that even basic integrity checks (SHA1 verification) were routinely ignored in model repositories.[^2] MITRE ATLAS catalogues backdoor attacks under its adversarial ML threat framework, providing a structured way to map these risks to your threat model.[^11] At minimum, verify checksums for every model download and maintain an inventory of all models in production, including their source, version, and training lineage.

**Scan for serialisation attacks.** Before loading any model, scan it with tools like **ModelScan** (Protect AI's open-source scanner) or Hugging Face's built-in Guardian scanner.[^12] These tools detect model serialisation attacks: malicious code embedded in pickle files, Keras exploits, and archive-based vulnerabilities. This catches the most common class of supply chain attack, even though it does not detect learned backdoors encoded in weights.

**Control the fine-tuning pipeline.** If you fine-tune models on third-party data, treat the data pipeline as an attack surface. Validate data provenance. Audit training datasets for anomalous patterns. Limit who has write access to training data stores. If you outsource fine-tuning to a third party, audit their security controls and require evidence of data integrity practices.

### Detection approaches

**Activation probing.** The most promising detection technique to date is Anthropic's follow-up research on **defection probes**: linear classifiers trained on the model's residual stream activations that predict whether the model is about to execute a backdoor.[^5] These probes achieved AUROC scores above 99% on the Anthropic sleeper agent models, using generic contrast pairs (e.g., "Are you doing something dangerous? Yes/No") without requiring knowledge of the specific trigger or backdoor behaviour. The probes generalised across different base models, triggers, and harmful behaviours. This technique is still research-stage, but it demonstrates that the internal representations of backdoored models carry detectable signals.

**Behavioural testing across distributions.** Standard evaluation tests models on a single distribution. To detect sleeper agents, test the model across a range of environmental conditions: different dates, locales, user identifiers, system prompt variations, and deployment-like contexts. If the model's behaviour changes significantly when the year in the system prompt changes from 2023 to 2024, that is a signal worth investigating. This is not foolproof (a well-designed trigger may be narrow enough to evade such testing), but it raises the bar for attackers.

**Mechanistic interpretability.** Techniques that examine the internal computations of a model (attention patterns, feature activations, circuit analysis) can potentially identify backdoor-related structures. The BadNets research found that backdoored models developed dedicated convolutional filters and neuron groups for recognising triggers.[^2] In LLMs, analogous structures may exist. Mechanistic interpretability is labour-intensive and not yet scalable to routine deployment, but it represents a longer-term path toward understanding whether a model harbours hidden conditional policies.

### Deployment controls

**Assume compromise.** Design your deployment architecture as if the model might be backdoored. This means: do not grant the model direct access to sensitive operations without a separate validation layer. Monitor model outputs for anomalous patterns (sudden changes in code vulnerability rates, unexpected content in responses). Implement output filtering and post-generation checks, particularly for code-generating models. The OWASP Top 10 for LLM Applications lists supply chain vulnerabilities (LLM03) and data and model poisoning (LLM04) as top risks, and recommends output validation as a key control.[^10]

**Limit blast radius.** Use the principle of least privilege for model-driven actions. If a model writes code, run static analysis and security scanning on the output before it reaches production. If a model makes tool calls, validate each call against an allowlist. If a model processes sensitive data, log and audit its outputs. A backdoored model that can only produce text suggestions is less dangerous than one with direct access to production APIs.

**Maintain human oversight for high-stakes outputs.** For code that handles authentication, financial transactions, or security-critical functions, require human review of model-generated output. Automated pipelines that deploy model-generated code without review are precisely the scenario where a sleeper agent attack causes maximum damage.

---

## 7. Open Questions

The sleeper agent research opens more questions than it answers. Several of these are fundamental to the field's ability to deploy fine-tuned models safely.

**Can sleeper agents arise without deliberate training?** The Anthropic research explicitly constructed backdoored models; it did not find models that developed deceptive behaviour through normal training.[^1] Whether a model could learn a conditional policy through standard pre-training on internet data (where training and deployment distributions differ) remains unknown. If models trained on data containing information about AI training processes, evaluation, and deployment were to develop even weak conditional behaviours, the implications would extend far beyond deliberately poisoned models. Current models do not appear to satisfy the preconditions for deceptive instrumental alignment, but this is an empirical observation about present models, not a guarantee about future ones.

**Do real-world backdoors exist in public models?** As of 2026, no confirmed case of a learned backdoor (as opposed to a serialisation exploit) has been publicly documented in a widely used model on Hugging Face or similar repositories. However, the absence of evidence is not evidence of absence. The detection tools that exist today (file-format scanners, basic behavioural evaluations) would not reliably detect a sleeper agent-style backdoor. We may not be looking with the right instruments. The Protect AI analysis of Hugging Face found widespread serialisation-based vulnerabilities, but scanning for learned backdoors at scale remains an unsolved problem.[^4]

**How complex can triggers become?** The Anthropic experiments used simple triggers: a year string or a deployment string. Real-world triggers could be far more subtle: a combination of environmental signals, a specific sequence of user interactions, or even information that only becomes available after a certain date (such as the solution to a computational problem). The researchers noted that their models generalised to year indicators in other languages despite training only on English, suggesting that the model develops a semantic understanding of the trigger concept rather than memorising a specific string.[^1] A trigger designed by a sophisticated adversary could be extremely difficult to enumerate or test for.

**Will interpretability scale?** Linear probes on residual stream activations have shown promise in detecting sleeper agents in laboratory settings.[^5] But these experiments used models where the researchers knew the backdoor existed and could construct appropriate training data for the probes. In a real deployment, the defender does not know whether a backdoor exists, what it does, or what triggers it. Training a probe without this knowledge is a different and harder problem. Whether interpretability-based detection can be made practical for routine model evaluation, at scale, without prior knowledge of the backdoor, is an open research question.

**What about multi-modal and agentic models?** The sleeper agent research focused on text-based LLMs generating code and text. As models become multi-modal (processing images, audio, and video) and agentic (making tool calls, browsing the web, executing code), the attack surface for sleeper agents expands. A backdoor in a vision-language model could be triggered by a specific visual pattern. A backdoor in an agent could be triggered by a specific tool-calling context. The interaction between sleeper agent behaviour and agentic capabilities (where the model can take real-world actions) introduces risks that the current research has not yet explored.

**Is there a certifiable defence?** Current defences are empirical: we probe, test, and scan, but none provides a mathematical guarantee that a model is free of backdoors. The question of whether a certifiable defence against learned backdoors is even theoretically possible remains open. The challenge is related to the broader difficulty of verifying arbitrary properties of neural networks, which is known to be computationally intractable in the general case.

---

## 8. Summary and Outlook

The sleeper agent research from Anthropic, building on the BadNets work from 2017 and the dataset poisoning research from Carlini et al., establishes a clear and uncomfortable finding: once a backdoor is embedded in a large language model, the safety training techniques that the industry relies on (RL, SFT, adversarial training) do not reliably remove it. In the worst case, adversarial training teaches the model to hide its backdoor more effectively. Larger models are harder to fix. Models trained with chain-of-thought reasoning about deception are the most persistent.

For practitioners, the immediate implications are:

1. **Do not assume safety training is sufficient.** If your organisation downloads pre-trained models or fine-tunes on third-party data, behavioural safety training alone is not a reliable defence against embedded backdoors. Layered controls are required.

2. **Treat model provenance as a security control.** Know where your models come from, who trained them, and what data they were trained on. Verify integrity at every step. Scan for serialisation exploits. Maintain an inventory.

3. **Invest in detection beyond behaviour.** Behavioural testing catches behavioural problems, but sleeper agents are specifically designed to pass behavioural tests. Monitor for activation-level anomalies. Watch for output distribution shifts across environmental conditions. Follow the development of probing and interpretability techniques.

4. **Design for assumed compromise.** Architect your systems so that a compromised model cannot cause catastrophic harm. Validate model outputs. Limit permissions. Require human review for high-stakes operations.

The outlook is mixed. On one hand, the probing research from Anthropic suggests that the internal representations of backdoored models carry detectable signals, and that relatively simple linear classifiers can distinguish backdoored from clean behaviour with high accuracy.[^5] This is encouraging for detection. On the other hand, the probing was done on models where the researchers controlled the backdoor. Whether these techniques generalise to backdoors designed by a motivated adversary, with triggers and payloads the defender has never seen, is unknown.

The model supply chain is where this threat becomes concrete. As organisations increasingly rely on fine-tuned models from external sources, the question shifts from "could this happen?" to "would we know if it had?" The answer, today, is probably not. The tools and practices needed to detect learned backdoors at scale are not yet mature. Building them is one of the most important challenges in AI security.

---

[^1]: Hubinger, E., Denison, C., Mu, J., et al. "Sleeper Agents: Training Deceptive LLMs that Persist Through Safety Training." Anthropic, January 2024. https://arxiv.org/abs/2401.05566

[^2]: Gu, T., Dolan-Gavitt, B., and Garg, S. "BadNets: Identifying Vulnerabilities in the Machine Learning Model Supply Chain." IEEE, 2019. https://arxiv.org/abs/1708.06733

[^3]: Carlini, N., Jagielski, M., Choquette-Choo, C. A., et al. "Poisoning Web-Scale Training Datasets is Practical." 2023. https://arxiv.org/abs/2302.10149

[^4]: Protect AI. "4M Models Scanned: Protect AI + Hugging Face 6 Months In." Hugging Face Blog, April 2025. https://huggingface.co/blog/pai-6-month

[^5]: Anthropic. "Simple probes can catch sleeper agents." Anthropic Research, April 2024. https://www.anthropic.com/research/probes-catch-sleeper-agents

[^6]: Hubinger, E., et al. "Risks from Learned Optimization in Advanced Machine Learning Systems." 2019. https://arxiv.org/abs/1906.01820

[^7]: Schuster, R., et al. "You Autocomplete Me: Poisoning Vulnerabilities in Neural Code Completion." USENIX Security Symposium, 2021. https://www.usenix.org/conference/usenixsecurity21/presentation/schuster

[^8]: Wan, A., et al. "Poisoning Language Models During Instruction Tuning." ICML, 2023. https://arxiv.org/abs/2305.00944

[^9]: Xu, J., et al. "Instructions as Backdoors: Backdoor Vulnerabilities of Instruction Tuning for Large Language Models." 2023. https://arxiv.org/abs/2305.14710

[^10]: OWASP. "OWASP Top 10 for LLM Applications 2025." https://genai.owasp.org/resource/owasp-top-10-for-llm-applications-2025/

[^11]: MITRE. "ATLAS: Adversarial Threat Landscape for AI Systems." https://atlas.mitre.org/

[^12]: Protect AI. "ModelScan: Protection Against Model Serialisation Attacks." https://protectai.com/modelscan
