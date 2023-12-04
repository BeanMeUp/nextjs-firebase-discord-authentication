"use client";

import { auth } from "@/utils/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import React from "react";

const Admin = () => {
    const router = useRouter();
    return (
        <main className="flex min-h-screen flex-col items-center p-24">
            You must be logged in to see this page
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-6"
                onClick={async () => {
                    signOut(auth);
                    router.push("/");
                }}
            >
                Logout
            </button>
        </main>
    );
};

export default Admin;
