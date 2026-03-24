import { IDeviceInput, IDevicePosture } from '../contracts';
import { OsCollector, SecurityCollector, NetworkCollector } from '../collectors';
import { PostureEvaluator } from '../evaluators';

/**
 * Orchestrates device data collection and posture evaluation.
 */
export class PostureService {
    private osCollector = new OsCollector();
    private securityCollector = new SecurityCollector();
    private networkCollector = new NetworkCollector();
    private evaluator = new PostureEvaluator();

    public async evaluatePosture(input: IDeviceInput): Promise<IDevicePosture> {
        const osSignals = this.osCollector.collect(input.os);
        const securitySignals = this.securityCollector.collect(input.security);
        const networkSignals = this.networkCollector.collect(input.network);

        const evaluation = this.evaluator.evaluate({
            os: { isHealthy: osSignals.isUpToDate },
            security: { isHealthy: securitySignals.isFirewallActive && securitySignals.isEncrypted },
            network: { isSecure: networkSignals.isAuthorizedNetwork }
        });

        return {
            deviceId: input.deviceId,
            deviceType: input.deviceType,
            posture: evaluation.posture as 'COMPLIANT' | 'NON_COMPLIANT',
            score: evaluation.score,
            riskLevel: evaluation.riskLevel,
            signals: {
                osHealthy: osSignals.isUpToDate,
                securityHealthy: securitySignals.isAvRunning,
                networkTrusted: networkSignals.isAuthorizedNetwork
            },
            lastEvaluatedAt: new Date()
        };
    }
}
