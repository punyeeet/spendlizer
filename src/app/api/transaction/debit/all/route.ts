import { connect } from "@/app/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import Transaction from "@/models/transactionModel";
import Tag from "@/models/tagModel";


connect()

export async function GET(request: NextRequest) {

    try {

        const userId = await getDataFromToken(request);

        const allTransactions = await Transaction.find({ userId,type:'debit' }).select("-userId").select("-__v");

        // ---> check for mongo err
        if(!allTransactions){
            throw new Error("Problem fetching from database.")
        }

        return NextResponse.json({
            message: "All Credit Transactions fetched successfully",
            success: true,
            data: allTransactions
        }, { status: 200 })

    } catch (error: any) {
        return NextResponse.json({
            error: error.message
        }, { status: 500 })
    }


}