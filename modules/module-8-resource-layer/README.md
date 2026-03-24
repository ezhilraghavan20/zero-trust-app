# Module 8 – Resource Layer

Zero Trust Resource Layer module.

## Definition
This module represents protected resources such as applications, APIs, and data systems.
It does NOT make trust decisions and does NOT enforce policies.

## Goals
- Represent protected apps, APIs, and data endpoints
- Accept traffic only from the Enforcement Point (Module 7)
- Remain completely unaware of trust logic

## Rules
- DO NOT calculate trust
- DO NOT evaluate policies
- DO NOT authenticate identity
- DO NOT expose resources directly to users
- DO NOT log security decisions
