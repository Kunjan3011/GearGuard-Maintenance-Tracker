import { useState } from 'react';
import { useMaintenance } from '../context/MaintenanceContext';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import RequestModal from '../components/RequestModal';
import './MaintenanceCalendar.css';

export default function MaintenanceCalendar() {
    const { requests, equipment, workCenters } = useMaintenance();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    // const preventiveRequests = requests.filter(r => r.type === 'Preventive');

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanks = Array.from({ length: firstDay }, (_, i) => i);

    const prevMonth = () => setCurrentDate(new Date(year, month - 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1));

    const handleDateClick = (day) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        setSelectedDate(dateStr);
        setIsModalOpen(true);
    };

    const monthName = currentDate.toLocaleString('default', { month: 'long' });

    return (
        <div className="animate-fade">
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Maintenance Schedule</h1>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Plan and monitor preventive checkups across all facilities.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)} style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-lg)' }}>
                    <Plus size={20} /> SCHEDULE CHECKUP
                </button>
            </div>

            <div className="calendar-container card" style={{ border: 'none', boxShadow: 'var(--shadow-lg)', background: 'white' }}>
                <div className="calendar-header" style={{ borderBottom: '1px solid var(--color-border)', padding: '1.5rem 2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Outfit' }}>{monthName} {year}</h2>
                    <div className="calendar-nav" style={{ background: '#f1f5f9', padding: '4px', borderRadius: 'var(--radius-md)' }}>
                        <button onClick={prevMonth} className="btn-link" style={{ padding: '0.5rem' }}><ChevronLeft size={20} /></button>
                        <button onClick={() => setCurrentDate(new Date())} className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '13px', borderRadius: 'var(--radius-sm)' }}>Today</button>
                        <button onClick={nextMonth} className="btn-link" style={{ padding: '0.5rem' }}><ChevronRight size={20} /></button>
                    </div>
                </div>

                <div className="calendar-grid">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div key={d} className="calendar-day-header">{d}</div>
                    ))}

                    {blanks.map(b => <div key={`b-${b}`} className="calendar-day empty"></div>)}

                    {days.map(day => {
                        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const dayRequests = requests.filter(r => r.scheduled_date === dateStr);
                        const dayEquipments = equipment.filter(e => e.purchase_date === dateStr);

                        return (
                            <div key={day} className="calendar-day" onClick={() => handleDateClick(day)}>
                                <span className="day-number">{day}</span>
                                <div className="day-requests">
                                    {dayEquipments.map(eq => (
                                        <div key={`eq-${eq.id}`} className="calendar-eq-pill" title={`Acquisition: ${eq.name}`}>
                                            ⭐ {eq.name}
                                        </div>
                                    ))}
                                    {dayRequests.map(req => {
                                        const eq = equipment.find(e => e.id === req.equipment_id);
                                        const wc = workCenters.find(w => w.id === req.work_center_id);
                                        return (
                                            <div key={req.id} className={`calendar-req-pill ${req.type.toLowerCase()}`} title={`${req.type}: ${req.subject}`}>
                                                {req.type === 'Preventive' ? '🔧' : '🚨'} {eq?.name || wc?.name || 'Asset'}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <RequestModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialDate={selectedDate}
            />
        </div>
    );
}
