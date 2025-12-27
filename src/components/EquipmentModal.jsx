import { useState, useEffect } from 'react';
import { useMaintenance } from '../context/MaintenanceContext';
import { X } from 'lucide-react';

export default function EquipmentModal({ isOpen, onClose, equipmentItem, onSubmitSuccess }) {
    const { addEquipment, updateEquipment, teams, technicians, categories } = useMaintenance();

    const [formData, setFormData] = useState({
        name: '',
        serial_number: '',
        purchase_date: new Date().toISOString().split('T')[0],
        warranty: '',
        location: '',
        department: '',
        employee: '',
        team_id: '',
        technician_id: '',
        company: '',
        category_id: ''
    });

    useEffect(() => {
        if (equipmentItem) {
            setFormData({
                name: equipmentItem.name,
                serial_number: equipmentItem.serial_number,
                purchase_date: equipmentItem.purchase_date,
                warranty: equipmentItem.warranty,
                location: equipmentItem.location,
                department: equipmentItem.department,
                employee: equipmentItem.employee,
                team_id: equipmentItem.team_id || '',
                technician_id: equipmentItem.technician_id || '',
                company: equipmentItem.company || '',
                category_id: equipmentItem.category_id || '',
            });
        } else {
            setFormData({
                name: '',
                serial_number: '',
                purchase_date: new Date().toISOString().split('T')[0],
                warranty: '',
                location: '',
                department: '',
                employee: '',
                team_id: '',
                technician_id: '',
                company: '',
                category_id: ''
            });
        }
    }, [equipmentItem, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                team_id: formData.team_id === '' ? null : Number(formData.team_id),
                technician_id: formData.technician_id === '' ? null : Number(formData.technician_id),
                category_id: formData.category_id === '' ? null : Number(formData.category_id)
            };

            if (equipmentItem) {
                const updated = await updateEquipment(equipmentItem.id, payload);
                if (typeof onSubmitSuccess === 'function') onSubmitSuccess(updated || payload);
            } else {
                const newDevice = await addEquipment(payload);
                if (typeof onSubmitSuccess === 'function') onSubmitSuccess(newDevice);
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
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-main)', fontFamily: 'Outfit' }}>{equipmentItem ? 'Update' : 'Register'} Equipment</h2>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Log a new hardware asset in the central inventory.</p>
                    </div>
                    <button onClick={onClose} className="btn-link" style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Asset Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Serial Number</label>
                            <input
                                type="text"
                                required
                                value={formData.serial_number}
                                onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Location</label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Department</label>
                            <input
                                type="text"
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Company / Organization</label>
                            <input
                                type="text"
                                placeholder="e.g. Acme Corp"
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Equipment Category</label>
                        <select
                            value={formData.category_id}
                            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                        >
                            <option value="">Select Category</option>
                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Default Team</label>
                            <select
                                value={formData.team_id}
                                onChange={(e) => setFormData({ ...formData, team_id: e.target.value })}
                            >
                                <option value="">Select Team</option>
                                {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Default Technician</label>
                            <select
                                value={formData.technician_id}
                                onChange={(e) => setFormData({ ...formData, technician_id: e.target.value })}
                            >
                                <option value="">Select Technician</option>
                                {technicians.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1.25rem' }}>
                        <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1, padding: '0.75rem', fontWeight: 700 }}>Cancel</button>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '0.75rem', fontWeight: 700 }}>
                            {equipmentItem ? 'Update Records' : 'Register Asset'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
