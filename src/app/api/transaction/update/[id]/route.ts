import { connect } from "@/app/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import Transaction from "@/models/transactionModel";


connect()

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {

    try {

        const reqBody = await req.json();
        console.log(reqBody)
        const { amount, tag , date, description, type, _id } = reqBody.data;

        const userId = await getDataFromToken(req);

        const res = await Transaction.updateOne({ _id: _id },{
            amount,
            tag,
            date: new Date(date),
            description,
            type,
            userId
        })

        return NextResponse.json({
            message: "Transaction updated successfully",
            success: true,
            response: res
        },{ status: 200})

    } catch (error: any) {
        return NextResponse.json({
            error: error.message
        }, { status: 500 })
    }


}