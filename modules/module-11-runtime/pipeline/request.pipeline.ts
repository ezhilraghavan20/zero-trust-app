import { IPipelineOutcome } from '../contracts';
import { SignalMapper } from './signal.mapper';

import { AuthService } from '../../module-1-identity/services';
import { PasswordProvider, TokenProvider } from '../../module-1-identity/providers';
import { IIdentityContract, LoggerFactory } from '../../module-0-core';

import { DeviceController } from '../../module-2-device-trust/controllers';
import { PostureService } from '../../module-2-device-trust/services';
import { IDeviceInput, IDevicePosture } from '../../module-2-device-trust/contracts';

import { ContextController } from '../../module-3-context-engine/controllers';
import { ContextService } from '../../module-3-context-engine/services';
import { IContextInput, IContextRisk } from '../../module-3-context-engine/contracts';

import { BehaviorAnalyticsController } from '../../module-4-behavior-analytics/controllers';

import { ScoreEngineController } from '../../module-5-trust-score/controllers';

import { PolicyEngineController } from '../../module-6-policy-engine/controllers';

import { EnforcementController } from '../../module-7-enforcement-point/controllers';

import { ResourceRegistry } from '../../module-8-resource-layer/registry';

import { logCollector } from '../../module-9-monitoring/logs';
import { AlertEngine } from '../../module-9-monitoring/alerts';
import { TelemetryNormalizer } from '../../module-9-monitoring/normalizers';

const logger = LoggerFactory.create('RequestPipeline');

/**
 * Coordinates the flow of a request through the Zero Trust modules.
 * Sequence: Identity -> Device -> Context -> Behavior -> Score -> Policy -> Enforcement -> Resource -> Monitoring
 */
export class RequestPipeline {
    // Module 1 — Identity
    private readonly authService = new AuthService(new PasswordProvider(), new TokenProvider());

    // Module 2 — Device Trust
    private readonly deviceController = new DeviceController(new PostureService(), LoggerFactory.create('DeviceTrust'));

    // Module 3 — Context Engine
    private readonly contextController = new ContextController(new ContextService(), LoggerFactory.create('ContextEngine'));

    // Module 4 — Behavior Analytics
    private readonly behaviorController = new BehaviorAnalyticsController();

    // Module 5 — Trust Score
    private readonly scoreController = new ScoreEngineController();

    // Module 6 — Policy Engine
    private readonly policyController = new PolicyEngineController();

    // Module 7 — Enforcement Point
    private readonly enforcementController = new EnforcementController();

    // Module 8 — Resource Layer
    private readonly resourceRegistry = new ResourceRegistry();

    // Module 9 — Monitoring
    private readonly alertEngine = new AlertEngine();
    private readonly telemetryNormalizer = new TelemetryNormalizer();

    /**
     * Executes the zero trust evaluation pipeline for a single inbound request.
     */
    public async processRequest(req: any): Promise<IPipelineOutcome> {
        const requestId: string = req.id || 'req-unknown';
        const resourceId: string = (req.path || '/').replace(/^\/api\/v1\//, '') || 'app/root';
        const action: string = (req.method || 'GET').toLowerCase();

        // ---- Phase 1: Identity ----
        const identityContext = await this.resolveIdentity(req);
        const identityId = identityContext?.userId || 'anonymous';

        this.emitTelemetry('Identity', 'SIGNAL', { requestId, identityId, authenticated: !!identityContext?.authenticated });

        // ---- Phase 2: Device Trust ----
        const devicePosture = await this.resolveDevicePosture(req, requestId);
        this.emitTelemetry('DeviceTrust', 'SIGNAL', { requestId, deviceId: devicePosture?.deviceId, riskLevel: devicePosture?.riskLevel });

        // ---- Phase 3: Context ----
        const contextRisk = await this.resolveContext(req, requestId, identityId);
        this.emitTelemetry('ContextEngine', 'SIGNAL', {
            requestId,
            anomalies: contextRisk?.anomaliesDetected,
            level: contextRisk?.riskDetails?.networkRisk
        });

        // ---- Phase 4: Behavior Analytics ----
        const behaviorOutcome = this.behaviorController.handleAnalysisRequest({
            identityId,
            action,
            resource: resourceId,
            timestamp: new Date()
        });
        this.emitTelemetry('BehaviorAnalytics', 'SIGNAL', {
            requestId,
            riskScore: behaviorOutcome.riskScore,
            anomalies: behaviorOutcome.anomaliesDetected
        });

        // ---- Phase 5: Trust Score ----
        const identitySignals = SignalMapper.fromIdentity(identityContext);
        const deviceSignals = SignalMapper.fromDevice(devicePosture);
        const contextSignals = SignalMapper.fromContext(contextRisk);
        const behaviorSignals = SignalMapper.fromBehavior(behaviorOutcome);
        contextSignals.push(SignalMapper.resourceSensitivitySignal(resourceId));

        const scoreOutcome = this.scoreController.handleScoreRequest({
            requestId,
            identityId,
            identitySignals,
            deviceSignals,
            contextSignals,
            behaviorSignals
        });
        this.emitTelemetry('TrustScore', 'SIGNAL', { requestId, trustScore: scoreOutcome.trustScore });

        // ---- Phase 6: Policy Decision ----
        const policyOutcome = this.policyController.handlePolicyEvaluation({
            requestId,
            identityId,
            resourceId,
            action,
            trustScore: scoreOutcome.trustScore
        });

        // ---- Phase 7: Enforcement ----
        const enforcement = this.enforcementController.handleEnforcement({
            requestId,
            resourceId,
            action,
            decision: policyOutcome.decision,
            evaluationReason: policyOutcome.evaluationReason
        });
        this.emitTelemetry('EnforcementPoint', 'LOG', {
            requestId,
            identityId,
            enforcedAction: enforcement.clientResponse.body.decision
        });

        // ---- Phase 8: Resource Layer (only when forwarded) ----
        let resourceResponse = null;
        if (enforcement.upstreamRequest) {
            try {
                resourceResponse = this.resourceRegistry.route(enforcement.upstreamRequest);
            } catch (error) {
                logger.error('Resource layer rejected forwarded request', { requestId }, error as Error);
            }
        }

        logger.info(`Pipeline complete for ${requestId}`, {
            identityId,
            trustScore: scoreOutcome.trustScore,
            decision: policyOutcome.decision
        });

        return {
            allowed: policyOutcome.decision === 'ALLOW',
            score: scoreOutcome.trustScore,
            reason: policyOutcome.evaluationReason,
            decision: policyOutcome.decision,
            statusCode: enforcement.clientResponse.statusCode,
            responseBody: enforcement.clientResponse.body,
            resourceResponse
        };
    }

    /**
     * Verifies the bearer token (if present) against Module 1. A missing or
     * invalid token is not an error — it simply means the request proceeds
     * as an unauthenticated identity, which downstream signals penalize.
     */
    private async resolveIdentity(req: any): Promise<IIdentityContract | null> {
        const authHeader = req.headers?.authorization || '';
        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
        if (!token) return null;

        try {
            return await this.authService.verifyAccessToken(token);
        } catch {
            return null;
        }
    }

    /**
     * Reads device posture telemetry from the request body (a real device
     * agent would submit this alongside the request). Falls back to null
     * (treated as unknown/medium risk by SignalMapper) when absent.
     */
    private async resolveDevicePosture(req: any, requestId: string): Promise<IDevicePosture | null> {
        const deviceInput: IDeviceInput | undefined = req.body?.device;
        if (!deviceInput) return null;

        try {
            return await this.deviceController.checkPosture(deviceInput);
        } catch (error) {
            logger.warn(`Device posture evaluation failed for ${requestId}`, { error: (error as Error).message });
            return null;
        }
    }

    private async resolveContext(req: any, requestId: string, identityId: string): Promise<IContextRisk | null> {
        const ip = req.clientIp || req.ip || req.connection?.remoteAddress || '0.0.0.0';
        const contextInput: IContextInput = req.body?.context || {
            location: { countryCode: req.headers?.['x-geo-country'] || 'US', region: '', city: '' },
            network: {
                ipAddress: ip,
                connectionType: 'WIFI',
                isPublicWifi: false,
                isp: req.headers?.['x-isp'] || 'unknown'
            },
            accessTime: new Date(),
            clientMetadata: {
                userAgent: req.headers?.['user-agent'] || 'unknown',
                requestCorrelationId: requestId
            }
        };

        try {
            return await this.contextController.evaluateRequest(contextInput);
        } catch (error) {
            logger.warn(`Context evaluation failed for ${requestId}`, { error: (error as Error).message });
            return null;
        }
    }

    private emitTelemetry(moduleId: string, eventType: 'LOG' | 'ALERT' | 'SIGNAL', payload: Record<string, any>): void {
        const event = this.telemetryNormalizer.normalize({ moduleId, eventType, timestamp: new Date(), ...payload });
        logCollector.ingest(event);
        this.alertEngine.process(event);
    }
}
