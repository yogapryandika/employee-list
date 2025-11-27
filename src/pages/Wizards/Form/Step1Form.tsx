import { useEffect } from "react";
import type { WizardFormData } from "../../../types/employee";
import { generateEmployeeId } from "../../../utils/employeeId";
import Autocomplete from "../../../components/AutoComplete";
import styles from "../wizards.module.scss"
import { API_ENDPOINTS } from "../../../service/api";

interface Step1FormProps {
    formData: WizardFormData;
    setFormData: React.Dispatch<React.SetStateAction<WizardFormData>>;
    onNext: () => void;
}

const Step1Form: React.FC<Step1FormProps> = ({ formData, setFormData, onNext }) => {
    useEffect(() => {
        if (formData.department) {
            generateEmployeeId(formData.department).then(id => {
                setFormData(prev => ({ ...prev, employeeId: id }));
            });
        }
    }, [formData.department, setFormData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onNext();
    };

    const role = ["Ops", "Admin", "Engineer", "Finance"]

    const isValid = formData.fullName && formData.email && formData.role && formData.department;

    return (
        <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
                <label className={styles.label}>
                    Full Name <span className={styles.required}>*</span>
                </label>
                <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Enter full name"
                    required
                    className={styles.input}
                />
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>
                    Email <span className={styles.required}>*</span>
                </label>
                <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="email@company.com"
                    required
                    className={styles.input}
                />
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>
                    Role <span className={styles.required}>*</span>
                </label>
                <select
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    required
                    className={styles.select}
                >
                    <option value="">Select a role</option>
                    {
                        role.map(r => (
                            <option key={r} value={r}>{r}</option>
                        ))
                    }
                </select>
            </div>

            <Autocomplete
                label="Department"
                value={formData.department}
                onChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
                fetchUrl={API_ENDPOINTS.DEPARTMENTS_SEARCH}
                placeholder="Start typing to search..."
                required
            />

            {formData.employeeId && (
                <div className={styles.employeeIdDisplay}>
                    <strong>Employee ID:</strong> {formData.employeeId}
                </div>
            )}

            <button
                type="submit"
                className={styles.submitBtn}
                disabled={!isValid}
            >
                Next Step →
            </button>
        </form>
    )
}

export default Step1Form;