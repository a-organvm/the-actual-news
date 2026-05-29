# ADR-003: Dependency Management Posture

## Status

Accepted

## Date

2026-05-15

## Context

Automated dependency update tools like Dependabot generate a high volume of pull requests, particularly in a monorepo setup using pnpm workspaces. While these tools ensure dependencies are up-to-date, they also introduce significant CI load, notification fatigue, and manual review burden. Often, updates are for transient development dependencies or minor semver bumps that don't immediately require attention unless they patch a known vulnerability or introduce needed features.

## Decision

We have decided to deliberately remove and avoid using Dependabot (or similar automated dependency update bots) for this repository. 

Our dependency management posture is as follows:
- **Manual Updates:** Dependency updates will be performed manually and intentionally.
- **Batched Upgrades:** We will batch updates periodically (e.g., monthly) or as needed when specific features or critical vulnerability patches are required.
- **Security Posture:** Security vulnerabilities will still be monitored. However, we will manually assess and patch vulnerabilities instead of relying on automated PRs that can obscure critical updates amidst a sea of minor version bumps.
- **pnpm Workspaces:** We leverage `pnpm` for efficient, unified dependency management across our monorepo workspaces, ensuring consistent versions when updates are performed.

## Consequences

### Positive

- **Reduced Noise:** Significant reduction in pull request volume, notification fatigue, and CI pipeline execution times.
- **Intentional Updates:** Updates are made when there is context and bandwidth to properly review and test changes, improving stability.

### Negative

- **Manual Effort:** Requires a proactive effort to check for and apply updates.
- **Delayed Security Patches:** There is a risk of slight delays in applying critical security patches if they are not manually caught in a timely manner. We mitigate this by monitoring security advisories directly.

## References

- Issue #29: Document the deliberate Dependabot removal and the dependency-management posture.
