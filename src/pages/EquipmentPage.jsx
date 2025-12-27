import { useState } from 'react';
import { useMaintenance } from '../context/MaintenanceContext';
import { useAuth } from '../context/AuthContext';
import { Search, Plus, List, LayoutGrid, Wrench, ShieldCheck, Trash2, Sparkles, X, Tags, ArrowLeft } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import EquipmentModal from '../components/EquipmentModal';

export default function EquipmentPage() {
    const { user } = useAuth();
    const { equipment, getEquipmentRequests, deleteEquipment } = useMaintenance();
    const [search, setSearch] = useState('');
    const [viewMode, setViewMode] = useState('kanban');
    const [selectedEq, setSelectedEq] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSimilarModalOpen, setIsSimilarModalOpen] = useState(false);
    const [modalItem, setModalItem] = useState(null);
    const [searchParams] = useSearchParams();
    const categoryId = searchParams.get('category');
    const navigate = useNavigate();
    const { getSimilarEquipment } = useMaintenance();

    const filtered = equipment.filter(e => {
        const matchesSearch = (e.name?.toLowerCase().includes(search.toLowerCase()) ||
            e.serial_number?.toLowerCase().includes(search.toLowerCase()));
        const matchesCategory = categoryId ? e.category_id === parseInt(categoryId) : true;
        return matchesSearch && matchesCategory;
    });

    const handleEdit = (item) => {
        setModalItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this asset?")) {
            await deleteEquipment(id);
            setSelectedEq(null);
        }
    };

    if (selectedEq) {
        const relatedRequests = getEquipmentRequests(selectedEq.id);
        return (
            <div className="animate-fade" style={{ paddingBottom: '3rem' }}>
                <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <button className="btn btn-secondary" onClick={() => setSelectedEq(null)} style={{ padding: '0.5rem 1rem' }}>
                            ← Back
                        </button>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{selectedEq.name}</h1>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button
                            className="btn"
                            style={{
                                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                                color: 'white',
                                border: 'none',
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                            }}
                            onClick={() => setIsSimilarModalOpen(true)}
                        >
                            <Sparkles size={16} /> SMART CHECK
                        </button>
                        {['admin', 'manager'].includes(user?.role) && (
                            <>
                                <button className="btn btn-secondary" onClick={() => handleEdit(selectedEq)}>EDIT</button>
                                <button className="btn" style={{ color: 'var(--color-scrap)', backgroundColor: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)' }} onClick={() => handleDelete(selectedEq.id)}>
                                    <Trash2 size={16} /> DELETE
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="card" style={{ padding: '0', overflow: 'hidden', border: 'none', boxShadow: 'var(--shadow-premium)', background: 'white' }}>
                    <div style={{ display: 'flex', background: 'white', borderBottom: '1px solid var(--color-border)', padding: '1.5rem 2.5rem' }}>
                        <div style={{ flex: 1, paddingTop: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                <span style={{ padding: '0.3rem 0.8rem', background: '#f1f5f9', borderRadius: 'var(--radius-sm)', fontSize: '11px', fontWeight: 800, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
                                    {selectedEq.department}
                                </span>
                                <span style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>•</span>
                                <span style={{ color: 'var(--color-text-secondary)', fontSize: '13px', fontWeight: 600 }}>SN: {selectedEq.serial_number}</span>
                            </div>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-text-main)', letterSpacing: '-0.02em', fontFamily: 'Outfit' }}>{selectedEq.name}</h2>
                        </div>
                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                            <div style={{ textAlign: 'center', padding: '1.25rem', background: '#f8fafc', borderRadius: 'var(--radius-lg)', minWidth: '120px', border: '1px solid #edf2f7' }}>
                                <Wrench size={24} color="var(--color-primary)" style={{ marginBottom: '0.75rem' }} />
                                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Maintenance</div>
                                <div style={{ fontSize: '20px', fontWeight: 800 }}>{relatedRequests.length}</div>
                            </div>
                            <div style={{ textAlign: 'center', padding: '1.25rem', background: '#f8fafc', borderRadius: 'var(--radius-lg)', minWidth: '120px', border: '1px solid #edf2f7' }}>
                                <ShieldCheck size={24} color="var(--color-repaired)" style={{ marginBottom: '0.75rem' }} />
                                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Health Status</div>
                                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-repaired)' }}>94%</div>
                            </div>
                        </div>
                    </div>

                    <div style={{ padding: '2.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', background: '#fafbfc' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Personnel</label>
                                <p style={{ fontWeight: 600, fontSize: '15px' }}>{selectedEq.employee}</p>
                            </div>
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Location</label>
                                <p style={{ fontWeight: 600, fontSize: '15px' }}>{selectedEq.location}</p>
                            </div>
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Department</label>
                                <p style={{ fontWeight: 600, fontSize: '15px' }}>{selectedEq.department}</p>
                            </div>
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Company</label>
                                <p style={{ fontWeight: 600, fontSize: '15px' }}>{selectedEq.company || 'N/A'}</p>
                            </div>
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Current Status</label>
                                <span style={{
                                    padding: '0.4rem 1rem',
                                    borderRadius: '100px',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    backgroundColor: selectedEq.status === 'operational' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                    color: selectedEq.status === 'operational' ? 'var(--color-repaired)' : 'var(--color-scrap)'
                                }}>
                                    {selectedEq.status}
                                </span>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Acquisition Date</label>
                                <p style={{ fontWeight: 600, fontSize: '15px' }}>{selectedEq.purchase_date}</p>
                            </div>
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Warranty Coverage</label>
                                <p style={{ fontWeight: 600, fontSize: '15px' }}>{selectedEq.warranty}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="related-requests" style={{ marginTop: '3rem' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 800 }}>Maintenance History</h3>
                    <div className="card" style={{ border: 'none', boxShadow: 'var(--shadow-md)' }}>
                        <table className="table-view">
                            <thead>
                                <tr>
                                    <th style={{ padding: '1rem 1.5rem' }}>Subject / Incident</th>
                                    <th>Repair Type</th>
                                    <th>Current Stage</th>
                                    <th>Logged Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {relatedRequests.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>No maintenance records found for this asset.</td>
                                    </tr>
                                ) : (
                                    relatedRequests.map(req => (
                                        <tr key={req.id}>
                                            <td style={{ padding: '1.25rem 1.5rem', fontWeight: 600 }}>{req.subject}</td>
                                            <td>{req.type}</td>
                                            <td>
                                                <span style={{
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: 'var(--radius-sm)',
                                                    background: 'var(--color-bg-app)',
                                                    fontSize: '11px',
                                                    fontWeight: 700,
                                                    color: 'var(--color-text-secondary)'
                                                }}>
                                                    {req.stage}
                                                </span>
                                            </td>
                                            <td style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{req.scheduled_date}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Similar Items Modal */}
                {isSimilarModalOpen && (
                    <div className="modal-overlay" onClick={() => setIsSimilarModalOpen(false)}>
                        <div className="modal-content animate-slide-up" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', width: '90%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ background: 'var(--color-primary-light)', padding: '0.5rem', borderRadius: '12px' }}>
                                        <Sparkles size={20} color="var(--color-primary)" />
                                    </div>
                                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Similar Equipment Issues</h2>
                                </div>
                                <button className="btn btn-link" onClick={() => setIsSimilarModalOpen(false)} style={{ padding: '0.5rem' }}>
                                    <X size={24} />
                                </button>
                            </div>

                            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', fontSize: '14px' }}>
                                Found other equipment with similar maintenance patterns to <strong>{selectedEq.name}</strong>.
                            </p>

                            <div style={{ maxHeight: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {getSimilarEquipment(selectedEq.id).length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '2rem', background: '#f8fafc', borderRadius: 'var(--radius-lg)', color: 'var(--color-text-muted)' }}>
                                        No similar equipment issues found.
                                    </div>
                                ) : (
                                    getSimilarEquipment(selectedEq.id).map(({ equipment: item, similarRequests, reason }) => (
                                        <div
                                            key={item.id}
                                            className="card"
                                            style={{
                                                padding: '1.25rem',
                                                cursor: 'pointer',
                                                border: '1px solid var(--color-border)',
                                                transition: 'all 0.2s',
                                                background: 'white'
                                            }}
                                            onClick={() => {
                                                setSelectedEq(item);
                                                setIsSimilarModalOpen(false);
                                            }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.borderColor = 'var(--color-primary)';
                                                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.borderColor = 'var(--color-border)';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                                <div>
                                                    <h4 style={{ fontWeight: 800, fontSize: '15px' }}>{item.name}</h4>
                                                    <span style={{ fontSize: '10px', color: 'var(--color-primary)', fontWeight: 800, textTransform: 'uppercase' }}>{reason}</span>
                                                </div>
                                                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{item.serial_number}</span>
                                            </div>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                {similarRequests.length > 0 ? (
                                                    <>
                                                        {similarRequests.slice(0, 2).map((req, idx) => (
                                                            <div key={idx} style={{
                                                                fontSize: '11px',
                                                                padding: '0.25rem 0.6rem',
                                                                background: '#f1f5f9',
                                                                borderRadius: '4px',
                                                                color: 'var(--color-text-secondary)',
                                                                fontWeight: 600
                                                            }}>
                                                                {req.subject}
                                                            </div>
                                                        ))}
                                                        {similarRequests.length > 2 && (
                                                            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', padding: '0.25rem' }}>
                                                                +{similarRequests.length - 2} more
                                                            </div>
                                                        )}
                                                    </>
                                                ) : (
                                                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>No maintenance records yet</div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="animate-fade">
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {categoryId && (
                            <button className="btn btn-link" onClick={() => navigate('/equipment')} style={{ padding: '0.25rem' }}>
                                <ArrowLeft size={20} />
                            </button>
                        )}
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Asset Inventory</h1>
                    </div>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                        {categoryId ? `Viewing assets in selected category` : 'Manage and monitor all facility equipment and hardware.'}
                    </p>
                </div>

                <div style={{ position: 'relative', width: '300px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Search assets..."
                        style={{
                            padding: '0.75rem 1rem 0.75rem 2.5rem',
                            width: '100%',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid var(--color-border)',
                            background: 'white',
                            fontSize: '14px'
                        }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: 'var(--radius-md)' }}>
                    <button className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-link'}`} style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', minWidth: '40px', background: viewMode === 'list' ? 'var(--color-primary)' : 'transparent', color: viewMode === 'list' ? 'white' : 'var(--color-text-secondary)' }} onClick={() => setViewMode('list')}><List size={18} /></button>
                    <button className={`btn ${viewMode === 'kanban' ? 'btn-primary' : 'btn-link'}`} style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', minWidth: '40px', background: viewMode === 'kanban' ? 'var(--color-primary)' : 'transparent', color: viewMode === 'kanban' ? 'white' : 'var(--color-text-secondary)' }} onClick={() => setViewMode('kanban')}><LayoutGrid size={18} /></button>
                </div>

                <button
                    className="btn btn-secondary"
                    onClick={() => navigate('/equipment-categories')}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <Tags size={18} /> CATEGORIES
                </button>

                {['admin', 'manager'].includes(user?.role) && (
                    <button className="btn btn-primary" onClick={() => { setModalItem(null); setIsModalOpen(true); }} style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-lg)' }}>
                        <Plus size={20} /> NEW ASSET
                    </button>
                )}
            </div>

            <div className="card" style={{ overflow: 'hidden', border: 'none', background: 'transparent', boxShadow: 'none' }}>
                {viewMode === 'list' ? (
                    <div className="card" style={{ background: 'white', boxShadow: 'var(--shadow-md)' }}>
                        <table className="table-view">
                            <thead>
                                <tr>
                                    <th style={{ padding: '1rem 1.5rem' }}>Asset Name</th>
                                    <th>Responsible Personnel</th>
                                    <th>Department</th>
                                    <th>Company</th>
                                    <th>Serial Code</th>
                                    <th style={{ textAlign: 'right', paddingRight: '1.5rem' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(item => (
                                    <tr key={item.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedEq(item)}>
                                        <td style={{ padding: '1.25rem 1.5rem', fontWeight: 700, color: 'var(--color-text-main)' }}>{item.name}</td>
                                        <td style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>{item.employee}</td>
                                        <td>
                                            <span style={{ padding: '0.2rem 0.6rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '11px', fontWeight: 700, color: 'var(--color-text-secondary)' }}>
                                                {item.department}
                                            </span>
                                        </td>
                                        <td style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>{item.company || '-'}</td>
                                        <td style={{ fontFamily: 'monospace', fontSize: '12px', color: 'var(--color-text-muted)' }}>{item.serial_number}</td>
                                        <td style={{ textAlign: 'right', paddingRight: '1.5rem' }}>
                                            <span style={{
                                                padding: '0.3rem 0.8rem',
                                                borderRadius: '100px',
                                                fontSize: '11px',
                                                fontWeight: 800,
                                                textTransform: 'uppercase',
                                                backgroundColor: item.status === 'operational' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                color: item.status === 'operational' ? 'var(--color-repaired)' : 'var(--color-scrap)'
                                            }}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                        {filtered.map(item => (
                            <div key={item.id} className="card" onClick={() => setSelectedEq(item)} style={{
                                cursor: 'pointer',
                                padding: '0',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                border: '1px solid var(--color-border)',
                                background: 'white'
                            }}>
                                <div style={{ height: '140px', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                                    <Wrench size={48} style={{ opacity: 0.1, color: 'var(--color-primary)' }} />
                                    <div style={{
                                        position: 'absolute',
                                        top: '12px',
                                        right: '12px',
                                        padding: '0.3rem 0.8rem',
                                        background: item.status === 'operational' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                        color: item.status === 'operational' ? 'var(--color-repaired)' : 'var(--color-scrap)',
                                        borderRadius: '100px',
                                        fontSize: '10px',
                                        fontWeight: 900,
                                        textTransform: 'uppercase',
                                        backdropFilter: 'blur(4px)'
                                    }}>
                                        {item.status}
                                    </div>
                                </div>
                                <div style={{ padding: '1.5rem' }}>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--color-text-main)', fontFamily: 'Outfit' }}>{item.name}</h3>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>{item.department}</span>
                                        <span style={{ opacity: 0.3 }}>•</span>
                                        <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{item.company}</span>
                                        <span style={{ opacity: 0.3 }}>•</span>
                                        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{item.serial_number}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.25rem', borderTop: '1px solid #f1f5f9' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-secondary)' }}>
                                            <Wrench size={16} color="var(--color-primary)" />
                                            <span style={{ fontSize: '13px', fontWeight: 700 }}>{getEquipmentRequests(item.id).length} Active</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <div style={{ width: '60px', height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                                                <div style={{ width: '94%', height: '100%', background: 'var(--color-repaired)', borderRadius: '3px' }}></div>
                                            </div>
                                            <span style={{ fontSize: '11px', fontWeight: 900, color: 'var(--color-repaired)' }}>94%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <EquipmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                equipmentItem={modalItem}
                onSubmitSuccess={(item) => {
                    // When an item is created or updated, immediately view its details/requests
                    setSelectedEq(item);
                }}
            />
        </div>
    );
}
