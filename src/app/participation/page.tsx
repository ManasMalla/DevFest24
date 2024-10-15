"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, doc, getDoc } from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";

export default function Page() {
  const router = useRouter();
  // const { data: session } = useSession();
  // const userId = (session?.user as { id: string })?.id;
  const [registration, setRegistration] = useState<boolean | undefined>(false);
  const [applicationStatus, setApplicationStatus] = useState<string>("");

  useEffect(
    () => {
      const fetchUser = async () => {
        // if (!userId) {
        //   toast.error("User ID not found. Please log in again.");
        //   return;
        // }
        // const userRef = doc(collection(db, "users"), userId);
        // try {
        //   const userSnapshot = await getDoc(userRef);
        //   if (userSnapshot.exists()) {
        //     const userData = userSnapshot.data();
        //     if (userData?.registration) {
        //       setRegistration(true);
        //       setApplicationStatus(
        //         userData.registrationDetails?.applicationStatus || ""
        //       );
        //     } else {
        //       setRegistration(false);
        //     }
        //   } else {
        //     setRegistration(false);
        //   }
        // } catch (error) {
        //   console.error("Error fetching user data:", error);
        //   toast.error("An unexpected error occurred. Please try again.");
        // }
      };

      fetchUser();
    },
    [
      // userId
    ]
  );

  if (registration === undefined)
    return (
      <div className="w-full h-screen flex justify-center items-center ">
        Loading...
      </div>
    );

  if (registration) {
    return (
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <p className="font-mono text-4xl font-medium">Devfest-2024</p>
          <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
            <li className="mb-2">
              Your application Status:
              <span
                className={`font-semibold text-xl font-mono ${
                  applicationStatus === "processing"
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
        </main>
        <Toaster />
      </div>
    );
  } else {
    return (
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <p className="font-mono text-4xl font-medium">Devfest-2024</p>
          <ul className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
            <li className="mb-2">Hurray one step further ⚡</li>
          </ul>
          <div
            onClick={() => router.push("/registration")}
            className="flex justify-center items-center rounded-3xl space-x-2 bg-white px-7 py-2 w-fit text-center cursor-pointer transition-all duration-500 hover:scale-105"
          >
            <p className="text-black font-medium text-sm sm:text-xs">
              Apply To be Volunteer 👤
            </p>
          </div>
        </main>
        <Toaster />
      </div>
    );
  }
}
