# CloudBees CI/CD Demo — Saudemo Automation

## Objective
Demonstrate how CloudBees automatically triggers and runs Playwright regression tests on every GitHub push.

---

## Step 1 — Introduce the workflow

Open `.cloudbees/workflows/test.yaml` and walk through it:

```yaml
on:
  push:               # Auto-trigger on push to main
  workflow_dispatch:  # Manual trigger from dashboard
  schedule:           # Nightly run at 22:00 UTC

jobs:
  regression:         # Runs E2E + API + Accessibility in one job
```

**Say:** "CloudBees automatically runs the full regression suite whenever a developer pushes code to the main branch — no manual steps required."

---

## Step 2 — Push code to trigger the pipeline

Run in terminal:

```bash
git add .cloudbees/workflows/test.yaml
git commit -m "ci: trigger regression demo run"
git push
```

**Say:** "I just pushed a commit to GitHub. CloudBees will detect it and kick off a new run automatically."

---

## Step 3 — Open the CloudBees dashboard

URL: `https://cloudbees.io`

Navigate to: **Components → Saudemo-Automation → Runs**

**Say:** "You can see a new run has been triggered. CloudBees is pulling the latest code from GitHub and spinning up a Playwright Docker container."

---

## Step 4 — Watch the job run

Click the latest run → click the **regression** job

Open the **Job Logs** tab and scroll through the steps:
- `Check out code` — checks out source from GitHub
- `Run Playwright Tests` — executes 3 suites:
  - `npm run test:e2e` — End-to-end tests
  - `npm run test:api` — API / Network interception tests
  - `npm run test:accessibility` — Axe-core accessibility tests

**Say:** "CloudBees uses the official Playwright Docker image, so the CI environment is identical every time — no flakiness from machine differences."

---

## Step 5 — View results

Once the job completes (~2–3 minutes), click the **Test results** tab.

**Say:** "CloudBees shows a detailed breakdown of every test case. The team can instantly see what passed and what failed without running anything locally."

---

## Key talking points

| Feature | Why it matters |
|---|---|
| Auto-trigger on push | Every commit is tested — no human intervention needed |
| Official Playwright Docker image | Clean, consistent environment across all runs |
| 3 suites in one job | E2E + API + Accessibility covered in a single pipeline step |
| Nightly scheduled run | Catches regressions overnight before the team starts the day |
| GitHub integration | Directly connected to `thong-maker/Saudemo-Automation` |
