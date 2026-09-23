# From Search to Action: Learner Workbook

Use fictional records throughout this exercise. The goal is a reviewable software specification. Clinical treatment recommendations are outside the exercise.

## Lesson 1: The Answer Contract

**Workflow:**

**Person doing the work:**

**Question the system should answer:**

**Patient/context boundary and time interval:**

**Sources required:**

**Required output:**

**Missing information that must remain visible:**

**Conclusion or action the system must not infer:**

Write an acceptable answer in three sentences. Write an unacceptable answer in one sentence. Explain what the second answer hides or assumes.

## Lesson 2: The Evidence Card

| Field | Your design |
| --- | --- |
| Claim | |
| Supporting observation | |
| Source identifier and original passage | |
| Event date and record date | |
| Conflicting evidence | |
| Missing or unreadable information | |
| Scope: what was actually reviewed? | |
| How the reviewer corrects it | |
| Outputs that must change after correction | |

Challenge the card: does the source establish the exact claim, or merely discuss the same topic?

## Lesson 3: The Action Map

Complete a row for every operation, including follow-up and confirmation.

| Operation | Prerequisite | Who approves? | What proves completion? | What happens on failure? | Owner |
| --- | --- | --- | --- | --- | --- |
| Prepare draft | | | | | |
| Approve exact draft | | | | | |
| Execute approved action, if in scope | | | | | |
| Confirm result | | | | | |
| Complete follow-up | | | | | |

Specify what changes invalidate approval. Describe what happens when execution status is unknown. Distinguish a failed request from a confirmed failure to perform the action.

## Lesson 4: Clinical AI Design Canvas

1. **Intent:** What does the clinician or patient want to accomplish?
2. **Context:** What information must be available, current, and correctly identified?
3. **Answer:** What bounded question does the system resolve?
4. **Evidence:** What supports each consequential claim?
5. **Uncertainty:** What must remain unresolved until additional information or review?
6. **Action:** What is prepared, and what is actually committed?
7. **Human checkpoint:** Who reviews which exact proposal, with what authority?
8. **Audit trail:** What must be retained to reconstruct consequential events?

**Ownership:** Who receives incomplete or failed work, including during absence?

**Recovery:** How are duplicate requests, stale approvals, and partial completion handled?

**Version-one boundary:** State one capability intentionally outside the first release.

## Capstone Case Set

Write expected behavior before evaluating any model output.

| Case | Fictional input change | Expected result | Observed result | Pass or revise |
| --- | --- | --- | --- | --- |
| Ordinary case | Complete and consistent inputs | | | |
| Missing context | Remove a required field | | | |
| Conflict | Introduce contradictory records | | | |
| Stale proposal | Change a material fact after review | | | |
| Failure | Make one downstream operation unavailable | | | |

For a draft-only prototype, simulate the downstream operation on paper. Do not add a live integration merely to complete the exercise.

## Peer-Review Rubric

Score each item 0 (absent), 1 (stated but ambiguous), or 2 (concrete and testable).

- The question, user, and scope are explicit.
- Consequential claims can be traced to specific source material.
- Missing and conflicting information remain visible.
- Preparation, approval, and execution are distinct.
- Failure and uncertain completion have an assigned owner.
- Test cases specify expected outcomes before evaluation.

Use the score to find weak parts of the specification. Any zero deserves revision regardless of the total. This rubric evaluates a learning artifact, not readiness for clinical deployment.

## Submission

Deliver a one-page build brief, one review-screen sketch, and at least five fictional test cases. Another person should be able to explain the system's scope, approval boundary, and recovery behavior without asking you to interpret your intent.
