import RecurringPayment from '@/models/recurringPayment';
import Transaction from '@/models/transactionModel';

export function calculateNextOccurrence(
    currentDate: Date,
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
): Date {
    const next = new Date(currentDate.getTime());

    switch (frequency) {
        case 'daily':
            next.setDate(next.getDate() + 1);
            break;
        case 'weekly':
            next.setDate(next.getDate() + 7);
            break;
        case 'monthly': {
            const currentDay = currentDate.getDate();
            next.setMonth(next.getMonth() + 1);
            // Handle month rollover (e.g. Jan 31 -> Feb 28/29)
            if (next.getDate() !== currentDay) {
                next.setDate(0); // Set to last day of previous month
            }
            break;
        }
        case 'yearly': {
            const currentMonth = currentDate.getMonth();
            next.setFullYear(next.getFullYear() + 1);
            // Handle leap year Feb 29 rollover
            if (next.getMonth() !== currentMonth) {
                next.setDate(0);
            }
            break;
        }
        default:
            next.setMonth(next.getMonth() + 1);
            break;
    }

    return next;
}

export interface ProcessResult {
    success: boolean;
    timestamp: Date;
    processedSchedulesCount: number;
    transactionsCreatedCount: number;
    completedSchedulesCount: number;
    errors: Array<{ scheduleId: string; error: string }>;
}

export async function processDueRecurringSchedules(asOfDate: Date = new Date()): Promise<ProcessResult> {
    const result: ProcessResult = {
        success: true,
        timestamp: asOfDate,
        processedSchedulesCount: 0,
        transactionsCreatedCount: 0,
        completedSchedulesCount: 0,
        errors: [],
    };

    // Find all active schedules whose next occurrence is due on or before asOfDate
    const dueSchedules = await RecurringPayment.find({
        status: 'active',
        nextOccurrence: { $lte: asOfDate },
    });

    result.processedSchedulesCount = dueSchedules.length;

    for (const schedule of dueSchedules) {
        try {
            let nextOcc = new Date(schedule.nextOccurrence);
            const endDate = schedule.endDate ? new Date(schedule.endDate) : null;
            let transactionsCreatedForSchedule = 0;

            // Catch-up loop in case multiple intervals elapsed
            // Safeguard against infinite loops with max iterations
            let iterations = 0;
            const MAX_ITERATIONS = 500;

            while (nextOcc <= asOfDate && (!endDate || nextOcc <= endDate) && iterations < MAX_ITERATIONS) {
                iterations++;

                // Create the transaction
                const newTransaction = new Transaction({
                    userId: schedule.userId.toString(),
                    amount: schedule.amount,
                    type: schedule.type,
                    description: schedule.description || schedule.name,
                    tag: schedule.tag || [],
                    date: new Date(nextOcc),
                    isRecurring: true,
                    recurringScheduleId: schedule._id,
                });

                await newTransaction.save();
                transactionsCreatedForSchedule++;
                result.transactionsCreatedCount++;

                schedule.lastRunDate = new Date(nextOcc);
                schedule.occurrencesGenerated = (schedule.occurrencesGenerated || 0) + 1;

                // Advance nextOccurrence
                nextOcc = calculateNextOccurrence(nextOcc, schedule.frequency);
            }

            schedule.nextOccurrence = nextOcc;

            // If endDate exists and nextOcc exceeds endDate, complete the schedule
            if (endDate && nextOcc > endDate) {
                schedule.status = 'completed';
                result.completedSchedulesCount++;
            }

            await schedule.save();
        } catch (scheduleError: any) {
            result.errors.push({
                scheduleId: schedule._id.toString(),
                error: scheduleError.message || 'Unknown error processing schedule',
            });
        }
    }

    if (result.errors.length > 0) {
        result.success = result.errors.length < dueSchedules.length;
    }

    return result;
}
