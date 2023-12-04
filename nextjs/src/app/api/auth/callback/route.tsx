import { exchangeCodeForToken } from "@/utils/discord";
import { app } from "@/utils/firebase";
import { getFunctions, httpsCallable } from "firebase/functions";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get("code");
    const access_token = await exchangeCodeForToken(code!);

    const functions = getFunctions(app, "us-central1");
    const generateCustomToken = httpsCallable(functions, "createToken");

    const firebaseToken: any = await generateCustomToken({
        access_token: access_token,
    });

    redirect("/login?access_token=" + firebaseToken.data.customToken);
}
