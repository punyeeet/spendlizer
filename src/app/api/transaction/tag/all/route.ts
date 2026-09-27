import { connect } from "@/app/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import Transaction from "@/models/transactionModel";
import Tag from "@/models/tagModel";
import { buildDateQuery } from "@/helpers/generic";

connect();

export async function GET(request: NextRequest) {
    try {
        const userId = await getDataFromToken(request);

        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");

        const query: Record<string, any> = { userId };
        const dateFilter = buildDateQuery(startDate, endDate);
        if (dateFilter) {
            query.date = dateFilter;
        }

        const allTransactions = await Transaction.find(query)
            .sort({ date: -1 })
            .select("-userId")
            .select("-__v");

        const allTags = await Tag.find({ userId })
            .select("-userId")
            .select("-__v");

        if (!allTransactions || !allTags) {
            throw new Error("Problem fetching from database.");
        }

        const responseData = allTags.map((tag) => ({
            tag,
            transactions: allTransactions.filter((transaction) =>
                transaction.tag.includes(tag._id)
            ),
        }));

        return NextResponse.json(
            {
                message: "Transactions as per tags fetched successfully",
                success: true,
                data: responseData,
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
