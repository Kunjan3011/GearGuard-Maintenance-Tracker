import { ChevronRight } from 'lucide-react';

export default function StageProgressBar({ currentStage, stages }) {
    const stageLabels = {
        'New': 'New Request',
        'In Progress': 'In Progress',
        'Repaired': 'Repaired',
        'Scrap': 'Scrap'
    };

    return (
        <div style={{
            display: 'flex',
            borderRadius: 'var(--radius-sm)',
            overflow: 'hidden',
            backgroundColor: '#f1f5f9', // Light grey background
            padding: '4px',
            gap: '4px',
            alignItems: 'center',
            border: '1px dashed var(--color-border)' // Dashed border as in wireframe
        }}>
            {stages.map((stage, index) => {
                const isActive = stage === currentStage;
                const isPast = stages.indexOf(currentStage) > index;
                const isLast = index === stages.length - 1;

                return (
                    <div key={stage} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '0.4rem 0.75rem',
                                color: isActive ? 'var(--color-primary)' : (isPast ? 'var(--color-text-main)' : 'var(--color-text-muted)'),
                                fontWeight: isActive ? 700 : 500,
                                fontSize: '13px',
                                flex: 1,
                                justifyContent: 'center',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {stageLabels[stage] || stage}
                        </div>
                        {!isLast && (
                            <ChevronRight size={14} style={{ color: 'var(--color-text-muted)', opacity: 0.5 }} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
