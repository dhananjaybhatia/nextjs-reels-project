// app/api/imagekit-auth/route.ts
import { NextResponse } from "next/server";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
    publicKey: process.env.NEXT_IMAGEKIT_PUBLIC_KEY!, // Only used on client
    privateKey: process.env.NEXT_IMAGEKIT_PRIVATE_KEY!, // Required only on server
    urlEndpoint: process.env.NEXT_IMAGEKIT_URL_ENDPOINT!,
});

export async function GET() {
    try {
        const result = imagekit.getAuthenticationParameters();
        return NextResponse.json(result);
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: "Failed to generate auth parameters" },
            { status: 500 }
        );
    }
}
