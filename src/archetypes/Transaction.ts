export enum TRANSACTION_TYPE {
    CREDIT = 'credit',
    DEBIT = 'debit'
}

export enum RECURRING_FREQUENCY {
    DAILY = 'daily',
    WEEKLY = 'weekly',
    MONTHLY = 'monthly',
    YEARLY = 'yearly'
}

export enum RECURRING_STATUS {
    ACTIVE = 'active',
    PAUSED = 'paused',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
}

export interface Transaction {
    date: Date | string;
    amount: number;
    type: TRANSACTION_TYPE;
    tag: string[];
    description: string;
    _id?: string;
    recurringScheduleId?: string;
    isRecurring?: boolean;
}

export interface Tag {
    _id: string;
    tag: string;
    color: string;
}

export interface RecurringSchedule {
    _id?: string;
    userId?: string;
    name: string;
    amount: number;
    type: TRANSACTION_TYPE;
    description?: string;
    tag: string[];
    frequency: RECURRING_FREQUENCY;
    startDate: Date | string;
    endDate?: Date | string | null;
    nextOccurrence: Date | string;
    lastRunDate?: Date | string | null;
    occurrencesGenerated?: number;
    status: RECURRING_STATUS;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}
