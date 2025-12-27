import { useState } from 'react';
import { useMaintenance } from '../context/MaintenanceContext';
import { Factory, Plus, Edit3, Trash2, Zap, LayoutGrid, List } from 'lucide-react';
import WorkCenterModal from '../components/WorkCenterModal';

import { useAuth } from '../context/AuthContext';

export default function WorkCenterPage() {
    const { user } = useAuth();
    const { workCenters, deleteWorkCenter } = useMaintenance();
    const [viewMode, setViewMode] = useState('grid');
    const [selectedWC, setSelectedWC] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleEdit = (wc) => {
        setSelectedWC(wc);
        setIsModalOpen(true);
    };

    const handleNew = () => {
        setSelectedWC(null);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Permanently delete this work center?")) {
            await deleteWorkCenter(id);
        }
    };

    return (
        <div className="animate-fade">
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem', alignItems: 'center' }}>
                <div style={{ padding: '1rem', background: 'var(--color-primary)', borderRadius: 'var(--radius-xl)', color: 'white', boxShadow: 'var(--shadow-lg)' }}>
                    <Factory size={32} />
                </div>
                <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Work Centers</h1>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Manage production units and operational efficiency targets.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <div className="toggle-group" style={{ display: 'flex', background: 'white', borderRadius: 'var(--radius-md)', padding: '0.25rem', boxShadow: 'var(--shadow-sm)' }}>
                        <button onClick={() => setViewMode('grid')} className={`btn-link ${viewMode === 'grid' ? 'active' : ''}`} style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', background: viewMode === 'grid' ? 'var(--color-bg-app)' : 'transparent' }}>
                            <LayoutGrid size={18} />
                        </button>
                        <button onClick={() => setViewMode('list')} className={`btn-link ${viewMode === 'list' ? 'active' : ''}`} style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', background: viewMode === 'list' ? 'var(--color-bg-app)' : 'transparent' }}>
                            <List size={18} />
                        </button>
                    </div>
                    {['admin', 'manager'].includes(user?.role) && (
                        <button className="btn btn-primary" onClick={handleNew} style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-lg)' }}>
                            <Plus size={20} /> NEW CENTER
                        </button>
                    )}
                </div>
            </div>

            {viewMode === 'grid' ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    {workCenters.map(wc => (
                        <div key={wc.id} className="card hover-lift" style={{ padding: '1.5rem', cursor: 'pointer' }} onClick={() => handleEdit(wc)}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-text-main)' }}>{wc.name}</h3>
                                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{wc.code}</span>
                                </div>
                                <div style={{ padding: '0.5rem', background: 'rgba(52, 152, 219, 0.1)', color: 'var(--color-primary)', borderRadius: 'var(--radius-md)' }}>
                                    <Zap size={20} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                                <div>
                                    <p style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-text-muted)', marginBottom: '0.2rem' }}>OEE TARGET</p>
                                    <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)' }}>{wc.oee_target}%</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-text-muted)', marginBottom: '0.2rem' }}>TIME EFFICIENCY</p>
                                    <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-main)' }}>{wc.time_efficiency}%</p>
                                </div>
                            </div>

                            <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '12px', padding: '0.25rem 0.6rem', background: '#f1f5f9', borderRadius: '4px', fontWeight: 700 }}>{wc.tag || 'Production'}</span>
                            </div>
                            {['admin', 'manager'].includes(user?.role) && (
                                <button className="btn-link" onClick={(e) => { e.stopPropagation(); handleDelete(wc.id); }} style={{ color: 'var(--color-scrap)', opacity: 0.6 }}>
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: '#f8fafc', borderBottom: '1px solid var(--color-border)' }}>
                            <tr>
                                <th style={{ padding: '1rem 1.5rem', fontSize: '11px', fontWeight: 800, color: 'var(--color-text-muted)' }}>WORK CENTER</th>
                                <th style={{ padding: '1rem 1.5rem', fontSize: '11px', fontWeight: 800, color: 'var(--color-text-muted)' }}>CODE</th>
                                <th style={{ padding: '1rem 1.5rem', fontSize: '11px', fontWeight: 800, color: 'var(--color-text-muted)' }}>TAG</th>
                                <th style={{ padding: '1rem 1.5rem', fontSize: '11px', fontWeight: 800, color: 'var(--color-text-muted)' }}>ALTERNATIVE WORKCENTERS</th>
                                <th style={{ padding: '1rem 1.5rem', fontSize: '11px', fontWeight: 800, color: 'var(--color-text-muted)' }}>COST/HR</th>
                                <th style={{ padding: '1rem 1.5rem', fontSize: '11px', fontWeight: 800, color: 'var(--color-text-muted)' }}>CAPACITY</th>
                                <th style={{ padding: '1rem 1.5rem', fontSize: '11px', fontWeight: 800, color: 'var(--color-text-muted)' }}>TIME EFFICIENCY</th>
                                <th style={{ padding: '1rem 1.5rem', fontSize: '11px', fontWeight: 800, color: 'var(--color-text-muted)' }}>OEE TARGET</th>
                                <th style={{ padding: '1rem 1.5rem', fontSize: '11px', fontWeight: 800, color: 'var(--color-text-muted)', textAlign: 'right' }}>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {workCenters.map(wc => (
                                <tr key={wc.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }} className="hover-row">
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <div style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>{wc.name}</div>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', fontSize: '13px', fontFamily: 'monospace', color: 'var(--color-text-secondary)' }}>{wc.code}</td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <span style={{ fontSize: '11px', padding: '0.2rem 0.5rem', background: 'var(--color-bg-app)', border: '1px solid var(--color-border)', borderRadius: '4px', fontWeight: 700 }}>{wc.tag}</span>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', fontSize: '12px', color: 'var(--color-text-muted)' }}>{wc.alternative_workcenters || '-'}</td>
                                    <td style={{ padding: '1rem 1.5rem', fontWeight: 700 }}>${wc.cost_per_hour.toFixed(2)}</td>
                                    <td style={{ padding: '1rem 1.5rem', fontWeight: 700 }}>{wc.capacity_time.toFixed(2)}</td>
                                    <td style={{ padding: '1rem 1.5rem', fontWeight: 700 }}>{wc.time_efficiency.toFixed(2)}</td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <div style={{ width: '100px', height: '6px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden', marginBottom: '4px' }}>
                                            <div style={{ width: `${wc.oee_target}%`, height: '100%', background: 'var(--color-primary)' }}></div>
                                        </div>
                                        <span style={{ fontSize: '12px', fontWeight: 800 }}>{wc.oee_target}%</span>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                        {['admin', 'manager'].includes(user?.role) && (
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                <button className="btn-link" onClick={() => handleEdit(wc)} style={{ color: 'var(--color-primary)' }}><Edit3 size={16} /></button>
                                                <button className="btn-link" onClick={() => handleDelete(wc.id)} style={{ color: 'var(--color-scrap)' }}><Trash2 size={16} /></button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )
            }

            <WorkCenterModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} workCenter={selectedWC} />
        </div >
    );
}
