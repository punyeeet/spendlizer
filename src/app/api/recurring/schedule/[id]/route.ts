import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/app/dbConfig/dbConfig';
import { getDataFromToken } from '@/helpers/getDataFromToken';
import RecurringPayment from '@/models/recurringPayment';
import Transaction from '@/models/transactionModel';

export const dynamic = 'force-dynamic';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connect();
        const userId = await getDataFromToken(request);
        const { id } = params;

        const schedule = await RecurringPayment.findOne({ _id: id, userId });
        if (!schedule) {
            return NextResponse.json(
                { error: 'Recurring schedule not found' },
                { status: 404 }
            );
        }

        const generatedTransactions = await Transaction.find({
            recurringScheduleId: id,
            userId,
        }).sort({ date: -1 });

        return NextResponse.json(
            {
                message: 'Recurring schedule fetched successfully',
                success: true,
                data: {
                    schedule,
                    transactions: generatedTransactions,
                },
            },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Failed to fetch schedule' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connect();
        const userId = await getDataFromToken(request);
        const { id } = params;
        const reqBody = await request.json();

        const schedule = await RecurringPayment.findOne({ _id: id, userId });
        if (!schedule) {
            return NextResponse.json(
                { error: 'Recurring schedule not found' },
                { status: 404 }
            );
        }

        const {
            name,
            amount,
            type,
            frequency,
            startDate,
            endDate,
            tag,
            description,
            status,
        } = reqBody;

        if (name !== undefined) schedule.name = name;
        if (amount !== undefined) schedule.amount = Number(amount);
        if (type !== undefined) schedule.type = type;
        if (frequency !== undefined) schedule.frequency = frequency;
        if (startDate !== undefined) schedule.startDate = new Date(startDate);
        if (endDate !== undefined) {
            schedule.endDate = endDate ? new Date(endDate) : null;
        }
        if (tag !== undefined) schedule.tag = tag;
        if (description !== undefined) schedule.description = description;
        if (status !== undefined) schedule.status = status;

        const updatedSchedule = await schedule.save();

        return NextResponse.json(
            {
                message: 'Recurring schedule updated successfully',
                success: true,
                data: updatedSchedule,
            },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Failed to update schedule' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connect();
        const userId = await getDataFromToken(request);
        const { id } = params;

        const deletedSchedule = await RecurringPayment.findOneAndDelete({
            _id: id,
            userId,
        });

        if (!deletedSchedule) {
            return NextResponse.json(
                { error: 'Recurring schedule not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                message: 'Recurring schedule deleted successfully',
                success: true,
            },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Failed to delete schedule' },
            { status: 500 }
        );
    }
}
