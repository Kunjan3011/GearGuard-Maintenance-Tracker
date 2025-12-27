import { useState } from 'react';
import { useMaintenance } from '../context/MaintenanceContext';
import { BarChart3, PieChart, Info, Zap } from 'lucide-react';

export default function ReportingPage() {
    const { requests, teams, equipment } = useMaintenance();

    const [viewMode, setViewMode] = useState('pivot'); // 'pivot' | 'graph'

    // Simple Pivot calculation: Team vs Request Stage
    const categories = [...new Set(equipment.map(e => e.department))];

    // Graph Data Preparation
    const teamData = teams.map(t => ({
        name: t.name,
        count: requests.filter(r => r.team_id === t.id).length,
        color: 'var(--color-primary)'
    }));
    const maxCount = Math.max(...teamData.map(d => d.count), 1);

    return (
        <div className="animate-fade" style={{ paddingBottom: '3rem' }}>
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Maintenance Analysis</h1>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Cross-dimensional insights into facility health and team performance.</p>
                </div>
                <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: 'var(--radius-md)' }}>
                    <button
                        onClick={() => setViewMode('graph')}
                        className="btn"
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: 'var(--radius-sm)',
                            background: viewMode === 'graph' ? 'white' : 'transparent',
                            boxShadow: viewMode === 'graph' ? 'var(--shadow-sm)' : 'none',
                            border: 'none',
                            color: viewMode === 'graph' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                            fontWeight: 700,
                            fontSize: '13px',
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center'
                        }}>
                        <BarChart3 size={16} style={{ marginRight: '6px' }} /> Graph
                    </button>
                    <button
                        onClick={() => setViewMode('pivot')}
                        className="btn"
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: 'var(--radius-sm)',
                            background: viewMode === 'pivot' ? 'white' : 'transparent',
                            boxShadow: viewMode === 'pivot' ? 'var(--shadow-sm)' : 'none',
                            border: 'none',
                            color: viewMode === 'pivot' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                            fontWeight: 700,
                            fontSize: '13px',
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center'
                        }}>
                        <PieChart size={16} style={{ marginRight: '6px' }} /> Pivot
                    </button>
                </div>
            </div>

            {viewMode === 'pivot' ? (
                <div className="card" style={{ padding: '0', overflowX: 'auto', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'white' }}>
                    <table className="table-view" style={{ fontSize: '13px', borderCollapse: 'collapse', width: '100%' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid var(--color-border)' }}>
                                <th style={{ width: '220px', borderRight: '1px solid var(--color-border)', padding: '1.25rem 1.5rem', textAlign: 'left', fontWeight: 800, textTransform: 'uppercase', fontSize: '11px', color: 'var(--color-text-muted)' }}>Department</th>
                                {teams.map(t => <th key={t.id} style={{ textAlign: 'center', borderRight: '1px solid var(--color-border)', padding: '1.25rem', fontWeight: 800, textTransform: 'uppercase', fontSize: '11px', color: 'var(--color-text-muted)' }}>{t.name}</th>)}
                                <th style={{ textAlign: 'center', backgroundColor: '#f1f5f9', padding: '1.25rem', fontWeight: 800, textTransform: 'uppercase', fontSize: '11px', color: 'var(--color-primary)' }}>Grand Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((cat, idx) => (
                                <tr key={cat} style={{ backgroundColor: idx % 2 === 0 ? 'white' : '#fcfdfe' }}>
                                    <td style={{ fontWeight: 800, color: 'var(--color-text-main)', borderRight: '1px solid var(--color-border)', padding: '1.25rem 1.5rem' }}>{cat}</td>
                                    {teams.map(t => {
                                        const count = requests.filter(r => {
                                            const eq = equipment.find(e => e.id === r.equipment_id);
                                            return eq?.department === cat && r.team_id === t.id;
                                        }).length;
                                        return <td key={t.id} style={{ textAlign: 'center', borderRight: '1px solid var(--color-border)', color: count ? 'var(--color-text-main)' : '#ccc', fontWeight: count ? 700 : 400 }}>{count || '0'}</td>;
                                    })}
                                    <td style={{ textAlign: 'center', fontWeight: 800, backgroundColor: '#f8fafc', color: 'var(--color-primary)', fontSize: '14px' }}>
                                        {requests.filter(r => {
                                            const eq = equipment.find(e => e.id === r.equipment_id);
                                            return eq?.department === cat;
                                        }).length}
                                    </td>
                                </tr>
                            ))}
                            <tr style={{ backgroundColor: '#f1f5f9', fontWeight: 800 }}>
                                <td style={{ padding: '1.25rem 1.5rem', borderRight: '1px solid var(--color-border)' }}>Grand Total</td>
                                {teams.map(t => (
                                    <td key={t.id} style={{ textAlign: 'center', borderRight: '1px solid var(--color-border)' }}>
                                        {requests.filter(r => r.team_id === t.id).length}
                                    </td>
                                ))}
                                <td style={{ textAlign: 'center', fontSize: '16px', color: 'var(--color-primary)' }}>{requests.length}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="card" style={{ padding: '2rem', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'white' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '2rem' }}>Total Requests by Team</h3>
                    <div style={{ display: 'flex', alignItems: 'flex-end', height: '300px', gap: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                        {teamData.map(d => (
                            <div key={d.name} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                                <div
                                    style={{
                                        width: '60px',
                                        height: `${(d.count / maxCount) * 100}%`,
                                        backgroundColor: d.color,
                                        borderRadius: '8px 8px 0 0',
                                        transition: 'height 0.5s ease',
                                        position: 'relative',
                                        minHeight: '4px'
                                    }}
                                >
                                    <span style={{ position: 'absolute', top: '-25px', width: '100%', textAlign: 'center', fontWeight: 800, color: 'var(--color-primary)' }}>
                                        {d.count}
                                    </span>
                                </div>
                                <span style={{ marginTop: '1rem', fontWeight: 600, fontSize: '12px', color: 'var(--color-text-secondary)', textAlign: 'center' }}>
                                    {d.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div style={{ marginTop: '3rem', display: 'flex', gap: '1.5rem' }}>
                <div className="card" style={{ flex: 1, padding: '2rem', border: 'none', boxShadow: 'var(--shadow-md)', background: 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.75rem', fontFamily: 'Outfit' }}>
                            <Zap size={20} color="var(--color-primary)" /> Maintenance Efficiency Score
                        </h3>
                        <span style={{ fontSize: '24px', fontWeight: 900, color: 'var(--color-primary)' }}>84%</span>
                    </div>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                        Composite score derived from MTTR (Mean Time to Repair), response speed, and preventive completion rates across all active units.
                    </p>
                    <div style={{ height: '12px', backgroundColor: '#f1f5f9', borderRadius: '100px', overflow: 'hidden', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)' }}>
                        <div style={{ width: '84%', height: '100%', background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-repaired) 100%)', borderRadius: '100px' }}></div>
                    </div>
                </div>
                <div className="card" style={{ flex: 1, padding: '2rem', border: 'none', boxShadow: 'var(--shadow-md)', background: 'white' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', fontFamily: 'Outfit' }}>
                        <Info size={20} color="var(--color-primary)" /> Reporting Insights
                    </h3>
                    <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <li style={{ fontSize: '13px', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-primary)' }}></div>
                            IT Hub operations are currently at peak demand.
                        </li>
                        <li style={{ fontSize: '13px', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-primary)' }}></div>
                            Preventive coverage has improved by 12% this month.
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
