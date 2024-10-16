"use client";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="p-4 flex flex-col items-center">
      {
        // Hero section
        <div className="mt-14 mb-12 w-[75%] flex flex-col items-center">
          <img
            src="/images/devfest_vizag_headlock.svg"
            className="w-full mb-4"
          />
          <p>
            GITAM University | <span className="font-bold">December 6-7</span>
          </p>
        </div>
      }
      {
        //CTA
        <div className="w-full flex justify-evenly">
          <button className="font-medium px-7 text-[14px] py-[10px] border-black border-2 rounded-full">
            Coming soon...
          </button>
          <button
            onClick={async () => {
              if (auth.currentUser) {
                router.push("/participation");
                return;
              }
              const userCredential = await signInWithPopup(
                auth,
                new GoogleAuthProvider()
              );
              if (userCredential.user != null) {
                router.push("/participation");
              }
            }}
            className="font-medium px-7 text-[14px] py-[10px] border-black border-2 bg-[#F9AB00] rounded-full"
          >
            Apply to be a volunteer
          </button>
        </div>
      }
      {
        // Gallery
        <div className="my-4">
          <div className="aspect-[1.225] w-full object-cover overflow-clip rounded-3xl border-2 border-black">
            <img
              src="https://github.com/ManasMalla.png"
              className="aspect-[1.225] w-full object-cover"
            />
          </div>
          <div className="grid grid-cols-2 my-4 gap-4 w-full">
            <img
              src="https://github.com/ManasMalla.png"
              className="aspect-[1.67] grow object-cover rounded-xl border-2 border-black saturate-0"
            />
            <img
              src="https://github.com/ManasMalla.png"
              className="aspect-[1.67] grow object-cover rounded-xl border-2 border-black saturate-0"
            />
          </div>
        </div>
      }
    </div>
  );
}
