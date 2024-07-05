import { connect } from "@/app/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import Transaction from "@/models/transactionModel";


connect()

export async function GET(request: NextRequest) {

    try {

        const userId = await getDataFromToken(request);

        const allTransactions = await Transaction.find({ userId }).select("-userId").select("-__v");

        return NextResponse.json({
            message: "Transactions fetched successfully",
            success: true,
            data: allTransactions
        },{ status: 200})

    } catch (error: any) {
        return NextResponse.json({
            error: error.message
        }, { status: 500 })
    }


}