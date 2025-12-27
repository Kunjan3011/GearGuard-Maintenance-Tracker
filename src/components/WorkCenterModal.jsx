import { useState, useEffect } from 'react';
import { useMaintenance } from '../context/MaintenanceContext';
import { X } from 'lucide-react';

export default function WorkCenterModal({ isOpen, onClose, workCenter }) {
    const { addWorkCenter, updateWorkCenter } = useMaintenance();

    const [formData, setFormData] = useState({
        name: '',
        code: '',
        tag: '',
        alternative_workcenters: '',
        cost_per_hour: 0,
        capacity_time: 100,
        time_efficiency: 100,
        oee_target: 85
    });

    useEffect(() => {
        if (workCenter) {
            setFormData({
                name: workCenter.name,
                code: workCenter.code,
                tag: workCenter.tag || '',
                alternative_workcenters: workCenter.alternative_workcenters || '',
                cost_per_hour: workCenter.cost_per_hour,
                capacity_time: workCenter.capacity_time,
                time_efficiency: workCenter.time_efficiency,
                oee_target: workCenter.oee_target
            });
        } else {
            setFormData({
                name: '',
                code: '',
                tag: '',
                alternative_workcenters: '',
                cost_per_hour: 0,
                capacity_time: 100,
                time_efficiency: 100,
                oee_target: 85
            });
        }
    }, [workCenter, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (workCenter) {
                await updateWorkCenter(workCenter.id, formData);
            } else {
                await addWorkCenter(formData);
            }
            onClose();
        } catch (err) {
            console.error("Submit failed", err);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-main)', fontFamily: 'Outfit' }}>{workCenter ? 'Update Work Center' : 'New Work Center'}</h2>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Configure operational units for maintenance tracking.</p>
                    </div>
                    <button onClick={onClose} className="btn-link" style={{ padding: '0.5rem' }}><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Work Center Name</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Assembly Line 1"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Internal Code</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. AL/01"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Identification Tag</label>
                            <input
                                type="text"
                                placeholder="e.g. Critical"
                                value={formData.tag}
                                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Alternative Routing / Work Centers</label>
                        <input
                            type="text"
                            value={formData.alternative_workcenters}
                            onChange={(e) => setFormData({ ...formData, alternative_workcenters: e.target.value })}
                            placeholder="e.g. Line 2 (Secondary)"
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Cost per Hour (USD)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.cost_per_hour}
                                onChange={(e) => setFormData({ ...formData, cost_per_hour: parseFloat(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="form-group">
                            <label>OEE Target (%)</label>
                            <input
                                type="number"
                                step="0.1"
                                value={formData.oee_target}
                                onChange={(e) => setFormData({ ...formData, oee_target: parseFloat(e.target.value) || 0 })}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Capacity Load (%)</label>
                            <input
                                type="number"
                                value={formData.capacity_time}
                                onChange={(e) => setFormData({ ...formData, capacity_time: parseFloat(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Performance Efficiency (%)</label>
                            <input
                                type="number"
                                value={formData.time_efficiency}
                                onChange={(e) => setFormData({ ...formData, time_efficiency: parseFloat(e.target.value) || 0 })}
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1.25rem' }}>
                        <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1, padding: '0.75rem', fontWeight: 700 }}>Cancel</button>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '0.75rem', fontWeight: 700 }}>
                            {workCenter ? 'Save Updates' : 'Create Unit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
