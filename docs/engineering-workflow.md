# Engineering workflow

This repository uses `development` as the canonical integration branch and `main` as the production branch.

## Branch and pull-request flow

1. Create a short-lived `codex/*` or feature branch from the current `development` head.
2. Open a pull request into `development`; do not push feature work directly to `development`.
3. Require the `validate` CI job and review the complete diff before merging.
4. Promote an intentionally selected `development` baseline to `main` through a separate reviewed pull request.
5. Deploy production only from an approved `main` commit. A feature branch or `development` preview must never be promoted implicitly.
6. Roll back by selecting a known-good immutable commit or deployment; do not rewrite shared branch history.

Infrastructure, environment variables, and database migrations require their own explicit verification and approval. A green repository build does not verify Vercel or Supabase state.

## PEP anonymous rate limit

`/api/pep` currently uses a bounded, instance-local fixed-window limiter. It hashes the proxy-derived client identity with a process-local random salt and stores only that digest; raw IP addresses are not retained in limiter state.

This is a pragmatic first guardrail, not a globally consistent quota. Serverless instances do not share its counters, counters reset with instance lifecycle, and forwarding headers are trustworthy only behind the configured deployment proxy. Before materially increasing traffic or granting higher-cost model access, replace it with a privacy-reviewed shared limiter (for example, a managed atomic counter with short TTLs), preserve hashed or pseudonymous keys, and define retention and proxy-trust rules explicitly.

## Recommended branch protection

No protection setting was changed by the engineering-guardrails work. Apply these settings only after this workflow has completed successfully on a pull request and the repository owner approves them.

For `main`:

- Require a pull request with at least one approving review.
- Dismiss stale approvals when new commits are pushed.
- Require conversation resolution.
- Require the status check `validate` and require the branch to be up to date.
- Block force pushes, branch deletion, and direct pushes, including for administrators.

For `development`:

- Require a pull request with at least one approving review.
- Require conversation resolution and the status check `validate`.
- Block force pushes and branch deletion.
- Allow only repository maintainers to bypass protections for documented emergencies.

## Review checklist

- The branch is based on the intended `development` SHA.
- The diff contains no unrelated application or generated files.
- `npm ci`, typecheck, lint, tests, production build, and `git diff --check` pass.
- No credentials or public client variables for server secrets appear in the diff or built client assets.
- PEP behavior changes have focused validation for request bounds, fallback behavior, provider boundaries, cost ceilings, and safe failures.
- Deployment and infrastructure changes, if any, are called out and approved separately.
