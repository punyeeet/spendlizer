import { connect } from "@/app/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import Transaction from "@/models/transactionModel";


connect()

export async function POST(request: NextRequest) {

    try {

        const reqBody = await request.json();
        console.log(reqBody)
        const { amount, tag , date, description, type } = reqBody.data;

        const userId = await getDataFromToken(request);

        const newTransaction = new Transaction({
            amount,
            tag,
            date: new Date(date),
            description,
            type,
            userId
        });

        const savedTransaction = await newTransaction.save();

        return NextResponse.json({
            message: "Transaction added successfully",
            success: true,
            savedTransaction
        },{ status: 200})

    } catch (error: any) {
        return NextResponse.json({
            error: error.message
        }, { status: 500 })
    }


}