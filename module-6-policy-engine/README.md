# Module 6 – Policy Engine

Zero Trust policy evaluation module.

## Goals
- Evaluate access requests against policies
- Use Trust Score from Module 5 as an input
- Produce a policy decision (ALLOW / DENY / STEP-UP)
- Return structured decision reasoning

## Rules
- Trust score informs policy, never replaces it
- Policies are explicit, deterministic, and auditable
- Authorization is conditional and least-privileged
- Decisions are per-request, never session-based
- DO NOT calculate trust score
- DO NOT authenticate identity
- DO NOT analyze behavior or context
- DO NOT enforce access (no blocking or granting)
- DO NOT store decisions or policies in DB
- DO NOT hardcode organization-specific rules
