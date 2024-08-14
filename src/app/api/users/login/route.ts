import { connect } from "@/app/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        console.log("Request Body:", reqBody);

        const { email, password } = reqBody.data;

        // checking if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                {
                    error: "User does not exist",
                },
                { status: 400 }
            );
        }

        // check if password is correct
        const validPassword = await bcryptjs.compare(password, user.password);
        if (!validPassword) {
            return NextResponse.json(
                { error: "Invalid Password" },
                { status: 400 }
            );
        }

        // create token data
        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email,
        };

        if (!process.env.TOKEN_SECRET) {
            throw new Error("Missing TOKEN_SECRET environment variable");
        }

        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, {
            expiresIn: "1d",
        });

        const response = NextResponse.json({
            message: "Login successful",
            success: true,
        });

        response.cookies.set("token", token, {
            httpOnly: true,
        });

        return response;
    } catch (error: any) {
        console.error("Error:", error);
        return NextResponse.json(
            {
                error: error.message,
            },
            { status: 500 }
        );
    }
}
