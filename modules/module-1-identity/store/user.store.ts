import { CryptoUtil } from '../../module-0-core/utils';
import { UserRole } from '../../module-0-core/constants';

export interface UserRecord {
    userId: string;
    username: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    mfaEnabled: boolean;
    failedLoginAttempts: number;
    lockedUntil?: string;
    lastLoginAt?: string;
}

/**
 * In-memory user repository. Swappable for a real database by implementing
 * the same interface — nothing outside this file depends on the storage
 * mechanism.
 */
class UserStore {
    private readonly usersById = new Map<string, UserRecord>();
    private readonly usersByUsername = new Map<string, string>();

    constructor() {
        this.seed();
    }

    private seed(): void {
        this.create({
            userId: 'usr_admin_001',
            username: 'admin',
            email: 'admin@ztac.local',
            password: 'AdminPass123!',
            role: UserRole.ADMIN,
            mfaEnabled: true
        });
        this.create({
            userId: 'usr_demo_001',
            username: 'demo',
            email: 'demo@ztac.local',
            password: 'DemoPass123!',
            role: UserRole.USER,
            mfaEnabled: false
        });
    }

    create(input: { userId: string; username: string; email: string; password: string; role: UserRole; mfaEnabled: boolean }): UserRecord {
        const record: UserRecord = {
            userId: input.userId,
            username: input.username,
            email: input.email,
            passwordHash: CryptoUtil.hashPassword(input.password),
            role: input.role,
            mfaEnabled: input.mfaEnabled,
            failedLoginAttempts: 0
        };
        this.usersById.set(record.userId, record);
        this.usersByUsername.set(record.username.toLowerCase(), record.userId);
        this.usersByUsername.set(record.email.toLowerCase(), record.userId);
        return record;
    }

    findByIdentifier(identifier: string): UserRecord | undefined {
        const id = this.usersByUsername.get(identifier.toLowerCase());
        return id ? this.usersById.get(id) : undefined;
    }

    findById(userId: string): UserRecord | undefined {
        return this.usersById.get(userId);
    }

    save(record: UserRecord): void {
        this.usersById.set(record.userId, record);
    }
}

export const userStore = new UserStore();
