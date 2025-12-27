import { useState } from 'react';
import { useMaintenance } from '../context/MaintenanceContext';
import { useAuth } from '../context/AuthContext';
import { ChevronRight, ChevronLeft, Star, Clock, AlertTriangle, Plus } from 'lucide-react';
import RequestModal from '../components/RequestModal';

export default function KanbanBoard() {
    const { user } = useAuth();
    const { requests, updateRequestStage, technicians, equipment, workCenters } = useMaintenance();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [sortBy, setSortBy] = useState('date'); // date, priority, none
    const [showSortMenu, setShowSortMenu] = useState(false);

    const handleOpenModal = (req = null) => {
        setSelectedRequest(req);
        setIsModalOpen(true);
    };

    const sortRequests = (reqs) => {
        if (sortBy === 'date') {
            return [...reqs].sort((a, b) => new Date(a.scheduled_date) - new Date(b.scheduled_date));
        } else if (sortBy === 'priority') {
            const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
            return [...reqs].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        }
        return reqs;
    };

    const stages = ['New', 'In Progress', 'Repaired', 'Scrap'];
    const getStageColor = (stage) => {
        switch (stage) {
            case 'New': return 'var(--color-new)';
            case 'In Progress': return 'var(--color-progress)';
            case 'Repaired': return 'var(--color-repaired)';
            case 'Scrap': return 'var(--color-scrap)';
            default: return 'var(--color-primary)';
        }
    };

    const getStageLabel = (stage) => {
        if (stage === 'New') return 'New Request';
        return stage;
    };

    const isOverdue = (date) => new Date(date) < new Date();

    return (
        <div className="animate-fade">
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Maintenance Pipeline</h1>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Track request status from initial report to resolution.</p>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <button
                            className="btn btn-secondary"
                            style={{ borderRadius: 'var(--radius-md)' }}
                            onClick={() => setShowSortMenu(!showSortMenu)}
                        >
                            Sort: {sortBy === 'date' ? 'Date' : sortBy === 'priority' ? 'Priority' : 'None'}
                        </button>
                        {showSortMenu && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                right: 0,
                                marginTop: '0.5rem',
                                background: 'white',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-md)',
                                boxShadow: 'var(--shadow-lg)',
                                zIndex: 1000,
                                minWidth: '150px',
                                overflow: 'hidden'
                            }}>
                                <button
                                    onClick={() => { setSortBy('date'); setShowSortMenu(false); }}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        border: 'none',
                                        background: sortBy === 'date' ? '#f1f5f9' : 'white',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        fontSize: '0.875rem',
                                        fontWeight: 600
                                    }}
                                >
                                    Sort by Date
                                </button>
                                <button
                                    onClick={() => { setSortBy('priority'); setShowSortMenu(false); }}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        border: 'none',
                                        background: sortBy === 'priority' ? '#f1f5f9' : 'white',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        fontSize: '0.875rem',
                                        fontWeight: 600
                                    }}
                                >
                                    Sort by Priority
                                </button>
                                <button
                                    onClick={() => { setSortBy('none'); setShowSortMenu(false); }}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        border: 'none',
                                        background: sortBy === 'none' ? '#f1f5f9' : 'white',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        fontSize: '0.875rem',
                                        fontWeight: 600
                                    }}
                                >
                                    No Sort
                                </button>
                            </div>
                        )}
                    </div>
                    <button className="btn btn-primary" onClick={() => { handleOpenModal(); }} style={{ borderRadius: 'var(--radius-md)' }}>
                        <Plus size={18} /> NEW REQUEST
                    </button>
                </div>
            </div>

            <div className="kanban-container" style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem' }}>
                {stages.map((stage) => {
                    const stageRequests = sortRequests(requests.filter(r => r.stage === stage));
                    return (
                        <div key={stage} className="kanban-col" style={{ flex: '0 0 320px', background: '#f1f5f9', borderRadius: 'var(--radius-lg)', padding: '0.75rem', display: 'flex', flexDirection: 'column', height: 'fit-content', minHeight: '500px' }}>
                            <div className="kanban-col-header" style={{
                                padding: '1rem 0.5rem',
                                borderBottom: '3px solid ' + getStageColor(stage),
                                marginBottom: '1rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                color: 'var(--color-text-main)',
                                textTransform: 'none',
                                fontSize: '14px',
                                fontWeight: 800
                            }}>
                                <span>{getStageLabel(stage)}</span>
                                <span style={{ opacity: 0.5, fontWeight: 600 }}>{stageRequests.length}</span>
                            </div>

                            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.25rem' }}>
                                {stageRequests.map((req) => {
                                    const tech = technicians.find(t => t.id === req.technician_id);
                                    const equip = equipment.find(e => e.id === req.equipment_id);
                                    const wc = workCenters.find(w => w.id === req.work_center_id);
                                    const overdue = isOverdue(req.scheduled_date) && stage !== 'Repaired' && stage !== 'Scrap';

                                    return (
                                        <div key={req.id} className="kanban-item card" onClick={() => handleOpenModal(req)} style={{
                                            cursor: 'pointer',
                                            padding: '1.25rem',
                                            marginBottom: '0.75rem',
                                            border: '1px solid var(--color-border)',
                                            background: 'white'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', gap: '0.5rem', alignItems: 'flex-start' }}>
                                                <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-text-main)', lineHeight: '1.3', flex: 1 }}>{req.subject}</span>
                                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                    {overdue && (
                                                        <div style={{
                                                            backgroundColor: '#ef4444',
                                                            color: 'white',
                                                            padding: '0.25rem 0.5rem',
                                                            borderRadius: '4px',
                                                            fontSize: '10px',
                                                            fontWeight: 700,
                                                            letterSpacing: '0.5px'
                                                        }}>
                                                            OVERDUE
                                                        </div>
                                                    )}
                                                    <Star size={16} fill={req.priority === 'High' ? '#f59e0b' : 'none'} color={req.priority === 'High' ? '#f59e0b' : '#cbd5e1'} />
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: getStageColor(stage) }}></div>
                                                <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>{equip?.name || wc?.name || 'Unassigned'}</span>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <div style={{
                                                    padding: '0.3rem 0.6rem',
                                                    borderRadius: 'var(--radius-sm)',
                                                    backgroundColor: overdue ? 'rgba(239, 68, 68, 0.15)' : '#f8fafc',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.4rem',
                                                    fontSize: '11px',
                                                    color: overdue ? '#ef4444' : 'var(--color-text-muted)',
                                                    border: overdue ? '1px solid rgba(239, 68, 68, 0.3)' : 'none'
                                                }}>
                                                    <Clock size={12} />
                                                    <span style={{ fontWeight: 700 }}>{req.scheduled_date}</span>
                                                </div>

                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    {user?.role !== 'employee' && (
                                                        <div style={{ display: 'flex', gap: '4px' }}>
                                                            <button className="btn-link" style={{ padding: 4 }} onClick={(e) => { e.stopPropagation(); updateRequestStage(req.id, stages[stages.indexOf(stage) - 1]); }} disabled={stages.indexOf(stage) === 0}>
                                                                <ChevronLeft size={16} />
                                                            </button>
                                                            <button className="btn-link" style={{ padding: 4 }} onClick={(e) => { e.stopPropagation(); updateRequestStage(req.id, stages[stages.indexOf(stage) + 1]); }} disabled={stages.indexOf(stage) === stages.length - 1}>
                                                                <ChevronRight size={16} />
                                                            </button>
                                                        </div>
                                                    )}
                                                    <img src={tech?.avatar} alt={tech?.name} style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid white', boxShadow: 'var(--shadow-sm)' }} />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            <RequestModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                request={selectedRequest}
            />
        </div>
    );
}
