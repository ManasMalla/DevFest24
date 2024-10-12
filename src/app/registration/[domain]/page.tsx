'use client';
import formFields from "@/lib/data/RegDetails";
import { ChangeEvent, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";

type FormDataProps = {
    phoneNumber: string;
    volunteerExperience: string;
    skillsOrTalents: string;
    volunteeringInterest: string;
    expectedOutcome: string;
    applicationStatus: 'processing' | 'approved' | 'rejected';
};

export default function page({ params }: { params: { domain: string } }) {
    const { data : session } = useSession();
    const userId = (session?.user as { id: string })?.id;
    const domain = decodeURIComponent(params.domain)
    const [formData, setFormData] = useState<FormDataProps>({
        phoneNumber: '',
        volunteerExperience: '',
        skillsOrTalents: '',
        volunteeringInterest: '',
        expectedOutcome: '',
        applicationStatus: 'processing',
    });

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
    
        const userRef = doc(collection(db, 'users'), userId);
    
        try {
            const userSnapshot = await getDoc(userRef);
    
            if (userSnapshot.exists()) {
                const userData = userSnapshot.data();
    
                if (userData.registration) {
                    toast.error("Registration with this email already exists.");
                    return;
                }
            }
    
            toast.promise(
                setDoc(userRef, { registrationDetails: formData, registration: true }, { merge: true }),
                {
                    loading: 'Submitting Registration...',
                    success: 'Registration Successful',
                    error: 'Please try again!'
                }
            );
        } catch (error) {
            console.error("Error submitting registration:", error);
            toast.error("An unexpected error occurred. Please try again.");
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name as keyof FormDataProps]: value,
        });
    };


    return (
        <div className="w-full min-h-screen h-full border bg-gray-800 
        border-gray-700 flex flex-col justify-start items-center">
            <div className="w-full p-4">
                <h5 className="mb-5 text-center text-2xl font-semibold text-neutral-200">📃Fill in your details | <span className="font-mono text-xl">{domain}</span></h5>

                <div
                    className="flex flex-col justify-center items-center"
                >
                    {/*  Form */}
                    <form className="w-[80%]" onSubmit={handleSubmit}>
                        {
                            formFields.map((item, index) => (
                                <div key={index} className="mb-5">
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-400">{item.label}</label>
                                    <input
                                        type={item.type}
                                        id={item.label}
                                        name={item.name}
                                        value={formData[item.name as keyof FormDataProps] || ''} onChange={(e) => handleChange(e)}
                                        className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-400"
                                        placeholder={item.placeholder}
                                        required
                                    />
                                </div>
                            ))
                        }

                        <button type="submit" className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                        >Submit</button>
                    </form>

                </div>
            </div>
            <Toaster/>
        </div>
    );
};
