'use client';
import { db } from "@/lib/firebase";
import { collection, doc, getDocs, onSnapshot, updateDoc } from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import { FormDataProps } from "@/app/registration/[domain]/page";
import formFields from "@/lib/data/RegDetails";
import toast, { Toaster } from "react-hot-toast";


const DomainOptions = [
    { value: "All", text: "All" },
    { value: "Web", text: "Web" },
    { value: "AI", text: "AI" },
    { value: "Cloud", text: "Cloud" }
];

type DefaultDetails = {
    email: string;
    name: string;
}

type ApplicationCollection = {
    uid: string;
    registration: boolean;
    registrationDetails: FormDataProps;
} & DefaultDetails;

export default function page() {
    const [showModal, setShowModal] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState<ApplicationCollection | null>(null);
    const [allApplications, setAllApplications] = useState<ApplicationCollection[]>([]);
    const [filteredApplications, setFilteredApplications] = useState<ApplicationCollection[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDomain, setSelectedDomain] = useState<string>('All');

    useEffect(() => {
        const usersRef = collection(db, 'users');
        const unsubscribe = onSnapshot(usersRef, (snapshot) => {
            const retrievedData = snapshot.docs.map(doc => doc.data() as ApplicationCollection);
            setAllApplications(retrievedData);
            setFilteredApplications(retrievedData);
        });

        return () => unsubscribe();
    }, []);

    const filterApplications = useCallback(() => {
        const filtered = allApplications.filter(application => {
            const matchesDomain = selectedDomain === 'All' || application.registrationDetails.domain.includes(selectedDomain);
            const matchesSearch = application.name.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesDomain && matchesSearch;
        });

        setFilteredApplications(filtered);
    }, [allApplications, searchTerm, selectedDomain]);

    useEffect(() => {
        filterApplications();
    }, [searchTerm, selectedDomain, filterApplications]);

    const openModal = (application: ApplicationCollection) => {
        setSelectedApplication(application);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedApplication(null);
    };
    return (
        <div className="min-h-screen bg-gray-800 w-full flex flex-col justify-center items-center p-4">
            <div className="overflow-x-hidden shadow-md">
                <div className="flex flex-col sm:flex-row flex-wrap space-y-4 items-center justify-between pb-4">
                    <div className="flex gap-2 justify-center items-center">
                        <p>Domain:</p>
                        <select
                            onChange={(e) => setSelectedDomain(e.target.value)}
                            id="dropdownRadioButton"
                            className="flex items-center justify-between text-white bg-gray-800 border border-gray-600 focus:outline-none hover:bg-gray-700 font-medium rounded-lg text-sm px-3 py-1.5 gap-2 appearance-none cursor-pointer"
                        >
                            {
                                DomainOptions.map((item, index) => (
                                    <option key={index} value={item.value} className="text-black px-4 py-2 hover:bg-gray-600 hover:text-white flex justify-between items-center cursor-pointer">
                                        {item.text}
                                    </option>
                                ))
                            }
                        </select>

                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center ps-3 pointer-events-none">
                            <span className="material-symbols-outlined">
                                search
                            </span>
                        </div>
                        <input
                            type="text"
                            id="table-search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block p-2 ps-10 text-sm text-white border border-gray-600 rounded-lg w-80 bg-gray-700 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Search by name"
                        />
                    </div>
                </div>
                <table className="w-full overflow-hidden text-sm text-left text-gray-400">
                    <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">E-mail</th>
                            <th scope="col" className="px-6 py-3">Domain</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            filteredApplications.map((item, index) => (
                                <tr
                                    key={index}
                                    className="bg-gray-800 border-b border-gray-700 hover:bg-gray-600"
                                    onClick={() => openModal(item)}
                                >
                                    <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">
                                        {item.name}
                                    </th>
                                    <td className="px-6 py-4 max-w-[clamp(150px,30vw,300px)] whitespace-nowrap overflow-hidden text-ellipsis">
                                        {item.email}
                                    </td>
                                    <td className="px-6 py-4">{item.registrationDetails.domain}</td>
                                    <td className={`x-6 py-4 font-mono ${item.registrationDetails.applicationStatus === 'processing'
                                        ? "text-yellow-500" : item.registrationDetails.applicationStatus === 'rejected'
                                            ? 'text-red-500' : 'text-green-500'}`}
                                    >
                                        {item.registrationDetails.applicationStatus}
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            {showModal && selectedApplication && (
                <PopupModal application={selectedApplication} onClose={closeModal} />
            )}
            <Toaster />
        </div>
    );
};


function PopupModal({
    application,
    onClose
}: {
    application: ApplicationCollection,
    onClose: () => void
}) {
    const modalRef = useRef<HTMLDivElement>(null);
    const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            onClose();
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const updateApplicationStatus = async (status: string) => {
        const userRef = doc(collection(db, 'users'), application.uid);
        await toast.promise(
            updateDoc(userRef, { "registrationDetails.applicationStatus": status }),
            {
                loading: 'Updating please wait!',
                success: 'Status updated Successfully',
                error: 'Please try again!'
            }
        );

        onClose();
    }
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center select-none z-20"
        >
            <div ref={modalRef} className="w-[85%] flex flex-col gap-3 text-white">
                <button onClick={onClose} className="place-self-end">
                    <p className="size-10 text-white font-medium">X</p>
                </button>

                <div className="w-full max-h-[500px] overflow-y-scroll py-6 px-4 flex flex-col items-center bg-black/40 backdrop-blur-xl rounded-xl space-y-7 shadow-md shadow-gray-800 border border-gray-800">
                    <div className="h-px w-[80%] bg-gray-500 opacity-70" />
                    {
                        defaultDetails.map((item, index) => (
                            <div key={index} className="w-full flex-justify-start items-start gap-5 ">
                                <p className="w-full text-base font-medium tracking-wider text-[#62a6fa]/90">
                                    {item}
                                </p>
                                <p className="w-full text-sm font-normal tracking-wide text-white/60 text-wrap">
                                    {application[item as keyof DefaultDetails]}
                                </p>
                            </div>
                        ))
                    }
                    {
                        formFields.map((item, index) => (
                            <div key={index} className="w-full flex-justify-start items-start gap-5 ">
                                <p className="w-full text-base font-medium tracking-wider text-[#62a6fa]/90">
                                    {item.label}
                                </p>
                                <p className="w-full text-sm font-normal tracking-wide text-white/60 text-wrap">
                                    {application?.registrationDetails[item.name as keyof FormDataProps]}
                                </p>
                            </div>
                        ))
                    }
                </div>

                <div className="flex justify-center items-center gap-6">
                    <button
                        onClick={() => updateApplicationStatus('approved')}
                        type="button"
                        className={`focus:outline-none text-white bg-green-600/80 hover:bg-green-700 focus:ring-4 focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 ${application.registrationDetails.applicationStatus === 'approved' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Approve
                    </button>

                    <button
                        onClick={() => updateApplicationStatus('rejected')}
                        type="button"
                        className={`focus:outline-none text-white bg-red-600/80 hover:bg-red-700 focus:ring-4 focus:ring-red-900 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 ${application.registrationDetails.applicationStatus === 'rejected' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Reject
                    </button>

                </div>
            </div>
        </div>
    );
};

const defaultDetails = ['name', 'email'];