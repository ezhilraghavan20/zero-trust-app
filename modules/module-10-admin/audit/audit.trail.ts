import { CryptoUtil, TimeUtil } from '../../module-0-core';

export interface AuditRecord {
    id: string;
    adminId: string;
    actionDesc: string;
    payload: any;
    timestamp: string;
    prevHash: string;
    hash: string;
}

const GENESIS_HASH = '0'.repeat(64);

/**
 * Maintains an immutable, hash-chained audit trail for all governance
 * actions. Each record's hash covers the previous record's hash, so any
 * tampering with historical entries breaks the chain and is detectable via
 * verifyIntegrity().
 */
export class AuditTrail {
    private readonly records: AuditRecord[] = [];

    public appendRecord(adminId: string, actionDesc: string, payload: any): AuditRecord {
        const prevHash = this.records.length > 0 ? this.records[this.records.length - 1].hash : GENESIS_HASH;
        const timestamp = TimeUtil.nowIso();
        const id = CryptoUtil.randomToken(8);

        const body = JSON.stringify({ id, adminId, actionDesc, payload, timestamp, prevHash });
        const hash = CryptoUtil.sha256(body);

        const record: AuditRecord = { id, adminId, actionDesc, payload, timestamp, prevHash, hash };
        this.records.push(record);

        // eslint-disable-next-line no-console
        console.log(`[AUDIT] Admin ${adminId} performed ${actionDesc}`);

        return record;
    }

    public getTrail(): AuditRecord[] {
        return [...this.records];
    }

    public verifyIntegrity(): boolean {
        let expectedPrevHash = GENESIS_HASH;
        for (const record of this.records) {
            if (record.prevHash !== expectedPrevHash) return false;
            const body = JSON.stringify({
                id: record.id,
                adminId: record.adminId,
                actionDesc: record.actionDesc,
                payload: record.payload,
                timestamp: record.timestamp,
                prevHash: record.prevHash
            });
            if (CryptoUtil.sha256(body) !== record.hash) return false;
            expectedPrevHash = record.hash;
        }
        return true;
    }
}
