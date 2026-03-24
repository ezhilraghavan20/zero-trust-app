# Module 3 – Context Engine

This module analyzes real-time environmental signals (location, network, time) to detect anomalies and produce context-based risk signals.

## Responsibilities
- Collect environmental signals at access time.
- Analyze signals for behavioral or geographical anomalies.
- Produce normalized risk indicators for the trust engine.

## Zero Trust Principles
- **Dynamic Context**: Environmental trust is never assumed and is evaluated per request.
- **Untrusted Location**: Network or physical location alone does not grant access.
- **Stateless Analysis**: Context risk is calculated on-the-fly without long-term storage.

## Usage
Exports `IContextRisk` signal via contracts for use in the trust engine.
