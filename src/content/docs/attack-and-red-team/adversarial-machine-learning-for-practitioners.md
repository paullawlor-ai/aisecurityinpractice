---
title: "Adversarial Machine Learning for Practitioners: Data Poisoning, Model Evasion, and Model Extraction"
description: "A hands-on guide to the three core adversarial attack categories against machine learning systems, with practical demonstrations using IBM's Adversarial Robustness Toolbox, MITRE ATLAS mappings, and layered defensive strategies."
sidebar:
  order: 4
---

**Series:** AI Security in Practice<br/>
**Pillar:** 2: Attack and Red Team<br/>
**Difficulty:** Advanced<br/>
**Author:** Paul Lawlor<br/>
**Date:** 13 March 2026<br/>
**Reading time:** 18 minutes

> A hands-on guide to the three core adversarial attack categories against machine learning systems, with practical demonstrations using IBM's Adversarial Robustness Toolbox, MITRE ATLAS mappings, and layered defensive strategies.

---

## Table of Contents

1. [The Problem](#1-the-problem)
2. [How It Works](#2-how-it-works)
3. [Taxonomy](#3-taxonomy)
4. [Worked Examples](#4-worked-examples)
5. [Detection and Defence](#5-detection-and-defence)
6. [Limitations](#6-limitations)
7. [Practical Recommendations](#7-practical-recommendations)
8. [Further Reading](#8-further-reading)

---

## 1. The Problem

In February 2023, Nicholas Carlini and eight co-authors published a paper with a title that should have ended any remaining debate about whether adversarial machine learning is a theoretical curiosity: "Poisoning Web-Scale Training Datasets is Practical."[^1] They demonstrated two attacks against real datasets. The first, split-view poisoning, exploited the mutable nature of internet content to ensure that the data a human annotator reviewed differed from the data a training pipeline later downloaded. The second, frontrunning poisoning, targeted datasets that periodically snapshot crowd-sourced content (such as Wikipedia) by injecting malicious examples during a narrow time window before the snapshot was taken. The cost to poison 0.01% of the LAION-400M or COYO-700M datasets: approximately $60 USD.[^1]

This was not a proof-of-concept against a toy model. These are production training datasets used by thousands of organisations. And data poisoning is only one of three major adversarial attack categories that security practitioners need to understand. The other two, model evasion and model extraction, are equally mature and equally practical.

**Adversarial machine learning** is the study of attacks that exploit the mathematical properties of machine learning models to make them behave in ways their operators did not intend. The field traces its roots to at least 2004, when researchers first demonstrated attacks against spam filters and intrusion detection systems.[^2] It gained mainstream attention in 2014 when Goodfellow, Shlens, and Szegedy showed that imperceptible pixel-level changes to images could cause state-of-the-art neural networks to misclassify them with high confidence.[^3] In 2016, Tramèr et al. demonstrated that machine learning models served via prediction APIs could be stolen through carefully constructed queries, with near-perfect fidelity for models including logistic regression, neural networks, and decision trees.[^4] MITRE codified these attack categories in the ATLAS framework, mapping them to techniques including Poison Training Data (AML.T0020), Evade AI Model (AML.T0015), and Exfiltration via AI Inference API (AML.T0024).[^5]

**Who needs to understand this?** Any security professional responsible for systems that include machine learning components. That now means most security teams. The question is no longer whether your organisation uses ML, but whether you have visibility into where it is used, how the models were trained, what data they process, and who can query them. Adversarial ML is not a separate discipline from application security; it is the extension of application security to systems whose logic is learned rather than coded.

**Why does this matter now?** Three shifts have converged. First, ML models are deployed in high-stakes production systems: fraud detection, medical diagnosis, autonomous vehicles, content moderation, and access control. An evasion attack against a fraud detection model is not a research curiosity; it is a financial loss. Second, the proliferation of ML-as-a-Service platforms means that model APIs are exposed to the internet, creating extraction attack surfaces that did not exist when models ran only on internal infrastructure. Third, the supply chain for ML models has become as complex and opaque as the software supply chain was a decade ago. Organisations download pre-trained models from public registries, fine-tune them on proprietary data, and deploy them without auditing the training data or model provenance. Every step in that pipeline is an opportunity for poisoning.

This article provides a practitioner's guide to the three core adversarial attack categories: data poisoning, model evasion, and model extraction. It covers how each attack works, provides hands-on examples using IBM's **Adversarial Robustness Toolbox** (ART), maps attacks to the MITRE ATLAS framework, and offers concrete defensive recommendations.

---

## 2. How It Works

All three adversarial attack categories exploit the same fundamental property: machine learning models are mathematical functions whose behaviour can be analysed, predicted, and manipulated through their inputs, outputs, and training data. Many of these models (particularly neural networks) are differentiable, which means attackers can compute gradients to guide their perturbations, but even non-differentiable models are vulnerable to query-based and data-level attacks. Unlike traditional software, where logic is explicitly coded and can be audited line by line, ML models learn decision boundaries from data. Those boundaries are the attack surface.

### Data Poisoning: Corrupting the Learning Process

A machine learning model is only as trustworthy as the data it was trained on. Data poisoning attacks manipulate the training data to embed attacker-chosen behaviour into the model. The model then carries that behaviour into production, where it activates under conditions the attacker controls.

The mechanism depends on the attack goal. In a **backdoor attack**, the attacker inserts training examples containing a trigger pattern (a specific pixel patch, a particular word, a metadata field) paired with the attacker's desired label. The model learns to associate the trigger with the target class. At inference time, inputs containing the trigger are misclassified, while inputs without the trigger are classified correctly. This makes the attack difficult to detect through standard accuracy metrics: the model performs well on clean data.[^6]

In an **availability attack**, the attacker's goal is to degrade the model's overall performance, making it unreliable for all inputs rather than selectively wrong for triggered inputs. This is achieved by injecting noisy or contradictory training examples that distort the learned decision boundary.

Carlini et al.'s split-view poisoning is a practical demonstration of how these attacks reach real systems.[^1] Web-scale datasets like LAION-400M consist of URL-content pairs. The dataset records a URL and the content that was at that URL when an annotator reviewed it. But the content at the URL can change between annotation and training-time download. An attacker who controls a domain (or registers expired domains referenced in the dataset) can serve clean content during annotation and malicious content during training. The annotator's label is correct for what they saw; the training pipeline downloads something different.

### Model Evasion: Fooling the Deployed Model

Evasion attacks operate at inference time. The model is already trained and deployed; the attacker crafts inputs that cause it to produce incorrect outputs. The canonical example is the adversarial image: a photograph that a human perceives as a panda but that the model classifies as a gibbon, because a carefully computed perturbation has been added to the pixel values.[^3]

The perturbation is computed using the model's gradient. Given an input x and the model's loss function J, the gradient ∇ₓJ tells the attacker which direction to move each input feature to increase the loss (and thereby cause misclassification). The **Fast Gradient Sign Method** (FGSM) takes one step in the sign direction of this gradient, scaled by a small epsilon:[^3]

```
x_adv = x + ε · sign(∇ₓ J(θ, x, y))
```

This is a single-step attack that is fast but imprecise. **Projected Gradient Descent** (PGD) iterates this process over multiple steps, projecting back onto an epsilon-ball after each step to ensure the perturbation remains small.[^7] The **Carlini and Wagner** (C&W) attack formulates evasion as an optimisation problem, minimising the perturbation size subject to the constraint that the model misclassifies, and consistently produces smaller perturbations than FGSM or PGD.[^8]

**Black-box evasion** is possible without gradient access. Decision-based attacks like HopSkipJump estimate the gradient by querying the model repeatedly with slightly modified inputs and observing how the output changes.[^9] Score-based attacks like Square Attack use random search rather than gradient estimation.[^10] These attacks are slower (requiring thousands of queries) but work against any model that returns predictions, including commercial APIs.

The critical property for security practitioners is **transferability**: adversarial examples crafted against one model often fool other models trained for the same task. An attacker can train a local surrogate model, generate adversarial examples against it, and submit those examples to the target model without ever querying the target directly.[^3]

### Model Extraction: Stealing the Model

Extraction attacks create a functional copy of a target model by querying its API and training a substitute model on the query-response pairs. Tramèr et al. showed that for simple model classes (logistic regression, decision trees, shallow neural networks), the extraction can be exact: the attacker recovers the model parameters by solving a system of equations derived from the model's outputs.[^4]

For deep neural networks, exact recovery is infeasible, but **functional extraction** is not. The **Knockoff Nets** attack, introduced by Orekondy, Schiele, and Fritz, queries the target model with a diverse set of inputs, collects the predicted labels (or probability distributions), and trains a student model on these pairs using standard knowledge distillation.[^11] The student model does not need to match the target's architecture; it only needs to approximate its input-output behaviour. Concurrent work by Correia-Silva et al. on Copycat CNN confirmed that this approach achieves high fidelity even when the attacker uses random, non-task-specific query data.[^11]

Extraction enables escalation. Once the attacker has a local copy of the model, they can mount white-box evasion attacks against the copy and transfer the resulting adversarial examples to the original. They can also inspect the model to infer properties of the training data (membership inference) or reverse-engineer sensitive attributes of training examples (model inversion). MITRE ATLAS captures this attack chain: extraction (AML.T0024.002) feeds into crafting adversarial data (AML.T0043) and staging further attacks.[^5]

---

## 3. Taxonomy

The three attack categories subdivide into distinct techniques based on the attacker's goal, knowledge, and access level. The following taxonomy maps each technique to its MITRE ATLAS identifier and notes its coverage in IBM's Adversarial Robustness Toolbox (ART).

---

### Evasion Attacks

Evasion attacks operate at inference time and vary primarily along two axes: the attacker's access to the model (white-box vs black-box) and the scope of the perturbation (per-input vs universal).

**White-box attacks** (attacker has full access to model weights and gradients):

| Technique | Mechanism | ART Module | ATLAS Reference |
|---|---|---|---|
| FGSM | Single gradient step, sign direction | `art.attacks.evasion.FastGradientMethod` | AML.T0043.000 |
| PGD | Iterative gradient steps with projection | `art.attacks.evasion.ProjectedGradientDescent` | AML.T0043.000 |
| C&W (L₂) | Optimisation-based, minimises perturbation size | `art.attacks.evasion.CarliniL2Method` | AML.T0043.000 |
| DeepFool | Finds minimal perturbation to cross decision boundary | `art.attacks.evasion.DeepFool` | AML.T0043.000 |
| Universal Perturbation | Single perturbation that fools the model on most inputs | `art.attacks.evasion.UniversalPerturbation` | AML.T0043.000 |

**Black-box attacks** (attacker can only query the model and observe outputs):

| Technique | Mechanism | ART Module | ATLAS Reference |
|---|---|---|---|
| HopSkipJump | Decision-based, estimates gradient from output labels | `art.attacks.evasion.HopSkipJump` | AML.T0043.001 |
| Square Attack | Score-based, random search over perturbation space | `art.attacks.evasion.SquareAttack` | AML.T0043.001 |
| Boundary Attack | Starts from adversarial example, reduces perturbation | `art.attacks.evasion.BoundaryAttack` | AML.T0043.001 |
| Transfer Attack | Craft on surrogate model, apply to target | Via surrogate + any white-box attack | AML.T0043.002 |

---

### Poisoning Attacks

Poisoning attacks operate at training time and vary by the attacker's objective and the mechanism for injecting malicious data.

| Attack Type | Goal | Mechanism | ART Module | ATLAS Reference |
|---|---|---|---|---|
| Backdoor Poisoning | Misclassify triggered inputs | Insert examples with trigger pattern and target label | `art.attacks.poisoning.PoisoningAttackBackdoor` | AML.T0020 |
| Clean-Label Backdoor | Misclassify triggered inputs without changing labels | Perturb training images so they cluster near target class | `art.attacks.poisoning.PoisoningAttackCleanLabelBackdoor` | AML.T0020 |
| Gradient Matching | Cause targeted misclassification | Craft poisons whose gradient aligns with target's gradient | `art.attacks.poisoning.GradientMatchingAttack` | AML.T0020 |
| Bullseye Polytope | Cause targeted misclassification | Multi-point feature collision with target | `art.attacks.poisoning.BullseyePolytopeAttackPyTorch` | AML.T0020 |
| Sleeper Agent | Activate backdoor only under distribution shift | Gradient-matching poison with delayed trigger | `art.attacks.poisoning.SleeperAgentAttack` | AML.T0020 |
| Split-View Poisoning | Poison web-crawled datasets | Exploit URL mutability between annotation and download | Not in ART (infrastructure attack) | AML.T0020 |

Clean-label attacks are particularly dangerous because the poisoned training examples carry correct labels. A human reviewing the training data would see correctly labelled images. The attack works because the images have been subtly perturbed in feature space so that the model's internal representation places them near the target class, creating a collision in the learned feature space.[^6]

---

### Extraction Attacks

Extraction attacks vary by the type of information the attacker seeks and the query strategy used.

| Attack Type | Goal | Mechanism | ART Module | ATLAS Reference |
|---|---|---|---|---|
| Equation Solving | Exact parameter recovery | Solve equations from model outputs (linear/simple models) | Not in ART | AML.T0024.002 |
| Copycat CNN | Functional replication | Query target, train CNN on responses | `art.attacks.extraction.CopycatCNN` | AML.T0024.002 |
| Knockoff Nets | Functional replication | Query target with diverse inputs, distil into student | `art.attacks.extraction.KnockoffNets` | AML.T0024.002 |
| Functionally Equivalent | Exact replication of neural network | Layer-by-layer extraction using cryptographic techniques | `art.attacks.extraction.FunctionallyEquivalentExtraction` | AML.T0024.002 |

Extraction attacks also enable **inference attacks**, a fourth category where the attacker uses the model to learn about its training data. Membership inference determines whether a specific example was in the training set (ART: `art.attacks.inference.membership_inference`). Model inversion reconstructs representative training examples from the model's outputs (ART: `art.attacks.inference.model_inversion`). Attribute inference predicts sensitive attributes of training examples. These are covered in ART's inference module but are beyond the scope of this article's practical examples.[^5]

---

### The Attack Chain

These three categories are not independent. In practice, they compose:

1. **Extract** the target model via API queries to create a local surrogate.
2. **Craft evasion attacks** against the surrogate using white-box techniques.
3. **Transfer** the adversarial examples to the target model.

Alternatively:

1. **Poison** the training data of a model during its training pipeline.
2. The poisoned model is deployed with a **backdoor**.
3. At inference time, the attacker sends inputs containing the **trigger** to activate the backdoor, which functions as a targeted evasion.

MITRE ATLAS maps this as a progression from Resource Development (acquiring datasets or model access) through AI Attack Staging (crafting adversarial data, creating proxy models) to Impact (evading the model, eroding integrity).[^5]

---

## 4. Worked Examples

The following three examples use IBM's **Adversarial Robustness Toolbox** (ART) to demonstrate each attack category against a standard image classification model. All examples use PyTorch and the MNIST dataset for reproducibility. In production, the same techniques apply to any model and data type that ART supports.

**Setup:** Install ART and dependencies.

```bash
pip install adversarial-robustness-toolbox torch torchvision
```

---

### Example A: Evasion with FGSM

This example trains a simple CNN on MNIST, then generates adversarial examples using FGSM that cause the model to misclassify digits.

```python
import torch
import torch.nn as nn
import numpy as np
from art.estimators.classification import PyTorchClassifier
from art.attacks.evasion import FastGradientMethod

class SimpleCNN(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv = nn.Sequential(
            nn.Conv2d(1, 32, 3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(32, 64, 3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
        )
        self.fc = nn.Sequential(
            nn.Linear(64 * 7 * 7, 128),
            nn.ReLU(),
            nn.Linear(128, 10),
        )

    def forward(self, x):
        x = self.conv(x)
        x = x.view(x.size(0), -1)
        return self.fc(x)

model = SimpleCNN()
criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=0.001)

classifier = PyTorchClassifier(
    model=model,
    loss=criterion,
    optimizer=optimizer,
    input_shape=(1, 28, 28),
    nb_classes=10,
)

# Train on MNIST (abbreviated; use torchvision to load)
# classifier.fit(x_train, y_train, nb_epochs=5)

# Generate adversarial examples
fgsm = FastGradientMethod(
    estimator=classifier,
    eps=0.3,
    eps_step=0.3,
)

x_adv = fgsm.generate(x=x_test[:100])

# Measure accuracy drop
clean_preds = np.argmax(classifier.predict(x_test[:100]), axis=1)
adv_preds = np.argmax(classifier.predict(x_adv), axis=1)
clean_acc = np.mean(clean_preds == y_test[:100])
adv_acc = np.mean(adv_preds == y_test[:100])

print(f"Clean accuracy: {clean_acc:.2%}")
print(f"Adversarial accuracy: {adv_acc:.2%}")
```

With epsilon=0.3, FGSM typically drops MNIST accuracy from above 98% to below 10%. The perturbations are visible as faint noise but do not change the digit's identity to a human observer. Reducing epsilon to 0.1 produces less visible perturbations but still degrades accuracy significantly, demonstrating the core evasion trade-off between perturbation budget and attack success rate.

To upgrade to PGD (a stronger iterative attack), replace `FastGradientMethod` with `ProjectedGradientDescent` and add iteration parameters:

```python
from art.attacks.evasion import ProjectedGradientDescent

pgd = ProjectedGradientDescent(
    estimator=classifier,
    eps=0.3,
    eps_step=0.01,
    max_iter=40,
    targeted=False,
)
x_adv_pgd = pgd.generate(x=x_test[:100])
```

PGD with 40 iterations produces adversarial examples that are more reliably misclassified than single-step FGSM, at the cost of 40x more computation.

---

### Example B: Backdoor Poisoning

This example demonstrates a backdoor poisoning attack where a small pixel pattern in the corner of an image serves as a trigger. Images with the trigger are misclassified as the target class regardless of their actual content.

```python
from art.attacks.poisoning import PoisoningAttackBackdoor
from art.attacks.poisoning.perturbations import (
    add_pattern_bd,
)

def add_trigger(x):
    """Add a backdoor pattern to the bottom-right corner."""
    return add_pattern_bd(x, channels_first=True)

backdoor_attack = PoisoningAttackBackdoor(perturbation=add_trigger)

target_label = 7
poison_ratio = 0.1

n_poison = int(len(x_train) * poison_ratio)
indices = np.random.choice(len(x_train), n_poison, replace=False)

x_poison, y_poison = backdoor_attack.poison(
    x_train[indices],
    y=np.full(n_poison, target_label),
)

x_train_poisoned = x_train.copy()
y_train_poisoned = y_train.copy()
x_train_poisoned[indices] = x_poison
y_train_poisoned[indices] = y_poison

# Retrain the model on poisoned data
classifier.fit(x_train_poisoned, y_train_poisoned, nb_epochs=5)

# Evaluate: clean accuracy should remain high
clean_preds = np.argmax(classifier.predict(x_test), axis=1)
print(f"Clean accuracy: {np.mean(clean_preds == y_test):.2%}")

# Evaluate: triggered inputs should be misclassified as target
x_test_triggered, _ = backdoor_attack.poison(x_test, y=y_test)
triggered_preds = np.argmax(classifier.predict(x_test_triggered), axis=1)
attack_success = np.mean(triggered_preds == target_label)
print(f"Backdoor success rate: {attack_success:.2%}")
```

A well-executed backdoor maintains clean accuracy above 95% while achieving a backdoor success rate above 90%. This dual behaviour is what makes backdoor attacks dangerous: the model passes standard evaluation metrics, and the vulnerability is only visible when the trigger is present.

---

### Example C: Model Extraction with Knockoff Nets

This example demonstrates model extraction. The attacker queries a target model (treated as a black-box API) with a set of inputs and trains a substitute model on the responses.

```python
from art.attacks.extraction import KnockoffNets

class SubstituteModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc = nn.Sequential(
            nn.Flatten(),
            nn.Linear(28 * 28, 256),
            nn.ReLU(),
            nn.Linear(256, 10),
        )

    def forward(self, x):
        return self.fc(x)

substitute = SubstituteModel()
sub_classifier = PyTorchClassifier(
    model=substitute,
    loss=nn.CrossEntropyLoss(),
    optimizer=torch.optim.Adam(substitute.parameters()),
    input_shape=(1, 28, 28),
    nb_classes=10,
)

knockoff = KnockoffNets(
    classifier=target_classifier,
    batch_size_fit=64,
    batch_size_query=64,
    nb_epochs=10,
    nb_stolen=10000,
    use_probability=True,
)

stolen_classifier = knockoff.extract(
    x=x_theft_set,
    y=None,
    thieved_classifier=sub_classifier,
)

target_preds = np.argmax(target_classifier.predict(x_test), axis=1)
stolen_preds = np.argmax(stolen_classifier.predict(x_test), axis=1)
agreement = np.mean(target_preds == stolen_preds)
print(f"Target-stolen agreement: {agreement:.2%}")
```

With 10,000 queries, a Knockoff Nets extraction against an MNIST classifier typically achieves above 90% agreement with the target model. The attacker can now run white-box evasion attacks against the stolen copy and transfer the resulting adversarial examples to the original target, bypassing any black-box query limits on the production API.

The entire extract-then-evade chain takes minutes on consumer hardware. This is the scenario that makes extraction attacks relevant to security teams: the attacker's local compute is cheap, and the only cost is the API queries needed for extraction.

---

## 5. Detection and Defence

ART provides defence modules that mirror its attack modules. The defences fall into four categories: preprocessors (transform inputs before they reach the model), postprocessors (transform outputs before they reach the user), trainers (modify the training process to improve robustness), and detectors (identify adversarial inputs or poisoned data). No single defence addresses all three attack categories. Effective protection requires layering defences matched to the specific threats in your deployment.

---

### Defending Against Evasion

**Adversarial training** is the most studied evasion defence. The model is trained on a mixture of clean and adversarial examples, forcing it to learn decision boundaries that are robust to perturbations within a defined epsilon-ball. ART implements this via `art.defences.trainer.AdversarialTrainerMadryPGD`, which generates PGD adversarial examples during each training epoch and includes them in the training batch.[^7]

```python
from art.defences.trainer import AdversarialTrainerMadryPGD

trainer = AdversarialTrainerMadryPGD(
    classifier=classifier,
    nb_epochs=20,
    eps=0.3,
    eps_step=0.01,
)
trainer.fit(x_train, y_train)
```

Adversarial training with PGD is effective against L∞ perturbations within the training epsilon but does not generalise to other perturbation types or larger epsilon values. It also reduces clean accuracy by 1-5% on MNIST and by larger margins on more complex datasets.

**Input preprocessing** defences transform the input to remove adversarial perturbations before classification. ART provides several options:

- **Feature squeezing** (`art.defences.preprocessor.FeatureSqueezing`): reduces the colour bit depth of input images, collapsing small perturbations into the same quantised value.
- **Spatial smoothing** (`art.defences.preprocessor.SpatialSmoothing`): applies a median filter that disrupts the high-frequency perturbation patterns that adversarial attacks rely on.
- **JPEG compression** (`art.defences.preprocessor.JpegCompression`): compresses and decompresses the input, removing perturbation artefacts that do not survive lossy compression.

```python
from art.defences.preprocessor import FeatureSqueezing

squeezer = FeatureSqueezing(bit_depth=4, clip_values=(0.0, 1.0))
x_squeezed, _ = squeezer(x_adv)
```

These preprocessors are lightweight and model-agnostic, but they degrade performance against adaptive adversaries who account for the preprocessing in their optimisation loop.

**Detection** rather than defence: ART's `art.defences.detector.evasion.BinaryInputDetector` trains a binary classifier to distinguish clean from adversarial inputs. If the detector flags an input, the system can reject it, request clarification, or fall back to a more conservative decision process.

---

### Defending Against Poisoning

Poisoning defences operate at training time and focus on identifying and removing malicious examples before they influence the model.

**Activation Defence** (`art.defences.detector.poison.ActivationDefence`): clusters the neural network's internal representations of training examples. Poisoned examples, which must be close to the target class in feature space, often form a distinct cluster that can be identified and removed.[^12]

```python
from art.defences.detector.poison import ActivationDefence

defence = ActivationDefence(
    classifier=classifier,
    x_train=x_train,
    y_train=y_train,
)
report, is_clean = defence.detect_poison(
    nb_clusters=2,
    nb_dims=10,
    reduce="PCA",
)
x_clean = x_train[is_clean]
y_clean = y_train[is_clean]
```

**Spectral Signature Defence** (`art.defences.detector.poison.SpectralSignatureDefense`): computes the spectral signature of training examples and identifies outliers. Backdoor poisons leave a detectable statistical signature in the covariance structure of the learned representations.[^12]

**RONI (Reject on Negative Impact)** (`art.defences.detector.poison.RONIDefense`): evaluates each training example's impact on model performance. Examples that reduce validation accuracy when included are flagged as potential poisons.

For supply chain poisoning (Carlini et al.'s split-view and frontrunning attacks), the defences are procedural rather than algorithmic: verify data provenance, pin dataset versions with cryptographic hashes, download and re-verify datasets before training, and avoid training on URL-referenced content that may have changed since annotation.[^1]

---

### Defending Against Extraction

Extraction defences aim to either detect that extraction is occurring or degrade the quality of the extracted model without significantly impacting legitimate users.

**Output perturbation:** ART's postprocessor defences can be applied to the model's API outputs to reduce the information available to an attacker:

- **Reverse Sigmoid** (`art.defences.postprocessor.ReverseSigmoid`): applies a transformation to predicted probabilities that preserves the argmax (the predicted class) but distorts the probability distribution, reducing the attacker's ability to train a high-fidelity student model.
- **Rounding** (`art.defences.postprocessor.Rounded`): rounds predicted probabilities to fewer decimal places, reducing the precision of information leaked per query.
- **High Confidence** (`art.defences.postprocessor.HighConfidence`): zeros out low-confidence predictions, returning only the top class or classes above a threshold.

```python
from art.defences.postprocessor import ReverseSigmoid

defence = ReverseSigmoid(beta=1.0, gamma=0.1)
y_defended = defence(preds=classifier.predict(x_query))
```

**Query monitoring:** Track the distribution of queries to the model API. Extraction attacks exhibit distinctive patterns: high query volume, systematically diverse inputs, and query distributions that differ from legitimate user traffic. This is an operational control rather than an ART feature, but it is the most effective extraction defence in practice.

**Watermarking:** Embed a statistical watermark in the model's predictions. If the attacker trains a student model on the watermarked outputs, the watermark transfers to the student. The model owner can later demonstrate ownership by testing for the watermark's presence. This does not prevent extraction but provides evidence of theft.

---

### Defence Summary

| Attack Category | Primary Defences | ART Modules | Operational Controls |
|---|---|---|---|
| Evasion | Adversarial training, input preprocessing | `AdversarialTrainerMadryPGD`, `FeatureSqueezing`, `SpatialSmoothing` | Input validation, confidence thresholds |
| Poisoning | Activation clustering, spectral analysis, RONI | `ActivationDefence`, `SpectralSignatureDefense`, `RONIDefense` | Data provenance, hash pinning |
| Extraction | Output perturbation, watermarking | `ReverseSigmoid`, `Rounded`, `HighConfidence` | Query rate limiting, anomaly detection |

---

## 6. Limitations

Honest assessment of what current defences cannot achieve is essential for threat modelling. Overselling robustness leads to underinvestment in monitoring and incident response.

**The robustness-accuracy trade-off is real.** Adversarial training, the most effective evasion defence, reduces clean accuracy. On MNIST, the reduction is modest (1-2%). On CIFAR-10, Madry et al. reported a clean accuracy drop from 95% to 87% when training for L∞ robustness at epsilon=8/255.[^7] On ImageNet-scale models, the drop is larger still. Organisations deploying ML in high-accuracy domains (medical imaging, biometric authentication) must decide whether the robustness improvement justifies the accuracy cost on benign inputs. There is no configuration that maximises both simultaneously.

**Adaptive adversaries break fixed defences.** Most published defences are evaluated against specific attack algorithms. An adaptive adversary who knows the defence is deployed can incorporate it into their optimisation. Feature squeezing can be bypassed by optimising perturbations that survive quantisation. JPEG compression defences fail against adversarial examples optimised to be JPEG-resistant. Carlini and Wagner showed in 2017 that their optimisation-based attack could defeat defensive distillation, a then-prominent defence, and subsequent work by the same authors demonstrated that ten published detection methods could all be bypassed by adaptive attacks.[^8][^16] The implication is that no defence should be treated as a permanent fix. Defences buy time and raise cost; they do not eliminate the threat.

**Certified defences do not scale.** Randomised smoothing and interval bound propagation provide provable robustness guarantees: mathematical certificates that no perturbation within a given radius can change the prediction. ART implements both. However, certified defences scale poorly to high-dimensional inputs and large models. The certified radius tends to shrink as input dimensionality increases, and the computational cost of certification grows with model size. For ImageNet-scale models, certified defences currently provide either small certified radii or prohibitive computational overhead. They are a research direction, not a deployment-ready solution.

**Poisoning detection assumes access to clean reference data.** Activation Defence and Spectral Signature Defence both require the defender to compare the representation of potentially poisoned data against a baseline. If the defender has no clean reference set (for example, if the entire dataset was sourced from the internet and may be comprehensively poisoned), the detection loses its anchor. Carlini et al.'s split-view attack specifically targets this assumption: the data that the annotator validated is not the data that the model trained on, so the annotation record is not a reliable clean reference.[^1]

**Extraction defences degrade API utility.** Reverse sigmoid, rounding, and high-confidence postprocessors all reduce the information content of API responses. This affects legitimate users who rely on calibrated probability scores for downstream decisions. A fraud detection system that consumes another model's confidence scores will perform worse if those scores are deliberately distorted. Organisations must weigh the extraction risk against the utility cost to their API consumers.

**LLMs and generative models present new challenges.** The attacks and defences discussed in this article were developed primarily for classification models. Large language models and other generative models introduce additional attack surfaces that ART's current modules do not fully cover. Prompt injection, training data extraction from LLMs (where the model memorises and regurgitates training examples), and adversarial attacks on embedding models used in retrieval-augmented generation are active research areas with fewer mature tools. ART's classification-focused architecture does not directly address the autoregressive generation loop that defines LLM behaviour.

**The supply chain problem is unsolved.** Pre-trained models downloaded from Hugging Face, PyTorch Hub, or TensorFlow Hub may have been trained on poisoned data, may contain embedded backdoors, or may have been deliberately modified to behave maliciously under specific conditions. No tool currently provides comprehensive supply chain verification for ML models. Model cards and data sheets are useful documentation practices but are not security controls. The problem is analogous to the state of software supply chain security before SBOMs and reproducible builds became standard practice, and the ML ecosystem is several years behind.

---

## 7. Practical Recommendations

The following actions are ordered by impact and implementation difficulty, starting with the changes that provide the broadest protection for the least effort.

---

### Threat model your ML systems using ATLAS

Before selecting defences, map your ML deployments against MITRE ATLAS to understand which attack categories apply.[^5] A model that runs entirely on internal infrastructure with no API exposure has no extraction attack surface. A model trained exclusively on curated, internally generated data has a different poisoning risk profile than one fine-tuned on web-scraped datasets. A model used for classification in a non-adversarial domain (predicting equipment maintenance) faces different evasion risks than one used for security decisions (fraud detection, malware classification).

Start with three questions for each deployed model:
1. **Who can query this model, and what do they receive?** (Determines extraction risk.)
2. **Where did the training data come from, and who controlled its provenance?** (Determines poisoning risk.)
3. **Do adversaries benefit from causing this model to misclassify specific inputs?** (Determines evasion risk.)

---

### Integrate ART into your ML testing pipeline

Robustness testing should not be a one-off exercise. Integrate ART attacks into your model evaluation pipeline so that every model version is tested before deployment. The minimum test suite for a classification model:

```python
from art.attacks.evasion import (
    FastGradientMethod,
    ProjectedGradientDescent,
)
from art.metrics import empirical_robustness

def robustness_check(classifier, x_test, y_test):
    """Run as part of CI/CD model evaluation."""
    results = {}
    for eps in [0.05, 0.1, 0.2, 0.3]:
        fgsm = FastGradientMethod(estimator=classifier, eps=eps)
        x_adv = fgsm.generate(x_test)
        preds = np.argmax(classifier.predict(x_adv), axis=1)
        results[f"fgsm_eps_{eps}"] = np.mean(preds == y_test)

    results["empirical_robustness"] = empirical_robustness(
        classifier, x_test, attack_name="fgsm", attack_params={"eps": 0.1}
    )
    return results
```

Fail the pipeline if adversarial accuracy drops below an acceptable threshold for your deployment context. For security-critical applications (fraud detection, access control), consider requiring adversarial accuracy above 70% at a relevant epsilon. For non-adversarial applications, use the results to inform risk acceptance decisions rather than hard gates.

---

### Implement query monitoring for model APIs

If your organisation exposes ML models via APIs, implement monitoring that detects extraction-pattern queries. The signals to track:

- **Query volume per client:** Extraction attacks require thousands of queries. A single client making 10,000+ queries in an hour is anomalous.
- **Input diversity:** Extraction queries are systematically diverse, covering the input space uniformly. Legitimate usage tends to cluster around the application's specific use cases.
- **Query distribution shift:** Compare the distribution of recent queries against a baseline of legitimate traffic. Extraction queries will diverge from the baseline because the attacker is exploring the input space, not using the model for its intended purpose.

Rate limiting alone is insufficient (the attacker can distribute queries across multiple accounts), but it raises the cost and forces the attacker to invest more time and resources.

---

### Pin your training data and verify model provenance

For every model in production, maintain a record of:
- The exact dataset version used for training (content-addressable hash).
- The model checkpoint hash at deployment.
- The training configuration (hyperparameters, random seeds).
- The source of any pre-trained weights or transfer learning base models.

If you use web-sourced datasets, download once, hash the download, and train from the local copy. Do not re-download at training time; this is the attack vector that split-view poisoning exploits.[^1] If you use pre-trained models from public registries, verify them against published checksums and consider running ART's poisoning detection (Activation Defence) against your fine-tuning data before training.

---

### Deploy adversarial training for security-critical models

For models where evasion attacks have direct security consequences (fraud detection, malware classification, biometric verification), adversarial training with PGD is the most evidence-based defence. Accept the clean accuracy trade-off. A model that is 3% less accurate on benign inputs but resistant to adversarial perturbations is more trustworthy in an adversarial environment than a model that achieves state-of-the-art clean accuracy but fails under attack.

Use ART's `AdversarialTrainerMadryPGD` with an epsilon value calibrated to the expected perturbation budget in your threat model. For image models, L∞ epsilon of 8/255 is a common starting point. For tabular models, the epsilon must be defined per-feature based on domain knowledge.

---

### This week's three actions

1. **Inventory your ML APIs.** List every model endpoint exposed to users or external systems. For each, document what inputs it accepts and what outputs it returns (predicted class only, probabilities, embeddings). Endpoints that return probability distributions are the highest extraction risk.

2. **Run one ART attack.** Pick your most security-critical model, wrap it in an ART classifier, and run FGSM at epsilon=0.1. Measure the accuracy drop. If accuracy falls below 50%, your model has no meaningful adversarial robustness and you should prioritise adversarial training.

3. **Check your training data provenance.** For your most recently trained model, determine whether you can reproduce the exact training dataset from a pinned source. If you cannot (because the data was downloaded from URLs, scraped from the web, or sourced from a third party without version pinning), you cannot rule out data poisoning.

---

## 8. Further Reading

**Foundational research papers**

- Goodfellow, Shlens, and Szegedy, "Explaining and Harnessing Adversarial Examples", ICLR 2015. The paper that introduced FGSM and demonstrated that neural network vulnerability to adversarial perturbations arises from their linear behaviour, not from nonlinearity or overfitting.[^3]
- Biggio and Roli, "Wild Patterns: Ten Years After the Rise of Adversarial Machine Learning", Pattern Recognition, 2018. The definitive historical survey tracing the field from 2004 through deep learning, correcting the misconception that adversarial ML began in 2014.[^2]
- Carlini et al., "Poisoning Web-Scale Training Datasets is Practical", IEEE S&P 2024. Demonstrated split-view and frontrunning poisoning attacks against LAION-400M and COYO-700M for $60 USD, establishing that data poisoning is an immediate practical threat.[^1]
- Tramèr et al., "Stealing Machine Learning Models via Prediction APIs", USENIX Security 2016. The foundational model extraction paper, demonstrating near-perfect extraction of models served by BigML and Amazon Machine Learning.[^4]
- Madry et al., "Towards Deep Learning Models Resistant to Adversarial Attacks", ICLR 2018. Established PGD-based adversarial training as the standard defence against evasion attacks and defined the robustness evaluation framework used by subsequent work.[^7]
- Carlini and Wagner, "Towards Evaluating the Robustness of Neural Networks", IEEE S&P 2017. The C&W attack and the methodology for evaluating defences against adaptive adversaries.[^8]

**Frameworks and standards**

- MITRE ATLAS (Adversarial Threat Landscape for AI Systems). The threat framework mapping adversarial ML techniques to a taxonomy compatible with ATT&CK. Essential for threat modelling ML systems.[^5]
- OWASP Top 10 for LLM Applications 2025. While focused on LLMs, the document's coverage of supply chain vulnerabilities (LLM03) and data and model poisoning (LLM04) connects directly to the poisoning and extraction threats discussed here.[^13]
- NIST AI Risk Management Framework (AI RMF). Provides a governance structure for managing AI risks including adversarial threats. Covered in article 5.01 of this series.[^14]

**Tools**

- **Adversarial Robustness Toolbox (ART)** (IBM/Linux Foundation AI): The primary tool used in this article. 39 attack modules and 29 defence modules covering evasion, poisoning, extraction, and inference. Supports PyTorch, TensorFlow, Keras, scikit-learn, and more.[^15]
- **CleverHans** (Google Brain): An earlier adversarial ML library focused on evasion attacks. Less comprehensive than ART but useful for TensorFlow-native workflows.
- **Foolbox**: A Python library focused on evasion attacks with a clean API. Supports PyTorch, TensorFlow, and JAX.
- **SecML**: An adversarial ML library with a focus on security evaluation methodology, implementing the threat model formalisation from Biggio and Roli's work.

**Related articles in this series**

- 1.01 How LLMs Work: A Security Engineer's Guide to Tokenisation, Attention, and RLHF (foundational ML concepts for security practitioners)
- 2.01 PyRIT: Zero to Red Team in 90 Minutes (red-teaming tool for AI systems, complementary to ART)
- 2.06 The MITRE ATLAS Playbook: Mapping AI Attacks to the ATT&CK Framework (using ATLAS for threat modelling)
- 6.05 AI Supply Chain Attacks (the supply chain context for poisoning and model provenance threats)

---

[^1]: Carlini et al., "Poisoning Web-Scale Training Datasets is Practical", IEEE S&P 2024, https://arxiv.org/abs/2302.10149
[^2]: Biggio and Roli, "Wild Patterns: Ten Years After the Rise of Adversarial Machine Learning", Pattern Recognition, 2018, https://arxiv.org/abs/1712.03141
[^3]: Goodfellow, Shlens, and Szegedy, "Explaining and Harnessing Adversarial Examples", ICLR 2015, https://arxiv.org/abs/1412.6572
[^4]: Tramèr et al., "Stealing Machine Learning Models via Prediction APIs", USENIX Security 2016, https://arxiv.org/abs/1609.02943
[^5]: MITRE ATLAS, "ATLAS Matrix", https://atlas.mitre.org/matrices/ATLAS
[^6]: Turner, Tsipras, and Madry, "Clean-Label Backdoor Attacks", 2018, https://people.csail.mit.edu/madry/lab/cleanlabel.pdf
[^7]: Madry et al., "Towards Deep Learning Models Resistant to Adversarial Attacks", ICLR 2018, https://arxiv.org/abs/1706.06083
[^8]: Carlini and Wagner, "Towards Evaluating the Robustness of Neural Networks", IEEE S&P 2017, https://arxiv.org/abs/1608.04644
[^9]: Chen, Jordan, and Wainwright, "HopSkipJumpAttack: A Query-Efficient Decision-Based Attack", IEEE S&P 2020, https://arxiv.org/abs/1904.02144
[^10]: Andriushchenko et al., "Square Attack: a query-efficient black-box adversarial attack via random search", ECCV 2020, https://arxiv.org/abs/1912.00049
[^11]: Correia-Silva et al., "Copycat CNN: Stealing Knowledge by Persuading Confession with Random Non-Labeled Data", IJCNN 2018; Orekondy, Schiele, and Fritz, "Knockoff Nets: Stealing Functionality of Black-Box Models", CVPR 2019, https://arxiv.org/abs/1812.02766
[^12]: Tran, Li, and Madry, "Spectral Signatures in Backdoor Attacks", NeurIPS 2018, https://arxiv.org/abs/1811.00636
[^13]: OWASP, "Top 10 for LLM Applications 2025", https://genai.owasp.org/llm-top-10/
[^14]: NIST, "AI Risk Management Framework (AI RMF 1.0)", https://www.nist.gov/artificial-intelligence/risk-management-framework
[^15]: IBM, "Adversarial Robustness Toolbox", Linux Foundation AI, https://github.com/Trusted-AI/adversarial-robustness-toolbox
[^16]: Carlini and Wagner, "Adversarial Examples Are Not Easily Detected: Bypassing Ten Detection Methods", AISec 2017, https://arxiv.org/abs/1705.07263
