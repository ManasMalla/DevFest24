"use client";
import { useEffect, useRef, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, doc, getDoc } from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";
import { Roles } from "@/lib/data/RegDetails";

export default function Page() {
  const user = useAuthContext();
  const [registration, setRegistration] = useState<boolean | undefined>(false);
  const [applicationStatus, setApplicationStatus] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      fetchUserData(user.uid);
    } else {
      setLoading(false);
    }
  }, [user]);

  const openModal = (jobDescription: string[]) => {
    setSelectedRole(jobDescription)
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const fetchUserData = async (userId: string) => {
    const userRef = doc(collection(db, "users"), userId);
    try {
      const userSnapshot = await getDoc(userRef);
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        setRegistration(userData?.registration || false);
        setApplicationStatus(
          userData.registrationDetails?.applicationStatus || ""
        );
      } else {
        setRegistration(false);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center ">
        Loading...
      </div>
    );
  }
  if (registration) {
    return (
      <div>
        <p className="font-mono text-4xl font-medium">Devfest-2024</p>
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Your application Status:
            <span
              className={`font-semibold text-xl font-mono ${applicationStatus === "processing"
                ? "text-yellow-500"
                : applicationStatus === "rejected"
                  ? "text-red-500"
                  : "text-blue-500"
                }`}
            >
              {applicationStatus}
            </span>
          </li>
        </ol>
        <Toaster />
      </div>
    );
  } else {
    return (
      <div className="px-4 w-full">
        <div>
          <div className="w-full flex flex-col md:flex-row md:gap-12">
            <div className="relative h-max  md:min-w-[60%]">
              <img
                src="/images/volunteers.jpg"
                className="aspect-[1.677] rounded-3xl border-2 border-[rgb(var(--md-sys-color-on-surface))] object-cover"
              />
              <div className="h-9 w-48 rounded-tr-3xl border-r-2 border-t-2 border-[rgb(var(--md-sys-color-on-surface))] absolute -bottom-[1px] -left-[1px] bg-[rgb(var(--md-sys-color-background))]" />
              <div className="h-24 w-12 rounded-bl-xl absolute border-l-2 border-b-2 border-[rgb(var(--md-sys-color-on-surface))] -top-[1px] -right-[1px] bg-[rgb(var(--md-sys-color-background))]" />
            </div>
            <div className="mt-6 md:mt-0 -translate-y-10 md:translate-y-0">
              <h2 className="text-2xl font-medium md:-translate-x-6">
                Our Backbone.
              </h2>
              <h3 className="text-4xl font-bold md:-translate-x-6 mb-6">
                Our Volunteers.
              </h3>
              {/*               <p className="py-4 md:mb-4 lg:mb-0">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus
                suscipit laudantium aspernatur odio id, at iste repellendus,
                laboriosam voluptate dolore quae doloremque et beatae ipsum
                similique deleniti sapiente in vitae?
              </p>
              <p className="mb-4 md:hidden lg:flex lg:mb-8">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus
                suscipit laudantium aspernatur odio id, at iste repellendus,
                laboriosam voluptate dolore quae doloremque et beatae ipsum
                similique deleniti sapiente in vitae?
              </p> */}
              <a
                href="/registration"
                className="px-8 py-2 border-2 border-[rgb(var(--md-sys-color-on-surface))] w-max rounded-full mb-6 mt-6"
              >
                Apply now
              </a>
            </div>
          </div>
          <div className="flex flex-col">
            {/* <h3 className="text-xl font-medium">Perks</h3>
            <ul className="list-disc ml-4 my-4 grid grid-cols-2">
              <li>Lorem ipsum</li>
              <li>Lorem ipsum</li>
              <li>Lorem ipsum</li>
              <li>Lorem ipsum</li>
              <li>Lorem ipsum</li>
              <li>Lorem ipsum</li>
              <li>Lorem ipsum</li>
            </ul> */}
            <h3 className="text-xl font-medium">Where do I fit in?</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 my-4">
              {Roles.map((e, index) => {
                return (
                  <div
                    onClick={() => openModal(e.jobDescription)}
                    key={index}
                    className="flex flex-col items-center border-2 border-[rgb(var(--md-sys-color-on-surface))] p-2 py-3 rounded-xl hover:bg-black dark:hover:bg-white dark:hover:text-black hover:text-white cursor-pointer"
                  >
                    <p className="text-center">{e.title}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {showModal &&(
          <JobDescriptionModal jobDescription={selectedRole} onClose={closeModal} />
        )}
        <Toaster />
      </div>
    );
  }
};

type JobDescriptionModalProps = {
  jobDescription: string[];
  onClose: () => void;
};

const JobDescriptionModal = ({ jobDescription, onClose }: JobDescriptionModalProps) => {

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
  return (
    <div className="fixed inset-0 flex justify-center items-center select-none z-20 bg-black/20 backdrop-blur-sm">
      <div ref={modalRef} className="w-[85%] flex flex-col gap-3 text-white">
        <button onClick={onClose} className="place-self-end">
          <p className="size-10 text-black font-medium">X</p>
        </button>

        <div className="w-full h-fit py-6 px-4 flex flex-col items-center bg-white rounded-xl space-y-7 border border-gray-400">
          <p className="text-lg font-semibold text-black underline">Job Description:</p>
        <ul className="list-disc ml-4 my-4 grid grid-cols-1 md:grid-cols-2">
            {jobDescription.map((jd, index) => (
              <li key={index} className="text-black md:w-[90%]">{jd}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};