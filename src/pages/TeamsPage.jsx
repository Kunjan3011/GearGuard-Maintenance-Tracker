import { useState } from 'react';
import { useMaintenance } from '../context/MaintenanceContext';
import { useAuth } from '../context/AuthContext';
import { Users, Shield, Zap, Wrench, Plus, Edit3, LayoutGrid, List } from 'lucide-react';
import TeamModal from '../components/TeamModal';

export default function TeamsPage() {
    const { user } = useAuth();
    const { teams, technicians } = useMaintenance();

    const [selectedTeam, setSelectedTeam] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState('grid');

    const getTeamIcon = (name) => {
        if (name.toLowerCase().includes('it')) return Zap;
        if (name.toLowerCase().includes('electrician') || name.toLowerCase().includes('mechanic')) return Wrench;
        return Shield;
    };

    const handleEdit = (team) => {
        setSelectedTeam(team);
        setIsModalOpen(true);
    };

    const handleNew = () => {
        setSelectedTeam(null);
        setIsModalOpen(true);
    };

    return (
        <div className="animate-fade">
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Maintenance Units</h1>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Orchestrate specialized teams for efficient facility up-keep.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--color-bg-app)', padding: '0.4rem', borderRadius: 'var(--radius-lg)', marginRight: '1rem' }}>
                    <button
                        onClick={() => setViewMode('grid')}
                        style={{
                            padding: '0.5rem',
                            borderRadius: 'var(--radius-md)',
                            border: 'none',
                            background: viewMode === 'grid' ? 'white' : 'transparent',
                            color: viewMode === 'grid' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                            boxShadow: viewMode === 'grid' ? 'var(--shadow-sm)' : 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'all 0.2s'
                        }}
                    >
                        <LayoutGrid size={18} />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        style={{
                            padding: '0.5rem',
                            borderRadius: 'var(--radius-md)',
                            border: 'none',
                            background: viewMode === 'list' ? 'white' : 'transparent',
                            color: viewMode === 'list' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                            boxShadow: viewMode === 'list' ? 'var(--shadow-sm)' : 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'all 0.2s'
                        }}
                    >
                        <List size={18} />
                    </button>
                </div>
                {user?.role === 'admin' && (
                    <button className="btn btn-primary" onClick={handleNew} style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-lg)' }}>
                        <Plus size={20} /> NEW UNIT
                    </button>
                )}
            </div>

            {viewMode === 'grid' ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {teams.map(team => {
                        const teamTechs = technicians.filter(t => t.team_id === team.id);
                        const Icon = getTeamIcon(team.name);

                        return (
                            <div key={team.id} className="card" onClick={() => user?.role === 'admin' && handleEdit(team)} style={{ cursor: user?.role === 'admin' ? 'pointer' : 'default', padding: '1.75rem', border: 'none', boxShadow: 'var(--shadow-md)', background: 'white', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                                {user?.role === 'admin' && (
                                    <button className="btn-link" style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', opacity: 0.4 }}><Edit3 size={16} /></button>
                                )}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
                                    <div style={{
                                        padding: '0.8rem',
                                        backgroundColor: 'var(--color-bg-app)',
                                        borderRadius: 'var(--radius-lg)',
                                        color: 'var(--color-primary)',
                                        boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.05)'
                                    }}>
                                        <Icon size={24} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-main)', fontFamily: 'Outfit' }}>{team.name}</h2>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Led by</span>
                                            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>{team.leader}</span>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <h3 style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '1rem', letterSpacing: '0.05em' }}>Personnel</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {teamTechs.map(tech => (
                                            <div key={tech.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem', borderRadius: 'var(--radius-sm)', transition: 'background 0.2s' }}>
                                                <div style={{ position: 'relative' }}>
                                                    <img src={tech.avatar} alt={tech.name} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid white', boxShadow: 'var(--shadow-sm)' }} />
                                                    <div style={{ position: 'absolute', bottom: 0, right: 0, width: '10px', height: '10px', background: 'var(--color-repaired)', border: '2px solid white', borderRadius: '50%' }}></div>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-main)' }}>{tech.name}</span>
                                                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Specialist</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div style={{
                                    marginTop: 'auto',
                                    paddingTop: '1.25rem',
                                    borderTop: '1px solid var(--color-border)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-secondary)' }}>{teamTechs.length} Members</span>
                                    <div style={{ display: 'flex', marginLeft: 'auto' }}>
                                        {teamTechs.slice(0, 3).map((t, idx) => (
                                            <img key={t.id} src={t.avatar} style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid white', marginLeft: idx === 0 ? 0 : '-8px', boxShadow: 'var(--shadow-sm)' }} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="card" style={{ padding: 0, overflow: 'hidden', border: 'none', boxShadow: 'var(--shadow-md)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ backgroundColor: 'var(--color-bg-app)', borderBottom: '1px solid var(--color-border)' }}>
                            <tr>
                                <th style={{ padding: '1.25rem 1.5rem', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>Unit</th>
                                <th style={{ padding: '1.25rem 1.5rem', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>Leader</th>
                                <th style={{ padding: '1.25rem 1.5rem', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>Members</th>
                                <th style={{ padding: '1.25rem 1.5rem', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teams.map(team => {
                                const teamTechs = technicians.filter(t => t.team_id === team.id);
                                const Icon = getTeamIcon(team.name);

                                return (
                                    <tr key={team.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.2s' }}>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{
                                                    padding: '0.5rem',
                                                    backgroundColor: 'var(--color-bg-app)',
                                                    borderRadius: 'var(--radius-md)',
                                                    color: 'var(--color-primary)'
                                                }}>
                                                    <Icon size={18} />
                                                </div>
                                                <span style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>{team.name}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>{team.leader}</span>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{ display: 'flex' }}>
                                                    {teamTechs.slice(0, 3).map((t, idx) => (
                                                        <img key={t.id} src={t.avatar} style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid white', marginLeft: idx === 0 ? 0 : '-8px', boxShadow: 'var(--shadow-sm)' }} />
                                                    ))}
                                                </div>
                                                <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{teamTechs.length} members</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                                            {user?.role === 'admin' && (
                                                <button
                                                    onClick={() => handleEdit(team)}
                                                    className="btn-link"
                                                    style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '13px' }}
                                                >
                                                    Configure
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            <TeamModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                team={selectedTeam}
            />
        </div>
    );
}
