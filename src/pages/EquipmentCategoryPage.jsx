import { useState } from 'react';
import { useMaintenance } from '../context/MaintenanceContext';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit3, Trash2, ArrowRight, Tags } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EquipmentCategoryModal from '../components/EquipmentCategoryModal';

export default function EquipmentCategoryPage() {
    const { user } = useAuth();
    const { categories, technicians, deleteEquipmentCategory } = useMaintenance();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const navigate = useNavigate();

    const handleEdit = (cat) => {
        setSelectedCategory(cat);
        setIsModalOpen(true);
    };

    const handleNew = () => {
        setSelectedCategory(null);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this category?")) {
            await deleteEquipmentCategory(id);
        }
    };

    const getResponsibleName = (userId) => {
        const tech = technicians.find(t => t.id === parseInt(userId));
        return tech ? tech.name : 'Unassigned';
    };

    return (
        <div className="animate-fade">
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem', alignItems: 'center' }}>
                <div style={{ padding: '1rem', background: 'var(--color-primary)', borderRadius: 'var(--radius-xl)', color: 'white' }}>
                    <Tags size={32} />
                </div>
                <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Equipment Categories</h1>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Define and organize asset groups.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate('/equipment')}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        GO TO EQUIPMENT <ArrowRight size={16} />
                    </button>
                    {['admin', 'manager'].includes(user?.role) && (
                        <button className="btn btn-primary" onClick={handleNew}>
                            <Plus size={20} /> NEW
                        </button>
                    )}
                </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden', background: 'white', boxShadow: 'var(--shadow-md)' }}>
                <table className="table-view">
                    <thead>
                        <tr>
                            <th style={{ padding: '1rem 1.5rem' }}>Name</th>
                            <th>Responsible</th>
                            <th>Company</th>
                            <th style={{ textAlign: 'right', paddingRight: '1.5rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                                    No categories defined yet.
                                </td>
                            </tr>
                        ) : (
                            categories.map(cat => (
                                <tr key={cat.id} className="hover-row">
                                    <td
                                        style={{ padding: '1.25rem 1.5rem', fontWeight: 700, color: 'var(--color-primary)', cursor: 'pointer' }}
                                        onClick={() => navigate(`/equipment?category=${cat.id}`)}
                                    >
                                        {cat.name}
                                    </td>
                                    <td style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                                        {getResponsibleName(cat.responsible_user_id)}
                                    </td>
                                    <td style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>
                                        {cat.company || '-'}
                                    </td>
                                    <td style={{ textAlign: 'right', paddingRight: '1.5rem' }}>
                                        {['admin', 'manager'].includes(user?.role) && (
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                <button className="btn-link" onClick={() => handleEdit(cat)} style={{ color: 'var(--color-primary)' }}>
                                                    <Edit3 size={16} />
                                                </button>
                                                <button className="btn-link" onClick={() => handleDelete(cat.id)} style={{ color: 'var(--color-scrap)' }}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <EquipmentCategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                category={selectedCategory}
            />
        </div>
    );
}
