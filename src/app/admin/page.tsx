'use client';
import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";

type adminLoginProps = {
    email: string;
    password: string;
}

export default function page() {
    const router = useRouter();
    const [formData, setFormData] = useState<adminLoginProps>({
        email: '',
        password: ''
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name as keyof adminLoginProps]: value,
        });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(formData.email === 'manasmalla.dev@gmail.com' && formData.password === 'manasmalla'){
            router.push('/admin/dashboard');
        }
    }

    return (
        <div className="h-screen bg-gray-800 w-full flex flex-col justify-center items-center">
            <p className="text-2xl font-mono text-center mb-4 font-semibold">Admin Login 🔐</p>
            <form onSubmit={handleSubmit} className="w-full mx-auto p-4 bg-gray-800">
                <div className="mb-5">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-white">Your email</label>
                    <input
                        value={formData.email || ''} onChange={(e) => handleChange(e)}
                        name="email"
                        type="email"
                        id="email"
                        className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-400"
                        placeholder="name@gmail.com"
                        required
                    />
                </div>
                <div className="mb-5">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">Your password</label>
                    <input
                        value={formData.password || ''} onChange={(e) => handleChange(e)}
                        name="password"
                        type="password"
                        id="password"
                        className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-400"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
                    Login
                </button>
            </form>
        </div>
    );
};
