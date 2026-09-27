import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/app/dbConfig/dbConfig';
import { processDueRecurringSchedules } from '@/helpers/recurringEngine';

export const dynamic = 'force-dynamic';

function verifyCronAuth(request: NextRequest): boolean {
    const cronSecret = process.env.CRON_SECRET;

    // If no CRON_SECRET is configured in development, allow the request with a warning
    if (!cronSecret) {
        console.warn('CRON_SECRET environment variable is not set. Allowing request in unauthenticated mode.');
        return true;
    }

    const authHeader = request.headers.get('authorization');
    const xCronSecret = request.headers.get('x-cron-secret');

    // Check Bearer token in Authorization header
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        if (token === cronSecret) return true;
    }

    // Check custom x-cron-secret header
    if (xCronSecret && xCronSecret === cronSecret) {
        return true;
    }

    return false;
}

export async function POST(request: NextRequest) {
    try {
        if (!verifyCronAuth(request)) {
            return NextResponse.json(
                { error: 'Unauthorized: Invalid or missing cron secret' },
                { status: 401 }
            );
        }

        await connect();

        const result = await processDueRecurringSchedules();

        return NextResponse.json(
            {
                message: 'Recurring schedules processed successfully',
                data: result,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Error executing recurring cron worker:', error);
        return NextResponse.json(
            {
                error: error.message || 'Internal Server Error',
            },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    // Also support GET requests for Cloud Scheduler or manual health checks
    return POST(request);
}
