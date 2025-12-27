import { useState } from 'react';
import { useMaintenance } from '../context/MaintenanceContext';
import { ClipboardList, AlertTriangle, CheckCircle, Calendar, Bell, ShieldCheck, ZapOff, Plus, Clock, Search, Box } from 'lucide-react';
import RequestModal from '../components/RequestModal';

export default function Dashboard() {
    const { requests, equipment, technicians } = useMaintenance();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showSearch, setShowSearch] = useState(false);

    // Filter function for search
    const filterBySearch = (items, searchFields) => {
        if (!searchTerm.trim()) return items;
        const lowerSearch = searchTerm.toLowerCase();
        return items.filter(item =>
            searchFields.some(field => {
                const value = field(item);
                return value && value.toString().toLowerCase().includes(lowerSearch);
            })
        );
    };

    // Apply search filters
    const filteredRequests = filterBySearch(requests, [
        r => r.equipment_name,
        r => r.type,
        r => r.stage,
        r => r.description,
        r => r.scheduled_date,
        r => r.assigned_to
    ]);

    const filteredEquipment = filterBySearch(equipment, [
        e => e.name,
        e => e.serial_number,
        e => e.manufacturer,
        e => e.location,
        e => e.status
    ]);

    // Helper functions for request tracking
    const getOverdueRequests = () => {
        const now = new Date();
        return filteredRequests.filter(req => {
            if (req.stage === 'Repaired' || req.stage === 'Scrap') return false;
            const scheduledDate = new Date(req.scheduled_date);
            return scheduledDate < now;
        });
    };

    const getRequestsOnTrack = () => {
        const now = new Date();
        return filteredRequests.filter(req => {
            if (req.stage === 'Repaired') return true;
            const scheduledDate = new Date(req.scheduled_date);
            return scheduledDate >= now;
        });
    };

    const getCriticalEquipment = () => {
        return filteredEquipment.filter(e => e.health < 50 || e.status === 'scrapped');
    };

    const getScheduledMaintenance = () => {
        return filteredRequests.filter(r => r.type === 'Preventive' && r.stage !== 'Repaired');
    };

    const overdueRequests = getOverdueRequests();
    const onTrackRequests = getRequestsOnTrack();
    const criticalEquipment = getCriticalEquipment();
    const scheduledMaintenance = getScheduledMaintenance();

    const { getTechnicianLoad } = useMaintenance();

    const getTechnicianLoadData = () => {
        return technicians.map(tech => {
            const loadPercentage = getTechnicianLoad(tech.id);
            const activeRequests = requests.filter(r =>
                r.technician_id === tech.id &&
                r.stage !== 'Repaired' &&
                r.stage !== 'Scrap'
            ).length;
            return { ...tech, activeRequests, loadPercentage };
        }).sort((a, b) => b.loadPercentage - a.loadPercentage);
    };

    const technicianLoad = getTechnicianLoadData();

    const stats = [
        {
            label: 'Critical Alerts',
            value: criticalEquipment.length,
            icon: AlertTriangle,
            color: '#ef4444',
            gradient: 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)',
            subtitle: 'Equipment at risk'
        },
        {
            label: 'Scheduled Maintenance',
            value: scheduledMaintenance.length,
            icon: Calendar,
            color: '#6366f1',
            gradient: 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)',
            subtitle: 'Preventive tasks'
        },
        {
            label: 'Technician Load',
            value: technicianLoad.length, // Not directly used in display
            icon: Bell, // Using Bell as placeholder, ideally Wrench or Users
            color: '#06b6d4',
            gradient: 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)',
            subtitle: 'Active requests per tech',
            isTechnicianCard: true,
            technicianLoad: technicianLoad
        },
        {
            label: 'On Track',
            value: `${Math.round((onTrackRequests.length / Math.max(filteredRequests.length, 1)) * 100)}%`,
            icon: CheckCircle,
            color: '#10b981',
            gradient: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
            subtitle: `${onTrackRequests.length}/${filteredRequests.length} requests`
        },
    ];

    return (
        <div className="animate-fade">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text-main)' }}>Maintenance Hub</h1>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Real-time overview of your facility's operational health.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {showSearch && (
                        <input
                            type="text"
                            placeholder="Search equipment, requests..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                padding: '0.8rem 1rem',
                                borderRadius: 'var(--radius-lg)',
                                border: '2px solid var(--color-border)',
                                background: 'var(--color-bg-secondary)',
                                color: 'var(--color-text-main)',
                                fontSize: '0.9rem',
                                width: '250px',
                                transition: 'all 0.3s ease',
                                outline: 'none'
                            }}
                            onBlur={() => {
                                if (!searchTerm) setShowSearch(false);
                            }}
                            autoFocus
                        />
                    )}
                    <button
                        className="btn btn-secondary"
                        onClick={() => setShowSearch(!showSearch)}
                        style={{
                            padding: '0.8rem 1.5rem',
                            borderRadius: 'var(--radius-lg)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <Search size={20} /> SEARCH
                    </button>
                    <button className="btn btn-primary" onClick={() => setIsModalOpen(true)} style={{ padding: '0.8rem 1.5rem', borderRadius: 'var(--radius-lg)' }}>
                        <Plus size={20} /> NEW REQUEST
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                {stats.map(s => (
                    <div key={s.label} className="card" style={{
                        padding: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                        background: s.gradient,
                        border: 'none',
                        color: 'white',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.15 }}>
                            <s.icon size={80} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '13px', fontWeight: 600, opacity: 0.9 }}>{s.label}</span>
                            <s.icon size={20} />
                        </div>

                        {s.isTechnicianCard ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '100px', overflowY: 'auto' }}>
                                {s.technicianLoad.slice(0, 3).map(tech => (
                                    <div key={tech.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
                                                {tech.name.charAt(0)}
                                            </div>
                                            <span>{tech.name}</span>
                                        </div>
                                        <span style={{ fontWeight: 800 }}>{tech.loadPercentage}%</span>
                                    </div>
                                ))}
                                {s.technicianLoad.length > 3 && (
                                    <div style={{ fontSize: '10px', opacity: 0.8, textAlign: 'center' }}>
                                        + {s.technicianLoad.length - 3} more
                                    </div>
                                )}
                            </div>
                        ) : s.isNotificationCard ? (
                            // Keeping this block if we ever revert or for reference, though logic is removed from array above
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                    <div>
                                        <div style={{ fontSize: '24px', fontWeight: 800 }}>{s.notifications}</div>
                                        <div style={{ fontSize: '11px', opacity: 0.8 }}>Notifications</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '24px', fontWeight: 800 }}>{s.alerts}</div>
                                        <div style={{ fontSize: '11px', opacity: 0.8 }}>Alerts</div>
                                    </div>
                                    <div style={{
                                        backgroundColor: 'rgba(239, 68, 68, 0.3)',
                                        padding: '0.5rem 0.75rem',
                                        borderRadius: '8px',
                                        border: '2px solid rgba(255, 255, 255, 0.5)'
                                    }}>
                                        <div style={{ fontSize: '24px', fontWeight: 800, color: '#fff' }}>{s.overdue}</div>
                                        <div style={{ fontSize: '11px', opacity: 0.9, fontWeight: 600 }}>OVERDUE</div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h2 style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'Outfit' }}>{s.value}</h2>
                                <p style={{ fontSize: '12px', opacity: 0.8, marginTop: '-0.5rem' }}>{s.subtitle}</p>
                            </>
                        )}
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
                <div className="card" style={{ padding: '2rem' }}>
                    <h3 style={{ fontSize: '18px', marginBottom: '2rem', fontWeight: 700 }}>Maintenance Efficiency</h3>
                    <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', gap: '3rem', padding: '1rem 2rem', borderLeft: '2px solid var(--color-border)', borderBottom: '2px solid var(--color-border)', position: 'relative' }}>
                        {[
                            { label: 'Preventive', val: '75%', color: 'var(--color-primary)' },
                            { label: 'Corrective', val: '45%', color: 'var(--color-accent)' },
                            { label: 'Scrap', val: '15%', color: 'var(--color-scrap)' }
                        ].map(bar => (
                            <div key={bar.label} style={{ flex: 1, backgroundColor: bar.color, height: bar.val, borderRadius: '8px 8px 0 0', position: 'relative', transition: 'height 0.5s ease' }}>
                                <span style={{ position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)', fontSize: '12px', fontWeight: 700, color: bar.color }}>{bar.val}</span>
                                <span style={{ position: 'absolute', bottom: '-35px', left: '50%', transform: 'translateX(-50%)', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>{bar.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card" style={{ padding: '2rem' }}>
                    <h3 style={{ fontSize: '18px', marginBottom: '1.5rem', fontWeight: 700 }}>
                        {searchTerm ? `Equipment Results (${filteredEquipment.length})` : 'Critical Equipment'}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {filteredEquipment.length > 0 ? (
                            filteredEquipment.slice(0, 5).map(e => (
                                <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid #edf2f7' }}>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
                                            <AlertTriangle size={20} color="var(--color-scrap)" />
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: 700, fontSize: '14px', color: 'var(--color-text-main)' }}>{e.name}</p>
                                            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{e.serial_number}</p>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ color: 'var(--color-primary)', fontWeight: 800, fontSize: '16px' }}>{e.health}%</p>
                                        <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Health</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                                <p>No equipment found matching "{searchTerm}"</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="card animate-fade-in" style={{ marginTop: '1.5rem', padding: '2rem', boxShadow: 'var(--shadow-premium)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text-main)', fontFamily: 'Outfit' }}>Equipment Fleet Status</h3>
                        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>Live health monitoring across all active facility assets.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text-main)' }}>{equipment.length}</div>
                            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Total Assets</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-repaired)' }}>
                                {equipment.filter(e => e.status === 'operational').length}
                            </div>
                            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Operational</div>
                        </div>
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table className="table-view" style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'left', padding: '0.5rem 1rem', color: 'var(--color-text-muted)', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Asset / Serial No.</th>
                                <th style={{ textAlign: 'left', padding: '0.5rem 1rem', color: 'var(--color-text-muted)', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Department</th>
                                <th style={{ textAlign: 'left', padding: '0.5rem 1rem', color: 'var(--color-text-muted)', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Location</th>
                                <th style={{ textAlign: 'center', padding: '0.5rem 1rem', color: 'var(--color-text-muted)', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Health Score</th>
                                <th style={{ textAlign: 'right', padding: '0.5rem 1rem', color: 'var(--color-text-muted)', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEquipment.map(e => (
                                <tr key={e.id} style={{ background: '#f8fafc', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'} onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f8fafc'}>
                                    <td style={{ padding: '1rem', borderRadius: '12px 0 0 12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)', border: '1px solid #edf2f7' }}>
                                                <Box size={20} color="var(--color-primary)" />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--color-text-main)' }}>{e.name}</div>
                                                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{e.serial_number}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>{e.department}</td>
                                    <td style={{ padding: '1rem', fontSize: '13px', color: 'var(--color-text-muted)' }}>{e.location}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
                                            <div style={{ width: '100px', height: '8px', background: 'white', borderRadius: '4px', overflow: 'hidden', border: '1px solid #edf2f7' }}>
                                                <div style={{
                                                    width: `${e.health}%`,
                                                    height: '100%',
                                                    background: e.health > 80 ? 'var(--color-repaired)' : e.health > 50 ? 'var(--color-accent)' : 'var(--color-scrap)',
                                                    borderRadius: '4px',
                                                    transition: 'width 1s ease-in-out'
                                                }}></div>
                                            </div>
                                            <span style={{ fontSize: '13px', fontWeight: 800, color: e.health > 80 ? 'var(--color-repaired)' : e.health > 50 ? 'var(--color-accent)' : 'var(--color-scrap)', minWidth: '40px' }}>{e.health}%</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right', borderRadius: '0 12px 12px 0' }}>
                                        <span style={{
                                            padding: '0.4rem 1rem',
                                            borderRadius: '100px',
                                            fontSize: '11px',
                                            fontWeight: 800,
                                            textTransform: 'uppercase',
                                            backgroundColor: e.status === 'operational' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                            color: e.status === 'operational' ? 'var(--color-repaired)' : 'var(--color-scrap)',
                                            border: `1px solid ${e.status === 'operational' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                                        }}>
                                            {e.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <RequestModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
