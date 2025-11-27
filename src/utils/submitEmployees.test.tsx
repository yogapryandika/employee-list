import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import submitEmployee from './submitEmployees';

vi.mock('axios');

describe('submitEmployee', () => {
    const mockBasicInfo = {
        fullName: 'John Doe',
        email: 'john@example.com',
        role: 'Developer',
        department: 'Engineering',
        employeeId: 'ENG-001',
    };

    const mockDetails = {
        email: 'john@example.com',
        photo: 'base64string',
        employmentType: 'Full-time',
        location: 'New York Office',
        notes: 'Test notes',
    };

    beforeEach(() => {
        vi.resetAllMocks();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    it('performs sequential POST requests with delays', async () => {
        const progressCallback = vi.fn();

        (axios.post as any)
            .mockResolvedValueOnce({ data: {} })
            .mockResolvedValueOnce({ data: {} });

        const submitPromise = submitEmployee(mockBasicInfo, mockDetails, progressCallback);

        expect(progressCallback).toHaveBeenCalledWith(
            expect.objectContaining({
                step: 'basic',
                message: 'Submitting basic information...',
                progress: 25,
            })
        );

        await vi.runOnlyPendingTimersAsync();

        expect(axios.post).toHaveBeenNthCalledWith(
            1,
            'http://localhost:4001/basicInfo',
            mockBasicInfo
        );

        expect(progressCallback).toHaveBeenCalledWith(
            expect.objectContaining({
                step: 'basic',
                message: 'Basic information submitted successfully',
                progress: 50,
            })
        );

        await vi.advanceTimersByTimeAsync(3000);

        expect(progressCallback).toHaveBeenCalledWith(
            expect.objectContaining({
                step: 'details',
                message: 'Submitting employee details...',
                progress: 75,
            })
        );

        await vi.runOnlyPendingTimersAsync();

        expect(axios.post).toHaveBeenNthCalledWith(
            2,
            'http://localhost:4002/details',
            mockDetails
        );

        await vi.advanceTimersByTimeAsync(3000);

        await submitPromise;

        expect(progressCallback).toHaveBeenCalledWith(
            expect.objectContaining({
                step: 'complete',
                message: 'Employee created successfully!',
                progress: 100,
            })
        );
    });

    it('verifies delay between requests is approximately 3 seconds', async () => {
        const progressCallback = vi.fn();

        (axios.post as any)
            .mockResolvedValueOnce({ data: {} })
            .mockResolvedValueOnce({ data: {} });

        const submitPromise = submitEmployee(mockBasicInfo, mockDetails, progressCallback);

        // Complete first POST
        await vi.runOnlyPendingTimersAsync();

        const timeBeforeDelay = Date.now();

        // Advance through the delay
        await vi.advanceTimersByTimeAsync(3000);

        const timeAfterDelay = Date.now();

        // Verify approximately 3 seconds passed
        expect(timeAfterDelay - timeBeforeDelay).toBeGreaterThanOrEqual(3000);

        await vi.runOnlyPendingTimersAsync();
        await vi.advanceTimersByTimeAsync(3000);
        await submitPromise;
    });
});
