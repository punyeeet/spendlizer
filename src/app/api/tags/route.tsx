import { connect } from "@/app/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import Tag from "@/models/tagModel";


connect()

export async function GET(request: NextRequest) {

    try {

        const userId = await getDataFromToken(request);

        const tokenId = request.nextUrl.searchParams.get("id");

        const tags = await Tag.find({ userId, _id: tokenId }).select("-userId").select("-__v");

        if (tags.length == 0) {
            return NextResponse.json({
                message: "Tag not found",
                success: false,
                data: tags,
            }, { status: 404 })
        }

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