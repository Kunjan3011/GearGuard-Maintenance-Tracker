import { useState, useEffect } from 'react';
import { useMaintenance } from '../context/MaintenanceContext';
import { useAuth } from '../context/AuthContext';
import { X, FileText, Edit2, Trash2 } from 'lucide-react';
import StageProgressBar from './StageProgressBar';

export default function RequestModal({ isOpen, onClose, request, initialDate }) {
    const { user } = useAuth();
    const { equipment, teams, technicians, workCenters, addRequest, updateRequest, deleteRequest, getTechnicianLoad } = useMaintenance();
    const [targetType, setTargetType] = useState('equipment'); // 'equipment' or 'workcenter'

    const [formData, setFormData] = useState({
        subject: '',
        equipment_id: '',
        work_center_id: '',
        type: 'Corrective',
        scheduled_date: new Date().toISOString().split('T')[0],
        priority: 'Medium',
        team_id: '',
        technician_id: '',
        company: '',
        worksheet_notes: '',
    });

    const [showWorksheet, setShowWorksheet] = useState(false);

    useEffect(() => {
        if (request) {
            setFormData({
                subject: request.subject,
                equipment_id: request.equipment_id || '',
                work_center_id: request.work_center_id || '',
                type: request.type,
                scheduled_date: request.scheduled_date,
                priority: request.priority || 'Medium',
                team_id: request.team_id,
                technician_id: request.technician_id,
                company: request.company || '',
                worksheet_notes: request.worksheet_notes || '',
            });
            setShowWorksheet(!!request.worksheet_notes);
            setTargetType(request.work_center_id ? 'workcenter' : 'equipment');
        } else {
            setFormData({
                subject: '',
                equipment_id: '',
                work_center_id: '',
                type: 'Corrective',
                scheduled_date: initialDate || new Date().toISOString().split('T')[0],
                priority: 'Medium',
                team_id: '',
                technician_id: '',
                company: '',
                worksheet_notes: '',
            });
            setShowWorksheet(false);
            setTargetType('equipment');
        }
    }, [request, isOpen, initialDate]);

    // Auto-Fill Logic
    useEffect(() => {
        if (formData.equipment_id) {
            const selectedEq = equipment.find(e => e.id === Number(formData.equipment_id));
            if (selectedEq) {
                setFormData(prev => ({
                    ...prev,
                    team_id: selectedEq.team_id,
                    technician_id: selectedEq.technician_id
                }));
            }
        }
    }, [formData.equipment_id, equipment]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Convert empty strings to null for optional integer fields
            const payload = {
                ...formData,
                equipment_id: formData.equipment_id || null,
                work_center_id: formData.work_center_id || null,
                team_id: formData.team_id || null,
                technician_id: formData.technician_id || null
            };

            if (request) {
                await updateRequest(request.id, payload);
            } else {
                await addRequest(payload);
            }
            onClose();
        } catch (err) {
            console.error("Submit failed", err);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this maintenance request? This action cannot be undone.")) {
            await deleteRequest(request.id);
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" style={{ maxWidth: '700px' }} onClick={(e) => e.stopPropagation()}>
                {/* ... existing header ... */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-main)', fontFamily: 'Outfit' }}>{request ? 'Update' : 'Create'} Maintenance Request</h2>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Fill out the details below to log a technical incident.</p>
                    </div>
                    <button onClick={onClose} className="btn-link" style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}><X size={24} /></button>
                </div>

                {/* ... rest of the modal ... */}
                <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                        <StageProgressBar
                            currentStage={request?.stage || 'New'}
                            stages={['New', 'In Progress', 'Repaired', 'Scrap']}
                        />
                    </div>
                    {request && (
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setShowWorksheet(!showWorksheet)}
                            style={{
                                borderRadius: 'var(--radius-sm)',
                                padding: '0.4rem 0.8rem',
                                fontSize: '12px',
                                fontWeight: 600,
                                background: showWorksheet ? 'var(--color-primary)' : 'white',
                                color: showWorksheet ? 'white' : 'var(--color-text-main)',
                                borderColor: showWorksheet ? 'var(--color-primary)' : 'var(--color-border)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <Edit2 size={14} /> Worksheet
                        </button>
                    )}
                </div>

                {showWorksheet && (
                    <div className="form-group animate-fade-in" style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', marginBottom: '1.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FileText size={14} /> Worksheet Notes / Comments
                        </label>
                        <textarea
                            placeholder="Add technical details, repairs made, or parts used..."
                            value={formData.worksheet_notes}
                            onChange={(e) => setFormData({ ...formData, worksheet_notes: e.target.value })}
                            rows={4}
                            style={{ resize: 'vertical', marginTop: '0.5rem' }}
                        />
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Subject / Issue</label>
                        <input
                            type="text"
                            placeholder="e.g. Leaking Oil, System slow..."
                            required
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', background: '#f8fafc', padding: '0.4rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                        <button
                            type="button"
                            onClick={() => { setTargetType('equipment'); setFormData({ ...formData, work_center_id: '' }); }}
                            style={{ flex: 1, padding: '0.6rem', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '12px', fontWeight: 800, cursor: 'pointer', background: targetType === 'equipment' ? 'white' : 'transparent', boxShadow: targetType === 'equipment' ? 'var(--shadow-sm)' : 'none', color: targetType === 'equipment' ? 'var(--color-primary)' : 'var(--color-text-secondary)' }}
                        >
                            EQUIPMENT
                        </button>
                        <button
                            type="button"
                            onClick={() => { setTargetType('workcenter'); setFormData({ ...formData, equipment_id: '' }); }}
                            style={{ flex: 1, padding: '0.6rem', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '12px', fontWeight: 800, cursor: 'pointer', background: targetType === 'workcenter' ? 'white' : 'transparent', boxShadow: targetType === 'workcenter' ? 'var(--shadow-sm)' : 'none', color: targetType === 'workcenter' ? 'var(--color-primary)' : 'var(--color-text-secondary)' }}
                        >
                            WORK CENTER
                        </button>
                    </div>

                    {targetType === 'equipment' ? (
                        <div className="form-group">
                            <label>Equipment</label>
                            <select
                                required
                                value={formData.equipment_id}
                                onChange={(e) => setFormData({ ...formData, equipment_id: e.target.value })}
                            >
                                <option value="">Select Equipment</option>
                                {equipment.map(e => (
                                    <option key={e.id} value={e.id}>{e.name} ({e.serial_number})</option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <div className="form-group">
                            <label>Work Center</label>
                            <select
                                required
                                value={formData.work_center_id}
                                onChange={(e) => setFormData({ ...formData, work_center_id: e.target.value })}
                            >
                                <option value="">Select Work Center</option>
                                {workCenters.map(wc => (
                                    <option key={wc.id} value={wc.id}>{wc.name} ({wc.code})</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Maintenance Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="Corrective">Corrective (Breakdown)</option>
                                <option value="Preventive">Preventive (Routine)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Date</label>
                            <input
                                type="date"
                                value={formData.scheduled_date}
                                onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Priority</label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Company</label>
                            <select
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            >
                                <option value="">Any Company (Internal)</option>
                                <option value="Ace Pumps">Ace Pumps</option>
                                <option value="Delta Engineering">Delta Engineering</option>
                                <option value="Prime Maintenance">Prime Maintenance</option>
                                <option value="TechServe Pro">TechServe Pro</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Maintenance Team (Auto-filled)</label>
                            <select
                                value={formData.team_id}
                                disabled
                                style={{ opacity: 0.7 }}
                            >
                                <option value="">No Team Assigned</option>
                                {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Assign Technician</label>
                            <select
                                value={formData.technician_id}
                                onChange={(e) => setFormData({ ...formData, technician_id: e.target.value })}
                                disabled={user?.role === 'employee'}
                            >
                                <option value="">Select Technician</option>
                                {technicians.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                            {formData.technician_id && getTechnicianLoad(Number(formData.technician_id)) > 85 && (
                                <p style={{ color: 'var(--color-scrap)', fontSize: '11px', fontWeight: 700, marginTop: '0.4rem' }}>
                                    ⚠️ The load is more to technician assign carefully
                                </p>
                            )}
                        </div>
                    </div>

                    <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1.25rem' }}>
                        {request && (
                            <button
                                type="button"
                                className="btn"
                                onClick={handleDelete}
                                style={{ padding: '0.75rem', fontWeight: 700, background: '#fee2e2', color: '#dc2626', borderColor: '#fca5a5', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                            >
                                <Trash2 size={16} /> Delete
                            </button>
                        )}
                        <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1, padding: '0.75rem', fontWeight: 700 }}>Cancel</button>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '0.75rem', fontWeight: 700 }}>
                            {request ? 'Save Changes' : 'Create Request'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
