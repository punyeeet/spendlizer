export function formatDate(date: string | Date) {
    if (!date) return '';
    return new Date(date).toDateString();
}

export function buildDateQuery(startDateParam?: string | null, endDateParam?: string | null) {
    const dateFilter: Record<string, any> = {};

    if (startDateParam && startDateParam.trim()) {
        const start = new Date(startDateParam);
        if (!isNaN(start.getTime())) {
            start.setHours(0, 0, 0, 0);
            dateFilter.$gte = start;
        }
    }

    if (endDateParam && endDateParam.trim()) {
        const end = new Date(endDateParam);
        if (!isNaN(end.getTime())) {
            end.setHours(23, 59, 59, 999);
            dateFilter.$lte = end;
        }
    }

    return Object.keys(dateFilter).length > 0 ? dateFilter : null;
}
