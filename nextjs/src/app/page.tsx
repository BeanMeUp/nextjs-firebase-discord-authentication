"use client";

import { getDiscordAuthUrl } from "@/utils/discord";
import { auth } from "@/utils/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    return (
        <main className="flex min-h-screen flex-col items-center p-24">
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={async () => {
                    const provider = new GoogleAuthProvider();
                    await signInWithPopup(auth, provider);
                    router.push("/admin");
                }}
            >
                Login with Google
            </button>

            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                onClick={async () => {
                    const authUrl = getDiscordAuthUrl();
                    window.location.assign(authUrl);
                }}
            >
                Login with Discord
            </button>
        </main>
    );
}
