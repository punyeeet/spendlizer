import { connect } from "@/app/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import Transaction from "@/models/transactionModel";
import Tag from "@/models/tagModel";


connect()

export async function GET(request: NextRequest) {

    try {

        const userId = await getDataFromToken(request);

        const allTransactions = await Transaction.find({ userId }).select("-userId").select("-__v");

        const allTags = await Tag.find({ userId }).select("-userId").select("-__v");

        // ---> check for mongo err
        if(!allTransactions || !allTags ){
            throw new Error("Problem fetching from database.")
        }

        const responseData = allTags.map(tag => ({
            tag,
            transactions: allTransactions.filter(transaction =>
                transaction.tag.includes(tag._id)
            )
        }));


        return NextResponse.json({
            message: "Transactions as per tags fetched successfully",
            success: true,
            data: responseData
        }, { status: 200 })

    } catch (error: any) {
        return NextResponse.json({
            error: error.message
        }, { status: 500 })
    }


}