import { NextResponse, NextRequest } from "next/server";
import sendForm from "@/nodemailer/sendForm";

export async function POST(request: NextRequest) {
    console.log("Received POST request");
    try {
        const body = await request.json();
        const { email, data } = body;
        await sendForm(email, data);
        
        return NextResponse.json(
            { success: true },
            { status: 200 }
        )
    } catch (error) {
        console.error("Error in sending mail! 📩");
        return NextResponse.json(
            { success : false },
            { status: 500}
        )
    }
};
