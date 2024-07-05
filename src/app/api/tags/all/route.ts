import { connect } from "@/app/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import Tag from "@/models/tagModel";


connect()

export async function GET(request: NextRequest) {

    try {

        const userId = await getDataFromToken(request);

        const tags = await Tag.find({ userId }).select("-userId").select("-__v");

        return NextResponse.json({
            message: "Tags fetched successfully",
            success: true,
            data: tags,
        }, { status: 200 })

    } catch (error: any) {
        return NextResponse.json({
            error: error.message
        }, { status: 500 })
    }


}