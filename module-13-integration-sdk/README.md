# Module 13: Integration & Network SDK Gateway

This module provides clean, typed SDK integration layers for any external system (Web, Mobile, Microservices, IoT) attempting to interact with the Zero Trust application.

## Responsibilities
- Provide typed SDK adapters for various client architectures.
- Establish secure handshakes (API keys, certificates) to register client instances.
- Standardize access enforcement payloads.
- Abstract the complexities of module-11-runtime communications away from the developers.

## Strict Rules
- **No Evaluation Logic:** This module NEVER makes trust, authentication, or policy decisions.
- **Always Forwards:** The gateway forwards strictly to module-11-runtime, taking integration secrets out of the scope of rule-making components.
- **Client Segregation:** SDKs must respect their categorized limitations (e.g. IoT devices cannot request arbitrary context properties like Web apps might).
- **Secrets Protocol:** Never store, leak, or log the integration secrets handled by the payload validators.
