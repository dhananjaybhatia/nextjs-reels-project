import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import UserModel from "@/models/User";

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json()

        if (!email || !password) {
            return NextResponse.json({ error: "Email and Password are required" }, { status: 400 })

        }
        await connectToDatabase()
        const existingUser = await UserModel.findOne({ email })

        if (existingUser) {
            return NextResponse.json({ error: "Email already exist" }, { status: 400 })

        }
        await UserModel.create({
            email,
            password
        })
        return NextResponse.json({ message: "User created Successfully" }, { status: 201 })
    } catch (error) {
        console.error("User creation error:", error);
        return NextResponse.json({ error: "Fail to create new user." }, { status: 500 })

    }
}