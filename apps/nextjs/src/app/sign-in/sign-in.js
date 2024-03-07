"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignIn() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        const res = await fetch("http://localhost:5000/api/login", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });
        if (res.ok) {
            router.push("/dashboard");
        }
        } catch (error) {
        console.error("An unexpected error happened:", error);
        }
    };
    
    return (
        <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold mb-8">Sign In</h1>
        <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
        >
            <input
            type="usernmame"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
            />
            <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
            />
            <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md"
            >
            Sign In
            </button>
        </form>
        <Link href="/sign-up">
            <button className="mt-4 text-blue-500">Not a user? Register now</button>
        </Link>
        </div>
    );
}

