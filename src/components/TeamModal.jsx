import { useState, useEffect } from 'react';
import { useMaintenance } from '../context/MaintenanceContext';
import { X, UserPlus, Trash2, Shield, Wrench, Zap } from 'lucide-react';

export default function TeamModal({ isOpen, onClose, team }) {
    const { addTeam, updateTeam, deleteTeam, addTechnician, deleteTechnician, technicians } = useMaintenance();

    const [formData, setFormData] = useState({
        name: '',
        leader: '',
    });

    const [newTech, setNewTech] = useState({
        name: '',
        avatar: 'https://i.pravatar.cc/150?u=' + Math.random()
    });

    useEffect(() => {
        if (team) {
            setFormData({
                name: team.name,
                leader: team.leader,
            });
        } else {
            setFormData({
                name: '',
                leader: '',
            });
        }
    }, [team, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (team) {
            await updateTeam(team.id, { ...formData, members_count: team.members_count });
        } else {
            await addTeam({ ...formData, members_count: 0 });
        }
        onClose();
    };

    const handleAddTech = async () => {
        if (!newTech.name || !team) return;
        await addTechnician({
            name: newTech.name,
            avatar: `https://i.pravatar.cc/150?u=${Math.floor(Math.random() * 1000)}`,
            team_id: team.id
        });
        setNewTech({ name: '', avatar: '' });
    };

    const handleDeleteTech = async (techId) => {
        if (window.confirm("Remove this specialist from the team?")) {
            await deleteTechnician(techId);
        }
    };

    const handleDeleteTeam = async () => {
        if (window.confirm("Are you sure you want to delete this maintenance unit? This action cannot be undone.")) {
            await deleteTeam(team.id);
            onClose();
        }
    };

    const teamTechs = team ? technicians.filter(t => t.team_id === team.id) : [];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-main)', fontFamily: 'Outfit' }}>
                            {team ? 'Manage Maintenance Unit' : 'New Maintenance Unit'}
                        </h2>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                            Define team identity and lead personnel.
                        </p>
                    </div>
                    <button onClick={onClose} className="btn-link" style={{ padding: '0.5rem' }}><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Unit Name</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Electrical Engineering"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Team Leader</label>
                        <input
                            type="text"
                            required
                            placeholder="Full Name"
                            value={formData.leader}
                            onChange={(e) => setFormData({ ...formData, leader: e.target.value })}
                        />
                    </div>

                    {team && (
                        <div style={{ marginTop: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3 style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>
                                    Active Specialists ({teamTechs.length})
                                </h3>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', maxHeight: '200px', overflowY: 'auto', paddingRight: '4px' }}>
                                {teamTechs.map(tech => (
                                    <div key={tech.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid #f1f5f9' }}>
                                        <img src={tech.avatar} alt={tech.name} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid white', boxShadow: 'var(--shadow-sm)' }} />
                                        <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-main)', flex: 1 }}>{tech.name}</span>
                                        <button type="button" onClick={() => handleDeleteTech(tech.id)} style={{ color: 'var(--color-scrap)', border: 'none', background: 'transparent', cursor: 'pointer' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--color-bg-app)', border: '1px dashed var(--color-border)' }}>
                                <input
                                    type="text"
                                    placeholder="Add new specialist name..."
                                    style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '13px' }}
                                    value={newTech.name}
                                    onChange={(e) => setNewTech({ ...newTech, name: e.target.value })}
                                />
                                <button type="button" className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '12px' }} onClick={handleAddTech}>
                                    <UserPlus size={16} style={{ marginRight: '4px' }} /> ADD
                                </button>
                            </div>
                        </div>
                    )}

                    <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem' }}>
                        {team && (
                            <button type="button" className="btn" style={{ color: 'var(--color-scrap)', background: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem' }} onClick={handleDeleteTeam}>
                                <Trash2 size={20} />
                            </button>
                        )}
                        <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1, padding: '0.75rem', fontWeight: 700 }}>Cancel</button>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '0.75rem', fontWeight: 700 }}>
                            {team ? 'Save Changes' : 'Create Unit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
