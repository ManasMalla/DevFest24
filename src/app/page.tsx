'use client';
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

export default function Home() {
  const router = useRouter();
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <p className="font-mono text-4xl font-medium">Devfest-2024</p>
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">Get Ready to be the part of the Everseen event ✨
          </li>
        </ol>

        <div onClick={() => router.push('/api/auth/signin')} className="flex justify-center items-center rounded-3xl space-x-2 bg-white px-7 py-2 w-fit text-center cursor-pointer transition-all duration-500 hover:scale-105">
          <FcGoogle className="size-7"/>
          <p className="text-black font-medium text-sm sm:text-xs">Continue With Google</p>
        </div>
      </main>
    </div>
  );
}
