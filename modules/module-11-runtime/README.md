# Module 11: Server Runtime & Deployment Layer

This module serves as the primary orchestration and entry point for the Zero Trust system. It is responsible for server initialization, request routing, and deployment configurations.

## Responsibilities
- **Server Bootstrap**: Initializes the underlying server framework (e.g., Express).
- **Global Routing**: Directs incoming requests to the Zero Trust request pipeline.
- **Health Monitoring**: Provides liveness and readiness probes for container orchestration.
- **Deployment Abstraction**: Handles Docker settings and reverse proxy header translation.

## Interaction Flow
1. **Entry**: `Server.start()` initializes the framework.
2. **Middleware**: `requestMiddleware` and `loggingMiddleware` process incoming traffic.
3. **Routing**: `MainRouter` dispatches calls to `/api/v1/*`.
4. **Pipeline**: `RequestPipeline` coordinates the Zero Trust evaluation flow.

## Strict Rules
- **Bootstrap Only**: This module must not contain business logic for trust or identity.
- **No Direct Access**: Access to protected resources is only allowed after pipeline success.
- **Enforcement Agnostic**: Routing only; Module 7 handles the actual enforcement logic.

## Dependencies
- Depends on `module-0-core` for logging and utilities.
- Orchestrates calls to Modules 1 through 7 via the `RequestPipeline`.
