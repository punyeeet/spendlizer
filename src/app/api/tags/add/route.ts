import { connect } from "@/app/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import Tag from "@/models/tagModel";


connect()

export async function POST(request: NextRequest) {

    try {

        const reqBody = await request.json();
        console.log('in Server: ',reqBody)
        const { tag, color } = reqBody.data;

        const userId = await getDataFromToken(request);

        const newTag = new Tag({
            tag,color,userId
        });

        const savedTag = await newTag.save();

        return NextResponse.json({
            message: "Tag added successfully",
            success: true,
            savedTag
        },{ status: 200})

    } catch (error: any) {
        return NextResponse.json({
            error: error.message
        }, { status: 500 })
    }


}