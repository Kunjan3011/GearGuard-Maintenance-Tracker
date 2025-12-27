import { useState, useEffect } from 'react';
import { useMaintenance } from '../context/MaintenanceContext';
import { useAuth } from '../context/AuthContext';
import { X, Save } from 'lucide-react';

export default function EquipmentCategoryModal({ isOpen, onClose, category }) {
    const { addEquipmentCategory, updateEquipmentCategory, technicians } = useMaintenance();
    const [formData, setFormData] = useState({
        name: '',
        responsible_user_id: '',
        company: ''
    });

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name || '',
                responsible_user_id: category.responsible_user_id || '',
                company: category.company || ''
            });
        } else {
            setFormData({
                name: '',
                responsible_user_id: '',
                company: ''
            });
        }
    }, [category, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (category) {
            await updateEquipmentCategory(category.id, formData);
        } else {
            await addEquipmentCategory(formData);
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content animate-slide-up" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                        {category ? 'Edit Category' : 'New Equipment Category'}
                    </h2>
                    <button className="btn btn-link" onClick={onClose}><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label>Category Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Computers, Software"
                            />
                        </div>

                        <div className="form-group">
                            <label>Responsible Personnel</label>
                            <select
                                value={formData.responsible_user_id}
                                onChange={e => setFormData({ ...formData, responsible_user_id: e.target.value })}
                            >
                                <option value="">Select Personnel...</option>
                                {technicians.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Company</label>
                            <input
                                type="text"
                                value={formData.company}
                                onChange={e => setFormData({ ...formData, company: e.target.value })}
                                placeholder="e.g. My Company (San Francisco)"
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                                <Save size={18} /> {category ? 'Update Category' : 'Create Category'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
