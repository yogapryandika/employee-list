import { employeeService } from '../service/api';

export const generateEmployeeId = async (department: string): Promise<string> => {
    const prefix = department.substring(0, 3).toUpperCase();

    try {
        const employees = await employeeService.getBasicInfoByDepartment(department);
        let maxSequence = 0;
        employees.forEach(emp => {
            if (emp.employeeId && emp.employeeId.startsWith(prefix)) {
                const parts = emp.employeeId.split('-');
                if (parts.length === 2) {
                    const sequence = parseInt(parts[1], 10);
                    if (!isNaN(sequence) && sequence > maxSequence) {
                        maxSequence = sequence;
                    }
                }
            }
        });
        const nextSequence = maxSequence + 1;
        const sequenceStr = nextSequence.toString().padStart(3, '0');

        return `${prefix}-${sequenceStr}`;
    } catch (error) {
        console.error('Failed to generate employee ID:', error);
        return `${prefix}-001`;
    }
};
