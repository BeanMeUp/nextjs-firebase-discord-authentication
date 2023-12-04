"use client";

import { auth } from "@/utils/firebase";
import { signInWithCustomToken } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";

const DiscordAuth = () => {
    const searchParams = useSearchParams();
    const custom_token = searchParams.get("custom_token");
    const router = useRouter();

    signInWithCustomToken(auth, custom_token!).then(() => {
        if (auth.currentUser) {
            router.push("/admin");
        } else {
            router.push("/");
        }
    });

    return <div>Logging in...</div>;
};

export default DiscordAuth;
