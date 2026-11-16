# Copilot agent team: evidence-gated development

This starter demonstrates a small software-development team orchestrated by GitHub Actions. It uses separate Copilot CLI sessions as **planner**, **developer**, **correctness reviewer**, and **security reviewer**. The agents cooperate through files and an Actions artifact, not shared conversation memory.

The exercise is intentionally narrow: implement `factorial` in `src/math.js` to satisfy the specification in `exercise.md`. The checked-in implementation is a stub, so the exercise tests fail until the developer produces a patch.

## Team and gates

| Stage | Output | Gate |
| --- | --- | --- |
| Planner | Plan | CLI succeeds and the plan is nonempty |
| Developer | Patch and implementation notes | Exactly `src/math.js` changed; patch is nonempty |
| Test runner | Test log | Patch applies cleanly; all exercise tests pass |
| Correctness and security reviewers | Independent JSON reports | Each report has the required shape and a `pass` verdict |
| Final gate | Actions job result | All previous jobs succeeded |

Reviewers run in parallel after the deterministic tests. The reviewer gate is a **model judgment**, not proof of correctness or security. The test job runs trusted, pre-existing tests; it does not rely on an agent's claim that tests passed. A human must inspect the patch, evidence and reports before applying or merging it. No workflow job commits, opens a pull request, deploys, or merges.

## Run it

1. Copy the files into a new **private training repository**. Enable GitHub Actions. Commit and push them to its default branch.
2. Ensure the operator has an active Copilot subscription and permission to use Copilot CLI. Create a **user-owned fine-grained PAT** with the account permission **Copilot Requests**, and save it as the Actions secret `COPILOT_TOKEN`. Use a dedicated account/token and follow your organization's policies. An eligible organization can alternatively configure built-in `GITHUB_TOKEN` authentication; see [GitHub's Actions guidance](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli-in-actions).
3. In **Actions > Evidence-gated agent team**, select **Run workflow** on the default branch. Other branches fail the final gate. Each run invokes four Copilot sessions and may consume paid usage.
4. Open the run. The **team-evidence** artifact contains the plan, patch and notes; **test-evidence** contains the test log; and the **review-*** artifacts contain the review reports. Artifacts are uploaded on failure where possible. If the run failed, inspect the job logs as well.
5. After reviewing the evidence, download the patch and apply it locally with `git apply change.patch`, then run `node --test`. Submit the resulting change through your normal human-reviewed pull request process.

The final job is named `Evidence gate`. To use it as a required check, integrate it into a trusted PR workflow and configure branch protection/rulesets. A manually dispatched workflow by itself does **not** prevent merges.

## Local checks

Node.js 22 or later is required; there are no project dependencies.

```shell
node --test test/gate.test.js
node --test test/math.test.js
```

The second command is expected to fail on the original stub. After applying a valid patch, both commands should pass.

## Trust boundaries and limitations

* The workflow is **manual only**, for trusted branches and trusted operators. Do not copy this pattern to `pull_request_target`, untrusted forks, or unreviewed branch workflows: repository content, tests, and generated patches can contain malicious instructions or code. A user who can modify the workflow can access its secrets.
* Use GitHub-hosted ephemeral runners. Checkout credentials are not persisted; the Actions token has only `contents: read`. The Copilot PAT is exposed only to the Copilot steps, but Copilot itself must receive it. Never put secrets in prompts, source files, reports, or artifacts. Review generated content for sensitive information before uploading it.
* The developer is allowed to write files and is instructed to edit one file; the post-run scope check enforces tracked/untracked workspace changes, **not an OS sandbox**. The generated code is executed by the test job. Do not use valuable credentials, privileged runners or sensitive networks; review this design before adapting it to real code.
* Prompt injection, hallucinated reviews, malicious changes that satisfy tests, compromised dependencies/actions, and incomplete tests remain possible. Copilot review does not replace human review, code scanning, dependency checks, or an isolated execution environment. Artifacts can contain repository code and model output; use an appropriate repository visibility and retention policy.
* The sample has no automatic retry: CLI failures, malformed reviews, blocked verdicts, missing evidence, unexpected changes, and failed tests all fail closed. Model output may vary; reruns may consume more usage.

## Adapt the exercise

Change the specification and tests first, then update the editable path in `.github/workflows/agent-team.yml` and the scope check in `scripts/check-scope.js`. Keep tests and workflow configuration outside the developer's permitted patch. For real projects, add project-specific build, lint, test, security and human-approval gates and use an isolated runner.

Documentation: [Copilot CLI in Actions](https://docs.github.com/en/copilot/how-tos/copilot-cli/automate-copilot-cli/automate-with-actions) and [programmatic CLI usage](https://docs.github.com/en/copilot/how-tos/copilot-cli/automate-copilot-cli/run-cli-programmatically).
