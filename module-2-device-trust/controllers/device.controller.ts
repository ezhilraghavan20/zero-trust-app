import { IDeviceInput, IDevicePosture } from '../contracts';
import { PostureService } from '../services';
import { ILogger } from '../../module-0-core';

/**
 * Handles incoming device posture requests.
 */
export class DeviceController {
    constructor(
        private readonly postureService: PostureService,
        private readonly logger: ILogger
    ) { }

    /**
     * Assesses the health and risk of a device at request time.
     */
    public async checkPosture(input: IDeviceInput): Promise<IDevicePosture> {
        this.logger.info(`Evaluating posture for device: ${input.deviceId}`);

        try {
            return await this.postureService.evaluatePosture(input);
        } catch (error) {
            this.logger.error(`Posture evaluation failed for ${input.deviceId}`, error);
            throw error; // TODO: Map to CoreError
        }
    }
}
