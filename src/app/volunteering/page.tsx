"use client";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, doc, getDoc } from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

export default function Page() {
  const router = useRouter();
  const user = useAuthContext();
  const [registration, setRegistration] = useState<boolean | undefined>(false);
  const [applicationStatus, setApplicationStatus] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData(user.uid);
    } else {
      setLoading(false);
    }
  }, [user]);

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
      <div className="px-4">
        <div>
          <div className="relative">
            <img
              src="/images/volunteers.jpg"
              className="aspect-[1.677] rounded-3xl border-2 border-black object-cover"
            />
            <div className="h-9 w-48 rounded-tr-3xl border-r-2 border-t-2 border-black absolute -bottom-[1px] -left-[1px] bg-white" />
            <div className="h-24 w-12 rounded-bl-xl absolute border-l-2 border-b-2 border-black -top-[1px] -right-[1px] bg-white" />
          </div>
          <div className="my-6 flex flex-col -translate-y-10">
            <h2 className="text-2xl font-medium">Our Backbone.</h2>
            <h3 className="text-4xl font-bold">Our Volunteers.</h3>
            <p className="py-4">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus
              suscipit laudantium aspernatur odio id, at iste repellendus,
              laboriosam voluptate dolore quae doloremque et beatae ipsum
              similique deleniti sapiente in vitae?
            </p>
            <p className="mb-4">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus
              suscipit laudantium aspernatur odio id, at iste repellendus,
              laboriosam voluptate dolore quae doloremque et beatae ipsum
              similique deleniti sapiente in vitae?
            </p>
            <a
              href="/registration"
              className="px-8 py-2 border-2 border-black w-max rounded-full mb-6"
            >
              Apply now
            </a>
            <h3 className="text-xl font-medium">Perks</h3>
            <ul className="list-disc ml-4 my-4 grid grid-cols-2">
              <li>Lorem ipsum</li>
              <li>Lorem ipsum</li>
              <li>Lorem ipsum</li>
              <li>Lorem ipsum</li>
              <li>Lorem ipsum</li>
              <li>Lorem ipsum</li>
              <li>Lorem ipsum</li>
            </ul>
            <h3 className="text-xl font-medium">Where do I fit in?</h3>
            <div className="grid grid-cols-3 gap-3 my-4">
              {[
                {
                  title: "Android",
                  image:
                    "https://lh3.googleusercontent.com/9v_pYj1CXETeu4G_id_-dP7b_q8Ys_Ga05S01yvU0aKxRWkzkxJGa2qWXrkWXtYzVsFV4Tuj1aQE6d-KsJGD8fTFJQFrGTLofjL_IknxGreQXGelhAg4",
                },
                {
                  title: "Flutter",
                  image:
                    "https://storage.googleapis.com/cms-storage-bucket/0dbfcc7a59cd1cf16282.png",
                },
                {
                  title: "Web",
                  image:
                    "https://seeklogo.com/images/W/web-dev-logo-E60991AA99-seeklogo.com.png",
                },
                {
                  title: "Content",
                  image:
                    "https://storage.googleapis.com/gweb-uniblog-publish-prod/images/color-alt_ZOCajrA.width-1200.format-webp.webp",
                },
              ].map((e) => {
                return (
                  <div className="flex flex-col items-center border-2 border-black p-2 py-3 rounded-xl hover:bg-black hover:text-white">
                    <img className="w-14 h-14 object-contain" src={e.image} />
                    <p>{e.title}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <Toaster />
      </div>
    );
  }
}