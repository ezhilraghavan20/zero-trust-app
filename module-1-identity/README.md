# Module 1: Identity & Authentication

This module serves as the primary **Identity Control Plane** for the Zero Trust Access Control (ZTAC) system.

## Role in Zero Trust
- **Root of Identity**: Every request must be tied to a verified identity.
- **Strong Authentication**: Support for password-based login plus MFA (Multifactor Authentication).
- **Identity Signals**: Produces the initial signals for the Trust Score Engine.

## Interaction Flow
1. **Request Interception**: AuthController receives credentials.
2. **Verification**: AuthService coordinates with PasswordProvider and MFAService.
3. **Token Issuance**: TokenProvider generates JWTs containing the identity context.
4. **Contract Adherence**: Outputs conform to `IIdentityContract` defined in `module-0-core`.

## Structure
- `controllers/`: API-level entry points.
- `services/`: Core logic for auth and MFA.
- `providers/`: Specialized logic for secrets and tokens.
- `validators/`: Input integrity checks.
- `contracts/`: Module-specific I/O interfaces.

## Dependencies
- Strictly depends only on `../module-0-core`.
