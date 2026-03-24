import { IRiskSignal } from '../../module-0-core';

export interface ScoreEngineInput {
    requestId: string;
    identityId: string;
    identitySignals: IRiskSignal[];
    deviceSignals: IRiskSignal[];
    contextSignals: IRiskSignal[];
    behaviorSignals: IRiskSignal[];
}
