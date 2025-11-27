import React from 'react';
import styles from '../wizards.module.scss';
import type { WizardFormData } from '../../../types/employee';
import { ImageUpload } from '../../../components/ImageUpload/ImageUpload';
import Autocomplete from '../../../components/AutoComplete';
import { API_ENDPOINTS } from '../../../service/api';

interface Step2Props {
    formData: WizardFormData;
    setFormData: React.Dispatch<React.SetStateAction<WizardFormData>>;
    onBack?: () => void;
    onSubmit: () => void;
    isSubmitting: boolean;
}

const Step2Form: React.FC<Step2Props> = ({
    formData,
    setFormData,
    onBack,
    onSubmit,
    isSubmitting,
}) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit();
    };

    const isValid = formData.employmentType && formData.location;

    return (
        <form onSubmit={handleSubmit}>
            <h2>Step {onBack ? '2' : '1'}: Employee Details</h2>

            <ImageUpload
                label="Photo"
                value={formData.photo}
                onChange={(value) => setFormData(prev => ({ ...prev, photo: value }))}
            />

            <div className={styles.formGroup}>
                <label className={styles.label}>
                    Employment Type <span className={styles.required}>*</span>
                </label>
                <select
                    value={formData.employmentType}
                    onChange={(e) => setFormData(prev => ({ ...prev, employmentType: e.target.value }))}
                    required
                    className={styles.select}
                >
                    <option value="">Select employment type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Intern">Intern</option>
                </select>
            </div>

            <Autocomplete
                label="Office Location"
                value={formData.location}
                onChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
                fetchUrl={API_ENDPOINTS.LOCATIONS_SEARCH}
                placeholder="Start typing to search..."
                required
            />

            <div className={styles.formGroup}>
                <label className={styles.label}>Notes</label>
                <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes about the employee..."
                    rows={4}
                    className={styles.textarea}
                />
            </div>

            <div className={styles.buttonGroup}>
                {onBack && (
                    <button
                        type="button"
                        onClick={onBack}
                        className={styles.backBtn}
                        disabled={isSubmitting}
                    >
                        ← Back
                    </button>
                )}
                <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={!isValid || isSubmitting}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
            </div>
        </form>
    );
};

export default Step2Form;
