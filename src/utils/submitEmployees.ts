import { employeeService } from '../service/api';
import type { BasicInfo, Details } from '../types/employee';

export interface SubmitProgress {
    step: 'idle' | 'basic' | 'details' | 'complete' | 'error';
    message: string;
    progress: number;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const submitEmployee = async (
    basicInfo: BasicInfo,
    details: Details,
    onProgress: (progress: SubmitProgress) => void
): Promise<void> => {
    try {
        // Step 1: Submit basic info
        onProgress({
            step: 'basic',
            message: 'Submitting basic information...',
            progress: 25
        });

        await employeeService.createBasicInfo(basicInfo);

        onProgress({
            step: 'basic',
            message: 'Basic information submitted successfully',
            progress: 50
        });

        // Simulate delay (~3 seconds)
        await delay(3000);

        // Step 2: Submit details
        onProgress({
            step: 'details',
            message: 'Submitting employee details...',
            progress: 75
        });

        await employeeService.createDetails(details);

        // Simulate delay (~3 seconds)
        await delay(3000);

        onProgress({
            step: 'complete',
            message: 'Employee created successfully!',
            progress: 100
        });
    } catch (error) {
        onProgress({
            step: 'error',
            message: error instanceof Error ? error.message : 'An error occurred',
            progress: 0
        });
        throw error;
    }
};

export default submitEmployee;