import type { WizardFormData, UserRole } from '../types/employee';

const DRAFT_KEY_PREFIX = 'wizard-draft';

export const saveDraft = (role: UserRole, data: Partial<WizardFormData>): void => {
    const key = `${DRAFT_KEY_PREFIX}-${role}`;
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Failed to save draft:', error);
    }
};

export const loadDraft = (role: UserRole): Partial<WizardFormData> | null => {
    const key = `${DRAFT_KEY_PREFIX}-${role}`;
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Failed to load draft:', error);
        return null;
    }
};

export const clearDraft = (role: UserRole): void => {
    const key = `${DRAFT_KEY_PREFIX}-${role}`;
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error('Failed to clear draft:', error);
    }
};
