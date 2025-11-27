import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import type { UserRole, WizardFormData } from '../../types/employee';
import { submitEmployee, type SubmitProgress } from '../../utils/submitEmployees';
import { clearDraft, loadDraft, saveDraft } from '../../utils/localStorage';
import styles from './wizards.module.scss';
import Step1Form from './Form/Step1Form';
import Step2Form from './Form/Step2Form';
import ProgressBar from '../../components/ProgressBar';

const initialFormData: WizardFormData = {
    fullName: '',
    email: '',
    role: '',
    department: '',
    employeeId: '',
    photo: '',
    employmentType: '',
    location: '',
    notes: '',
};

const Wizards: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate();
    const roleParam = searchParams.get('role') as UserRole | null;

    const [currentRole, setCurrentRole] = useState<UserRole>(roleParam || 'admin');
    const [currentStep, setCurrentStep] = useState<number>(roleParam === 'ops' ? 2 : 1);
    const [formData, setFormData] = useState<WizardFormData>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitProgress, setSubmitProgress] = useState<SubmitProgress>({
        step: 'idle',
        message: '',
        progress: 0,
    });
    const [logs, setLogs] = useState<string[]>([]);

    const debounceRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            saveDraft(currentRole, formData);
        }, 2000);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [formData, currentRole]);

    useEffect(() => {
        const draft = loadDraft(currentRole);
        if (draft) {
            setFormData(prev => ({ ...prev, ...draft }));
        }
    }, [currentRole]);

    const handleRoleToggle = (role: UserRole) => {
        setCurrentRole(role);
        setCurrentStep(role === 'ops' ? 2 : 1);
    };

    const handleNext = () => {
        setCurrentStep(2);
    };

    const handleBack = () => {
        setCurrentStep(1);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setLogs([]);

        const progressCallback = (progress: SubmitProgress) => {
            setSubmitProgress(progress);
            setLogs(prev => [...prev, progress.message]);
        };

        try {
            const basicInfo = {
                fullName: formData.fullName,
                email: formData.email,
                role: formData.role,
                department: formData.department,
                employeeId: formData.employeeId,
            };

            const details = {
                email: formData.email,
                photo: formData.photo,
                employmentType: formData.employmentType,
                location: formData.location,
                notes: formData.notes,
            };

            await submitEmployee(basicInfo, details, progressCallback);

            // Clear draft after successful submission
            clearDraft(currentRole);

            // Reset form
            setFormData(initialFormData);

            // Navigate to employees page after 2 seconds
            setTimeout(() => {
                navigate('/employees');
            }, 2000);
        } catch (error) {
            console.error('Submission failed:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        setSearchParams({ role: currentRole });
    }, [currentRole, setSearchParams]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Add Employee</h1>
                <div className={styles.roleToggle}>
                    <button
                        className={`${styles.roleButton} ${currentRole === 'admin' ? styles.active : ''}`}
                        onClick={() => handleRoleToggle('admin')}
                        disabled={isSubmitting}
                    >
                        Admin
                    </button>
                    <button
                        className={`${styles.roleButton} ${currentRole === 'ops' ? styles.active : ''}`}
                        onClick={() => handleRoleToggle('ops')}
                        disabled={isSubmitting}
                    >
                        Ops
                    </button>
                </div>
            </div>
            <div>
                <div className={styles.steps}>
                    {
                        currentRole === 'admin' && (
                            <div className={`${styles.stepIndicator} ${currentStep === 1 ? styles.activeStep : styles.completedStep}`}>
                                <span className={styles.stepNumber}>1</span>
                                <span className={styles.stepLabel}>Basic Info</span>
                            </div>
                        ) 
                    }
                    <div className={`${styles.stepIndicator} ${currentStep === 2 ? styles.activeStep : ''}`}>
                        <span className={styles.stepNumber}>{currentRole === 'admin' ? '2' : '1'}</span>
                        <span className={styles.stepLabel}>Details</span>
                    </div>
                </div>
                <div className={styles.formCard}>
                    {currentStep === 1 && currentRole === 'admin' && (
                        <Step1Form
                            formData={formData}
                            setFormData={setFormData}
                            onNext={handleNext}
                        />
                    )}
                    {currentStep === 2 && (
                        <Step2Form
                            formData={formData}
                            setFormData={setFormData}
                            onBack={currentRole === 'admin' ? handleBack : undefined}
                            onSubmit={handleSubmit}
                            isSubmitting={isSubmitting}
                        />
                    )}
                    {isSubmitting && (
                        <ProgressBar
                            progress={submitProgress.progress}
                            logs={logs}
                            status={submitProgress.step === 'error' ? 'error' : submitProgress.step === 'complete' ? 'success' : 'loading'}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default Wizards;