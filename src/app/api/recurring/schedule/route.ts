import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/app/dbConfig/dbConfig';
import { getDataFromToken } from '@/helpers/getDataFromToken';
import RecurringPayment from '@/models/recurringPayment';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        await connect();
        const userId = await getDataFromToken(request);

        const schedules = await RecurringPayment.find({ userId })
            .sort({ createdAt: -1 });

        return NextResponse.json(
            {
                message: 'Recurring schedules fetched successfully',
                success: true,
                data: schedules,
            },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Failed to fetch schedules' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        await connect();
        const userId = await getDataFromToken(request);
        const reqBody = await request.json();

        const {
            name,
            amount,
            type,
            frequency = 'monthly',
            startDate,
            endDate,
            tag = [],
            description = '',
        } = reqBody;

        if (!name || !amount || !type || !startDate) {
            return NextResponse.json(
                { error: 'Name, amount, type, and start date are required' },
                { status: 400 }
            );
        }

        const parsedStartDate = new Date(startDate);
        const parsedEndDate = endDate ? new Date(endDate) : null;

        if (parsedEndDate && parsedEndDate < parsedStartDate) {
            return NextResponse.json(
                { error: 'End date cannot be earlier than start date' },
                { status: 400 }
            );
        }

        const newSchedule = new RecurringPayment({
            userId,
            name,
            amount: Number(amount),
            type,
            frequency,
            startDate: parsedStartDate,
            endDate: parsedEndDate,
            nextOccurrence: parsedStartDate,
            tag,
            description,
            status: 'active',
            occurrencesGenerated: 0,
        });

        const savedSchedule = await newSchedule.save();

        return NextResponse.json(
            {
                message: 'Recurring schedule created successfully',
                success: true,
                data: savedSchedule,
            },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Failed to create recurring schedule' },
            { status: 500 }
        );
    }
}
