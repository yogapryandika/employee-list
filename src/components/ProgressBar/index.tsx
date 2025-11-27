import React from 'react';
import styles from './ProgressBar.module.scss';

interface ProgressBarProps {
    progress: number; // 0-100
    logs: string[];
    status: 'idle' | 'loading' | 'success' | 'error';
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, logs, status }) => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.barContainer}>
                <div
                    className={`${styles.bar} ${styles[status]}`}
                    style={{ width: `${progress}%` }}
                >
                    <span className={styles.percentage}>{progress}%</span>
                </div>
            </div>

            <div className={styles.logs}>
                {logs.map((log, index) => (
                    <div key={index} className={styles.logItem}>
                        <span className={styles.logIcon}>
                            {index < logs.length - 1 ? '✓' : '⋯'}
                        </span>
                        <span className={styles.logText}>{log}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProgressBar;
