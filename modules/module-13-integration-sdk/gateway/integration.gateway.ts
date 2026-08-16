import { BaseIntegrationRequest, AccessDecisionResponse } from '../contracts';
import { GatewayRateLimiter } from './rate-limiter';
import { ApiKeyValidator, ClientCertValidator } from '../handshake';
import { AccessRequestBuilder, DeviceContextBuilder } from '../request-builder';
import { AccessResponseParser, StepUpHandler } from '../response-parser';
import { RequestPipeline } from '../../module-11-runtime/pipeline';
import { LoggerFactory } from '../../module-0-core';

const logger = LoggerFactory.create('IntegrationGateway');

/**
 * Main entrypoint for all integration SDKs/adapters. Validates the caller,
 * enforces rate limits, normalizes the request, forwards it through Module
 * 11's zero-trust pipeline, and parses the result back into the SDK's
 * response contract.
 */
export class IntegrationGateway {
  private readonly apiKeyValidator = new ApiKeyValidator();
  private readonly certValidator = new ClientCertValidator();
  private readonly requestBuilder = new AccessRequestBuilder();
  private readonly deviceContextBuilder = new DeviceContextBuilder();
  private readonly responseParser = new AccessResponseParser();
  private readonly stepUpHandler = new StepUpHandler();
  private readonly pipeline = new RequestPipeline();

  constructor(private rateLimiter: GatewayRateLimiter) {}

  public async handleRequest(request: BaseIntegrationRequest): Promise<AccessDecisionResponse> {
    const withinLimit = await this.rateLimiter.checkLimit(request.credentials);
    if (!withinLimit) {
      return {
        allowed: false,
        reason: 'Rate limit exceeded',
        transactionId: `txn-rate-limited-${Date.now()}`
      };
    }

    const isValidCredential = request.credentials.apiKey
      ? await this.apiKeyValidator.validate(request.credentials)
      : await this.certValidator.validate(request.credentials);

    if (!isValidCredential) {
      logger.warn('Rejected integration request: invalid credentials', {
        clientId: request.credentials.clientId,
        clientType: request.clientType
      });
      return {
        allowed: false,
        reason: 'Invalid client credentials',
        transactionId: `txn-unauthenticated-${Date.now()}`
      };
    }

    const normalizedDevice = request.payload.deviceContext
      ? this.deviceContextBuilder.buildContext(request.payload.deviceContext, request.clientType)
      : undefined;

    const pipelineRequest = this.requestBuilder.buildPipelineRequest({
      ...request.payload,
      deviceContext: normalizedDevice
    });

    const rawOutcome = await this.pipeline.processRequest(pipelineRequest);
    const parsed = this.responseParser.parse({ ...rawOutcome, requestId: pipelineRequest.id });

    this.stepUpHandler.handleStepUp(parsed);

    return parsed;
  }
}
