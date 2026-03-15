# Module 2 – Device Trust

This module is responsible for identifying and evaluating the posture of devices attempting to access resources.

## Responsibilities
- Collect device attributes (OS, Security, Network).
- Evaluate device posture against compliance requirements.
- Produce risk and health signals for access control decisions.

## Zero Trust Principles
- **Never Trust**: Devices are always evaluated, never assumed secure.
- **Continuous Evaluation**: Posture is assessed at request time.
- **Signal-only**: This module produces signals; it does not authorize or authenticate.

## Usage
Exports `IDevicePosture` signal via contracts for use in the trust engine.
