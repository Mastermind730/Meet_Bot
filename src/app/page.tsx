"use client";
import { useState } from 'react';

export default function Home() {
    const [meetLink, setMeetLink] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e:any) => {
        e.preventDefault();
        const res = await fetch('/api/startbot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ meetLink, email, password }),
        });
        const data = await res.json();
        console.log('Success:', data);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl text-black font-bold mb-6">Google Meet Bot</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Google Meet Link:</label>
                        <input
                            type="text"
                            value={meetLink}
                            onChange={(e) => setMeetLink(e.target.value)}
                            required
                            className="mt-1 p-2 text-black w-full border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email ID:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 p-2 text-black w-full border rounded"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700">Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 text-black p-2 w-full border rounded"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}
