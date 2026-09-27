import { connect } from "@/app/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import Transaction from "@/models/transactionModel";
import { buildDateQuery } from "@/helpers/generic";

connect();

export async function GET(request: NextRequest) {
    try {
        const userId = await getDataFromToken(request);

        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");

        const query: Record<string, any> = { userId, type: "debit" };
        const dateFilter = buildDateQuery(startDate, endDate);
        if (dateFilter) {
            query.date = dateFilter;
        }

        const allTransactions = await Transaction.find(query)
            .sort({ date: -1 })
            .select("-userId")
            .select("-__v");

        if (!allTransactions) {
            throw new Error("Problem fetching from database.");
        }

        return NextResponse.json(
            {
                message: "All Debit Transactions fetched successfully",
                success: true,
                data: allTransactions,
            },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            {
                error: error.message,
            },
            { status: 500 }
        );
    }
}
