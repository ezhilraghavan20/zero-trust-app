import { useState, useEffect, useMemo } from 'react'
import {
    Shield,
    Activity,
    Users,
    Lock,
    Search,
    Zap,
    ArrowUpRight,
    Server,
    ShieldCheck,
    AlertCircle,
    ChevronRight,
    User,
    Smartphone,
    Globe,
    FileText,
    X,
    Target,
    Layers,
    Flag
} from 'lucide-react'

// --- Types ---
interface PipelineLog {
    id: string;
    identityId: string;
    score: number;
    decision: 'ALLOW' | 'DENY';
    reason: string;
    timestamp: string;
    details?: {
        identity: { status: string; risk: string; groups: string[] };
        device: { os: string; status: string; compliance: string };
        context: { ip: string; location: string; network: string };
    };
}

interface Identity {
    id: string;
    name: string;
    risk: 'LOW' | 'MEDIUM' | 'HIGH';
    lastSeen: string;
    status: 'ACTIVE' | 'SUSPENDED';
}

interface Policy {
    id: string;
    name: string;
    rule: string;
    status: 'ENABLED' | 'DISABLED';
    priority: number;
    target: string;
    signals: string[];
}

type ViewName = 'dashboard' | 'identities' | 'policy' | 'trust';

// --- Main Component ---
function App() {
    const [currentView, setCurrentView] = useState<ViewName>('dashboard');
    const [selectedLog, setSelectedLog] = useState<PipelineLog | null>(null);
    const [logs, setLogs] = useState<PipelineLog[]>([
        {
            id: 'req-7chxdq',
            identityId: 'user-123',
            score: 85,
            decision: 'ALLOW',
            reason: 'Compliant request',
            timestamp: new Date().toISOString(),
            details: {
                identity: { status: 'Verified', risk: 'Low', groups: ['Engineering', 'CloudOps'] },
                device: { os: 'Windows 11', status: 'Healthy', compliance: 'Compliant' },
                context: { ip: '192.168.1.45', location: 'San Francisco, US', network: 'Internal Corporate' }
            }
        },
        {
            id: 'req-xk92p1',
            identityId: 'anon-99',
            score: 12,
            decision: 'DENY',
            reason: 'High risk behavior',
            timestamp: new Date(Date.now() - 600000).toISOString(),
            details: {
                identity: { status: 'Unrecognized', risk: 'High', groups: [] },
                device: { os: 'Unknown', status: 'Unmanaged', compliance: 'Non-compliant' },
                context: { ip: '45.122.98.12', location: 'Eastern Europe', network: 'Public Cloud Proxy' }
            }
        }
    ]);

    const [identities] = useState<Identity[]>([
        { id: 'user-123', name: 'John Doe', risk: 'LOW', lastSeen: '2 min ago', status: 'ACTIVE' },
        { id: 'admin-01', name: 'Jane Smith', risk: 'LOW', lastSeen: '5 min ago', status: 'ACTIVE' },
        { id: 'anon-99', name: 'Anonymous Proxy', risk: 'HIGH', lastSeen: '10 min ago', status: 'SUSPENDED' },
    ]);

    const [policies] = useState<Policy[]>([
        {
            id: 'pol-01',
            name: 'Corporate Device Only',
            rule: 'device.compliance === "Compliant"',
            status: 'ENABLED',
            priority: 10,
            target: 'Internal Apps',
            signals: ['Device Posture', 'Identity Verification']
        },
        {
            id: 'pol-02',
            name: 'Geo-Fencing US/EU',
            rule: 'context.region IN ["US", "EU"]',
            status: 'ENABLED',
            priority: 20,
            target: 'Storage Assets',
            signals: ['Geography', 'IP Reputation']
        },
        {
            id: 'pol-03',
            name: 'Risk Score Threshold',
            rule: 'assessment.score > 60',
            status: 'ENABLED',
            priority: 5,
            target: 'Production Databases',
            signals: ['Aggregate Trust', 'Behavior Analytics']
        },
    ]);

    const [search, setSearch] = useState('');
    const [isSimulating, setIsSimulating] = useState(false);

    // --- Logic ---
    const filteredLogs = useMemo(() => {
        return logs.filter(log =>
            log.identityId.toLowerCase().includes(search.toLowerCase()) ||
            log.id.toLowerCase().includes(search.toLowerCase())
        );
    }, [logs, search]);

    const simulateRequest = () => {
        setIsSimulating(true);
        setTimeout(() => {
            const isDenied = Math.random() > 0.8;
            const newLog: PipelineLog = {
                id: `req-${Math.random().toString(36).substr(2, 6)}`,
                identityId: isDenied ? 'threat-actor-x' : 'trusted-user-beta',
                score: isDenied ? Math.floor(Math.random() * 30) : 70 + Math.floor(Math.random() * 30),
                decision: isDenied ? 'DENY' : 'ALLOW',
                reason: isDenied ? 'Anomalous network path' : 'Standard profile verified',
                timestamp: new Date().toISOString(),
                details: {
                    identity: { status: 'Active', risk: isDenied ? 'High' : 'Low', groups: isDenied ? [] : ['Users'] },
                    device: { os: 'MacOS', status: 'Managed', compliance: 'Compliant' },
                    context: { ip: '10.0.4.152', location: 'London, UK', network: 'VPN Gateway' }
                }
            };
            setLogs(prev => [newLog, ...prev]);
            setIsSimulating(false);
        }, 1200);
    };

    // --- Sub-components ---
    const DashboardView = () => (
        <div className="fade-in">
            <div className="metrics-grid">
                <MetricCard title="Avg Trust Score" value="78" progress={78} icon={<ArrowUpRight size={16} color="var(--text-primary)" />} />
                <MetricCard title="Identities Tracked" value={`${identities.length}`} icon={<Users size={16} color="var(--text-primary)" />} />
                <MetricCard title="System Node" value="Healthy" pulse icon={<Server size={16} color="var(--text-primary)" />} />
            </div>

            <section className="panel log-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Live Logs</h2>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input className="search-field" placeholder="Search..." style={{ paddingLeft: '40px' }} value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                </div>

                <table className="log-table">
                    <thead>
                        <tr>
                            <th>Identifier</th>
                            <th>Identity</th>
                            <th>Score</th>
                            <th>Status</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLogs.map(log => (
                            <tr key={log.id} className="log-row" onClick={() => setSelectedLog(log)}>
                                <td style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>{log.id}</td>
                                <td style={{ fontWeight: 500 }}>{log.identityId}</td>
                                <td><span style={{ fontWeight: 700, color: log.score > 50 ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{log.score}</span></td>
                                <td><span className={`status-badge ${log.decision.toLowerCase()}`}>{log.decision}</span></td>
                                <td><ChevronRight size={16} color="var(--text-muted)" /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );

    const IdentityView = () => (
        <div className="fade-in">
            <div className="header">
                <h1>Identity Explorer</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Monitoring all connected principals and their risk footprints</p>
            </div>
            <div className="panel" style={{ padding: '32px' }}>
                <table className="log-table">
                    <thead>
                        <tr>
                            <th>Identity ID</th>
                            <th>Name</th>
                            <th>Risk Level</th>
                            <th>Status</th>
                            <th>Last Active</th>
                        </tr>
                    </thead>
                    <tbody>
                        {identities.map(id => (
                            <tr key={id.id} className="log-row">
                                <td style={{ fontWeight: 600 }}>{id.id}</td>
                                <td>{id.name}</td>
                                <td>
                                    <span style={{ color: id.risk === 'HIGH' ? 'var(--text-secondary)' : 'var(--text-primary)' }}>● {id.risk}</span>
                                </td>
                                <td>
                                    <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>{id.status}</span>
                                </td>
                                <td style={{ color: 'var(--text-secondary)' }}>{id.lastSeen}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const PolicyView = () => (
        <div className="fade-in">
            <div className="header">
                <h1>Policy Engine</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Active access control rules and enforcement logic</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
                {policies.map(pol => (
                    <div key={pol.id} className="panel" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ background: 'var(--accent-light)', padding: '8px', borderRadius: '10px' }}>
                                    <Lock size={20} color="var(--text-primary)" />
                                </div>
                                <h3 style={{ fontSize: '1.1rem' }}>{pol.name}</h3>
                            </div>
                            <span className={`status-badge ${pol.status === 'ENABLED' ? 'allow' : 'deny'}`}>{pol.status}</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ background: '#111111', padding: '12px', borderRadius: '12px', border: '0.5px solid var(--border-main)' }}>
                                <span className="detail-label" style={{ marginBottom: '4px' }}>Logical Rule</span>
                                <code style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{pol.rule}</code>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="panel" style={{ padding: '12px', background: '#111111' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                        <Flag size={14} color="var(--text-muted)" />
                                        <span className="detail-label">Priority</span>
                                    </div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{pol.priority}</div>
                                </div>
                                <div className="panel" style={{ padding: '12px', background: '#111111' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                        <Target size={14} color="var(--text-muted)" />
                                        <span className="detail-label">Target Tier</span>
                                    </div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{pol.target}</div>
                                </div>
                            </div>

                            <div>
                                <span className="detail-label" style={{ marginBottom: '8px', display: 'block' }}>Required Signals</span>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {pol.signals.map(s => (
                                        <span key={s} style={{ fontSize: '0.7rem', background: 'var(--accent-light)', color: 'var(--text-primary)', padding: '4px 10px', borderRadius: '20px', border: '0.5px solid var(--text-primary)' }}>
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const TrustView = () => {
        const signals = [
            {
                label: 'Identity Signal',
                module: 'Module 1 – Identity',
                weight: 40,
                subSignals: ['Authentication Integrity', 'Historical Behavior', 'Group Affiliation Risk'],
                icon: <User size={20} color="var(--text-primary)" />,
                score: 88
            },
            {
                label: 'Device Signal',
                module: 'Module 2 – Device Trust',
                weight: 30,
                subSignals: ['OS Patch Level', 'Disk Encryption', 'EDR Agent Status', 'MDM Enrollment'],
                icon: <Smartphone size={20} color="var(--text-primary)" />,
                score: 74
            },
            {
                label: 'Context Signal',
                module: 'Module 3 – Context Engine',
                weight: 30,
                subSignals: ['Geolocation', 'IP Reputation', 'Network Path', 'Access Time'],
                icon: <Globe size={20} color="var(--text-primary)" />,
                score: 61
            },
        ];

        const pipelineSteps = [
            {
                step: '01',
                name: 'Signal Aggregator',
                file: 'signal.aggregator.ts',
                desc: 'Collects & normalizes raw signals from Modules 1, 2, 3 and optionally Behavior Analytics (Module 4) into a unified risk object.',
                icon: <Layers size={18} color="var(--text-primary)" />
            },
            {
                step: '02',
                name: 'Weighted Calculator',
                file: 'weighted.calculator.ts',
                desc: 'Applies per-signal weight ratios to the aggregated score. Weights are externally configurable to avoid hardcoding.',
                icon: <ArrowUpRight size={18} color="var(--text-primary)" />
            },
            {
                step: '03',
                name: 'Score Explainer',
                file: 'score.explainer.ts',
                desc: 'Generates human-readable explainability metadata and assigns a confidence label (LOW/MEDIUM/HIGH) to each decision.',
                icon: <FileText size={18} color="var(--text-primary)" />
            },
        ];

        const compositeScore = Math.round(
            signals.reduce((acc, s) => acc + (s.score * s.weight) / 100, 0)
        );

        return (
        <div className="fade-in">
            <div className="header">
                <h1>Trust Architect</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Module 5 — multi-signal weighted scoring pipeline</p>
            </div>

            {/* Top summary */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', marginBottom: '32px' }}>
                <div className="panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                    <Shield size={48} color="var(--text-primary)" style={{ filter: 'drop-shadow(0 0 16px var(--text-primary))' }} />
                    <div style={{ fontSize: '3.5rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: compositeScore >= 60 ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                        {compositeScore}
                    </div>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>Composite Trust Score</span>
                    <span style={{ 
                        fontSize: '0.75rem', padding: '4px 12px', borderRadius: '8px',
                        background: compositeScore >= 60 ? '#1e1e1e' : '#1c1c1c',
                        color: compositeScore >= 60 ? 'var(--text-primary)' : 'var(--text-secondary)',
                        border: `0.5px solid ${compositeScore >= 60 ? '#333333' : '#3a3a3a'}`
                    }}>
                        Confidence: {compositeScore >= 75 ? 'HIGH' : compositeScore >= 50 ? 'MEDIUM' : 'LOW'}
                    </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {signals.map(s => (
                        <div key={s.label} className="panel" style={{ padding: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    {s.icon}
                                    <div>
                                        <div style={{ fontWeight: 700 }}>{s.label}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{s.module} · Weight: {s.weight}%</div>
                                    </div>
                                </div>
                                <span style={{ fontWeight: 800, fontSize: '1.5rem', color: s.score >= 60 ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{s.score}</span>
                            </div>
                            <div style={{ width: '100%', height: '6px', background: '#222222', borderRadius: '3px' }}>
                                <div style={{ width: `${s.score}%`, height: '100%', background: s.score >= 60 ? 'var(--text-primary)' : 'var(--text-secondary)', borderRadius: '3px', boxShadow: 'none', transition: 'width 0.6s ease' }}></div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                                {s.subSignals.map(ss => (
                                    <span key={ss} style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', padding: '2px 8px', background: '#1a1a1a', border: '0.5px solid var(--border-main)', borderRadius: '4px' }}>{ss}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pipeline flow */}
            <div className="panel" style={{ padding: '32px' }}>
                <h3 style={{ marginBottom: '24px', fontSize: '1.1rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Scoring Pipeline (Module 5)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0' }}>
                    {pipelineSteps.map((step, i) => (
                        <div key={step.step} style={{ display: 'flex', alignItems: 'stretch', gap: '0' }}>
                            <div style={{ flex: 1, padding: '24px', background: '#111111', borderRadius: i === 0 ? '12px 0 0 12px' : i === 2 ? '0 12px 12px 0' : '0', border: '0.5px solid var(--border-main)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.1em' }}>STEP {step.step}</span>
                                    {step.icon}
                                </div>
                                <h4 style={{ marginBottom: '4px' }}>{step.name}</h4>
                                <code style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '12px' }}>{step.file}</code>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{step.desc}</p>
                            </div>
                            {i < 2 && <div style={{ display: 'flex', alignItems: 'center', padding: '0 2px', color: 'var(--text-secondary)', fontSize: '1.2rem' }}>→</div>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );};

    return (
        <div className="dashboard-container">
            <aside className="sidebar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px' }}>
                    <Shield size={28} color="var(--text-primary)" />
                    <span style={{ fontWeight: 800, fontSize: '1.4rem', fontFamily: 'var(--font-display)' }}>Z Horiizon</span>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <NavItem icon={<Activity size={20} />} label="Pipeline Monitor" active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} />
                    <NavItem icon={<Users size={20} />} label="Identities" active={currentView === 'identities'} onClick={() => setCurrentView('identities')} />
                    <NavItem icon={<Lock size={20} />} label="Policy Engine" active={currentView === 'policy'} onClick={() => setCurrentView('policy')} />
                    <NavItem icon={<ShieldCheck size={20} />} label="Trust Models" active={currentView === 'trust'} onClick={() => setCurrentView('trust')} />
                </nav>

                <button className="btn-simulate" style={{ marginTop: 'auto' }} onClick={simulateRequest} disabled={isSimulating}>
                    <Zap size={18} fill={isSimulating ? 'transparent' : 'white'} />
                    {isSimulating ? 'Processing...' : 'Simulate'}
                </button>
            </aside>

            <main className="main-content">
                {currentView === 'dashboard' && <DashboardView />}
                {currentView === 'identities' && <IdentityView />}
                {currentView === 'policy' && <PolicyView />}
                {currentView === 'trust' && <TrustView />}
            </main>

            {/* Log Detail Modal */}
            {selectedLog && (
                <div className="modal-overlay" onClick={() => setSelectedLog(null)}>
                    <div className="panel modal-content fade-in" onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
                            <div>
                                <span className="status-badge" style={{ marginBottom: '8px' }}>Request Analysis</span>
                                <h2 className="display-font">{selectedLog.id}</h2>
                            </div>
                            <X size={24} style={{ cursor: 'pointer' }} onClick={() => setSelectedLog(null)} />
                        </div>

                        <div className="detail-grid">
                            <section className="panel card">
                                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}><User size={20} color="var(--text-primary)" /> <strong>Identity Analysis</strong></div>
                                <div className="detail-item"><span className="detail-label">Subject ID</span><div className="detail-value">{selectedLog.identityId}</div></div>
                                <div className="detail-item"><span className="detail-label">Risk Profile</span><div className="detail-value">{selectedLog.details?.identity.risk}</div></div>
                                <div className="detail-item"><span className="detail-label">Affiliations</span><div className="detail-value">{selectedLog.details?.identity.groups.join(', ') || 'None'}</div></div>
                            </section>

                            <section className="panel card">
                                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}><Smartphone size={20} color="var(--text-primary)" /> <strong>Device Integrity</strong></div>
                                <div className="detail-item"><span className="detail-label">OS Platform</span><div className="detail-value">{selectedLog.details?.device.os}</div></div>
                                <div className="detail-item"><span className="detail-label">Posture Status</span><div className="detail-value">{selectedLog.details?.device.status}</div></div>
                                <div className="detail-item"><span className="detail-label">Compliance</span><div className="detail-value">{selectedLog.details?.device.compliance}</div></div>
                            </section>

                            <section className="panel card" style={{ gridColumn: 'span 2' }}>
                                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}><Globe size={20} color="var(--text-primary)" /> <strong>Contextual Signals</strong></div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                                    <div className="detail-item"><span className="detail-label">IP Address</span><div className="detail-value">{selectedLog.details?.context.ip}</div></div>
                                    <div className="detail-item"><span className="detail-label">Origin</span><div className="detail-value">{selectedLog.details?.context.location}</div></div>
                                    <div className="detail-item"><span className="detail-label">Network Tier</span><div className="detail-value">{selectedLog.details?.context.network}</div></div>
                                </div>
                            </section>
                        </div>

                        <div className="panel" style={{ marginTop: '32px', padding: '24px', borderLeft: `4px solid ${selectedLog.decision === 'ALLOW' ? 'var(--text-primary)' : 'var(--text-secondary)'}` }}>
                            <div className="detail-label">Final Enforcement Outcome</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                                <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>{selectedLog.decision} | {selectedLog.reason}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// --- Utils ---
function NavItem({ icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick: () => void }) {
    return (
        <div
            onClick={onClick}
            style={{
                padding: '12px 16px',
                borderRadius: '12px',
                background: active ? 'var(--accent-light)' : 'transparent',
                color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: active ? '0.5px solid var(--text-primary)' : '0.5px solid transparent'
            }}
        >
            {icon}
            <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{label}</span>
            {active && <div style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-primary)', boxShadow: '0 0 8px var(--text-primary)' }}></div>}
        </div>
    )
}

function MetricCard({ title, value, icon, progress, pulse }: { title: string, value: string, icon: any, progress?: number, pulse?: boolean }) {
    return (
        <div className="panel metric-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>{title}</span>
                {icon}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800 }}>{value}</span>
                {pulse && <div className="pulse" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--text-primary)' }}></div>}
            </div>
            {progress !== undefined && (
                <div style={{ width: '100%', height: '4px', background: '#222222', borderRadius: '2px', marginTop: '12px' }}>
                    <div style={{ width: `${progress}%`, height: '100%', background: 'var(--text-primary)' }}></div>
                </div>
            )}
        </div>
    )
}

export default App
