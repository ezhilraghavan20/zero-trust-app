# Module 5 – Trust Score Engine

Zero Trust score aggregation and calculation module.

## Goals
- Aggregate risk signals from upstream modules
- Calculate a normalized trust score (0–100)
- Provide confidence and reasoning metadata
- Be deterministic and explainable

## Rules
- Trust is never binary
- Trust score is dynamic and request-scoped
- High trust does NOT automatically grant access
- DO NOT authenticate users
- DO NOT evaluate device posture directly
- DO NOT analyze context or behavior
- DO NOT allow or deny access
- DO NOT persist trust scores across sessions
