import { IContextInput, IContextRisk } from '../contracts';
import { LocationSignal, NetworkSignal, TimeSignal } from '../signals';
import { AnomalyAnalyzer } from '../analyzers';

/**
 * Orchestrates contextual signal analysis.
 */
export class ContextService {
    private locationSignal = new LocationSignal();
    private networkSignal = new NetworkSignal();
    private timeSignal = new TimeSignal();
    private analyzer = new AnomalyAnalyzer();

    public async evaluateContext(input: IContextInput): Promise<IContextRisk> {
        const locResult = this.locationSignal.process(input.location);
        const netResult = this.networkSignal.process(input.network);
        const timeResult = this.timeSignal.process(input.accessTime);

        const anomalies = this.analyzer.analyze({
            location: locResult,
            network: netResult,
            time: timeResult
        });

        return {
            anomaliesDetected: anomalies,
            riskDetails: {
                locationRisk: locResult.riskLevel,
                networkRisk: netResult.riskLevel,
                timeRisk: timeResult.riskLevel
            },
            evaluatedAt: new Date()
        };
    }
}
