# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly.

**Do not open a public issue.**

Instead, email security concerns to the project maintainers with:

1. Description of the vulnerability
2. Steps to reproduce
3. Potential impact
4. Suggested fix (if any)

We will acknowledge receipt within 48 hours and provide a detailed response within 7 days.

## Supported Versions

| Version | Supported |
|---------|-----------|
| 0.x     | Yes       |

## Security Considerations

This platform handles news verification data. Key security areas:

- Evidence integrity (content-addressed hashing)
- Publication gate enforcement (policy-based access control)
- Event ledger immutability
- Actor identity and role separation

## Dependency Management

We do not use Dependabot or similar automated dependency update tools. Our dependency management posture is manual and intentional (see [ADR-003](../docs/adr/003-dependency-management.md)). 

If you discover a security vulnerability in one of our dependencies, please follow the responsible disclosure process outlined above. We will manually review, test, and patch the dependency.
