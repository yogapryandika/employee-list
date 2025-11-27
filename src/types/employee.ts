export interface BasicInfo {
    id?: string;
    fullName: string;
    email: string;
    role: string;
    department: string;
    employeeId: string;
}

export interface Details {
    id?: string;
    email: string;
    photo: string;
    employmentType: string;
    location: string;
    notes: string;
}

export interface Employee extends BasicInfo {
    photo?: string;
    employmentType?: string;
    location?: string;
    notes?: string;
}

export interface Department {
    id: string;
    name: string;
}

export interface Location {
    id: string;
    name: string;
}

export type UserRole = 'admin' | 'ops';

export interface WizardFormData {
    fullName: string;
    email: string;
    role: string;
    department: string;
    employeeId: string;
    photo: string;
    employmentType: string;
    location: string;
    notes: string;
}
